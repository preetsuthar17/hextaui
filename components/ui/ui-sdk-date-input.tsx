"use client"

import * as React from "react"
import * as DateInputPrimitive from "@ui-sdk/react/date-input"
import { cn } from "cn"

type ClassName<State> =
  string | ((state: State) => string | undefined) | undefined

function mergeClassName<State>(base: string, className: ClassName<State>) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

type DateInputState = DateInputPrimitive.DateInputState

type DateInputContextValue = {
  state: DateInputState | null
  invalid: boolean
}

const DateInputContext = React.createContext<DateInputContextValue>({
  state: null,
  invalid: false,
})

type DateInputProps = React.ComponentProps<
  typeof DateInputPrimitive.DateInput
> & {
  invalid?: boolean
}

function DateInput({
  className,
  children,
  invalid = false,
  ...props
}: DateInputProps) {
  return (
    <DateInputPrimitive.DateInput
      data-invalid={invalid ? "" : undefined}
      className={mergeClassName(
        "group/date-input flex h-9 w-full min-w-0 cursor-text items-center gap-1.5 rounded-md bg-transparent px-2.5 text-sm text-foreground inset-ring-(length:--hairline) inset-ring-input transition-[background-color,box-shadow] duration-150 ease-out-cubic has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-focus-ring has-[input:focus-visible]:inset-ring-ring data-invalid:inset-ring-destructive data-invalid:has-[input:focus-visible]:ring-destructive/20 data-invalid:has-[input:focus-visible]:inset-ring-destructive data-readonly:cursor-default data-readonly:bg-muted/40 motion-reduce:transition-none dark:bg-input/30 dark:data-readonly:bg-input/20 forced-colors:border pointer-coarse:h-10 data-disabled:cursor-not-allowed data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&>svg]:text-muted-foreground [@media(hover:hover)]:hover:not-has-[input:focus-visible]:not-data-disabled:not-data-invalid:inset-ring-ring/70",
        className
      )}
      {...props}
    >
      {(state) => (
        <DateInputContext.Provider value={{ state, invalid }}>
          {children === undefined ? (
            <DateInputSegments />
          ) : typeof children === "function" ? (
            children(state)
          ) : (
            children
          )}
        </DateInputContext.Provider>
      )}
    </DateInputPrimitive.DateInput>
  )
}

function DateInputSegments() {
  const { state } = React.useContext(DateInputContext)
  if (!state) return null
  return (
    <span data-slot="date-input-segments" className="flex min-w-0 items-center">
      {state.segments.map((segment) => (
        <DateInputSegment key={segment.key} segment={segment} />
      ))}
    </span>
  )
}

function DateInputSegment({
  className,
  segment,
  ...props
}: React.ComponentProps<typeof DateInputPrimitive.DateInputSegment>) {
  const { invalid } = React.useContext(DateInputContext)
  if (!segment.editable) {
    return (
      <DateInputPrimitive.DateInputSegment
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
    <DateInputPrimitive.DateInputSegment
      segment={segment}
      aria-invalid={invalid || undefined}
      className={mergeClassName(
        "box-content w-[2ch] min-w-0 rounded-[calc(var(--radius-sm)-1px)] bg-transparent px-[2px] py-0.5 text-center tabular-nums caret-transparent outline-none selection:bg-transparent placeholder:text-muted-foreground read-only:cursor-default focus:bg-primary focus:text-primary-foreground focus:placeholder:text-primary-foreground/60 disabled:cursor-not-allowed data-[type=dayPeriod]:field-sizing-content data-[type=dayPeriod]:w-auto data-[type=dayPeriod]:min-w-[2ch] not-supports-[field-sizing:content]:data-[type=dayPeriod]:w-[2.75em] data-[type=year]:w-[4ch] forced-colors:focus:bg-[Highlight] forced-colors:focus:text-[HighlightText] pointer-coarse:text-touch",
        className
      )}
      {...props}
    />
  )
}

const createDateInputController = DateInputPrimitive.createDateInputController

export {
  DateInput,
  DateInputSegments,
  DateInputSegment,
  createDateInputController,
}
export type { DateInputProps, DateInputState }
export type {
  DateInputController,
  DateInputGranularity,
  DateInputSegmentState,
  DateMatchers,
  HourCycle,
} from "@ui-sdk/react/date-input"
