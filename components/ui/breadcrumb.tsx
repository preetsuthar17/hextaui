"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { IconChevronRight, IconDots } from "@tabler/icons-react"
import { cn } from "cn"

import { duration, easeSpring } from "@/lib/motion"

type BreadcrumbCollapseContextValue = {
  group: string
  open: boolean
  settled: boolean
}

const BreadcrumbCollapseContext =
  React.createContext<BreadcrumbCollapseContextValue | null>(null)

function collapseAttributes(
  context: BreadcrumbCollapseContextValue | null,
  collapsed: boolean
) {
  if (!context) {
    return {}
  }

  return {
    "data-breadcrumb-group": context.group,
    "data-collapsed": collapsed && context.settled ? "" : undefined,
  } as Record<string, string | undefined>
}

function Breadcrumb({
  className,
  render,
  ...props
}: useRender.ComponentProps<"nav">) {
  return useRender({
    defaultTagName: "nav",
    render,
    props: mergeProps<"nav">(
      { "aria-label": "Breadcrumb", className: cn("min-w-0", className) },
      props,
      { "data-slot": "breadcrumb" } as React.ComponentProps<"nav">
    ),
  })
}

function BreadcrumbList({
  className,
  render,
  ...props
}: useRender.ComponentProps<"ol">) {
  return useRender({
    defaultTagName: "ol",
    render,
    props: mergeProps<"ol">(
      {
        className: cn(
          "flex min-w-0 flex-wrap items-center gap-1.5 text-sm wrap-anywhere text-muted-foreground",
          className
        ),
      },
      props,
      { "data-slot": "breadcrumb-list" } as React.ComponentProps<"ol">
    ),
  })
}

function BreadcrumbItem({
  className,
  render,
  ...props
}: useRender.ComponentProps<"li">) {
  const collapse = React.useContext(BreadcrumbCollapseContext)

  return useRender({
    defaultTagName: "li",
    render,
    props: mergeProps<"li">(
      {
        className: cn(
          "inline-flex min-w-0 items-center gap-1 data-collapsed:hidden",
          className
        ),
      },
      props,
      {
        "data-slot": "breadcrumb-item",
        ...collapseAttributes(collapse, collapse ? !collapse.open : false),
      } as React.ComponentProps<"li">
    ),
  })
}

function BreadcrumbLink({
  className,
  render,
  ...props
}: useRender.ComponentProps<"a">) {
  return useRender({
    defaultTagName: "a",
    render,
    props: mergeProps<"a">(
      {
        className: cn(
          "relative -mx-1 inline-flex min-w-0 items-center gap-1 rounded-sm px-1 transition-[color,box-shadow] duration-150 ease-out-quint outline-none hover:text-foreground focus-visible:z-10 focus-visible:text-foreground focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden [&>svg]:pointer-events-none [&>svg]:shrink-0 [&>svg:not([class*='size-'])]:size-4",
          className
        ),
      },
      props,
      { "data-slot": "breadcrumb-link" } as React.ComponentProps<"a">
    ),
  })
}

function BreadcrumbPage({
  className,
  render,
  ...props
}: useRender.ComponentProps<"span">) {
  return useRender({
    defaultTagName: "span",
    render,
    props: mergeProps<"span">(
      {
        "aria-current": "page",
        className: cn(
          "inline-flex min-w-0 items-center gap-1 font-normal text-foreground [&>svg]:pointer-events-none [&>svg]:shrink-0 [&>svg:not([class*='size-'])]:size-4",
          className
        ),
      },
      props,
      { "data-slot": "breadcrumb-page" } as React.ComponentProps<"span">
    ),
  })
}

function BreadcrumbSeparator({
  children,
  className,
  render,
  ...props
}: useRender.ComponentProps<"li">) {
  const collapse = React.useContext(BreadcrumbCollapseContext)

  return useRender({
    defaultTagName: "li",
    render,
    props: mergeProps<"li">(
      {
        role: "presentation",
        "aria-hidden": true,
        children: children ?? <IconChevronRight className="rtl:-scale-x-100" />,
        className: cn(
          "inline-flex shrink-0 items-center text-muted-foreground/60 select-none [&>svg]:pointer-events-none [&>svg:not([class*='size-'])]:size-3.5 [&[data-collapsed]:has(+[data-collapsed])]:hidden",
          className
        ),
      },
      props,
      {
        "data-slot": "breadcrumb-separator",
        ...collapseAttributes(collapse, collapse ? !collapse.open : false),
      } as React.ComponentProps<"li">
    ),
  })
}

function BreadcrumbEllipsis({
  children,
  className,
  render,
  ...props
}: useRender.ComponentProps<"span">) {
  const interactive = render !== undefined || props.onClick !== undefined

  return useRender({
    defaultTagName: "span",
    render,
    props: mergeProps<"span">(
      {
        ...(interactive
          ? {}
          : { role: "presentation", "aria-hidden": true as const }),
        children: children ?? (
          <>
            <IconDots aria-hidden />
            <span className="sr-only">More</span>
          </>
        ),
        className: cn(
          "relative inline-flex size-5 shrink-0 items-center justify-center rounded-sm outline-none focus-visible:outline-hidden [&:is(a,button)]:size-6 [&:is(a,button)]:cursor-pointer [&:is(a,button)]:transition-[color,background-color,box-shadow] [&:is(a,button)]:duration-150 [&:is(a,button)]:ease-out-quint [&:is(a,button)]:after:absolute [&:is(a,button)]:after:-inset-x-1 [&:is(a,button)]:after:-inset-y-2.5 [&:is(a,button)]:hover:bg-muted [&:is(a,button)]:hover:text-foreground [&:is(a,button)]:focus-visible:z-10 [&:is(a,button)]:focus-visible:text-foreground [&:is(a,button)]:focus-visible:ring-3 [&:is(a,button)]:focus-visible:ring-focus-ring [&:is(a,button)]:aria-expanded:bg-muted [&:is(a,button)]:aria-expanded:text-foreground [&>svg]:pointer-events-none [&>svg:not([class*='size-'])]:size-4",
          className
        ),
      },
      props,
      { "data-slot": "breadcrumb-ellipsis" } as React.ComponentProps<"span">
    ),
  })
}

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function groupElements(anchor: HTMLElement, group: string) {
  const list = anchor.parentElement

  if (!list) {
    return []
  }

  return Array.from(list.children).filter(
    (node): node is HTMLElement =>
      node instanceof HTMLElement && node.dataset.breadcrumbGroup === group
  )
}

function togglesWithCollapse(element: HTMLElement, group: string) {
  if (element.dataset.slot !== "breadcrumb-separator") {
    return true
  }

  const next = element.nextElementSibling

  return next instanceof HTMLElement && next.dataset.breadcrumbGroup === group
}

function clearAnimationStyles(element: HTMLElement) {
  element.style.overflow = ""
  element.style.whiteSpace = ""
  element.style.minWidth = ""
}

type BreadcrumbCollapseProps = {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  label?: string
}

function BreadcrumbCollapse({
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  label = "Show full path",
}: BreadcrumbCollapseProps) {
  const group = React.useId()
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const open = openProp ?? uncontrolledOpen
  const [previousOpen, setPreviousOpen] = React.useState(open)
  const [settled, setSettled] = React.useState(true)
  const triggerItemRef = React.useRef<HTMLLIElement>(null)
  const animationsRef = React.useRef(new Map<HTMLElement, Animation>())
  const runRef = React.useRef(0)
  const restoreFocusRef = React.useRef(false)

  if (open !== previousOpen) {
    setPreviousOpen(open)
    setSettled(false)
  }

  React.useLayoutEffect(() => {
    const triggerItem = triggerItemRef.current

    if (settled || !triggerItem) {
      return
    }

    const run = ++runRef.current
    const animations = animationsRef.current
    const elements = [triggerItem, ...groupElements(triggerItem, group)]
    const toggled = elements.filter(
      (element) =>
        element === triggerItem || togglesWithCollapse(element, group)
    )

    if (toggled.some((element) => element.contains(document.activeElement))) {
      restoreFocusRef.current = true
    }

    if (typeof triggerItem.animate !== "function") {
      setSettled(true)
      return
    }

    const reduceMotion =
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const list = triggerItem.parentElement
    const gap = list ? parseFloat(getComputedStyle(list).columnGap) || 0 : 0

    const starts = new Map<HTMLElement, number | null>()

    for (const element of toggled) {
      const running = animations.get(element)
      starts.set(
        element,
        running ? element.getBoundingClientRect().width : null
      )
      running?.cancel()
      animations.delete(element)
    }

    const pending = toggled.map((element) => {
      const entering = element === triggerItem ? !open : open
      const natural = element.getBoundingClientRect().width
      const start = starts.get(element) ?? (entering ? 0 : natural)
      const end = entering ? natural : 0
      const progress = natural > 0 ? start / natural : entering ? 0 : 1

      element.style.overflow = "hidden"
      element.style.whiteSpace = "nowrap"
      element.style.minWidth = "0px"

      const animation = element.animate(
        [
          {
            width: `${start}px`,
            marginInlineEnd: `${-gap * (1 - progress)}px`,
            opacity: progress,
          },
          {
            width: `${end}px`,
            marginInlineEnd: entering ? "0px" : `${-gap}px`,
            opacity: entering ? 1 : 0,
          },
        ],
        {
          duration: reduceMotion ? 0 : duration.morph,
          easing: easeSpring,
          fill: "forwards",
        }
      )

      animations.set(element, animation)

      return animation.finished
    })

    Promise.all(pending).then(
      () => {
        if (runRef.current === run) {
          setSettled(true)
        }
      },
      () => {}
    )
  }, [group, open, settled])

  React.useLayoutEffect(() => {
    if (!settled) {
      return
    }

    const animations = animationsRef.current

    for (const [element, animation] of animations) {
      animation.cancel()
      clearAnimationStyles(element)
    }

    animations.clear()

    const triggerItem = triggerItemRef.current

    if (!restoreFocusRef.current || !triggerItem) {
      return
    }

    restoreFocusRef.current = false

    const target = open
      ? groupElements(triggerItem, group)
          .map((element) =>
            element.matches(focusableSelector)
              ? element
              : element.querySelector<HTMLElement>(focusableSelector)
          )
          .find((element) => element?.checkVisibility?.() ?? true)
      : triggerItem.querySelector<HTMLElement>(focusableSelector)

    target?.focus()
  }, [group, open, settled])

  React.useEffect(() => {
    const animations = animationsRef.current

    return () => {
      for (const [element, animation] of animations) {
        animation.cancel()
        clearAnimationStyles(element)
      }

      animations.clear()
    }
  }, [])

  const context = React.useMemo(
    () => ({ group, open, settled }),
    [group, open, settled]
  )

  return (
    <BreadcrumbCollapseContext.Provider value={context}>
      <li
        ref={triggerItemRef}
        data-slot="breadcrumb-collapse"
        data-collapsed={open && settled ? "" : undefined}
        className="inline-flex shrink-0 items-center data-collapsed:hidden"
      >
        <BreadcrumbEllipsis
          render={<button type="button" aria-label={label} />}
          tabIndex={open ? -1 : undefined}
          onClick={() => {
            if (openProp === undefined) {
              setUncontrolledOpen(true)
            }
            onOpenChange?.(true)
          }}
        />
      </li>
      {children}
    </BreadcrumbCollapseContext.Provider>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  BreadcrumbCollapse,
}
