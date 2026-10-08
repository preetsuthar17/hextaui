"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva } from "class-variance-authority"
import { cn } from "cn"

type ClassName<State> =
  string | ((state: State) => string | undefined) | undefined

function mergeClassName<State>(base: string, className: ClassName<State>) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

type TabsVariant = "default" | "line"

const TabsListContext = React.createContext<TabsVariant>("default")

function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={mergeClassName(
        "group/tabs flex min-w-0 gap-3 data-[orientation=horizontal]:flex-col",
        className
      )}
      {...props}
    />
  )
}

function useScrollEdges(list: HTMLElement | null) {
  React.useEffect(() => {
    if (!list) {
      return
    }
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const vertical = list.getAttribute("data-orientation") === "vertical"
        const offset = vertical ? list.scrollTop : Math.abs(list.scrollLeft)
        const max = vertical
          ? list.scrollHeight - list.clientHeight
          : list.scrollWidth - list.clientWidth
        list.toggleAttribute("data-scrolled-start", offset > 0.5)
        list.toggleAttribute("data-scrolled-end", offset < max - 0.5)
      })
    }
    update()
    list.addEventListener("scroll", update, { passive: true })
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update)
    observer?.observe(list)
    return () => {
      cancelAnimationFrame(frame)
      list.removeEventListener("scroll", update)
      observer?.disconnect()
    }
  }, [list])
}

function useRevealActive(list: HTMLElement | null) {
  React.useEffect(() => {
    if (!list || typeof MutationObserver === "undefined") {
      return
    }
    const reveal = () => {
      const tab = list.querySelector<HTMLElement>(
        "[data-slot=tabs-trigger][data-active]"
      )
      if (!tab || list.scrollWidth <= list.clientWidth + 1) {
        return
      }
      const box = list.getBoundingClientRect()
      const rect = tab.getBoundingClientRect()
      const margin = 24
      if (rect.left < box.left + margin) {
        list.scrollBy({
          left: rect.left - box.left - margin,
          behavior: "smooth",
        })
      } else if (rect.right > box.right - margin) {
        list.scrollBy({
          left: rect.right - box.right + margin,
          behavior: "smooth",
        })
      }
    }
    const observer = new MutationObserver(reveal)
    observer.observe(list, {
      subtree: true,
      attributes: true,
      attributeFilter: ["data-active"],
    })
    const onFocus = (event: FocusEvent) => {
      const tab = (event.target as Element).closest<HTMLElement>(
        "[data-slot=tabs-trigger]"
      )
      if (!tab || list.scrollWidth <= list.clientWidth + 1) {
        return
      }
      const box = list.getBoundingClientRect()
      const rect = tab.getBoundingClientRect()
      if (rect.left < box.left || rect.right > box.right) {
        list.scrollBy({
          left:
            rect.left < box.left
              ? rect.left - box.left - 24
              : rect.right - box.right + 24,
          behavior: "smooth",
        })
      }
    }
    list.addEventListener("focusin", onFocus)
    return () => {
      observer.disconnect()
      list.removeEventListener("focusin", onFocus)
    }
  }, [list])
}

const tabsListVariants = cva(
  "group/tabs-list relative isolate flex max-w-full min-w-0 scroll-p-1 [scrollbar-width:none] overflow-x-auto overscroll-x-none data-[orientation=vertical]:flex-col data-[orientation=vertical]:overflow-x-visible data-[orientation=vertical]:overflow-y-auto [&::-webkit-scrollbar]:hidden",
  {
    variants: {
      variant: {
        default:
          "w-fit items-center gap-0.5 rounded-lg bg-muted p-[3px] data-[orientation=vertical]:items-stretch",
        line: "w-full gap-1 shadow-[inset_0_calc(var(--hairline)*-1)_0_var(--border)] data-[orientation=vertical]:w-fit data-[orientation=vertical]:shadow-[inset_calc(var(--hairline)*-1)_0_0_var(--border)] rtl:data-[orientation=vertical]:shadow-[inset_var(--hairline)_0_0_var(--border)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type TabsListProps = TabsPrimitive.List.Props & {
  variant?: TabsVariant
}

function TabsList({
  className,
  variant = "default",
  children,
  ref,
  ...props
}: TabsListProps) {
  const [list, setList] = React.useState<HTMLElement | null>(null)
  useScrollEdges(list)
  useRevealActive(list)

  React.useEffect(() => {
    if (!list) {
      return
    }
    let second = 0
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => list.setAttribute("data-ready", ""))
    })
    return () => {
      cancelAnimationFrame(first)
      cancelAnimationFrame(second)
    }
  }, [list])

  const setRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      setList(node)
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
    <TabsListContext.Provider value={variant}>
      <TabsPrimitive.List
        ref={setRef}
        data-slot="tabs-list"
        data-variant={variant}
        className={mergeClassName(
          cn(
            tabsListVariants({ variant }),
            "[--fade-end:0px] [--fade-start:0px] data-scrolled-end:[--fade-end:--spacing(6)] data-scrolled-start:[--fade-start:--spacing(6)] data-[orientation=horizontal]:mask-[linear-gradient(to_right,transparent,#000_var(--fade-start),#000_calc(100%-var(--fade-end)),transparent)] rtl:data-[orientation=horizontal]:mask-[linear-gradient(to_left,transparent,#000_var(--fade-start),#000_calc(100%-var(--fade-end)),transparent)]"
          ),
          className
        )}
        {...props}
      >
        {children}
        <TabsPrimitive.Indicator
          renderBeforeHydration
          data-slot="tabs-indicator"
          className={cn(
            "pointer-events-none absolute top-0 left-0 -z-1 h-(--active-tab-height) w-(--active-tab-width) translate-x-(--active-tab-left) translate-y-(--active-tab-top) group-data-ready/tabs-list:ease-out-quint motion-safe:group-data-ready/tabs-list:transition-[translate,width,height] motion-safe:group-data-ready/tabs-list:duration-300 motion-reduce:transition-none forced-colors:border",
            variant === "default"
              ? "rounded-md bg-background ring-(length:--hairline) ring-foreground/5 dark:bg-input/50 forced-colors:border"
              : "bg-foreground group-data-[orientation=horizontal]/tabs-list:top-auto group-data-[orientation=horizontal]/tabs-list:bottom-0 group-data-[orientation=horizontal]/tabs-list:h-0.5 group-data-[orientation=horizontal]/tabs-list:translate-y-0 group-data-[orientation=vertical]/tabs-list:w-0.5 group-data-[orientation=vertical]/tabs-list:translate-x-[calc(var(--active-tab-left)+var(--active-tab-width)-2px)] rtl:group-data-[orientation=vertical]/tabs-list:translate-x-(--active-tab-left)"
          )}
        />
      </TabsPrimitive.List>
    </TabsListContext.Provider>
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  const variant = React.useContext(TabsListContext)

  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={mergeClassName(
        cn(
          "relative inline-flex shrink-0 items-center justify-center gap-1.5 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors duration-150 outline-none select-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden data-disabled:pointer-events-none data-disabled:opacity-50 data-active:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [@media(hover:hover)]:hover:text-foreground",
          variant === "default"
            ? "h-8 flex-1 rounded-md px-3 group-data-[orientation=vertical]/tabs-list:justify-start pointer-coarse:h-10"
            : "h-10 px-2 group-data-[orientation=vertical]/tabs-list:h-9 group-data-[orientation=vertical]/tabs-list:justify-start group-data-[orientation=vertical]/tabs-list:pe-4 focus-visible:rounded-md focus-visible:ring-inset pointer-coarse:h-11"
        ),
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={mergeClassName(
        "min-w-0 flex-1 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden",
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsContent, TabsList, TabsTrigger, tabsListVariants }
export type { TabsListProps, TabsVariant }
