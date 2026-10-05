"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { IconChevronLeft, IconSearch, IconX } from "@tabler/icons-react"
import { Command as CommandPrimitive, useCommandState } from "cmdk"
import { cn } from "cn"

import { Spinner } from "@/components/ui/spinner"
import { formatHotkey, matchesHotkey, useIsApple } from "@/lib/hotkey"

import { Button } from "@/components/ui/button"
import { easeOut, prefersReducedMotion } from "@/lib/motion"

type CommandPageEntry = { id: string; title: string }

type CommandContextValue = {
  search: string
  setSearch: (search: string) => void
  pages: CommandPageEntry[]
  direction: 1 | -1
  pushPage: (id: string, title?: string) => void
  popPage: (count?: number) => void
  registerShortcut: (hotkey: string, run: () => void) => () => void
  takeKeyboardSelect: () => { fromKeyboard: boolean; newTab: boolean }
}

const CommandContext = React.createContext<CommandContextValue | null>(null)
const CommandPageContext = React.createContext<string | null>(null)

function useCommandContext(part: string) {
  const context = React.useContext(CommandContext)
  if (!context) {
    throw new Error(`<${part}> must be used within <Command>.`)
  }
  return context
}

function useCommandPages() {
  const { pages, pushPage, popPage } = useCommandContext("useCommandPages")
  return {
    pages,
    page: pages.at(-1)?.id ?? null,
    push: pushPage,
    pop: popPage,
    reset: () => popPage(pages.length),
  }
}

function usePageVisible() {
  const context = React.useContext(CommandContext)
  const page = React.useContext(CommandPageContext)
  const current = context?.pages.at(-1)?.id ?? null
  return page === current
}

function subscribeNothing() {
  return () => {}
}

function isEditable(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      target.closest("input, textarea, select, [contenteditable='true']") !==
        null)
  )
}

const internalEvents = new WeakSet<Event>()

const highlightName = "command-match"
const highlightRanges = new Map<string, Range[]>()
let highlightSheet: CSSStyleSheet | null = null

function adoptHighlightStyle() {
  if (
    highlightSheet ||
    typeof CSSStyleSheet === "undefined" ||
    !("adoptedStyleSheets" in document)
  ) {
    return
  }
  highlightSheet = new CSSStyleSheet()
  highlightSheet.replaceSync(
    `::highlight(${highlightName}) { color: var(--foreground); }`
  )
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, highlightSheet]
}

function publishHighlights() {
  if (typeof CSS === "undefined" || !("highlights" in CSS)) {
    return
  }
  adoptHighlightStyle()
  const ranges = [...highlightRanges.values()].flat()
  if (ranges.length === 0) {
    CSS.highlights.delete(highlightName)
  } else {
    CSS.highlights.set(highlightName, new Highlight(...ranges))
  }
}

function matchIndices(text: string, query: string) {
  const haystack = text.toLowerCase()
  const needle = query.toLowerCase()
  const start = haystack.indexOf(needle)
  if (start !== -1) {
    return Array.from({ length: needle.length }, (_, index) => start + index)
  }
  const indices: number[] = []
  let from = 0
  for (const char of needle) {
    if (char === " ") {
      continue
    }
    const found = haystack.indexOf(char, from)
    if (found === -1) {
      return []
    }
    indices.push(found)
    from = found + 1
  }
  return indices
}

function highlightItem(item: HTMLElement, query: string) {
  const walker = document.createTreeWalker(item, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) =>
      node.parentElement?.closest(
        "[data-slot=command-shortcut], svg, [aria-hidden=true]"
      )
        ? NodeFilter.FILTER_REJECT
        : NodeFilter.FILTER_ACCEPT,
  })
  const nodes: { node: Text; start: number }[] = []
  let text = ""
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    nodes.push({ node: node as Text, start: text.length })
    text += node.textContent ?? ""
  }
  const ranges: Range[] = []
  for (const index of matchIndices(text, query.trim())) {
    const owner = nodes.findLast((entry) => entry.start <= index)
    if (!owner) {
      continue
    }
    const range = document.createRange()
    range.setStart(owner.node, index - owner.start)
    range.setEnd(owner.node, index - owner.start + 1)
    ranges.push(range)
  }
  return ranges
}

function CommandHighlighter() {
  const id = React.useId()
  const search = useCommandState((state) => state.search)
  const count = useCommandState((state) => state.filtered.count)
  const anchorRef = React.useRef<HTMLSpanElement>(null)

  React.useLayoutEffect(() => {
    const root = anchorRef.current?.closest<HTMLElement>("[cmdk-root]")
    if (!root) {
      return
    }
    const query = search.trim()
    root.toggleAttribute("data-highlighting", query !== "")
    highlightRanges.set(
      id,
      query
        ? Array.from(root.querySelectorAll<HTMLElement>("[cmdk-item]")).flatMap(
            (item) => highlightItem(item, query)
          )
        : []
    )
    publishHighlights()
  }, [count, id, search])

  React.useEffect(
    () => () => {
      highlightRanges.delete(id)
      publishHighlights()
    },
    [id]
  )

  return <span ref={anchorRef} hidden />
}

function defaultFormatResults(count: number) {
  if (count === 0) {
    return "No results"
  }
  return count === 1 ? "1 result" : `${count} results`
}

function CommandAnnouncer({
  format,
  pageTitle,
}: {
  format: (count: number) => string
  pageTitle: string
}) {
  const search = useCommandState((state) => state.search)
  const count = useCommandState((state) => state.filtered.count)
  const [message, setMessage] = React.useState("")
  const [previousPage, setPreviousPage] = React.useState(pageTitle)
  const [pageMessage, setPageMessage] = React.useState("")

  if (pageTitle !== previousPage) {
    setPreviousPage(pageTitle)
    setPageMessage(pageTitle)
  }

  React.useEffect(() => {
    const timer = setTimeout(
      () => setMessage(search ? format(count) : ""),
      search ? 500 : 0
    )
    return () => clearTimeout(timer)
  }, [count, format, search])

  return (
    <span
      data-slot="command-announcer"
      role="status"
      aria-live="polite"
      aria-atomic
      className="sr-only"
    >
      {message || pageMessage}
    </span>
  )
}

type CommandProps = React.ComponentProps<typeof CommandPrimitive> & {
  formatResults?: (count: number) => string
  highlight?: boolean
  rootTitle?: string
}

function Command({
  className,
  children,
  label = "Command menu",
  formatResults = defaultFormatResults,
  highlight = false,
  rootTitle = "All commands",
  onKeyDown,
  ...props
}: CommandProps) {
  const [search, setSearch] = React.useState("")
  const [pages, setPages] = React.useState<CommandPageEntry[]>([])
  const [direction, setDirection] = React.useState<1 | -1>(1)
  const shortcutsRef = React.useRef(
    new Map<symbol, { hotkey: string; run: () => void }>()
  )
  const enterRef = React.useRef({ at: -Infinity, newTab: false })

  const pushPage = React.useCallback((id: string, title?: string) => {
    setDirection(1)
    setPages((current) => [...current, { id, title: title ?? id }])
    setSearch("")
  }, [])

  const popPage = React.useCallback((count = 1) => {
    setDirection(-1)
    setPages((current) => current.slice(0, Math.max(0, current.length - count)))
    setSearch("")
  }, [])

  const registerShortcut = React.useCallback(
    (hotkey: string, run: () => void) => {
      const key = Symbol(hotkey)
      shortcutsRef.current.set(key, { hotkey, run })
      return () => {
        shortcutsRef.current.delete(key)
      }
    },
    []
  )

  const takeKeyboardSelect = React.useCallback(() => {
    const entry = enterRef.current
    const fromKeyboard = performance.now() - entry.at < 100
    enterRef.current = { at: -Infinity, newTab: false }
    return { fromKeyboard, newTab: fromKeyboard && entry.newTab }
  }, [])

  const context = React.useMemo(
    () => ({
      search,
      setSearch,
      pages,
      direction,
      pushPage,
      popPage,
      registerShortcut,
      takeKeyboardSelect,
    }),
    [
      direction,
      pages,
      popPage,
      pushPage,
      registerShortcut,
      search,
      takeKeyboardSelect,
    ]
  )

  return (
    <CommandContext.Provider value={context}>
      <CommandPrimitive
        data-slot="command"
        label={label}
        onKeyDown={(event) => {
          if (internalEvents.has(event.nativeEvent)) {
            return
          }
          onKeyDown?.(event)
          if (event.defaultPrevented || event.nativeEvent.isComposing) {
            return
          }
          if (event.key === "Enter") {
            enterRef.current = {
              at: performance.now(),
              newTab: event.metaKey || event.ctrlKey,
            }
            return
          }
          if (event.repeat) {
            return
          }
          for (const { hotkey, run } of shortcutsRef.current.values()) {
            if (matchesHotkey(event.nativeEvent, hotkey)) {
              event.preventDefault()
              run()
              return
            }
          }
        }}
        className={cn(
          "flex size-full min-w-0 flex-col overflow-hidden rounded-(--command-radius) bg-popover text-popover-foreground ring-(length:--hairline) ring-foreground/10 outline-none [--command-inset:--spacing(1.5)] [--command-radius:var(--radius-xl)] focus-visible:outline-hidden in-data-[slot=command-dialog]:rounded-none in-data-[slot=command-dialog]:ring-0 forced-colors:border",
          className
        )}
        {...props}
      >
        {children}
        {highlight ? <CommandHighlighter /> : null}
        <CommandAnnouncer
          format={formatResults}
          pageTitle={pages.at(-1)?.title ?? (pages.length ? "" : rootTitle)}
        />
      </CommandPrimitive>
    </CommandContext.Provider>
  )
}

function CommandPage({
  id,
  children,
}: {
  id: string
  children?: React.ReactNode
}) {
  return (
    <CommandPageContext.Provider value={id}>
      {children}
    </CommandPageContext.Provider>
  )
}

type CommandInputProps = Omit<
  React.ComponentProps<typeof CommandPrimitive.Input>,
  "value" | "onValueChange"
> & {
  value?: string
  onValueChange?: (search: string) => void
  clearLabel?: string
  backLabel?: (title: string) => string
}

function CommandInput({
  className,
  value,
  onValueChange,
  onKeyDown,
  clearLabel = "Clear search",
  backLabel = (title) => `Back from ${title}`,
  ref,
  ...props
}: CommandInputProps) {
  const context = useCommandContext("CommandInput")
  const search = value ?? context.search
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const page = context.pages.at(-1)

  const setInput = React.useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node
      if (typeof ref === "function") {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    },
    [ref]
  )

  const change = (next: string) => {
    if (value === undefined) {
      context.setSearch(next)
    }
    onValueChange?.(next)
  }

  return (
    <div
      data-slot="command-input-wrapper"
      className="flex shrink-0 items-center gap-2.5 border-b ps-3.5 pe-2"
    >
      {page ? (
        <button
          type="button"
          data-slot="command-page-chip"
          aria-label={backLabel(page.title)}
          onClick={() => {
            context.popPage()
            inputRef.current?.focus()
          }}
          className="-ms-1.5 inline-flex h-6 max-w-40 min-w-0 shrink-0 items-center gap-0.5 rounded-[calc(var(--radius-sm)*0.8)] bg-muted ps-0.5 pe-2 text-xs font-medium text-foreground transition-[background-color,scale] duration-150 ease-out-quint outline-none hover:bg-foreground/10 focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden motion-safe:animate-in motion-safe:animation-duration-150 motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:active:scale-95 pointer-coarse:after:absolute pointer-coarse:after:-inset-2.5"
        >
          <IconChevronLeft
            aria-hidden
            className="size-3.5 shrink-0 rtl:-scale-x-100"
          />
          <span className="truncate">{page.title}</span>
        </button>
      ) : (
        <IconSearch
          aria-hidden
          className="pointer-events-none size-4 shrink-0 text-muted-foreground"
        />
      )}
      <CommandPrimitive.Input
        ref={setInput}
        data-slot="command-input"
        value={search}
        onValueChange={change}
        onKeyDown={(event) => {
          onKeyDown?.(event)
          if (event.defaultPrevented || event.nativeEvent.isComposing) {
            return
          }
          if (event.key === "Escape") {
            if (search !== "") {
              event.preventDefault()
              change("")
            } else if (context.pages.length > 0) {
              event.preventDefault()
              context.popPage()
            }
            return
          }
          if (
            event.key === "Backspace" &&
            search === "" &&
            context.pages.length > 0 &&
            !event.repeat
          ) {
            event.preventDefault()
            context.popPage()
          }
        }}
        className={cn(
          "h-11 w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 pointer-coarse:h-12 pointer-coarse:text-[max(16px,1rem)] [&::-webkit-search-cancel-button]:hidden",
          className
        )}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        tabIndex={-1}
        aria-label={clearLabel}
        aria-hidden={search === "" || undefined}
        data-slot="command-clear"
        onClick={() => {
          change("")
          inputRef.current?.focus()
        }}
        className={cn(
          "shrink-0 rounded-full text-muted-foreground transition-[opacity,scale,color,background-color] duration-150 hover:text-foreground",
          search === ""
            ? "pointer-events-none opacity-0 motion-safe:scale-75"
            : "opacity-100"
        )}
      >
        <IconX />
      </Button>
    </div>
  )
}

function scrollIntoList(element: HTMLElement) {
  const list = element.closest<HTMLElement>("[cmdk-list]")
  if (!list) {
    return
  }
  const style = getComputedStyle(list)
  const top = parseFloat(style.scrollPaddingTop) || 0
  const bottom = parseFloat(style.scrollPaddingBottom) || 0
  const listRect = list.getBoundingClientRect()
  const rect = element.getBoundingClientRect()
  if (rect.top < listRect.top + top) {
    list.scrollTop -= listRect.top + top - rect.top
  } else if (rect.bottom > listRect.bottom - bottom) {
    list.scrollTop += rect.bottom - (listRect.bottom - bottom)
  }
}

function useScrollWithinList(
  ref: React.RefObject<HTMLElement | null>,
  selector?: string
) {
  React.useLayoutEffect(() => {
    const root = ref.current
    const target = selector ? root?.querySelector<HTMLElement>(selector) : root
    if (!target) {
      return
    }
    target.scrollIntoView = () => scrollIntoList(target)
    return () => {
      delete (target as Partial<HTMLElement>).scrollIntoView
    }
  })
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  const context = useCommandContext("CommandList")
  const listRef = React.useRef<HTMLDivElement>(null)
  const depth = context.pages.length
  const [previousDepth, setPreviousDepth] = React.useState(depth)
  const [pageTurn, setPageTurn] = React.useState(0)

  if (depth !== previousDepth) {
    setPreviousDepth(depth)
    setPageTurn((turn) => turn + 1)
  }

  React.useLayoutEffect(() => {
    const list = listRef.current
    if (!pageTurn || !list) {
      return
    }
    const home = new KeyboardEvent("keydown", {
      key: "Home",
      bubbles: true,
      cancelable: true,
    })
    internalEvents.add(home)
    list.closest("[cmdk-root]")?.dispatchEvent(home)
    list.scrollTop = 0

    const sizer = list.querySelector<HTMLElement>(":scope > [cmdk-list-sizer]")
    if (!sizer || typeof sizer.animate !== "function") {
      return
    }
    const rtl = getComputedStyle(sizer).direction === "rtl"
    const offset = 16 * context.direction * (rtl ? -1 : 1)
    const animation = sizer.animate(
      prefersReducedMotion()
        ? [{ opacity: 0 }, { opacity: 1 }]
        : [
            { translate: `${offset}px 0`, opacity: 0 },
            { translate: "0 0", opacity: 1 },
          ],
      { duration: 180, easing: easeOut }
    )
    return () => animation.cancel()
  }, [context.direction, pageTurn])

  React.useLayoutEffect(() => {
    const list = listRef.current
    if (!list || typeof ResizeObserver !== "function") {
      return
    }
    let frame = 0
    const settle = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          list.setAttribute("data-settled", "")
        })
      })
    }
    const observer = new ResizeObserver(() => {
      if (list.getClientRects().length === 0) {
        cancelAnimationFrame(frame)
        list.removeAttribute("data-settled")
      } else if (!list.hasAttribute("data-settled")) {
        settle()
      }
    })
    observer.observe(list)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      list.removeAttribute("data-settled")
    }
  }, [])

  return (
    <CommandPrimitive.List
      ref={listRef}
      data-slot="command-list"
      className={cn(
        "max-h-[min(24rem,45dvh)] scroll-py-(--command-inset) [scrollbar-gutter:stable] overflow-x-hidden overflow-y-auto overscroll-none duration-150 ease-out-quint outline-none focus-visible:outline-hidden data-settled:h-(--cmdk-list-height) motion-safe:data-settled:transition-[height] motion-reduce:transition-none [&>[cmdk-list-sizer]]:p-(--command-inset)",
        className
      )}
      {...props}
    />
  )
}

type CommandEmptyProps = Omit<
  React.ComponentProps<typeof CommandPrimitive.Empty>,
  "children"
> & {
  children?: React.ReactNode | ((search: string) => React.ReactNode)
}

function CommandEmpty({ className, children, ...props }: CommandEmptyProps) {
  const search = useCommandState((state) => state.search)
  const hydrating = React.useSyncExternalStore(
    subscribeNothing,
    () => false,
    () => true
  )

  if (hydrating) {
    return null
  }

  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn(
        "px-3 py-8 text-center text-sm text-balance text-muted-foreground in-[[cmdk-list]:has([cmdk-loading])]:hidden",
        className
      )}
      {...props}
    >
      {typeof children === "function" ? children(search) : children}
    </CommandPrimitive.Empty>
  )
}

function useCommandLoading(
  loading: boolean,
  {
    delay = 150,
    minDuration = 300,
  }: { delay?: number; minDuration?: number } = {}
) {
  const [visible, setVisible] = React.useState(false)
  const shownAtRef = React.useRef(0)

  React.useEffect(() => {
    if (loading && !visible) {
      const timer = setTimeout(() => {
        shownAtRef.current = performance.now()
        setVisible(true)
      }, delay)
      return () => clearTimeout(timer)
    }
    if (!loading && visible) {
      const remaining = Math.max(
        0,
        minDuration - (performance.now() - shownAtRef.current)
      )
      const timer = setTimeout(() => setVisible(false), remaining)
      return () => clearTimeout(timer)
    }
  }, [delay, loading, minDuration, visible])

  return visible
}

type CommandLoadingProps = React.ComponentProps<
  typeof CommandPrimitive.Loading
> & {
  loading?: boolean
  delay?: number
  minDuration?: number
}

function CommandLoading({
  className,
  children,
  label,
  loading = true,
  delay,
  minDuration,
  ...props
}: CommandLoadingProps) {
  const visible = useCommandLoading(loading, { delay, minDuration })

  if (!loading && !visible) {
    return null
  }

  return (
    <CommandPrimitive.Loading
      data-slot="command-loading"
      data-pending={visible ? undefined : ""}
      label={label ?? (typeof children === "string" ? children : undefined)}
      className={cn(
        "flex min-h-9 items-center justify-center px-3 py-4 text-sm text-muted-foreground data-pending:sr-only motion-safe:animate-in motion-safe:animation-duration-150 motion-safe:fade-in-0 [&>div]:flex [&>div]:items-center [&>div]:gap-2",
        className
      )}
      {...props}
    >
      <Spinner aria-hidden />
      {children}
    </CommandPrimitive.Loading>
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  const groupRef = React.useRef<HTMLDivElement>(null)
  useScrollWithinList(groupRef, ":scope > [cmdk-group-heading]")

  if (!usePageVisible()) {
    return null
  }

  return (
    <CommandPrimitive.Group
      ref={groupRef}
      data-slot="command-group"
      className={cn(
        "overflow-hidden text-foreground not-first:mt-1 [&>[cmdk-group-heading]]:px-2.5 [&>[cmdk-group-heading]]:pt-2 [&>[cmdk-group-heading]]:pb-1.5 [&>[cmdk-group-heading]]:text-xs [&>[cmdk-group-heading]]:font-medium [&>[cmdk-group-heading]]:text-muted-foreground [&>[cmdk-group-heading]]:select-none",
        className
      )}
      {...props}
    />
  )
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  if (!usePageVisible()) {
    return null
  }

  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      aria-hidden
      className={cn(
        "-mx-(--command-inset) my-(--command-inset) h-(length:--hairline) bg-border",
        className
      )}
      {...props}
    />
  )
}

function textOf(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node)
  }
  if (Array.isArray(node)) {
    return node.map(textOf).join("")
  }
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return node.type === CommandShortcut ? "" : textOf(node.props.children)
  }
  return ""
}

const confirmBlink = 60
const confirmDelay = 120

type CommandItemProps = Omit<
  React.ComponentProps<typeof CommandPrimitive.Item>,
  "asChild"
> & {
  shortcut?: string
  page?: string
  pageTitle?: string
  href?: string
  render?: React.ReactElement<{ href?: string }>
  confirm?: boolean
}

function CommandItem({
  className,
  children,
  shortcut,
  page,
  pageTitle,
  href,
  render,
  confirm = true,
  onSelect,
  disabled,
  value,
  ...props
}: CommandItemProps) {
  const context = useCommandContext("CommandItem")
  const visible = usePageVisible()
  const apple = useIsApple()
  const itemRef = React.useRef<HTMLDivElement>(null)
  useScrollWithinList(itemRef)
  const [confirming, setConfirming] = React.useState(false)
  const busyRef = React.useRef(false)
  const timersRef = React.useRef<ReturnType<typeof setTimeout>[]>([])
  const linkHref = href ?? render?.props.href

  React.useEffect(() => {
    const timers = timersRef
    return () => timers.current.forEach(clearTimeout)
  }, [])

  const act = (
    value: string,
    keyboard: { fromKeyboard: boolean; newTab: boolean }
  ) => {
    busyRef.current = false
    if (page) {
      context.pushPage(page, pageTitle ?? value)
    } else if (linkHref && keyboard.fromKeyboard) {
      if (keyboard.newTab) {
        window.open(linkHref, "_blank", "noopener")
      } else {
        itemRef.current?.click()
      }
    }
    onSelect?.(value)
  }

  const select = (value: string) => {
    if (busyRef.current) {
      return
    }
    const keyboard = context.takeKeyboardSelect()
    if (!confirm || prefersReducedMotion()) {
      act(value, keyboard)
      return
    }
    busyRef.current = true
    setConfirming(true)
    timersRef.current.push(
      setTimeout(() => setConfirming(false), confirmBlink),
      setTimeout(() => act(value, keyboard), confirmDelay)
    )
  }

  const selectRef = React.useRef(select)
  React.useLayoutEffect(() => {
    selectRef.current = select
  })

  React.useEffect(() => {
    if (!shortcut || disabled) {
      return
    }
    return context.registerShortcut(shortcut, () => {
      const value =
        itemRef.current?.getAttribute("data-value") ??
        itemRef.current?.textContent ??
        ""
      selectRef.current(value)
    })
  }, [context, disabled, shortcut])

  if (!visible) {
    return null
  }

  const content = (
    <>
      {children}
      {page ? (
        <IconChevronLeft
          aria-hidden
          className="ms-auto size-4 shrink-0 rotate-180 text-muted-foreground rtl:rotate-0"
        />
      ) : null}
      {shortcut ? (
        <CommandShortcut aria-hidden>
          {formatHotkey(shortcut, apple)}
        </CommandShortcut>
      ) : null}
    </>
  )

  const link = render ?? (href ? <a href={href} /> : null)

  return (
    <CommandPrimitive.Item
      ref={itemRef}
      data-slot="command-item"
      data-confirming={confirming ? "" : undefined}
      data-page={page ? "" : undefined}
      aria-keyshortcuts={
        shortcut
          ? shortcut
              .split("+")
              .map((part) =>
                part === "mod" ? (apple ? "Meta" : "Control") : part
              )
              .join("+")
          : undefined
      }
      value={value ?? (textOf(children).trim() || undefined)}
      disabled={disabled}
      onSelect={select}
      asChild={Boolean(link)}
      className={cn(
        "relative flex min-h-9 min-w-0 cursor-default items-center gap-2.5 rounded-[max(calc(var(--radius-sm)*0.5),calc(var(--command-radius)-var(--command-inset)))] px-2.5 py-1.5 text-sm text-foreground outline-none select-none focus-visible:outline-hidden in-data-highlighting:text-muted-foreground data-[confirming]:bg-transparent data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-muted forced-colors:data-[selected=true]:outline-2 forced-colors:data-[selected=true]:-outline-offset-2 forced-colors:data-[selected=true]:outline-solid pointer-coarse:min-h-11 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[selected=true]:[&_svg:not([class*='text-'])]:text-foreground [&:is(a)]:cursor-pointer",
        className
      )}
      {...props}
    >
      {link ? React.cloneElement(link, undefined, content) : content}
    </CommandPrimitive.Item>
  )
}

type CommandShortcutProps = React.ComponentProps<"kbd"> & {
  hotkey?: string
}

function CommandShortcut({
  className,
  dir = "ltr",
  hotkey,
  children,
  ...props
}: CommandShortcutProps) {
  const apple = useIsApple()

  return (
    <kbd
      data-slot="command-shortcut"
      dir={dir}
      className={cn(
        "ms-auto shrink-0 font-sans text-xs tracking-widest text-muted-foreground [unicode-bidi:isolate]",
        className
      )}
      {...props}
    >
      {children ?? (hotkey ? formatHotkey(hotkey, apple) : null)}
    </kbd>
  )
}

function CommandKey({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-[calc(var(--radius-sm)*0.7)] bg-muted px-1 font-sans text-[0.6875rem] font-medium text-muted-foreground">
      {children}
    </kbd>
  )
}

function CommandFooter({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const context = React.useContext(CommandContext)
  const nested = (context?.pages.length ?? 0) > 0

  return (
    <div
      data-slot="command-footer"
      className={cn(
        "flex shrink-0 items-center gap-4 border-t px-3.5 py-2 text-xs text-muted-foreground select-none pointer-coarse:hidden",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          <span className="inline-flex items-center gap-1.5">
            <CommandKey>↑</CommandKey>
            <CommandKey>↓</CommandKey>
            Navigate
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CommandKey>↵</CommandKey>
            Open
          </span>
          {nested ? (
            <span className="inline-flex items-center gap-1.5">
              <CommandKey>⌫</CommandKey>
              Back
            </span>
          ) : null}
          <span className="ms-auto inline-flex items-center gap-1.5">
            <CommandKey>esc</CommandKey>
            {nested ? "Back" : "Close"}
          </span>
        </>
      )}
    </div>
  )
}

type CommandDialogProps = DialogPrimitive.Root.Props & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
  preserveSearch?: boolean
  children?: React.ReactNode
}

function CommandDialog({
  title = "Command menu",
  description = "Search for a command to run.",
  className,
  showCloseButton = false,
  preserveSearch = false,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  ...props
}: CommandDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const isOpen = open ?? uncontrolledOpen
  const popupRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!isOpen || !preserveSearch) {
      return
    }
    const frame = requestAnimationFrame(() => {
      popupRef.current
        ?.querySelector<HTMLInputElement>("[data-slot=command-input]")
        ?.select()
    })
    return () => cancelAnimationFrame(frame)
  }, [isOpen, preserveSearch])

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(next, details) => {
        if (
          !next &&
          details.reason === "escape-key" &&
          details.event.defaultPrevented
        ) {
          details.cancel()
          return
        }
        onOpenChange?.(next, details)
        if (!details.isCanceled && open === undefined) {
          setUncontrolledOpen(next)
        }
      }}
      {...props}
    >
      <DialogPrimitive.Portal keepMounted={preserveSearch}>
        <DialogPrimitive.Backdrop
          data-slot="command-dialog-overlay"
          className="fixed inset-0 z-50 min-h-dvh bg-black/40 supports-backdrop-filter:backdrop-blur-xs dark:bg-black/60"
        />
        <DialogPrimitive.Popup
          ref={popupRef}
          data-slot="command-dialog"
          className={cn(
            "fixed inset-x-4 top-[max(env(safe-area-inset-top),1rem)] z-50 mx-auto flex max-w-lg flex-col overflow-hidden rounded-(--command-radius) bg-popover text-popover-foreground shadow-2xl ring-(length:--hairline) ring-foreground/10 outline-none [--command-radius:var(--radius-xl)] focus-visible:outline-hidden sm:top-[12dvh] forced-colors:border",
            className
          )}
        >
          <DialogPrimitive.Title className="sr-only">
            {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            {description}
          </DialogPrimitive.Description>
          {children}
          {showCloseButton ? (
            <DialogPrimitive.Close
              data-slot="command-dialog-close"
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="absolute end-2 top-2"
                />
              }
            >
              <IconX />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          ) : null}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

function useCommandHotkey(
  hotkey: string,
  callback: (event: KeyboardEvent) => void,
  { enabled = true }: { enabled?: boolean } = {}
) {
  const callbackRef = React.useRef(callback)

  React.useLayoutEffect(() => {
    callbackRef.current = callback
  })

  React.useEffect(() => {
    if (!enabled) {
      return
    }
    const bare = !/(^|\+)(mod|meta|ctrl|alt)\+/i.test(hotkey)

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.repeat ||
        event.isComposing ||
        !matchesHotkey(event, hotkey) ||
        (bare && isEditable(event.target))
      ) {
        return
      }
      event.preventDefault()
      callbackRef.current(event)
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [enabled, hotkey])
}

function useHotkeyLabel(hotkey: string) {
  return formatHotkey(hotkey, useIsApple())
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandLoading,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
  CommandPage,
  CommandFooter,
  useCommandHotkey,
  useCommandLoading,
  useCommandPages,
  useCommandState,
  useHotkeyLabel,
}
