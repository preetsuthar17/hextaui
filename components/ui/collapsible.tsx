"use client"

import * as React from "react"
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { IconChevronDown } from "@tabler/icons-react"
import { cn } from "cn"

type ClassName<State> =
  string | ((state: State) => string | undefined) | undefined

function mergeClassName<State>(base: string, className: ClassName<State>) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T) => {
    const cleanups = refs.map((ref) => {
      if (typeof ref === "function") {
        const cleanup = ref(node)
        return typeof cleanup === "function" ? cleanup : () => ref(null)
      }
      if (ref) {
        ref.current = node
        return () => {
          ref.current = null
        }
      }
      return undefined
    })
    return () => {
      for (const cleanup of cleanups) {
        cleanup?.()
      }
    }
  }
}

function getCollapsedGap(panel: HTMLElement) {
  const parent = panel.parentElement

  if (!parent) {
    return { start: 0, end: 0 }
  }

  const style = getComputedStyle(parent)
  const isFlexColumn =
    style.display.endsWith("flex") && style.flexDirection.startsWith("column")
  const isSingleColumnGrid =
    style.display.endsWith("grid") &&
    style.gridTemplateColumns.trim().split(/\s+/).length === 1
  const gap =
    isFlexColumn || isSingleColumnGrid ? parseFloat(style.rowGap) || 0 : 0

  if (!gap) {
    return { start: 0, end: 0 }
  }

  const reversed = isFlexColumn && style.flexDirection === "column-reverse"

  if (panel.previousElementSibling) {
    return reversed ? { start: 0, end: gap } : { start: gap, end: 0 }
  }

  if (panel.nextElementSibling) {
    return reversed ? { start: gap, end: 0 } : { start: 0, end: gap }
  }

  return { start: 0, end: 0 }
}

function syncCollapsedGap(panel: HTMLElement) {
  const { start, end } = getCollapsedGap(panel)
  const { style } = panel

  if (
    style.getPropertyValue("--collapsible-gap-start") === `${start}px` &&
    style.getPropertyValue("--collapsible-gap-end") === `${end}px`
  ) {
    return
  }

  const transition = style.getPropertyValue("transition")
  const priority = style.getPropertyPriority("transition")
  style.setProperty("transition", "none", "important")
  style.setProperty("--collapsible-gap-start", `${start}px`)
  style.setProperty("--collapsible-gap-end", `${end}px`)
  void getComputedStyle(panel).margin
  if (transition) {
    style.setProperty("transition", transition, priority)
  } else {
    style.removeProperty("transition")
  }
}

function Collapsible(props: CollapsiblePrimitive.Root.Props) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({
  className,
  ...props
}: CollapsiblePrimitive.Trigger.Props) {
  return (
    <CollapsiblePrimitive.Trigger
      data-slot="collapsible-trigger"
      className={mergeClassName(
        "group/collapsible-trigger [-webkit-tap-highlight-color:transparent]",
        className
      )}
      {...props}
    />
  )
}

function CollapsibleTriggerIcon({
  className,
  children,
  render,
  ...props
}: useRender.ComponentProps<"span">) {
  return useRender({
    defaultTagName: "span",
    render,
    props: mergeProps<"span">(
      {
        "aria-hidden": true,
        className: cn(
          "inline-flex size-4 shrink-0 items-center justify-center transition-[translate] duration-150 group-active/collapsible-trigger:translate-y-px motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
          className
        ),
        children: children ?? (
          <IconChevronDown className="transition-[rotate] duration-200 ease-spring group-data-panel-open/collapsible-trigger:rotate-180 motion-reduce:transition-none" />
        ),
      },
      props,
      { "data-slot": "collapsible-trigger-icon" } as Record<string, string>
    ),
  })
}

function CollapsibleContent({
  className,
  children,
  hiddenUntilFound = true,
  ref,
  ...props
}: Omit<CollapsiblePrimitive.Panel.Props, "className"> & {
  className?: string
}) {
  const observeGap = React.useCallback((panel: HTMLDivElement | null) => {
    const parent = panel?.parentElement

    if (!panel || !parent) {
      return
    }

    syncCollapsedGap(panel)

    const sync = () => syncCollapsedGap(panel)
    const resizeObserver =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(sync)
    const mutationObserver = new MutationObserver(sync)
    resizeObserver?.observe(parent)
    mutationObserver.observe(parent, { childList: true })

    return () => {
      resizeObserver?.disconnect()
      mutationObserver.disconnect()
    }
  }, [])
  const setRef = React.useMemo(
    () => mergeRefs(observeGap, ref),
    [observeGap, ref]
  )

  return (
    <CollapsiblePrimitive.Panel
      data-slot="collapsible-content"
      ref={setRef}
      hiddenUntilFound={hiddenUntilFound}
      className="group/collapsible-content h-(--collapsible-panel-height) overflow-hidden transition-[height,margin] duration-300 ease-spring data-ending-style:h-0 data-ending-style:duration-150 data-starting-style:-mt-(--collapsible-gap-start) data-starting-style:-mb-(--collapsible-gap-end) data-starting-style:h-0 motion-reduce:transition-none data-closed:-mt-(--collapsible-gap-start) data-closed:-mb-(--collapsible-gap-end)"
      {...props}
    >
      <div
        data-slot="collapsible-content-inner"
        className={cn(
          "transition-[opacity,translate] duration-200 ease-out-quint group-data-ending-style/collapsible-content:-translate-y-1 group-data-ending-style/collapsible-content:opacity-0 group-data-ending-style/collapsible-content:duration-150 group-data-starting-style/collapsible-content:-translate-y-1 group-data-starting-style/collapsible-content:opacity-0 motion-reduce:transition-none",
          className
        )}
      >
        {children}
      </div>
    </CollapsiblePrimitive.Panel>
  )
}

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleTriggerIcon,
  CollapsibleContent,
}
