"use client"

import * as React from "react"
import {
  MessageScroller as MessageScrollerPrimitive,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
} from "@shadcn/react/message-scroller"
import { IconArrowDown } from "@tabler/icons-react"
import { cn } from "cn"

import { useSizeMorph } from "@/lib/motion"

import { Button } from "@/components/ui/button"

function MessageScrollerProvider(
  props: React.ComponentProps<typeof MessageScrollerPrimitive.Provider>
) {
  return <MessageScrollerPrimitive.Provider {...props} />
}

function MessageScroller({
  className,
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Root>) {
  return (
    <MessageScrollerPrimitive.Root
      data-slot="message-scroller"
      className={cn(
        "group/message-scroller relative flex size-full min-h-0 flex-col overflow-hidden",
        className
      )}
      {...props}
    />
  )
}

function MessageScrollerViewport({
  className,
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Viewport>) {
  return (
    <MessageScrollerPrimitive.Viewport
      data-slot="message-scroller-viewport"
      className={cn(
        "size-full min-h-0 min-w-0 [scrollbar-width:thin] [scrollbar-color:var(--color-border)_transparent] [scrollbar-gutter:stable] overflow-y-auto overscroll-none mask-[linear-gradient(to_bottom,transparent,#000_var(--scroller-fade-start),#000_calc(100%-var(--scroller-fade-end)),transparent)] transition-[--scroller-fade-start,--scroller-fade-end] duration-200 ease-out-cubic [contain:content] outline-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden focus-visible:ring-inset data-autoscrolling:[scrollbar-color:transparent_transparent] data-pending-scroll:invisible data-[scrollable~=end]:[--scroller-fade-end:--spacing(10)] data-[scrollable~=start]:[--scroller-fade-start:--spacing(10)] motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

const MessageScrollerReadyContext = React.createContext(false)

function useSpacerHold(contentRef: React.RefObject<HTMLDivElement | null>) {
  React.useLayoutEffect(() => {
    const content = contentRef.current
    const viewport = content?.parentElement
    const spacer = content?.querySelector<HTMLElement>(
      "[data-message-scroller-spacer]"
    )
    if (
      !content ||
      !viewport ||
      !spacer ||
      typeof ResizeObserver === "undefined"
    ) {
      return
    }

    let lastScrollTop = viewport.scrollTop
    let spacerHeight = spacer.getBoundingClientRect().height
    let held = Infinity
    let collapsed = false
    let reading = false

    const naturalHeight = () => {
      const rows = Array.from(content.children).filter(
        (child): child is HTMLElement =>
          child instanceof HTMLElement && child !== spacer
      )
      const last = rows.at(-1)
      const padding = parseFloat(getComputedStyle(content).paddingBottom) || 0
      return last ? last.offsetTop + last.offsetHeight + padding : 0
    }

    const release = () => {
      collapsed = false
      if (held !== Infinity) {
        held = Infinity
        content.style.minHeight = ""
      }
    }

    const hold = (scrollTop: number) => {
      const floor = Math.min(
        held,
        scrollTop + viewport.clientHeight - content.offsetTop
      )
      if (floor <= Math.max(viewport.clientHeight, naturalHeight()) + 0.5) {
        release()
        return
      }
      held = floor
      content.style.minHeight = `${floor}px`
    }

    const onScroll = () => {
      lastScrollTop = viewport.scrollTop
      if (collapsed && held !== Infinity) {
        hold(lastScrollTop)
      }
    }

    const onUserScroll = () => {
      reading = true
      if (!collapsed) {
        release()
      }
    }

    const onSpacer = () => {
      const next = spacer.getBoundingClientRect().height
      const shrank = next < spacerHeight - 0.5
      spacerHeight = next
      if (next > 0.5) {
        collapsed = false
        if (reading) {
          return
        }
        content.style.minHeight = ""
        held = content.getBoundingClientRect().height
        content.style.minHeight = `${held}px`
        return
      }
      if (held !== Infinity) {
        collapsed = true
        hold(viewport.scrollTop)
        return
      }
      if (shrank) {
        const keep = lastScrollTop
        collapsed = true
        hold(keep)
        viewport.scrollTop = keep
      }
    }

    const onRows = () => {
      reading = false
      release()
    }

    const spacerObserver = new ResizeObserver(onSpacer)
    spacerObserver.observe(spacer)
    const rows = new MutationObserver(onRows)
    rows.observe(content, { childList: true })
    viewport.addEventListener("scroll", onScroll, { passive: true })
    const intents = ["wheel", "touchstart", "keydown", "pointerdown"] as const
    for (const type of intents) {
      viewport.addEventListener(type, onUserScroll, { passive: true })
    }

    return () => {
      spacerObserver.disconnect()
      rows.disconnect()
      viewport.removeEventListener("scroll", onScroll)
      for (const type of intents) {
        viewport.removeEventListener(type, onUserScroll)
      }
      content.style.minHeight = ""
    }
  }, [contentRef])
}

function MessageScrollerContent({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Content>) {
  const [ready, setReady] = React.useState(false)
  const contentRef = React.useRef<HTMLDivElement | null>(null)
  useSpacerHold(contentRef)
  const setRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      contentRef.current = node
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

  React.useEffect(() => {
    setReady(true)
  }, [])

  return (
    <MessageScrollerReadyContext.Provider value={ready}>
      <MessageScrollerPrimitive.Content
        ref={setRef}
        data-slot="message-scroller-content"
        className={cn("flex h-max min-h-full flex-col gap-4 p-4", className)}
        {...props}
      />
    </MessageScrollerReadyContext.Provider>
  )
}

type MessageScrollerItemProps = React.ComponentProps<
  typeof MessageScrollerPrimitive.Item
> & {
  animated?: boolean
}

function MessageScrollerItem({
  className,
  scrollAnchor = false,
  animated = true,
  ...props
}: MessageScrollerItemProps) {
  const ready = React.useContext(MessageScrollerReadyContext)
  const [entering] = React.useState(() => animated && ready)

  return (
    <MessageScrollerPrimitive.Item
      data-slot="message-scroller-item"
      data-entering={entering ? "" : undefined}
      scrollAnchor={scrollAnchor}
      className={cn(
        "min-w-0 shrink-0 [contain-intrinsic-size:auto_6rem] [content-visibility:auto] data-entering:motion-safe:animate-message-in motion-reduce:data-entering:animate-in motion-reduce:data-entering:fade-in-0",
        className
      )}
      {...props}
    />
  )
}

function useUnseenCount(enabled: boolean) {
  const anchorRef = React.useRef<HTMLButtonElement | null>(null)
  const { visibleMessageIds } = useMessageScrollerVisibility()
  const { end } = useMessageScrollerScrollable()
  const seenRef = React.useRef<Set<string> | null>(null)
  const [unseen, setUnseen] = React.useState(0)

  React.useEffect(() => {
    if (!enabled) {
      return
    }
    const root = anchorRef.current?.closest("[data-slot=message-scroller]")
    if (!root) {
      return
    }
    const ids = () =>
      Array.from(
        root.querySelectorAll<HTMLElement>("[data-message-id]"),
        (node) => node.dataset.messageId ?? ""
      ).filter(Boolean)

    if (!seenRef.current) {
      seenRef.current = new Set(ids())
    }
    const seen = seenRef.current

    const count = () => {
      if (!end) {
        for (const id of ids()) {
          seen.add(id)
        }
        setUnseen(0)
        return
      }
      for (const id of visibleMessageIds) {
        seen.add(id)
      }
      setUnseen(ids().filter((id) => !seen.has(id)).length)
    }

    count()
    const content = root.querySelector("[data-slot=message-scroller-content]")
    if (!content) {
      return
    }
    const observer = new MutationObserver(count)
    observer.observe(content, { childList: true })
    return () => observer.disconnect()
  }, [enabled, end, visibleMessageIds])

  return { anchorRef, unseen }
}

function defaultUnseenLabel(count: number) {
  return count === 1 ? "1 new message" : `${count} new messages`
}

type MessageScrollerButtonProps = React.ComponentProps<
  typeof MessageScrollerPrimitive.Button
> &
  Pick<React.ComponentProps<typeof Button>, "variant"> & {
    showUnseen?: boolean
    unseenLabel?: (count: number) => React.ReactNode
  }

function MessageScrollerButton({
  direction = "end",
  className,
  children,
  render,
  variant = "outline",
  showUnseen = true,
  unseenLabel = defaultUnseenLabel,
  ref,
  ...props
}: MessageScrollerButtonProps) {
  const counting = showUnseen && direction === "end" && children === undefined
  const { anchorRef, unseen } = useUnseenCount(counting)
  const morphRef = useSizeMorph<HTMLButtonElement>({
    axis: "width",
    duration: 260,
  })
  const setRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      anchorRef.current = node
      const cleanup = morphRef(node)
      if (typeof ref === "function") {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
      return () => {
        cleanup?.()
        anchorRef.current = null
      }
    },
    [anchorRef, morphRef, ref]
  )
  const label = counting && unseen > 0 ? unseenLabel(unseen) : null

  return (
    <MessageScrollerPrimitive.Button
      ref={setRef}
      data-slot="message-scroller-button"
      data-direction={direction}
      data-unseen={label ? unseen : undefined}
      direction={direction}
      className={cn(
        "absolute start-1/2 z-10 -translate-x-1/2 overflow-hidden rounded-full shadow-md transition-[translate,scale,opacity] duration-200 data-morphing:overflow-clip data-[active=false]:pointer-events-none data-[active=false]:scale-95 data-[active=false]:opacity-0 data-[active=false]:duration-300 data-[active=false]:ease-[cubic-bezier(0.7,0,0.84,0)] data-[active=true]:translate-y-0 data-[active=true]:scale-100 data-[active=true]:opacity-100 data-[active=true]:ease-out-quint data-[direction=end]:bottom-3 data-[direction=end]:data-[active=false]:translate-y-2 data-[direction=start]:top-3 data-[direction=start]:data-[active=false]:-translate-y-2 motion-reduce:transition-opacity rtl:translate-x-1/2 data-[direction=start]:[&_svg]:rotate-180",
        className
      )}
      render={
        render ?? (
          <Button
            variant={variant}
            size={label ? "sm" : "icon-sm"}
            className={label ? "ps-2.5 pe-3" : undefined}
          />
        )
      }
      {...props}
    >
      {children ?? (
        <>
          <IconArrowDown />
          {label ? (
            <span className="whitespace-nowrap">{label}</span>
          ) : (
            <span className="sr-only">
              {direction === "end" ? "Scroll to latest" : "Scroll to start"}
            </span>
          )}
        </>
      )}
    </MessageScrollerPrimitive.Button>
  )
}

export {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
}
export type { MessageScrollerButtonProps, MessageScrollerItemProps }
