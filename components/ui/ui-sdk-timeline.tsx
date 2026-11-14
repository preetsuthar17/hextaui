"use client"

import * as React from "react"
import * as TimelinePrimitive from "@ui-sdk/react/timeline"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

type ClassName<State> =
  string | ((state: State) => string | undefined) | undefined

function mergeClassName<State>(base: string, className: ClassName<State>) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

function Timeline({
  className,
  ...props
}: React.ComponentProps<typeof TimelinePrimitive.Timeline>) {
  return (
    <TimelinePrimitive.Timeline
      className={mergeClassName(
        "group/timeline flex min-w-0 gap-(--timeline-gap) [--timeline-gap:--spacing(6)] [--timeline-marker:--spacing(5)] data-[orientation=horizontal]:-m-2 data-[orientation=horizontal]:flex-row data-[orientation=horizontal]:overflow-x-auto data-[orientation=horizontal]:overscroll-x-contain data-[orientation=horizontal]:p-2 data-[orientation=horizontal]:[--timeline-gap:--spacing(4)] data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    />
  )
}

function TimelineItem({
  className,
  ...props
}: React.ComponentProps<typeof TimelinePrimitive.TimelineItem>) {
  return (
    <TimelinePrimitive.TimelineItem
      className={mergeClassName(
        "group/timeline-item relative grid min-w-0 content-start gap-x-3 gap-y-0.5 rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background data-[orientation=horizontal]:min-w-28 data-[orientation=horizontal]:flex-1 data-[orientation=horizontal]:grid-cols-1 data-[orientation=vertical]:grid-cols-[var(--timeline-marker)_minmax(0,1fr)] data-[orientation=vertical]:[&>:not([data-slot=timeline-marker],[data-slot=timeline-connector])]:col-start-2",
        className
      )}
      {...props}
    />
  )
}

const timelineMarkerVariants = cva(
  "relative z-1 col-start-1 row-start-1 flex size-(--timeline-marker) shrink-0 items-center justify-center overflow-hidden rounded-full text-muted-foreground transition-[background-color,color,box-shadow] duration-200 ease-out-quint not-empty:bg-muted not-empty:text-foreground not-empty:inset-ring-(length:--hairline) not-empty:inset-ring-border group-data-[orientation=horizontal]/timeline:mb-2 empty:overflow-visible empty:before:size-2 empty:before:rounded-full empty:before:bg-muted-foreground/45 empty:before:transition-[background-color,box-shadow] empty:before:duration-200 data-complete:not-empty:bg-primary data-complete:not-empty:text-primary-foreground data-complete:not-empty:inset-ring-0 data-complete:empty:before:bg-foreground data-current:not-empty:bg-background data-current:not-empty:inset-ring-foreground/60 data-current:empty:before:bg-foreground data-current:empty:before:ring-4 data-current:empty:before:ring-foreground/10 data-upcoming:not-empty:bg-transparent data-upcoming:not-empty:text-muted-foreground data-upcoming:empty:before:bg-transparent data-upcoming:empty:before:inset-ring-[1.5px] data-upcoming:empty:before:inset-ring-muted-foreground/45 motion-reduce:transition-none forced-colors:border forced-colors:empty:before:bg-[CanvasText] [&_img]:size-full [&_img]:object-cover [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        default: "",
        success:
          "not-empty:bg-success/12 not-empty:text-success not-empty:inset-ring-success/25 empty:before:bg-success data-complete:not-empty:bg-success data-complete:not-empty:text-success-foreground data-complete:empty:before:bg-success",
        warning:
          "not-empty:bg-warning/12 not-empty:text-warning not-empty:inset-ring-warning/25 empty:before:bg-warning data-complete:not-empty:bg-warning data-complete:not-empty:text-warning-foreground data-complete:empty:before:bg-warning",
        destructive:
          "not-empty:bg-destructive/12 not-empty:text-destructive not-empty:inset-ring-destructive/25 empty:before:bg-destructive data-complete:not-empty:bg-destructive data-complete:not-empty:text-destructive-foreground data-complete:empty:before:bg-destructive",
        info: "not-empty:bg-info/12 not-empty:text-info not-empty:inset-ring-info/25 empty:before:bg-info data-complete:not-empty:bg-info data-complete:not-empty:text-info-foreground data-complete:empty:before:bg-info",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TimelineMarker({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TimelinePrimitive.TimelineMarker> &
  VariantProps<typeof timelineMarkerVariants>) {
  return (
    <TimelinePrimitive.TimelineMarker
      data-variant={variant}
      className={mergeClassName(timelineMarkerVariants({ variant }), className)}
      {...props}
    />
  )
}

function TimelineConnector({
  className,
  ...props
}: React.ComponentProps<typeof TimelinePrimitive.TimelineConnector>) {
  return (
    <TimelinePrimitive.TimelineConnector
      className={mergeClassName(
        "pointer-events-none absolute bg-border group-last/timeline-item:hidden group-data-last/timeline-item:hidden data-complete:bg-foreground/50 data-[orientation=horizontal]:start-[calc(var(--timeline-marker)+--spacing(1))] data-[orientation=horizontal]:end-[calc(--spacing(1)-var(--timeline-gap))] data-[orientation=horizontal]:top-[calc(var(--timeline-marker)/2-0.5px)] data-[orientation=horizontal]:h-px data-[orientation=vertical]:start-[calc(var(--timeline-marker)/2-0.5px)] data-[orientation=vertical]:top-[calc(var(--timeline-marker)+--spacing(1))] data-[orientation=vertical]:bottom-[calc(--spacing(1)-var(--timeline-gap))] data-[orientation=vertical]:w-px forced-colors:bg-[CanvasText]",
        className
      )}
      {...props}
    />
  )
}

function TimelineTitle({
  className,
  ...props
}: React.ComponentProps<typeof TimelinePrimitive.TimelineTitle>) {
  return (
    <TimelinePrimitive.TimelineTitle
      className={mergeClassName(
        "min-w-0 text-sm/5 font-medium text-foreground data-upcoming:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function TimelineTime({
  className,
  ...props
}: React.ComponentProps<typeof TimelinePrimitive.TimelineTime>) {
  return (
    <TimelinePrimitive.TimelineTime
      className={mergeClassName(
        "text-xs/5 text-muted-foreground tabular-nums",
        className
      )}
      {...props}
    />
  )
}

function TimelineDescription({
  className,
  ...props
}: React.ComponentProps<typeof TimelinePrimitive.TimelineDescription>) {
  return (
    <TimelinePrimitive.TimelineDescription
      className={mergeClassName(
        "min-w-0 text-sm text-pretty text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

const createTimelineController = TimelinePrimitive.createTimelineController

export {
  Timeline,
  TimelineItem,
  TimelineMarker,
  TimelineConnector,
  TimelineTitle,
  TimelineTime,
  TimelineDescription,
  createTimelineController,
  timelineMarkerVariants,
}
export type {
  TimelineController,
  TimelineOrientation,
  TimelineState,
  TimelineItemState,
  TimelineStatus,
} from "@ui-sdk/react/timeline"
