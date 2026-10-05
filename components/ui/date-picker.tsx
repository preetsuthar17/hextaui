"use client"

import * as React from "react"
import { IconCalendar } from "@tabler/icons-react"
import { cn } from "cn"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar, type CalendarProps } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const phoneQuery = "(max-width: 639px)"

function subscribePhone(onChange: () => void) {
  if (typeof window.matchMedia !== "function") {
    return () => {}
  }
  const media = window.matchMedia(phoneQuery)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}

function getPhone() {
  return typeof window.matchMedia === "function"
    ? window.matchMedia(phoneQuery).matches
    : false
}

function useIsPhone() {
  return React.useSyncExternalStore(subscribePhone, getPhone, () => false)
}

function toIsoDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${date.getFullYear()}-${month}-${day}`
}

function normalizeSpaces(text: string) {
  return text.replace(/[\u2009\u202f\u00a0]/g, " ")
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

type CalendarPassthrough = Omit<
  CalendarProps,
  "mode" | "selected" | "onSelect" | "required" | "numberOfMonths" | "autoFocus"
>

type TriggerProps = Omit<
  React.ComponentProps<typeof Button>,
  "value" | "defaultValue" | "onChange" | "children" | "render"
>

type DatePickerSharedProps = TriggerProps & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  placeholder?: string
  title?: string
  locale?: string
  clearable?: boolean
  clearLabel?: string
  name?: string
  calendarProps?: CalendarPassthrough
}

type DatePickerShellProps = Omit<
  DatePickerSharedProps,
  "locale" | "calendarProps"
> & {
  label: string | undefined
  hasValue: boolean
  hiddenValue: string | undefined
  onClear: () => void
  children: (close: () => void, phone: boolean) => React.ReactNode
}

function DatePickerShell({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  placeholder,
  title,
  label,
  hasValue,
  hiddenValue,
  clearable = false,
  clearLabel = "Clear",
  name,
  onClear,
  children,
  className,
  variant = "outline",
  disabled,
  ...props
}: DatePickerShellProps) {
  const phone = useIsPhone()
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const open = openProp ?? uncontrolledOpen

  const setOpen = (next: boolean) => {
    if (openProp === undefined) {
      setUncontrolledOpen(next)
    }
    onOpenChange?.(next)
  }
  const close = () => setOpen(false)

  const trigger = (
    <Button
      variant={variant}
      disabled={disabled}
      data-slot="date-picker-trigger"
      data-empty={hasValue ? undefined : ""}
      className={cn(
        "w-60 max-w-full justify-start gap-2 px-3 text-start font-normal tabular-nums data-empty:text-muted-foreground",
        className
      )}
      {...props}
    />
  )

  const triggerContent = (
    <>
      <IconCalendar aria-hidden className="text-muted-foreground" />
      <span className="min-w-0 truncate">{label ?? placeholder}</span>
    </>
  )

  const clearButton =
    clearable && hasValue ? (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        data-slot="date-picker-clear"
        onClick={() => {
          onClear()
          close()
        }}
      >
        {clearLabel}
      </Button>
    ) : null

  const hidden =
    name !== undefined ? (
      <input type="hidden" name={name} value={hiddenValue ?? ""} />
    ) : null

  if (phone) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={trigger}>{triggerContent}</SheetTrigger>
        {hidden}
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
          <SheetBody>
            <div
              data-slot="date-picker-content"
              className="flex justify-center"
            >
              {children(close, true)}
            </div>
          </SheetBody>
          {clearButton ? <SheetFooter>{clearButton}</SheetFooter> : null}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={trigger}>{triggerContent}</PopoverTrigger>
      {hidden}
      <PopoverContent
        align="start"
        aria-label={title}
        className="w-auto gap-0 p-0"
      >
        <div data-slot="date-picker-content">{children(close, false)}</div>
        {clearButton ? (
          <div className="flex justify-end border-t px-2 py-1.5">
            {clearButton}
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}

type DatePickerProps = DatePickerSharedProps & {
  value?: Date | null
  defaultValue?: Date | null
  onValueChange?: (value: Date | null) => void
}

function DatePicker({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  placeholder = "Pick a date",
  title = "Select a date",
  locale = "en-US",
  calendarProps,
  ...props
}: DatePickerProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const value = valueProp !== undefined ? valueProp : uncontrolledValue
  const formatter = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }),
    [locale]
  )

  const setValue = (next: Date | null) => {
    if (valueProp === undefined) {
      setUncontrolledValue(next)
    }
    onValueChange?.(next)
  }

  return (
    <DatePickerShell
      {...props}
      placeholder={placeholder}
      title={title}
      label={value ? normalizeSpaces(formatter.format(value)) : undefined}
      hasValue={Boolean(value)}
      hiddenValue={value ? toIsoDate(value) : undefined}
      onClear={() => setValue(null)}
    >
      {(close) => (
        <Calendar
          {...calendarProps}
          mode="single"
          required
          autoFocus
          selected={value ?? undefined}
          defaultMonth={value ?? calendarProps?.defaultMonth}
          onSelect={(date) => {
            setValue(date)
            close()
          }}
        />
      )}
    </DatePickerShell>
  )
}

type DateRangePickerProps = DatePickerSharedProps & {
  value?: DateRange | null
  defaultValue?: DateRange | null
  onValueChange?: (value: DateRange | null) => void
}

function DateRangeCalendar({
  value,
  phone,
  calendarProps,
  onComplete,
}: {
  value: DateRange | null
  phone: boolean
  calendarProps?: CalendarPassthrough
  onComplete: (range: DateRange) => void
}) {
  const [draft, setDraft] = React.useState<DateRange | undefined>(undefined)
  const selected = draft ?? value ?? undefined

  return (
    <Calendar
      {...calendarProps}
      mode="range"
      autoFocus
      numberOfMonths={phone ? 1 : 2}
      defaultMonth={value?.from ?? calendarProps?.defaultMonth}
      selected={selected}
      onSelect={(_, day) => {
        if (!draft) {
          setDraft({ from: day, to: day })
          return
        }
        const start = draft.from ?? day
        const range =
          day < start ? { from: day, to: start } : { from: start, to: day }
        setDraft(undefined)
        onComplete(range)
      }}
    />
  )
}

function DateRangePicker({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  placeholder = "Pick a date range",
  title = "Select dates",
  locale = "en-US",
  calendarProps,
  ...props
}: DateRangePickerProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const value = valueProp !== undefined ? valueProp : uncontrolledValue
  const formatter = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }),
    [locale]
  )

  const setValue = (next: DateRange | null) => {
    if (valueProp === undefined) {
      setUncontrolledValue(next)
    }
    onValueChange?.(next)
  }

  const from = value?.from
  const to = value?.to ?? value?.from
  const label =
    from && to
      ? isSameDay(from, to)
        ? normalizeSpaces(formatter.format(from))
        : normalizeSpaces(formatter.formatRange(from, to))
      : undefined

  return (
    <DatePickerShell
      {...props}
      placeholder={placeholder}
      title={title}
      label={label}
      hasValue={Boolean(from)}
      hiddenValue={
        from && to ? `${toIsoDate(from)}/${toIsoDate(to)}` : undefined
      }
      onClear={() => setValue(null)}
    >
      {(close, phone) => (
        <DateRangeCalendar
          value={value}
          phone={phone}
          calendarProps={calendarProps}
          onComplete={(range) => {
            setValue(range)
            close()
          }}
        />
      )}
    </DatePickerShell>
  )
}

export { DatePicker, DateRangePicker }
export type { DatePickerProps, DateRangePickerProps }
