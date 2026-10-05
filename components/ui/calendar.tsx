"use client"

import * as React from "react"
import { useDirection } from "@base-ui/react/direction-provider"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
} from "@tabler/icons-react"
import { cn } from "cn"

import {
  fromDateKey,
  getTodayKey,
  subscribeToday,
  toDateKey,
  useToday,
} from "@/hooks/use-today"
import { easeOut, easeSpring } from "@/lib/motion"
import {
  addToRange,
  DayPicker,
  getDefaultClassNames,
  useDayPicker,
  type ChevronProps,
  type DateRange,
  type DayButtonProps,
  type DayEventHandler,
  type DayProps,
  type MonthCaptionProps,
  type MonthProps,
  type MonthsProps,
  type RootProps,
  type WeekNumberProps,
  type WeeksProps,
} from "react-day-picker"

import { Button, buttonVariants } from "@/components/ui/button"

type CalendarContextValue = {
  id: string
  todayKey: string | undefined
  animate: boolean
  hovered: Date | undefined
}

const CalendarContext = React.createContext<CalendarContextValue | null>(null)
const CalendarPreviewContext = React.createContext<DateRange | undefined>(
  undefined
)

function useCalendarContext(part: string) {
  const context = React.useContext(CalendarContext)

  if (!context) {
    throw new Error(`<${part}> must be used within <Calendar>.`)
  }

  return context
}

function omit<T extends object, K extends keyof T>(value: T, ...keys: K[]) {
  const result = { ...value }
  for (const key of keys) {
    delete result[key]
  }
  return result as Omit<T, K>
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function subscribeNothing() {
  return () => {}
}

function readServerToday(id: string) {
  if (typeof document === "undefined") {
    return getTodayKey()
  }

  const root = document.querySelector(`[data-calendar-id="${CSS.escape(id)}"]`)

  return root?.getAttribute("data-today") ?? getTodayKey()
}

function useCalendarToday(id: string, enabled: boolean) {
  const getServerSnapshot = React.useCallback(() => readServerToday(id), [id])
  const todayKey = React.useSyncExternalStore(
    enabled ? subscribeToday : subscribeNothing,
    getTodayKey,
    getServerSnapshot
  )
  const isHydrating = React.useSyncExternalStore(
    subscribeNothing,
    () => false,
    () => true
  )
  const [initialKey] = React.useState(todayKey)
  const [remount, setRemount] = React.useState<boolean | undefined>(undefined)

  if (enabled && !isHydrating && remount === undefined) {
    setRemount(initialKey.slice(0, 7) !== todayKey.slice(0, 7))
  }

  return { todayKey: enabled ? todayKey : undefined, remount: remount === true }
}

type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}

function composeDayHandler<Event extends React.SyntheticEvent>(
  userHandler: DayEventHandler<Event> | undefined,
  internal: DayEventHandler<Event> | undefined
): DayEventHandler<Event> | undefined {
  if (!internal) {
    return userHandler
  }

  return (date, modifiers, event) => {
    userHandler?.(date, modifiers, event)
    if (!event.defaultPrevented) {
      internal(date, modifiers, event)
    }
  }
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  navLayout = "around",
  buttonVariant = "ghost",
  animate = true,
  formatters,
  components,
  dir,
  today,
  onDayMouseEnter,
  onDayMouseLeave,
  onDayFocus,
  onDayBlur,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames()
  const id = React.useId()
  const direction = useDirection()
  const [hovered, setHovered] = React.useState<Date>()
  const managesToday = today === undefined && props.timeZone === undefined
  const { todayKey, remount } = useCalendarToday(id, managesToday)
  const isRange = props.mode === "range"

  const context = React.useMemo(
    () => ({ id, todayKey, animate, hovered }),
    [id, todayKey, animate, hovered]
  )

  const track = React.useCallback<DayEventHandler<React.SyntheticEvent>>(
    (date, modifiers) => {
      setHovered(modifiers.disabled ? undefined : date)
    },
    []
  )
  const clear = React.useCallback<DayEventHandler<React.SyntheticEvent>>(
    () => setHovered(undefined),
    []
  )

  return (
    <CalendarContext.Provider value={context}>
      <DayPicker
        key={remount ? "client" : "server"}
        dir={dir ?? (direction === "rtl" ? "rtl" : undefined)}
        today={today ?? (todayKey ? fromDateKey(todayKey) : undefined)}
        showOutsideDays={showOutsideDays}
        captionLayout={captionLayout}
        navLayout={navLayout}
        onDayMouseEnter={composeDayHandler(
          onDayMouseEnter,
          isRange ? track : undefined
        )}
        onDayMouseLeave={composeDayHandler(
          onDayMouseLeave,
          isRange ? clear : undefined
        )}
        onDayFocus={composeDayHandler(onDayFocus, isRange ? track : undefined)}
        onDayBlur={composeDayHandler(onDayBlur, isRange ? clear : undefined)}
        className={cn(
          "group/calendar bg-background p-3 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(9)] in-data-[slot=alert-dialog-content]:bg-transparent in-data-[slot=card-content]:bg-transparent in-data-[slot=dialog-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent in-data-[slot=sheet-content]:bg-transparent pointer-coarse:[--cell-size:--spacing(11)]",
          className
        )}
        formatters={{
          formatMonthDropdown: (month, dateLib) =>
            dateLib ? dateLib.format(month, "LLL") : toDateKey(month),
          ...formatters,
        }}
        classNames={{
          root: cn("w-fit max-w-full", defaultClassNames.root),
          months: cn(
            "relative flex flex-col gap-4 sm:flex-row",
            defaultClassNames.months
          ),
          month: cn(
            "relative flex w-[calc(var(--cell-size)*7)] max-w-full min-w-0 flex-col gap-3 group-data-week-numbers/calendar:w-[calc(var(--cell-size)*8)]",
            defaultClassNames.month
          ),
          nav: cn(
            "pointer-events-none absolute inset-x-0 top-0 z-10 flex h-(--cell-size) items-center justify-between gap-1 *:pointer-events-auto",
            defaultClassNames.nav
          ),
          button_previous: cn(
            buttonVariants({ variant: buttonVariant, size: "icon" }),
            "size-(--cell-size) rounded-(--cell-radius) p-0 aria-disabled:pointer-events-none aria-disabled:opacity-50",
            navLayout === "around" && "absolute start-0 top-0 z-10",
            defaultClassNames.button_previous
          ),
          button_next: cn(
            buttonVariants({ variant: buttonVariant, size: "icon" }),
            "size-(--cell-size) rounded-(--cell-radius) p-0 aria-disabled:pointer-events-none aria-disabled:opacity-50",
            navLayout === "around" && "absolute end-0 top-0 z-10",
            defaultClassNames.button_next
          ),
          month_caption: cn(
            "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
            defaultClassNames.month_caption
          ),
          dropdowns: cn(
            "flex h-(--cell-size) w-full items-center justify-center gap-1 text-sm font-medium",
            defaultClassNames.dropdowns
          ),
          dropdown_root: cn(
            "relative rounded-(--cell-radius) transition-[background-color,box-shadow] duration-150 ease-out-quint has-focus-visible:ring-3 has-focus-visible:ring-focus-ring [@media(hover:hover)]:has-[select:hover]:bg-muted",
            defaultClassNames.dropdown_root
          ),
          dropdown: cn(
            "absolute inset-0 cursor-pointer bg-popover text-popover-foreground opacity-0",
            defaultClassNames.dropdown
          ),
          caption_label: cn(
            "font-medium select-none",
            captionLayout === "label"
              ? "truncate text-sm"
              : "flex h-8 items-center gap-1 rounded-(--cell-radius) ps-2 pe-1 text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
            defaultClassNames.caption_label
          ),
          month_grid: cn(
            "w-full table-fixed border-collapse",
            defaultClassNames.month_grid
          ),
          weekdays: cn("flex", defaultClassNames.weekdays),
          weekday: cn(
            "w-(--cell-size) min-w-0 text-xs font-normal text-muted-foreground select-none",
            defaultClassNames.weekday
          ),
          week: cn("mt-1 flex w-full", defaultClassNames.week),
          week_number_header: cn(
            "w-(--cell-size) shrink-0 select-none",
            defaultClassNames.week_number_header
          ),
          week_number: cn(
            "text-xs font-normal text-muted-foreground select-none",
            defaultClassNames.week_number
          ),
          day: cn(
            "group/day relative aspect-square w-(--cell-size) min-w-0 p-0 text-center transition-[background-color] duration-150 ease-out-quint select-none data-preview:bg-muted/60 data-[preview=end]:rounded-e-(--cell-radius) data-[preview=start]:rounded-s-(--cell-radius) data-[preview=end]:data-selected:rounded-s-none data-[preview=start]:data-selected:rounded-e-none [&:is([data-preview],[data-range-middle]):first-of-type]:rounded-s-(--cell-radius) [&:is([data-preview],[data-range-middle]):has(+[data-duplicate])]:rounded-e-(--cell-radius) [&:is([data-preview],[data-range-middle]):last-of-type]:rounded-e-(--cell-radius) [[data-duplicate]+&:is([data-preview],[data-range-middle])]:rounded-s-(--cell-radius)",
            defaultClassNames.day
          ),
          range_start: cn(
            "rounded-s-(--cell-radius) bg-muted",
            defaultClassNames.range_start
          ),
          range_middle: cn("bg-muted", defaultClassNames.range_middle),
          range_end: cn(
            "rounded-e-(--cell-radius) bg-muted",
            defaultClassNames.range_end
          ),
          today: cn(defaultClassNames.today),
          outside: cn(defaultClassNames.outside),
          disabled: cn(defaultClassNames.disabled),
          hidden: cn("invisible", defaultClassNames.hidden),
          footer: cn(
            "pt-3 text-sm text-pretty text-muted-foreground",
            defaultClassNames.footer
          ),
          ...classNames,
        }}
        components={{
          Root: CalendarRoot,
          Chevron: CalendarChevron,
          Months: CalendarMonths,
          Month: CalendarMonth,
          MonthCaption: CalendarMonthCaption,
          Weeks: CalendarWeeks,
          Day: CalendarDay,
          DayButton: CalendarDayButton,
          WeekNumber: CalendarWeekNumber,
          ...components,
        }}
        {...props}
      />
    </CalendarContext.Provider>
  )
}

function CalendarRoot({
  className,
  rootRef,
  onKeyDownCapture,
  ...props
}: RootProps) {
  const { id, todayKey } = useCalendarContext("CalendarRoot")

  return (
    <div
      ref={rootRef}
      className={className}
      onKeyDownCapture={(event) => {
        event.currentTarget.dataset.keyboardAt = String(performance.now())
        onKeyDownCapture?.(event)
      }}
      {...props}
      data-slot="calendar"
      data-calendar-id={id}
      data-today={todayKey}
    />
  )
}

function CalendarChevron({ className, orientation, ...props }: ChevronProps) {
  const { dayPickerProps } = useDayPicker()
  const mirrored =
    dayPickerProps.navLayout === "around" && dayPickerProps.dir === "rtl"
  const icons = {
    left: IconChevronLeft,
    right: IconChevronRight,
    up: IconChevronUp,
    down: IconChevronDown,
  }
  const Icon = icons[orientation ?? "left"]

  return (
    <Icon
      aria-hidden
      className={cn(
        "size-4",
        !mirrored &&
          (orientation === "left" || orientation === "right") &&
          "rtl:-scale-x-100",
        className
      )}
      style={props.style}
    />
  )
}

function CalendarMonths({ className, ...props }: MonthsProps) {
  const { hovered } = useCalendarContext("CalendarMonths")
  const { selected, dayPickerProps } = useDayPicker()

  const preview = React.useMemo(() => {
    if (dayPickerProps.mode !== "range" || !hovered) {
      return undefined
    }

    const range = selected as DateRange | undefined

    if (!range?.from || (range.to && !isSameDay(range.from, range.to))) {
      return undefined
    }

    const next = addToRange(
      hovered,
      range,
      dayPickerProps.min,
      dayPickerProps.max,
      dayPickerProps.required
    )

    if (!next?.from || !next.to || isSameDay(next.from, next.to)) {
      return undefined
    }

    return next
  }, [dayPickerProps, hovered, selected])

  return (
    <CalendarPreviewContext.Provider value={preview}>
      <div className={className} {...props} data-slot="calendar-months" />
    </CalendarPreviewContext.Provider>
  )
}

const bottomClip = "inset(-1rem -1rem 0 -1rem)"

function layoutSize(element: HTMLElement) {
  const style = getComputedStyle(element)
  const width = parseFloat(style.width)
  const height = parseFloat(style.height)
  if (Number.isFinite(width) && Number.isFinite(height)) {
    return { width, height }
  }
  const rect = element.getBoundingClientRect()
  return { width: rect.width, height: rect.height }
}

function CalendarMonth({ calendarMonth, className, ...rest }: MonthProps) {
  const props = omit(rest, "displayIndex")
  const { animate } = useCalendarContext("CalendarMonth")
  const elementRef = React.useRef<HTMLDivElement>(null)
  const time = calendarMonth.date.getTime()
  const previousTimeRef = React.useRef(time)
  const animationsRef = React.useRef<Animation[]>([])
  const heightRef = React.useRef(0)

  React.useLayoutEffect(() => {
    const element = elementRef.current

    if (!element) {
      return
    }

    heightRef.current = layoutSize(element).height

    if (typeof ResizeObserver !== "function") {
      return
    }

    const observer = new ResizeObserver(() => {
      if (animationsRef.current.every((a) => a.playState !== "running")) {
        heightRef.current = layoutSize(element).height
      }
    })
    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  React.useLayoutEffect(() => {
    const element = elementRef.current
    const previous = previousTimeRef.current
    previousTimeRef.current = time

    if (
      !animate ||
      !element ||
      previous === time ||
      typeof element.animate !== "function"
    ) {
      return
    }

    const reduceMotion =
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const keyboardAt = Number(
      element.closest<HTMLElement>("[data-slot=calendar]")?.dataset
        .keyboardAt ?? -Infinity
    )
    const fromKeyboard = performance.now() - keyboardAt < 100
    const rtl = getComputedStyle(element).direction === "rtl"
    const sign = (time > previous ? 1 : -1) * (rtl ? -1 : 1)
    const distance = Math.min(32, layoutSize(element).width * 0.1)
    const weeks = element.querySelector<HTMLElement>(
      "[data-slot=calendar-weeks]"
    )
    const caption = element.querySelector<HTMLElement>(
      "[data-slot=calendar-month-caption]"
    )
    const interrupted = animationsRef.current.some(
      (a) => a.playState === "running"
    )
    const fromHeight = interrupted
      ? layoutSize(element).height
      : heightRef.current
    const fromOpacity =
      interrupted && weeks ? parseFloat(getComputedStyle(weeks).opacity) / 2 : 0

    for (const running of animationsRef.current) {
      running.cancel()
    }

    const toHeight = layoutSize(element).height
    heightRef.current = toHeight

    const slide = (target: HTMLElement, offset: number, duration: number) =>
      target.animate(
        reduceMotion || fromKeyboard
          ? [{ opacity: fromOpacity }, { opacity: 1 }]
          : [
              { translate: `${sign * offset}px 0`, opacity: fromOpacity },
              { translate: "0 0", opacity: 1 },
            ],
        {
          duration: reduceMotion ? 150 : fromKeyboard ? 120 : duration,
          easing: easeOut,
        }
      )

    const next: Animation[] = []

    if (weeks) {
      next.push(slide(weeks, distance, 280))
    }

    if (caption) {
      next.push(slide(caption, distance * 0.4, 220))
    }

    if (fromHeight > 0 && Math.abs(fromHeight - toHeight) > 0.5) {
      next.push(
        element.animate(
          [
            { height: `${fromHeight}px`, clipPath: bottomClip },
            { height: `${toHeight}px`, clipPath: bottomClip },
          ],
          { duration: reduceMotion ? 0 : 300, easing: easeSpring }
        )
      )
    }

    animationsRef.current = next
  }, [animate, time])

  React.useEffect(() => {
    const animations = animationsRef
    return () => {
      for (const running of animations.current) {
        running.cancel()
      }
    }
  }, [])

  return (
    <div
      ref={elementRef}
      className={className}
      {...props}
      data-slot="calendar-month"
    />
  )
}

function CalendarMonthCaption({ className, ...rest }: MonthCaptionProps) {
  const props = omit(rest, "calendarMonth", "displayIndex")
  return (
    <div className={className} {...props} data-slot="calendar-month-caption" />
  )
}

function CalendarWeeks({ className, ...props }: WeeksProps) {
  return <tbody className={className} {...props} data-slot="calendar-weeks" />
}

function CalendarDay({
  day,
  modifiers,
  className,
  children,
  ...props
}: DayProps) {
  const preview = React.useContext(CalendarPreviewContext)
  const { months } = useDayPicker()
  const duplicate =
    day.outside &&
    months.length > 1 &&
    months.some(
      (month) =>
        month.date.getFullYear() === day.date.getFullYear() &&
        month.date.getMonth() === day.date.getMonth()
    )

  if (duplicate) {
    return (
      <td
        className={cn(className, "invisible")}
        {...props}
        aria-hidden
        data-slot="calendar-day"
        data-duplicate=""
      />
    )
  }

  let state: "start" | "middle" | "end" | undefined

  if (preview?.from && preview.to && !modifiers.hidden) {
    const date = day.date

    if (isSameDay(date, preview.from)) {
      state = "start"
    } else if (isSameDay(date, preview.to)) {
      state = "end"
    } else if (date > preview.from && date < preview.to) {
      state = "middle"
    }
  }

  return (
    <td
      className={className}
      {...props}
      data-slot="calendar-day"
      data-preview={state}
      data-range-middle={modifiers.range_middle ? "" : undefined}
    >
      {children}
    </td>
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: DayButtonProps) {
  const ref = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (modifiers.focused) {
      ref.current?.focus()
    }
  }, [modifiers.focused])

  const rangeStart = Boolean(modifiers.range_start)
  const rangeEnd = Boolean(modifiers.range_end)
  const rangeMiddle = Boolean(modifiers.range_middle)
  const selectedSingle =
    Boolean(modifiers.selected) && !rangeStart && !rangeEnd && !rangeMiddle

  return (
    <button
      ref={ref}
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon" }),
        "relative size-full rounded-(--cell-radius) p-0 font-normal tabular-nums group-data-outside/day:text-muted-foreground focus-visible:z-10 data-[range-end]:bg-primary data-[range-end]:text-primary-foreground data-[range-end]:hover:bg-primary/90 data-[range-middle]:rounded-none data-[range-middle]:hover:rounded-(--cell-radius) data-[range-middle]:hover:bg-foreground/6 data-[range-start]:bg-primary data-[range-start]:text-primary-foreground data-[range-start]:hover:bg-primary/90 data-[selected-single]:bg-primary data-[selected-single]:text-primary-foreground data-[selected-single]:hover:bg-primary/90 data-[today]:bg-info/12 data-[today]:font-semibold data-[today]:text-info data-[today]:hover:bg-info/15 data-[today]:data-[range-end]:bg-info data-[today]:data-[range-end]:text-info-foreground data-[today]:data-[range-end]:hover:bg-info/90 data-[today]:data-[range-middle]:bg-transparent data-[today]:data-[range-middle]:hover:bg-foreground/6 data-[today]:data-[range-start]:bg-info data-[today]:data-[range-start]:text-info-foreground data-[today]:data-[range-start]:hover:bg-info/90 data-[today]:data-[selected-single]:bg-info data-[today]:data-[selected-single]:text-info-foreground data-[today]:data-[selected-single]:hover:bg-info/90 forced-colors:data-[range-end]:outline-2 forced-colors:data-[range-end]:-outline-offset-2 forced-colors:data-[range-end]:outline-solid forced-colors:data-[range-start]:outline-2 forced-colors:data-[range-start]:-outline-offset-2 forced-colors:data-[range-start]:outline-solid forced-colors:data-[selected-single]:outline-2 forced-colors:data-[selected-single]:-outline-offset-2 forced-colors:data-[selected-single]:outline-solid",
        className
      )}
      {...props}
      data-slot="calendar-day-button"
      data-day={day.isoDate}
      data-today={modifiers.today && !modifiers.outside ? "" : undefined}
      data-selected-single={selectedSingle ? "" : undefined}
      data-range-start={rangeStart ? "" : undefined}
      data-range-end={rangeEnd ? "" : undefined}
      data-range-middle={rangeMiddle ? "" : undefined}
    />
  )
}

function CalendarWeekNumber({ children, className, ...rest }: WeekNumberProps) {
  const props = omit(rest, "week")
  return (
    <th className={className} {...props} data-slot="calendar-week-number">
      <div className="flex size-(--cell-size) items-center justify-center text-center">
        {children}
      </div>
    </th>
  )
}

export { Calendar, CalendarDayButton, useToday }
export type { CalendarProps }
