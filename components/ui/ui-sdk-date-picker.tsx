"use client"

import * as React from "react"
import {
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconX,
} from "@tabler/icons-react"
import * as DatePickerPrimitive from "@ui-sdk/react/date-picker"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button"

type ClassName<State> =
  string | ((state: State) => string | undefined) | undefined

function mergeClassName<State>(base: string, className: ClassName<State>) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

const iconButtonClassName =
  "relative inline-flex size-7 shrink-0 items-center justify-center rounded-[calc(var(--radius-md)-var(--spacing))] text-muted-foreground transition-[color,background-color,box-shadow] duration-150 ease-out-quint outline-none after:absolute after:-inset-1 hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-focus-ring disabled:pointer-events-none disabled:opacity-50 pointer-coarse:after:-inset-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"

function DatePicker({
  className,
  ...props
}: React.ComponentProps<typeof DatePickerPrimitive.DatePicker>) {
  return (
    <DatePickerPrimitive.DatePicker
      className={mergeClassName(
        "group/date-picker relative flex w-full min-w-0 flex-col gap-1.5",
        className
      )}
      {...props}
    />
  )
}

function DatePickerControl({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="date-picker-control"
      className={cn(
        "flex h-9 w-full min-w-0 items-center gap-1 rounded-md bg-transparent pe-1 text-sm text-foreground inset-ring-(length:--hairline) inset-ring-input transition-[background-color,box-shadow] duration-150 ease-out-cubic group-data-invalid/date-picker:inset-ring-destructive group-data-readonly/date-picker:bg-muted/40 group-data-disabled/date-picker:opacity-50 has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-focus-ring has-[input:focus-visible]:inset-ring-ring group-data-invalid/date-picker:has-[input:focus-visible]:ring-destructive/20 group-data-invalid/date-picker:has-[input:focus-visible]:inset-ring-destructive motion-reduce:transition-none dark:bg-input/30 dark:group-data-readonly/date-picker:bg-input/20 forced-colors:border pointer-coarse:h-10 [@media(hover:hover)]:hover:not-has-[input:focus-visible]:not-group-data-disabled/date-picker:not-group-data-invalid/date-picker:inset-ring-ring/70",
        className
      )}
      {...props}
    />
  )
}

function DatePickerInput({
  className,
  ...props
}: React.ComponentProps<typeof DatePickerPrimitive.DatePickerInput>) {
  return (
    <DatePickerPrimitive.DatePickerInput
      className={mergeClassName(
        "h-full w-full min-w-0 flex-1 bg-transparent ps-2.5 tabular-nums outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed pointer-coarse:text-[max(16px,1rem)]",
        className
      )}
      {...props}
    />
  )
}

function DatePickerSeparator({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      data-slot="date-picker-separator"
      className={cn("shrink-0 text-muted-foreground", className)}
      {...props}
    >
      –
    </span>
  )
}

function DatePickerTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DatePickerPrimitive.DatePickerTrigger>) {
  return (
    <DatePickerPrimitive.DatePickerTrigger
      className={mergeClassName(
        cn(iconButtonClassName, "data-open:bg-muted data-open:text-foreground"),
        className
      )}
      {...props}
    >
      {children ?? <IconCalendar aria-hidden="true" />}
    </DatePickerPrimitive.DatePickerTrigger>
  )
}

function DatePickerClear({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DatePickerPrimitive.DatePickerClear>) {
  return (
    <DatePickerPrimitive.DatePickerClear
      aria-label={children ? undefined : "Clear"}
      className={mergeClassName(
        cn(iconButtonClassName, "data-empty:hidden"),
        className
      )}
      {...props}
    >
      {children ?? <IconX aria-hidden="true" />}
    </DatePickerPrimitive.DatePickerClear>
  )
}

function DatePickerHint({
  className,
  ...props
}: React.ComponentProps<typeof DatePickerPrimitive.DatePickerHint>) {
  return (
    <DatePickerPrimitive.DatePickerHint
      className={mergeClassName(
        "text-xs text-muted-foreground tabular-nums",
        className
      )}
      {...props}
    />
  )
}

function DatePickerContent({
  className,
  children,
  align = "start",
  sideOffset = 6,
  collisionPadding = 8,
  ...props
}: React.ComponentProps<typeof DatePickerPrimitive.DatePickerContent>) {
  return (
    <DatePickerPrimitive.DatePickerContent
      align={align}
      sideOffset={sideOffset}
      collisionPadding={collisionPadding}
      className={mergeClassName(
        "m-0 flex max-h-(--available-height) w-auto max-w-(--available-width) origin-(--transform-origin) gap-3 overflow-y-auto overscroll-contain rounded-xl border-0 bg-popover p-3 text-sm text-popover-foreground shadow-md ring-(length:--hairline) ring-foreground/10 transition-[opacity,scale] duration-150 ease-out-quint outline-none [--cell-radius:calc(var(--radius-xl)-var(--spacing)*3)] [--cell-size:--spacing(9)] data-ending-style:opacity-0 data-ending-style:duration-100 data-starting-style:opacity-0 motion-safe:data-ending-style:scale-96 motion-safe:data-starting-style:scale-96 motion-reduce:transition-opacity max-sm:flex-col forced-colors:border pointer-coarse:[--cell-size:--spacing(10)]",
        className
      )}
      {...props}
    >
      {children ?? <DatePickerCalendar />}
    </DatePickerPrimitive.DatePickerContent>
  )
}

function DatePickerCalendar({
  className,
  months = 1,
  ...props
}: React.ComponentProps<"div"> & { months?: number }) {
  return (
    <div
      data-slot="date-picker-calendar"
      className={cn("flex min-w-0 flex-col gap-3", className)}
      {...props}
    >
      <div className="flex items-center gap-1">
        <CalendarPrevious />
        <CalendarHeading />
        <CalendarNext />
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        {Array.from({ length: months }, (_, offset) => (
          <CalendarGrid key={offset} offset={offset}>
            <CalendarWeekdays>
              {(index) => <CalendarWeekday index={index} />}
            </CalendarWeekdays>
            <CalendarWeeks>
              {(cell) => <CalendarDay value={cell.date} />}
            </CalendarWeeks>
          </CalendarGrid>
        ))}
      </div>
    </div>
  )
}

function CalendarPrevious({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DatePickerPrimitive.CalendarPrevious>) {
  return (
    <DatePickerPrimitive.CalendarPrevious
      className={mergeClassName(iconButtonClassName, className)}
      {...props}
    >
      {children ?? (
        <IconChevronLeft aria-hidden="true" className="rtl:-scale-x-100" />
      )}
    </DatePickerPrimitive.CalendarPrevious>
  )
}

function CalendarNext({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DatePickerPrimitive.CalendarNext>) {
  return (
    <DatePickerPrimitive.CalendarNext
      className={mergeClassName(iconButtonClassName, className)}
      {...props}
    >
      {children ?? (
        <IconChevronRight aria-hidden="true" className="rtl:-scale-x-100" />
      )}
    </DatePickerPrimitive.CalendarNext>
  )
}

function CalendarHeading({
  className,
  ...props
}: React.ComponentProps<typeof DatePickerPrimitive.CalendarHeading>) {
  return (
    <DatePickerPrimitive.CalendarHeading
      className={mergeClassName(
        "m-0 flex-1 text-center text-sm font-medium",
        className
      )}
      {...props}
    />
  )
}

function CalendarGrid({
  className,
  ...props
}: React.ComponentProps<typeof DatePickerPrimitive.CalendarGrid>) {
  return (
    <DatePickerPrimitive.CalendarGrid
      className={mergeClassName(
        "border-separate border-spacing-x-0 border-spacing-y-0.5",
        className
      )}
      {...props}
    />
  )
}

function CalendarWeekdays({
  className,
  ...props
}: React.ComponentProps<typeof DatePickerPrimitive.CalendarWeekdays>) {
  return (
    <DatePickerPrimitive.CalendarWeekdays className={className} {...props} />
  )
}

function CalendarWeekday({
  className,
  ...props
}: React.ComponentProps<typeof DatePickerPrimitive.CalendarWeekday>) {
  return (
    <DatePickerPrimitive.CalendarWeekday
      className={mergeClassName(
        "h-8 w-(--cell-size) p-0 text-xs font-normal text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function CalendarWeeks(
  props: React.ComponentProps<typeof DatePickerPrimitive.CalendarWeeks>
) {
  return <DatePickerPrimitive.CalendarWeeks {...props} />
}

function CalendarDay({
  className,
  ...props
}: React.ComponentProps<typeof DatePickerPrimitive.CalendarDay>) {
  return (
    <DatePickerPrimitive.CalendarDay
      className={mergeClassName(
        "relative size-(--cell-size) cursor-default rounded-(--cell-radius) p-0 text-center text-sm tabular-nums transition-[background-color,color,box-shadow] duration-150 ease-out-quint outline-none select-none hover:bg-muted focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:ring-inset data-outside:text-muted-foreground/60 data-preview:rounded-none data-preview:bg-muted/60 data-today:bg-info/12 data-today:font-semibold data-today:text-info data-unavailable:text-muted-foreground data-unavailable:line-through data-unavailable:hover:bg-transparent data-[range-end]:rounded-(--cell-radius) data-[range-end]:bg-primary data-[range-end]:text-primary-foreground data-[range-end]:not-data-[range-start]:rounded-s-none data-[range-middle]:rounded-none data-[range-middle]:bg-muted data-[range-middle]:font-normal data-[range-middle]:text-foreground data-[range-start]:rounded-(--cell-radius) data-[range-start]:bg-primary data-[range-start]:text-primary-foreground data-[range-start]:not-data-[range-end]:rounded-e-none data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:hover:bg-primary/90 data-[range-middle]:data-[selected]:bg-muted data-[range-middle]:data-[selected]:text-foreground forced-colors:data-[selected]:outline-2 forced-colors:data-[selected]:-outline-offset-2 forced-colors:data-[selected]:outline-solid data-disabled:pointer-events-none data-disabled:opacity-40",
        className
      )}
      {...props}
    />
  )
}

function DatePickerPreset({
  className,
  ...props
}: React.ComponentProps<typeof DatePickerPrimitive.DatePickerPreset>) {
  return (
    <DatePickerPrimitive.DatePickerPreset
      className={mergeClassName(
        cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "justify-start font-normal aria-pressed:bg-muted aria-pressed:font-medium"
        ),
        className
      )}
      {...props}
    />
  )
}

const createDatePickerController =
  DatePickerPrimitive.createDatePickerController

export {
  DatePicker,
  DatePickerControl,
  DatePickerInput,
  DatePickerSeparator,
  DatePickerTrigger,
  DatePickerClear,
  DatePickerHint,
  DatePickerContent,
  DatePickerCalendar,
  DatePickerPreset,
  CalendarPrevious,
  CalendarNext,
  CalendarHeading,
  CalendarGrid,
  CalendarWeekdays,
  CalendarWeekday,
  CalendarWeeks,
  CalendarDay,
  createDatePickerController,
}
export type {
  DateMatchers,
  DatePickerController,
  DatePickerValue,
} from "@ui-sdk/react/date-picker"
