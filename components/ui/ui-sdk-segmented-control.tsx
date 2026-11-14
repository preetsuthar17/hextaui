"use client"

import * as React from "react"
import * as SegmentedControlPrimitive from "@ui-sdk/react/segmented-control"
import { cn } from "cn"

type ClassName<State> =
  string | ((state: State) => string | undefined) | undefined

function mergeClassName<State>(base: string, className: ClassName<State>) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

type SegmentedControlSize = "sm" | "default" | "lg"

type SegmentedControlProps<T extends string = string> = React.ComponentProps<
  typeof SegmentedControlPrimitive.SegmentedControl<T>
> & {
  size?: SegmentedControlSize
}

function SegmentedControl<T extends string = string>({
  className,
  size = "default",
  children,
  ...props
}: SegmentedControlProps<T>) {
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    let second = 0
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setReady(true))
    })
    return () => {
      cancelAnimationFrame(first)
      cancelAnimationFrame(second)
    }
  }, [])

  return (
    <SegmentedControlPrimitive.SegmentedControl<T>
      data-size={size}
      data-ready={ready ? "" : undefined}
      className={mergeClassName(
        "group/segmented-control relative isolate inline-flex w-fit max-w-full min-w-0 items-stretch gap-0.5 rounded-lg bg-muted p-[3px] text-muted-foreground data-[orientation=vertical]:flex-col forced-colors:border",
        className
      )}
      {...props}
    >
      {(state) => (
        <>
          <SegmentedControlIndicator />
          {typeof children === "function" ? children(state) : children}
        </>
      )}
    </SegmentedControlPrimitive.SegmentedControl>
  )
}

function SegmentedControlIndicator({
  className,
  ...props
}: React.ComponentProps<
  typeof SegmentedControlPrimitive.SegmentedControlIndicator
>) {
  return (
    <SegmentedControlPrimitive.SegmentedControlIndicator
      className={mergeClassName(
        "pointer-events-none absolute top-0 left-0 -z-1 h-(--segmented-control-indicator-height) w-(--segmented-control-indicator-width) translate-x-(--segmented-control-indicator-left) translate-y-(--segmented-control-indicator-top) rounded-md bg-background ring-(length:--hairline) ring-foreground/5 group-data-ready/segmented-control:ease-out-quint motion-safe:group-data-ready/segmented-control:transition-[translate,width,height] motion-safe:group-data-ready/segmented-control:duration-300 motion-reduce:transition-none dark:bg-input/50 forced-colors:border forced-colors:border-[Highlight]",
        className
      )}
      {...props}
    />
  )
}

function isIconOnly(children: React.ReactNode) {
  const nodes = React.Children.toArray(children)
  return (
    nodes.length > 0 &&
    nodes.every(
      (node) =>
        React.isValidElement(node) &&
        (typeof node.type !== "string" || node.type === "svg")
    )
  )
}

function SegmentedControlItem({
  className,
  children,
  ...props
}: React.ComponentProps<
  typeof SegmentedControlPrimitive.SegmentedControlItem
>) {
  const iconOnly = typeof children !== "function" && isIconOnly(children)

  return (
    <SegmentedControlPrimitive.SegmentedControlItem
      data-icon-only={iconOnly ? "" : undefined}
      className={mergeClassName(
        "relative inline-flex h-8 min-w-0 flex-1 shrink-0 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium whitespace-nowrap text-muted-foreground transition-[color,box-shadow,scale] duration-150 ease-out-quint outline-none select-none group-data-[orientation=vertical]/segmented-control:flex-none group-data-[orientation=vertical]/segmented-control:justify-start group-data-[size=lg]/segmented-control:h-9 group-data-[size=lg]/segmented-control:px-4 group-data-[size=sm]/segmented-control:h-7 group-data-[size=sm]/segmented-control:px-2.5 group-data-[size=sm]/segmented-control:text-xs focus-visible:ring-3 focus-visible:ring-focus-ring active:duration-75 data-icon-only:aspect-square data-icon-only:flex-none data-icon-only:px-0 group-data-[orientation=vertical]/segmented-control:data-icon-only:justify-center data-readonly:cursor-default motion-safe:not-data-checked:not-data-readonly:active:scale-[0.97] pointer-coarse:h-10 pointer-coarse:group-data-[size=lg]/segmented-control:h-11 pointer-coarse:group-data-[size=sm]/segmented-control:h-9 data-checked:text-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 group-data-[size=sm]/segmented-control:[&_svg:not([class*='size-'])]:size-3.5 [@media(hover:hover)]:not-data-readonly:hover:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </SegmentedControlPrimitive.SegmentedControlItem>
  )
}

const createSegmentedControlController =
  SegmentedControlPrimitive.createSegmentedControlController

export {
  SegmentedControl,
  SegmentedControlItem,
  createSegmentedControlController,
}
export type { SegmentedControlProps, SegmentedControlSize }
export type {
  SegmentedControlController,
  SegmentedControlState,
  SegmentedControlItemState,
  SegmentedControlOrientation,
} from "@ui-sdk/react/segmented-control"
