"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import {
  IconChevronLeft,
  IconChevronRight,
  IconDots,
} from "@tabler/icons-react"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button"
import {
  usePagination,
  type PaginationItemData,
  type UsePaginationOptions,
} from "@/hooks/use-pagination"
import { prefersReducedMotion, useSlidingHighlight } from "@/lib/motion"

function clampInt(value: unknown, fallback: number, min: number, max: number) {
  const number = Math.floor(Number(value))
  if (!Number.isFinite(number)) {
    return fallback
  }
  return Math.min(max, Math.max(min, number))
}

const linkClassName =
  "h-9 min-w-[max(--spacing(9),calc(var(--pagination-digits,1)*1ch+--spacing(4)))] px-2 tabular-nums pointer-coarse:h-11 pointer-coarse:min-w-11 aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-[current=page]:text-foreground aria-[current=page]:inset-ring-border aria-[current=page]:bg-background dark:aria-[current=page]:bg-input/30 dark:aria-[current=page]:inset-ring-input group-has-[>[data-slot=pagination-indicator][data-visible]]/pagination:aria-[current=page]:bg-transparent group-has-[>[data-slot=pagination-indicator][data-visible]]/pagination:aria-[current=page]:inset-ring-transparent group-has-[>[data-slot=pagination-indicator][data-visible]]/pagination:aria-[current=page]:hover:bg-transparent"

type PaginationProps = React.ComponentProps<"nav"> & {
  page?: number
  defaultPage?: number
  count?: number
  onPageChange?: (page: number) => void
  siblings?: number
  boundaries?: number
  getPageHref?: (page: number) => string
  compact?: boolean | "auto"
  jump?: boolean
}

const indicatorClassName =
  "pointer-events-none absolute top-0 -z-1 rounded-md bg-background opacity-0 inset-ring-(length:--hairline) forced-colors:border inset-ring-border transition-[transform,width,height,opacity] duration-300 ease-out-quint data-instant:transition-opacity data-visible:opacity-100 motion-reduce:transition-opacity dark:bg-input/30 dark:inset-ring-input"

const linkSelector = "[data-slot=pagination-link][aria-current=page]"

function focusableItems(nav: HTMLElement) {
  return Array.from(
    nav.querySelectorAll<HTMLElement>("a[href], a[role=link], button")
  ).filter(
    (item) =>
      item.getClientRects().length > 0 &&
      item.getAttribute("aria-disabled") !== "true" &&
      !item.hasAttribute("disabled") &&
      getComputedStyle(item).visibility !== "hidden"
  )
}

function handleArrowKeys(event: React.KeyboardEvent<HTMLElement>) {
  const keys = ["ArrowLeft", "ArrowRight", "Home", "End"]
  const target = event.target as HTMLElement
  if (
    event.defaultPrevented ||
    !keys.includes(event.key) ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    target.closest("input, textarea, [contenteditable=true]")
  ) {
    return
  }
  const items = focusableItems(event.currentTarget)
  const index = items.indexOf(target)
  if (index === -1) {
    return
  }
  const rtl = getComputedStyle(event.currentTarget).direction === "rtl"
  const forward = event.key === "ArrowRight" ? !rtl : rtl
  const next =
    event.key === "Home"
      ? 0
      : event.key === "End"
        ? items.length - 1
        : Math.min(items.length - 1, Math.max(0, index + (forward ? 1 : -1)))
  event.preventDefault()
  items[next]?.focus()
}

function Pagination({
  className,
  children,
  page,
  defaultPage = 1,
  count,
  onPageChange,
  siblings,
  boundaries,
  getPageHref,
  compact = "auto",
  jump = true,
  style,
  onKeyDown,
  ref,
  ...props
}: PaginationProps) {
  const auto = count !== undefined
  const navRef = React.useRef<HTMLElement | null>(null)
  const indicatorRef = React.useRef<HTMLSpanElement | null>(null)
  useSlidingHighlight(navRef, indicatorRef, linkSelector, "aria-current")

  const setRef = React.useCallback(
    (node: HTMLElement | null) => {
      navRef.current = node
      if (typeof ref === "function") {
        return ref(node)
      }
      if (ref) {
        ref.current = node
      }
      return undefined
    },
    [ref]
  )

  return (
    <nav
      ref={setRef}
      aria-label="Pagination"
      data-slot="pagination"
      className={cn(
        "group/pagination relative isolate mx-auto flex w-full min-w-0 justify-center text-sm",
        className
      )}
      style={style}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        handleArrowKeys(event)
      }}
      {...props}
    >
      {auto ? (
        <PaginationAuto
          page={page}
          defaultPage={defaultPage}
          count={count}
          onPageChange={onPageChange}
          siblings={siblings}
          boundaries={boundaries}
          getPageHref={getPageHref}
          compact={compact}
          jump={jump}
        />
      ) : (
        <>
          <span
            ref={indicatorRef}
            aria-hidden="true"
            data-slot="pagination-indicator"
            className={indicatorClassName}
          />
          {children}
        </>
      )}
    </nav>
  )
}

function isPlainClick(event: React.MouseEvent) {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  )
}

function measureList(list: HTMLElement) {
  const layouts = list.closest<HTMLElement>("[data-slot=pagination-layouts]")
  if (!layouts) {
    return 0
  }
  const clone = list.cloneNode(true) as HTMLElement
  clone.removeAttribute("id")
  clone.setAttribute("aria-hidden", "true")
  clone.inert = true
  clone.className = cn(list.className, "invisible fixed top-0 left-0 flex")
  const digits = getComputedStyle(layouts).getPropertyValue(
    "--pagination-digits"
  )
  clone.style.setProperty("--pagination-digits", digits)
  clone.style.fontSize = getComputedStyle(list).fontSize
  document.body.appendChild(clone)
  const width = clone.getBoundingClientRect().width
  clone.remove()
  return width
}

function PaginationAuto({
  page: pageProp,
  defaultPage,
  count,
  onPageChange,
  siblings,
  boundaries,
  getPageHref,
  compact,
  jump,
}: Required<Pick<PaginationProps, "defaultPage" | "count" | "compact">> &
  Pick<
    PaginationProps,
    "page" | "onPageChange" | "siblings" | "boundaries" | "getPageHref" | "jump"
  >) {
  const [internalPage, setInternalPage] = React.useState(defaultPage)
  const pagination = usePagination({
    page: pageProp ?? internalPage,
    count,
    siblings,
    boundaries,
  })
  const fullRef = React.useRef<HTMLDivElement | null>(null)
  const indicatorRef = React.useRef<HTMLSpanElement | null>(null)
  const listRef = React.useRef<HTMLUListElement | null>(null)
  const layoutsRef = React.useRef<HTMLDivElement | null>(null)
  const slots = Math.min(
    pagination.count,
    clampInt(boundaries ?? 1, 1, 0, 10) * 2 +
      clampInt(siblings ?? 1, 1, 0, 10) * 2 +
      3
  )
  const digits = String(pagination.count).length
  const vars = {
    "--pagination-digits": digits,
    "--pagination-needed": `calc(${slots} * max(2.25rem, ${digits}ch + 1rem) + ${slots + 1} * 0.25rem + 10.5rem)`,
  } as React.CSSProperties
  useSlidingHighlight(fullRef, indicatorRef, linkSelector, "aria-current")

  React.useLayoutEffect(() => {
    const list = listRef.current
    const layouts = layoutsRef.current
    if (compact !== "auto" || !list || !layouts) {
      return
    }
    const update = () => {
      const width = measureList(list)
      if (width > 0) {
        layouts.style.setProperty(
          "--pagination-needed",
          `${Math.ceil(width)}px`
        )
      }
    }
    update()
    document.fonts?.addEventListener("loadingdone", update)
    return () => document.fonts?.removeEventListener("loadingdone", update)
  })

  const go = (next: number) => {
    const target = clampInt(next, 1, 1, Math.max(1, pagination.count))
    if (target === pagination.page) {
      return
    }
    if (pageProp === undefined) {
      setInternalPage(target)
    }
    onPageChange?.(target)
  }

  const canJump = jump !== false && (!!onPageChange || !getPageHref)
  const jumpTo = (target: number) => {
    if (!onPageChange && getPageHref) {
      window.location.assign(getPageHref(target))
      return
    }
    go(target)
  }

  const linkProps = (target: number, disabled = false) => {
    const href = getPageHref?.(target)
    return {
      disabled,
      href,
      render: href ? undefined : <button type="button" />,
      onClick: (event: React.MouseEvent) => {
        if (href && !isPlainClick(event)) {
          return
        }
        go(target)
      },
    }
  }

  const previous = (iconOnly: boolean) => (
    <PaginationItem>
      <PaginationPrevious
        {...linkProps(pagination.page - 1, !pagination.hasPrevious)}
        text={iconOnly ? null : undefined}
      />
    </PaginationItem>
  )
  const next = (iconOnly: boolean) => (
    <PaginationItem>
      <PaginationNext
        {...linkProps(pagination.page + 1, !pagination.hasNext)}
        text={iconOnly ? null : undefined}
      />
    </PaginationItem>
  )

  const label = (
    <>
      Page {pagination.page} of {pagination.count}
    </>
  )

  const compactList = (
    <PaginationContent
      className={cn(
        compact === "auto" && "@max-[4px]/pagination-compact:hidden"
      )}
    >
      {previous(true)}
      <PaginationItem>
        {canJump && pagination.count > 1 ? (
          <PaginationJump
            count={pagination.count}
            onJump={jumpTo}
            suffix={`of ${pagination.count}`}
            aria-label={`Page ${pagination.page} of ${pagination.count}, go to page`}
            className="px-2.5"
          >
            {label}
          </PaginationJump>
        ) : (
          <span
            data-slot="pagination-status"
            className="flex h-9 items-center px-2 text-sm whitespace-nowrap tabular-nums pointer-coarse:h-11"
          >
            {label}
          </span>
        )}
      </PaginationItem>
      {next(true)}
    </PaginationContent>
  )

  const fullList = (
    <PaginationContent
      ref={listRef}
      className={cn(
        compact === "auto" && "w-max @max-[4px]/pagination-full:hidden"
      )}
    >
      {previous(false)}
      {pagination.items.map((item) =>
        item.type === "page" ? (
          <PaginationItem key={item.page}>
            <PaginationLink
              {...linkProps(item.page)}
              isActive={item.page === pagination.page}
              aria-label={`Page ${item.page}`}
            >
              {item.page}
            </PaginationLink>
          </PaginationItem>
        ) : (
          <PaginationItem key={item.position}>
            <PaginationEllipsis
              count={pagination.count}
              onJump={canJump ? jumpTo : undefined}
            />
          </PaginationItem>
        )
      )}
      {next(false)}
    </PaginationContent>
  )

  const indicator = (
    <span
      ref={indicatorRef}
      aria-hidden="true"
      data-slot="pagination-indicator"
      className={indicatorClassName}
    />
  )

  if (compact !== "auto") {
    return (
      <div
        ref={layoutsRef}
        data-slot="pagination-layouts"
        style={vars}
        className="flex w-full justify-center"
      >
        {compact ? (
          compactList
        ) : (
          <div
            ref={fullRef}
            data-slot="pagination-full"
            className="group/pagination relative isolate"
          >
            {indicator}
            {fullList}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      ref={layoutsRef}
      data-slot="pagination-layouts"
      style={vars}
      className="grid w-full grid-cols-1"
    >
      <div
        ref={fullRef}
        data-slot="pagination-full"
        className="group/pagination @container/pagination-full relative isolate col-start-1 row-start-1 flex w-full max-w-[max(0px,calc((100%-var(--pagination-needed)+1px)*9999))] justify-center justify-self-center"
      >
        {indicator}
        {fullList}
      </div>
      <div
        data-slot="pagination-compact"
        className="@container/pagination-compact col-start-1 row-start-1 flex w-full max-w-[max(0px,calc((var(--pagination-needed)-100%)*9999))] justify-center justify-self-center"
      >
        {compactList}
      </div>
    </div>
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  )
}

function PaginationItem(props: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = useRender.ComponentProps<"a"> & {
  isActive?: boolean
  disabled?: boolean
}

function PaginationLink({
  className,
  isActive = false,
  disabled = false,
  render,
  href,
  onClick,
  ...props
}: PaginationLinkProps) {
  return useRender({
    defaultTagName: "a",
    render,
    props: mergeProps<"a">(
      {
        className: cn(
          buttonVariants({ variant: "ghost" }),
          linkClassName,
          className
        ),
        href: disabled ? undefined : href,
        ...(disabled && !render ? { role: "link", tabIndex: 0 } : {}),
      },
      props,
      {
        "data-slot": "pagination-link",
        "aria-current": isActive ? "page" : undefined,
        "aria-disabled": disabled || undefined,
        "data-active": isActive ? "" : undefined,
        onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
          if (disabled) {
            event.preventDefault()
            return
          }
          onClick?.(event)
        },
      } as React.ComponentProps<"a">
    ),
  })
}

type PaginationStepProps = PaginationLinkProps & {
  text?: React.ReactNode
}

function PaginationPrevious({
  text = "Previous",
  className,
  ...props
}: PaginationStepProps) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      className={cn(text ? "ps-2" : "px-0", className)}
      {...props}
    >
      <IconChevronLeft
        data-icon={text ? "inline-start" : undefined}
        className="rtl:-scale-x-100"
      />
      {text ? <span className="max-sm:hidden">{text}</span> : null}
    </PaginationLink>
  )
}

function PaginationNext({
  text = "Next",
  className,
  ...props
}: PaginationStepProps) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      className={cn(text ? "pe-2" : "px-0", className)}
      {...props}
    >
      {text ? <span className="max-sm:hidden">{text}</span> : null}
      <IconChevronRight
        data-icon={text ? "inline-end" : undefined}
        className="rtl:-scale-x-100"
      />
    </PaginationLink>
  )
}

type PaginationJumpProps = Omit<React.ComponentProps<"button">, "onClick"> & {
  count: number
  onJump: (page: number) => void
  suffix?: React.ReactNode
}

function PaginationJump({
  count,
  onJump,
  suffix,
  className,
  children,
  ...props
}: PaginationJumpProps) {
  const [editing, setEditing] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [invalid, setInvalid] = React.useState(false)
  const [width, setWidth] = React.useState(0)
  const triggerRef = React.useRef<HTMLButtonElement | null>(null)
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const returnFocus = React.useRef(false)
  const digits = String(count).length

  React.useLayoutEffect(() => {
    if (editing) {
      inputRef.current?.focus()
    } else if (returnFocus.current) {
      returnFocus.current = false
      triggerRef.current?.focus()
    }
  }, [editing])

  const shake = () => {
    const input = inputRef.current
    setInvalid(true)
    if (!input || prefersReducedMotion()) {
      return
    }
    input.removeAttribute("data-shake")
    void input.offsetWidth
    input.setAttribute("data-shake", "")
  }

  const commit = () => {
    const text = value
      .trim()
      .replace(/[\u0660-\u0669\u06f0-\u06f9\uff10-\uff19]/g, (digit) =>
        String(digit.charCodeAt(0) & 0xf)
      )
    const target = Number(text)
    if (!/^\d+$/.test(text) || target < 1 || target > count) {
      shake()
      return
    }
    const nav = inputRef.current?.closest("[data-slot=pagination]")
    setEditing(false)
    setValue("")
    setInvalid(false)
    onJump(target)
    requestAnimationFrame(() => {
      const focusTarget =
        nav?.querySelector<HTMLElement>(linkSelector) ??
        nav?.querySelector<HTMLElement>("[data-slot=pagination-jump]")
      focusTarget?.focus()
    })
  }

  if (editing) {
    return (
      <span
        data-slot="pagination-jump-field"
        style={
          { "--pagination-jump-width": `${width}px` } as React.CSSProperties
        }
        className="flex h-9 min-w-(--pagination-jump-width) items-center justify-center gap-1.5 text-sm whitespace-nowrap tabular-nums pointer-coarse:h-11"
      >
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          enterKeyHint="go"
          autoComplete="off"
          placeholder="…"
          aria-label={`Go to page, 1 to ${count}`}
          aria-invalid={invalid || undefined}
          value={value}
          style={{ "--pagination-digits": digits } as React.CSSProperties}
          className="h-full w-[max(--spacing(9),calc(var(--pagination-digits)*1ch+--spacing(4)))] rounded-md bg-background text-center text-sm tabular-nums ring-3 inset-ring-(length:--hairline) ring-focus-ring inset-ring-ring outline-none placeholder:text-muted-foreground focus-visible:outline-hidden aria-invalid:ring-destructive/20 aria-invalid:inset-ring-destructive motion-safe:animate-in motion-safe:animation-duration-150 motion-safe:fade-in-0 motion-safe:zoom-in-95 data-shake:motion-safe:animate-button-shake dark:bg-input/30 forced-colors:border pointer-coarse:text-[max(16px,1rem)]"
          onChange={(event) => {
            setValue(event.target.value)
            setInvalid(false)
          }}
          onAnimationEnd={(event) => {
            event.currentTarget.removeAttribute("data-shake")
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              commit()
            } else if (event.key === "Escape") {
              event.preventDefault()
              event.stopPropagation()
              returnFocus.current = true
              setEditing(false)
              setValue("")
              setInvalid(false)
            }
          }}
          onBlur={() => {
            setEditing(false)
            setValue("")
            setInvalid(false)
          }}
        />
        {suffix ? (
          <span className="text-muted-foreground">{suffix}</span>
        ) : null}
      </span>
    )
  }

  return (
    <button
      ref={triggerRef}
      type="button"
      data-slot="pagination-jump"
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "h-9 min-w-[max(--spacing(9),calc(var(--pagination-digits,1)*1ch+--spacing(4)))] px-0 tabular-nums pointer-coarse:h-11 pointer-coarse:min-w-11",
        className
      )}
      onClick={(event) => {
        setWidth(event.currentTarget.getBoundingClientRect().width)
        setEditing(true)
      }}
      {...props}
    >
      {children}
    </button>
  )
}

type PaginationEllipsisProps = React.ComponentProps<"span"> & {
  count?: number
  onJump?: (page: number) => void
}

function PaginationEllipsis({
  className,
  count,
  onJump,
  ...props
}: PaginationEllipsisProps) {
  if (onJump && count && count > 0) {
    return (
      <PaginationJump
        count={count}
        onJump={onJump}
        aria-label="More pages, go to page"
        className="text-muted-foreground hover:text-foreground"
      >
        <IconDots />
      </PaginationJump>
    )
  }

  return (
    <span
      data-slot="pagination-ellipsis"
      className={cn(
        "flex h-9 min-w-[max(--spacing(9),calc(var(--pagination-digits,1)*1ch+--spacing(4)))] items-center justify-center text-muted-foreground [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <IconDots aria-hidden="true" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  usePagination,
}
export type {
  PaginationEllipsisProps,
  PaginationItemData,
  PaginationLinkProps,
  PaginationProps,
  UsePaginationOptions,
}
