"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const markerVariants = cva(
  "group/marker relative flex min-h-4 w-full min-w-0 items-center gap-2 text-start text-sm text-muted-foreground [&_a:not([data-slot])]:underline [&_a:not([data-slot])]:decoration-foreground/30 [&_a:not([data-slot])]:underline-offset-3 [&_a:not([data-slot])]:hover:text-foreground [&_a:not([data-slot])]:hover:decoration-foreground [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "",
        separator:
          "before:h-(--hairline) before:min-w-4 before:flex-1 before:bg-border before:transition-opacity before:duration-200 after:h-(--hairline) after:min-w-4 after:flex-1 after:bg-border after:transition-opacity after:duration-200 data-stuck:before:opacity-0 data-stuck:after:opacity-0 motion-reduce:before:transition-none motion-reduce:after:transition-none",
        border: "border-b border-border pb-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type MarkerVariant = NonNullable<VariantProps<typeof markerVariants>["variant"]>

function scrollParent(element: HTMLElement) {
  let node = element.parentElement
  while (node && node !== document.body) {
    const { overflowY } = getComputedStyle(node)
    if (/(auto|scroll|overlay)/.test(overflowY)) {
      return node
    }
    node = node.parentElement
  }
  return null
}

function useStuck(ref: React.RefObject<HTMLElement | null>, enabled: boolean) {
  const [stuck, setStuck] = React.useState(false)

  React.useEffect(() => {
    const element = ref.current
    if (!enabled || !element || typeof IntersectionObserver === "undefined") {
      setStuck(false)
      return
    }

    const offset = parseFloat(getComputedStyle(element).top) || 0
    const root = scrollParent(element)
    const observer = new IntersectionObserver(
      ([entry]) => {
        const top = entry.rootBounds?.top ?? 0
        setStuck(
          entry.intersectionRatio > 0 &&
            entry.intersectionRatio < 1 &&
            entry.boundingClientRect.top < top + offset + 1
        )
      },
      {
        root,
        rootMargin: `${-(offset + 1)}px 0px 0px 0px`,
        threshold: [0, 1],
      }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, enabled])

  return stuck
}

type MarkerProps = useRender.ComponentProps<"div"> & {
  variant?: MarkerVariant
  sticky?: boolean
}

function Marker({
  className,
  variant = "default",
  sticky = false,
  render,
  ref,
  ...props
}: MarkerProps) {
  const markerRef = React.useRef<HTMLDivElement | null>(null)
  const stuck = useStuck(markerRef, sticky)
  const setRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      markerRef.current = node
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

  return useRender({
    defaultTagName: "div",
    render,
    ref: setRef,
    props: mergeProps<"div">(
      {
        className: cn(
          markerVariants({ variant }),
          sticky &&
            "sticky top-[calc(var(--marker-sticky-top,--spacing(2))-1px)] z-10",
          className
        ),
      },
      props,
      {
        "data-slot": "marker",
        "data-variant": variant,
        ...(sticky ? { "data-sticky": "" } : {}),
        ...(stuck ? { "data-stuck": "" } : {}),
      } as React.ComponentProps<"div">
    ),
  })
}

function MarkerIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="marker-icon"
      aria-hidden="true"
      className={cn(
        "inline-flex size-4 shrink-0 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function MarkerContent({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="marker-content"
      className={cn(
        "min-w-0 rounded-4xl text-pretty wrap-break-word transition-[background-color,box-shadow,padding,color] duration-200 ease-out-quint group-data-stuck/marker:bg-popover group-data-stuck/marker:px-2.5 group-data-stuck/marker:py-0.5 group-data-stuck/marker:text-foreground group-data-stuck/marker:shadow-sm group-data-stuck/marker:ring-(length:--hairline) group-data-stuck/marker:ring-foreground/10 group-data-[variant=separator]/marker:flex-initial group-data-[variant=separator]/marker:text-center motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

const dayMs = 24 * 60 * 60 * 1000

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function toDate(value: Date | string | number) {
  return value instanceof Date ? value : new Date(value)
}

function capitalize(text: string, locale: Intl.LocalesArgument) {
  return (
    text.charAt(0).toLocaleUpperCase(locale as string | undefined) +
    text.slice(1)
  )
}

function formatDay(
  value: Date,
  now: Date | null,
  locale: Intl.LocalesArgument
) {
  if (Number.isNaN(value.getTime())) {
    return ""
  }
  const sameYear = now ? value.getFullYear() === now.getFullYear() : false
  const absolute = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  }).format(value)
  if (!now) {
    return absolute
  }
  const days = Math.round(
    (startOfDay(now).getTime() - startOfDay(value).getTime()) / dayMs
  )
  if (days === 0 || days === 1) {
    return capitalize(
      new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
        -days,
        "day"
      ),
      locale
    )
  }
  if (days > 1 && days < 7) {
    return new Intl.DateTimeFormat(locale, { weekday: "long" }).format(value)
  }
  return absolute
}

let midnightListeners = new Set<() => void>()
let midnightTimer: ReturnType<typeof setTimeout> | undefined

function scheduleMidnight() {
  clearTimeout(midnightTimer)
  const now = new Date()
  const next = startOfDay(new Date(now.getTime() + dayMs)).getTime()
  midnightTimer = setTimeout(
    () => {
      for (const notify of midnightListeners) {
        notify()
      }
      scheduleMidnight()
    },
    Math.max(1000, next - now.getTime() + 50)
  )
}

function subscribeToday(notify: () => void) {
  midnightListeners.add(notify)
  if (midnightListeners.size === 1) {
    scheduleMidnight()
  }
  return () => {
    midnightListeners.delete(notify)
    if (midnightListeners.size === 0) {
      clearTimeout(midnightTimer)
      midnightListeners = new Set()
    }
  }
}

function getToday() {
  return startOfDay(new Date()).getTime()
}

function getServerToday() {
  return null
}

type MarkerTimeProps = Omit<React.ComponentProps<"time">, "children"> & {
  date: Date | string | number
  locale?: Intl.LocalesArgument
  format?: (date: Date) => React.ReactNode
}

function MarkerTime({
  className,
  date,
  locale = "en-US",
  format,
  ...props
}: MarkerTimeProps) {
  const today = React.useSyncExternalStore(
    subscribeToday,
    getToday,
    getServerToday
  )
  const value = toDate(date)
  const valid = !Number.isNaN(value.getTime())

  return (
    <time
      data-slot="marker-time"
      dateTime={valid ? value.toISOString() : undefined}
      suppressHydrationWarning
      className={cn("tabular-nums", className)}
      {...props}
    >
      {format
        ? valid
          ? format(value)
          : null
        : formatDay(value, today === null ? null : new Date(today), locale)}
    </time>
  )
}

export { Marker, MarkerContent, MarkerIcon, MarkerTime, markerVariants }
export type { MarkerProps, MarkerTimeProps, MarkerVariant }
