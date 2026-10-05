"use client"

import * as React from "react"
import {
  DirectionProvider,
  useDirection,
} from "@base-ui/react/direction-provider"
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area"
import { cva } from "class-variance-authority"
import { cn } from "cn"

type ClassName<State> =
  string | ((state: State) => string | undefined) | undefined

function mergeClassName<State>(base: string, className: ClassName<State>) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    }
  }
}

type PeekItem = { top: number; height: number }

function getPeekHeight(items: PeekItem[], viewportHeight: number) {
  if (items.length === 0 || viewportHeight <= 0) {
    return null
  }

  const last = items[items.length - 1]
  if (last.top + last.height <= viewportHeight + 1) {
    return null
  }

  const crossing = items.find(
    (item) =>
      item.top < viewportHeight && item.top + item.height > viewportHeight
  )
  if (crossing && crossing.height > 0) {
    const visible = (viewportHeight - crossing.top) / crossing.height
    if (visible >= 0.4 && visible <= 0.65) {
      return null
    }
  }

  let target: { height: number; visible: number } | null = null
  for (const item of items) {
    const cut = item.top + item.height * 0.6
    if (cut <= viewportHeight) {
      target = { height: cut, visible: item.height * 0.6 }
    }
  }

  if (target === null || target.height < viewportHeight * 0.5) {
    return null
  }

  return {
    height: Math.round(target.height),
    visible: Math.round(target.visible),
  }
}

function findPeekItems(content: HTMLElement) {
  const marked = content.querySelectorAll<HTMLElement>(
    "[data-scroll-area-item]"
  )
  if (marked.length > 0) {
    return Array.from(marked)
  }
  let container: Element = content
  while (container.children.length === 1) {
    container = container.children[0]
  }
  return Array.from(container.children) as HTMLElement[]
}

function usePeek(
  enabled: boolean,
  rootRef: React.RefObject<HTMLDivElement | null>,
  viewportRef: React.RefObject<HTMLDivElement | null>,
  contentRef: React.RefObject<HTMLDivElement | null>
) {
  React.useLayoutEffect(() => {
    const root = rootRef.current
    const viewport = viewportRef.current
    const content = contentRef.current
    if (!enabled || !root || !viewport || !content) {
      return
    }

    const apply = () => {
      root.style.height = ""
      viewport.style.removeProperty("--scroll-area-fade-end")
      const viewportHeight = viewport.clientHeight
      const origin = viewport.getBoundingClientRect().top - viewport.scrollTop
      const items = findPeekItems(content).map((item) => {
        const rect = item.getBoundingClientRect()
        return { top: rect.top - origin, height: rect.height }
      })
      const target = getPeekHeight(items, viewportHeight)
      if (target === null) {
        delete root.dataset.peeking
        return
      }
      const chrome = root.offsetHeight - viewportHeight
      root.style.height = `${target.height + chrome}px`
      viewport.style.setProperty(
        "--scroll-area-fade-end",
        `${Math.max(8, Math.round(target.visible / 2))}px`
      )
      root.dataset.peeking = ""
    }

    apply()

    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(apply)
    observer?.observe(content)
    observer?.observe(root)

    return () => {
      observer?.disconnect()
      root.style.height = ""
      viewport.style.removeProperty("--scroll-area-fade-end")
      delete root.dataset.peeking
    }
  }, [enabled, rootRef, viewportRef, contentRef])
}

function useDomDirection(rootRef: React.RefObject<HTMLDivElement | null>) {
  const contextDirection = useDirection()
  const [domDirection, setDomDirection] = React.useState<"ltr" | "rtl">("ltr")

  React.useLayoutEffect(() => {
    const root = rootRef.current
    if (root) {
      setDomDirection(
        getComputedStyle(root).direction === "rtl" ? "rtl" : "ltr"
      )
    }
  }, [rootRef])

  return domDirection === "rtl" ? "rtl" : contextDirection
}

const fadeMask =
  "[--scroll-area-fade:2.5rem] [mask-composite:intersect] [mask-image:linear-gradient(to_bottom,transparent,#000_min(var(--scroll-area-fade),var(--scroll-area-overflow-y-start,0px)),#000_calc(100%_-_min(var(--scroll-area-fade-end,var(--scroll-area-fade)),var(--scroll-area-overflow-y-end,0px))),transparent),linear-gradient(to_right,transparent,#000_min(var(--scroll-area-fade),var(--scroll-area-overflow-x-start,0px)),#000_calc(100%_-_min(var(--scroll-area-fade),var(--scroll-area-overflow-x-end,0px))),transparent)] rtl:[mask-image:linear-gradient(to_bottom,transparent,#000_min(var(--scroll-area-fade),var(--scroll-area-overflow-y-start,0px)),#000_calc(100%_-_min(var(--scroll-area-fade-end,var(--scroll-area-fade)),var(--scroll-area-overflow-y-end,0px))),transparent),linear-gradient(to_left,transparent,#000_min(var(--scroll-area-fade),var(--scroll-area-overflow-x-start,0px)),#000_calc(100%_-_min(var(--scroll-area-fade),var(--scroll-area-overflow-x-end,0px))),transparent)]"

const scrollAreaVariants = cva(
  "relative has-[>[data-slot=scroll-area-viewport]:focus-visible]:ring-3 has-[>[data-slot=scroll-area-viewport]:focus-visible]:ring-focus-ring has-[>[data-slot=scroll-area-viewport]:focus-visible]:outline-1 has-[>[data-slot=scroll-area-viewport]:focus-visible]:outline-ring has-[>[data-slot=scroll-area-viewport]:focus-visible]:outline-solid"
)

type ScrollAreaProps = ScrollAreaPrimitive.Root.Props & {
  scrollbars?: "vertical" | "horizontal" | "both"
  fade?: boolean
  peek?: boolean
  viewportRef?: React.Ref<HTMLDivElement>
}

function ScrollArea({
  className,
  children,
  scrollbars = "vertical",
  fade = true,
  peek = false,
  viewportRef,
  ref,
  ...props
}: ScrollAreaProps) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const localViewportRef = React.useRef<HTMLDivElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const setRootRef = React.useMemo(() => mergeRefs(rootRef, ref), [ref])
  const setViewportRef = React.useMemo(
    () => mergeRefs(localViewportRef, viewportRef),
    [viewportRef]
  )
  const direction = useDomDirection(rootRef)

  usePeek(peek, rootRef, localViewportRef, contentRef)

  const area = (
    <ScrollAreaPrimitive.Root
      ref={setRootRef}
      data-slot="scroll-area"
      data-peek={peek ? "" : undefined}
      className={mergeClassName(scrollAreaVariants(), className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        ref={setViewportRef}
        data-slot="scroll-area-viewport"
        className={cn(
          "size-full overscroll-none rounded-[inherit] outline-none focus-visible:outline-hidden",
          fade && fadeMask
        )}
      >
        <ScrollAreaPrimitive.Content
          ref={contentRef}
          data-slot="scroll-area-content"
          className={cn(scrollbars === "vertical" && "w-full min-w-0!")}
        >
          {children}
        </ScrollAreaPrimitive.Content>
      </ScrollAreaPrimitive.Viewport>
      {scrollbars !== "horizontal" ? (
        <ScrollBar orientation="vertical" />
      ) : null}
      {scrollbars !== "vertical" ? (
        <ScrollBar orientation="horizontal" />
      ) : null}
      {scrollbars === "both" ? (
        <ScrollAreaPrimitive.Corner data-slot="scroll-area-corner" />
      ) : null}
    </ScrollAreaPrimitive.Root>
  )

  return <DirectionProvider direction={direction}>{area}</DirectionProvider>
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: ScrollAreaPrimitive.Scrollbar.Props) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={mergeClassName(
        "pointer-events-none flex touch-none p-0.5 opacity-0 transition-opacity duration-200 select-none data-hovering:pointer-events-auto data-hovering:opacity-100 data-scrolling:pointer-events-auto data-scrolling:opacity-100 data-scrolling:duration-0 data-[orientation=horizontal]:mx-1.5 data-[orientation=horizontal]:mb-0.5 data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-col data-[orientation=vertical]:my-1.5 data-[orientation=vertical]:me-0.5 data-[orientation=vertical]:w-2.5",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-full bg-[color-mix(in_oklab,var(--foreground)_20%,var(--background))] transition-colors duration-150 hover:bg-[color-mix(in_oklab,var(--foreground)_35%,var(--background))] active:bg-[color-mix(in_oklab,var(--foreground)_45%,var(--background))] forced-colors:bg-canvas-text"
      />
    </ScrollAreaPrimitive.Scrollbar>
  )
}

export { ScrollArea, ScrollBar, scrollAreaVariants, getPeekHeight }
export type { ScrollAreaProps, PeekItem }
