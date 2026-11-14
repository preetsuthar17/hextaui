"use client"

import * as React from "react"
import * as TimeInputPrimitive from "@ui-sdk/react/time-input"
import { cn } from "cn"

type ClassName<State> =
  string | ((state: State) => string | undefined) | undefined

function mergeClassName<State>(base: string, className: ClassName<State>) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

type TimeInputState = TimeInputPrimitive.TimeInputState

type TimeInputContextValue = {
  state: TimeInputState | null
  invalid: boolean
}

const TimeInputContext = React.createContext<TimeInputContextValue>({
  state: null,
  invalid: false,
})

type TimeInputProps = React.ComponentProps<
  typeof TimeInputPrimitive.TimeInput
> & {
  invalid?: boolean
}

function TimeInput({
  className,
  children,
  invalid = false,
  ...props
}: TimeInputProps) {
  return (
    <TimeInputPrimitive.TimeInput
      data-invalid={invalid ? "" : undefined}
      className={mergeClassName(
        "group/time-input flex h-9 w-full min-w-0 cursor-text items-center gap-1.5 rounded-md bg-transparent px-2.5 text-sm text-foreground inset-ring-(length:--hairline) inset-ring-input transition-[background-color,box-shadow] duration-150 ease-out-cubic has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-focus-ring has-[input:focus-visible]:inset-ring-ring data-invalid:inset-ring-destructive data-invalid:has-[input:focus-visible]:ring-destructive/20 data-invalid:has-[input:focus-visible]:inset-ring-destructive data-readonly:cursor-default data-readonly:bg-muted/40 motion-reduce:transition-none dark:bg-input/30 dark:data-readonly:bg-input/20 forced-colors:border pointer-coarse:h-10 data-disabled:cursor-not-allowed data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&>svg]:text-muted-foreground [@media(hover:hover)]:hover:not-has-[input:focus-visible]:not-data-disabled:not-data-invalid:inset-ring-ring/70",
        className
      )}
      {...props}
    >
      {(state) => (
        <TimeInputContext.Provider value={{ state, invalid }}>
          {children === undefined ? (
            <TimeInputSegments />
          ) : typeof children === "function" ? (
            children(state)
          ) : (
            children
          )}
        </TimeInputContext.Provider>
      )}
    </TimeInputPrimitive.TimeInput>
  )
}

function TimeInputSegments() {
  const { state } = React.useContext(TimeInputContext)
  if (!state) return null
  return (
    <span data-slot="time-input-segments" className="flex min-w-0 items-center">
      {state.segments.map((segment) => (
        <TimeInputSegment key={segment.key} segment={segment} />
      ))}
    </span>
  )
}

function TimeInputSegment({
  className,
  segment,
  ...props
}: React.ComponentProps<typeof TimeInputPrimitive.TimeInputSegment>) {
  const { invalid } = React.useContext(TimeInputContext)
  if (!segment.editable) {
    return (
      <TimeInputPrimitive.TimeInputSegment
        segment={segment}
        className={mergeClassName(
          "whitespace-pre text-muted-foreground",
          className
        )}
        {...props}
      />
    )
  }
  return (
    <TimeInputPrimitive.TimeInputSegment
      segment={segment}
      aria-invalid={invalid || undefined}
      className={mergeClassName(
        "box-content w-[2ch] min-w-0 rounded-[calc(var(--radius-sm)-1px)] bg-transparent px-[2px] py-0.5 text-center tabular-nums caret-transparent outline-none selection:bg-transparent placeholder:text-muted-foreground read-only:cursor-default focus:bg-primary focus:text-primary-foreground focus:placeholder:text-primary-foreground/60 disabled:cursor-not-allowed data-[type=dayPeriod]:field-sizing-content data-[type=dayPeriod]:w-auto data-[type=dayPeriod]:min-w-[2ch] not-supports-[field-sizing:content]:data-[type=dayPeriod]:w-[2.75em] forced-colors:focus:bg-[Highlight] forced-colors:focus:text-[HighlightText] pointer-coarse:text-touch",
        className
      )}
      {...props}
    />
  )
}

const createTimeInputController = TimeInputPrimitive.createTimeInputController

export {
  TimeInput,
  TimeInputSegments,
  TimeInputSegment,
  createTimeInputController,
}
export type { TimeInputProps, TimeInputState }
export type {
  TimeInputController,
  TimeInputGranularity,
  TimeInputSegmentState,
  HourCycle,
} from "@ui-sdk/react/time-input"
