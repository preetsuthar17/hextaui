"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { IconX } from "@tabler/icons-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { easeOut, easeSpring } from "@/lib/motion"

import { NumberFlow } from "@/components/ui/number-flow"

const badgeVariants = cva(
  "group/badge relative inline-flex h-(--badge-height) w-fit max-w-full min-w-0 shrink-0 items-center justify-center gap-1 overflow-hidden rounded-(--badge-radius) align-middle leading-none font-medium whitespace-nowrap inset-ring-(length:--hairline) inset-ring-transparent transition-[background-color,border-color,color,box-shadow,scale] duration-150 ease-out-quint outline-none select-none [--badge-inset:3px] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-current after:opacity-0 after:transition-opacity after:duration-150 focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:inset-ring-ring focus-visible:outline-hidden has-data-[slot=badge-close]:overflow-visible has-[>[data-slot=badge-close]]:pe-(--badge-inset) aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:inset-ring-destructive dark:aria-invalid:ring-destructive/40 forced-colors:border [&:is(a,button)]:cursor-pointer [&:is(a,button)]:hover:after:opacity-8 motion-safe:[&:is(a,button)]:active:scale-[0.97] [&>svg]:pointer-events-none [&>svg]:shrink-0 [&>svg]:text-(--badge-accent) [&>svg:not([class*='size-'])]:size-3",
  {
    variants: {
      variant: {
        default: "[--badge-accent:var(--color-muted-foreground)]",
        success: "[--badge-accent:var(--color-success)]",
        info: "[--badge-accent:var(--color-info)]",
        warning: "[--badge-accent:var(--color-warning)]",
        destructive: "[--badge-accent:var(--color-destructive)]",
      },
      appearance: {
        solid: "[--badge-accent:currentColor]",
        outline: "bg-background text-foreground inset-ring-border",
      },
      size: {
        sm: "px-1.5 text-[0.6875rem] [--badge-height:1.125rem] [--badge-radius:min(var(--radius-sm),5px)] has-data-[icon=inline-end]:pe-1 has-data-[icon=inline-start]:ps-1 [&>svg:not([class*='size-'])]:size-2.5",
        default:
          "px-2 text-xs [--badge-height:1.25rem] [--badge-radius:min(var(--radius-sm),6px)] has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5",
        lg: "gap-1.5 px-2.5 text-sm [--badge-height:1.5rem] [--badge-inset:4px] [--badge-radius:min(var(--radius-md),7px)] has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2 [&>svg:not([class*='size-'])]:size-3.5",
      },
    },
    compoundVariants: [
      {
        appearance: "solid",
        variant: "default",
        className: "bg-primary text-primary-foreground",
      },
      {
        appearance: "solid",
        variant: "success",
        className: "bg-success text-success-foreground",
      },
      {
        appearance: "solid",
        variant: "info",
        className: "bg-info text-info-foreground",
      },
      {
        appearance: "solid",
        variant: "warning",
        className: "bg-warning text-warning-foreground",
      },
      {
        appearance: "solid",
        variant: "destructive",
        className: "bg-destructive text-destructive-foreground",
      },
    ],
    defaultVariants: {
      variant: "default",
      appearance: "outline",
      size: "default",
    },
  }
)

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>
type BadgeAppearance = NonNullable<
  VariantProps<typeof badgeVariants>["appearance"]
>
type BadgeSize = NonNullable<VariantProps<typeof badgeVariants>["size"]>

const BadgeContext = React.createContext<{
  close: () => void
  labelId: string | undefined
} | null>(null)

function useBadgeContext(part: string) {
  const context = React.useContext(BadgeContext)

  if (!context) {
    throw new Error(`<${part}> must be used within <Badge>.`)
  }

  return context
}

function subscribe() {
  return () => {}
}

function prefersReducedMotion() {
  return (
    typeof window.matchMedia !== "function" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

function dataAttributes(slot: string, extra?: Record<string, string>) {
  return { "data-slot": slot, ...extra } as Record<string, string>
}

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'

function focusNearest(from: HTMLElement) {
  const candidates = Array.from(
    document.querySelectorAll<HTMLElement>(focusableSelector)
  ).filter(
    (node) =>
      !from.contains(node) &&
      (typeof node.checkVisibility !== "function" || node.checkVisibility())
  )

  const target =
    candidates.find(
      (node) =>
        from.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING
    ) ??
    candidates.findLast(
      (node) =>
        from.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_PRECEDING
    )

  target?.focus()
}

function siblingCloses(element: HTMLElement) {
  const parent = element.parentElement

  if (!parent) {
    return { next: [], previous: [] }
  }

  const closes = Array.from(
    parent.querySelectorAll<HTMLElement>(
      ":scope > [data-slot=badge] > [data-slot=badge-close]"
    )
  ).filter((close) => !element.contains(close))

  return {
    next: closes.filter(
      (close) =>
        element.compareDocumentPosition(close) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ),
    previous: closes
      .filter(
        (close) =>
          element.compareDocumentPosition(close) &
          Node.DOCUMENT_POSITION_PRECEDING
      )
      .reverse(),
  }
}

function inlineGap(element: HTMLElement) {
  const parent = element.parentElement

  if (!parent) {
    return 0
  }

  const style = getComputedStyle(parent)
  const flowsInline =
    style.display.includes("grid") ||
    (style.display.includes("flex") && style.flexDirection.startsWith("row"))

  return flowsInline ? parseFloat(style.columnGap) || 0 : 0
}

function isText(child: React.ReactNode) {
  return (
    (typeof child === "string" || typeof child === "number") &&
    String(child).trim() !== ""
  )
}

function hasText(children: React.ReactNode) {
  return React.Children.toArray(children).some(isText)
}

function wrapText(children: React.ReactNode, labelId: string) {
  const items = React.Children.toArray(children)
  const first = items.findIndex(isText)

  return items.map((child, index) =>
    isText(child) ? (
      <span
        key={`badge-label-${index}`}
        id={index === first ? labelId : undefined}
        data-slot="badge-label"
        className="min-w-0 truncate"
      >
        {child}
      </span>
    ) : (
      child
    )
  )
}

type BadgeProps = useRender.ComponentProps<"span"> & {
  variant?: BadgeVariant
  appearance?: BadgeAppearance
  size?: BadgeSize
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onOpenChangeComplete?: (open: boolean) => void
}

function Badge({
  className,
  variant = "default",
  appearance = "outline",
  size = "default",
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  onOpenChangeComplete,
  render,
  ref,
  children,
  ...props
}: BadgeProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const open = openProp ?? uncontrolledOpen
  const [present, setPresent] = React.useState(open)
  const elementRef = React.useRef<HTMLElement>(null)
  const closingRef = React.useRef(false)
  const labelId = React.useId()
  const onCompleteRef = React.useRef(onOpenChangeComplete)

  React.useLayoutEffect(() => {
    onCompleteRef.current = onOpenChangeComplete
  })

  const isHydrating = React.useSyncExternalStore(
    subscribe,
    () => false,
    () => true
  )
  const [animateIn, setAnimateIn] = React.useState(!isHydrating)

  if (open && !present) {
    setPresent(true)
  }

  React.useEffect(() => {
    if (open) {
      closingRef.current = false
    }
  }, [open])

  React.useEffect(() => {
    const element = elementRef.current

    if (open || !present || !element) {
      return
    }

    const hadFocus = element.contains(document.activeElement)
    const { next, previous } = siblingCloses(element)

    const finish = () => {
      if (hadFocus) {
        const target = [...next, ...previous].find((close) => close.isConnected)

        if (target) {
          target.focus()
        } else {
          focusNearest(element)
        }
      }
      setAnimateIn(true)
      setPresent(false)
      onCompleteRef.current?.(false)
    }

    if (typeof element.animate !== "function") {
      finish()
      return
    }

    element.dataset.endingStyle = ""

    const animation = element.animate(
      [
        {
          width: `${element.offsetWidth}px`,
          minWidth: "0px",
        },
        {
          width: "0px",
          minWidth: "0px",
          paddingInline: "0px",
          borderInlineWidth: "0px",
          marginInlineEnd: `${-inlineGap(element)}px`,
        },
      ],
      {
        duration: prefersReducedMotion() ? 0 : 260,
        easing: easeSpring,
        fill: "forwards",
      }
    )

    const fade = element.animate(
      [
        { opacity: 1, scale: 1 },
        { opacity: 0, scale: 0.9 },
      ],
      {
        duration: prefersReducedMotion() ? 0 : 140,
        easing: easeOut,
        fill: "forwards",
      }
    )

    animation.onfinish = finish

    return () => {
      animation.onfinish = null
      animation.cancel()
      fade.cancel()
      delete element.dataset.endingStyle
    }
  }, [open, present])

  const labelled = hasText(children)
  const context = React.useMemo(
    () => ({
      close: () => {
        if (closingRef.current) {
          return
        }
        closingRef.current = true
        if (openProp === undefined) {
          setUncontrolledOpen(false)
        }
        onOpenChange?.(false)
      },
      labelId: labelled ? labelId : undefined,
    }),
    [openProp, onOpenChange, labelled, labelId]
  )

  const element = useRender({
    defaultTagName: "span",
    render,
    ref: ref ? [elementRef, ref] : elementRef,
    enabled: present,
    props: mergeProps<"span">(
      {
        className: cn(
          badgeVariants({ variant, appearance, size }),
          animateIn &&
            "motion-safe:animate-in motion-safe:ease-out-quint motion-safe:animation-duration-200 motion-safe:fade-in-0 motion-safe:zoom-in-90",
          className
        ),
        children: wrapText(children, labelId),
      },
      props,
      dataAttributes("badge", {
        "data-variant": variant,
        "data-appearance": appearance,
        "data-size": size,
      })
    ),
  })

  return (
    <BadgeContext.Provider value={context}>{element}</BadgeContext.Provider>
  )
}

function BadgeDot({
  className,
  pulse = false,
  ...props
}: React.ComponentProps<"span"> & { pulse?: boolean }) {
  return (
    <span
      aria-hidden
      data-pulse={pulse ? "" : undefined}
      className={cn(
        "relative size-1.5 shrink-0 rounded-full bg-(--badge-accent,currentColor) group-data-[size=lg]/badge:size-2",
        pulse &&
          "after:absolute after:inset-0 after:rounded-full after:bg-inherit motion-safe:after:animate-ping",
        className
      )}
      {...props}
      data-slot="badge-dot"
    />
  )
}

function BadgeClose({
  className,
  children,
  onClick,
  onKeyDown,
  ...props
}: React.ComponentProps<"button">) {
  const { close, labelId } = useBadgeContext("BadgeClose")
  const id = React.useId()
  const labelled = props["aria-label"] === undefined

  return (
    <button
      id={id}
      type="button"
      aria-labelledby={labelled && labelId ? `${id} ${labelId}` : undefined}
      className={cn(
        "relative z-1 inline-flex size-[calc(var(--badge-height)-var(--badge-inset)*2)] shrink-0 cursor-pointer items-center justify-center rounded-[max(calc(var(--radius-sm)*0.25),calc(var(--badge-radius)-var(--badge-inset)))] opacity-70 transition-[opacity,background-color] duration-150 ease-out-quint outline-none before:absolute before:-inset-(--badge-inset) after:absolute after:-inset-1.5 hover:bg-current/15 hover:opacity-100 focus-visible:bg-current/15 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-40 pointer-coarse:after:-inset-3 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-[75%]",
        className
      )}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          close()
        }
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (
          !event.defaultPrevented &&
          (event.key === "Backspace" || event.key === "Delete")
        ) {
          event.preventDefault()
          close()
        }
      }}
      {...props}
      data-slot="badge-close"
    >
      {children ?? (
        <>
          <IconX aria-hidden />
          {labelled ? <span className="sr-only">Remove</span> : null}
        </>
      )}
    </button>
  )
}

type BadgeCountProps = Omit<
  React.ComponentProps<typeof NumberFlow>,
  "value" | "suffix"
> & {
  value: number
  max?: number
}

function BadgeCount({ className, value, max = 99, ...props }: BadgeCountProps) {
  const safe = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0
  const cap =
    max === Infinity
      ? Infinity
      : Number.isFinite(max) && max >= 1
        ? Math.floor(max)
        : 99
  const over = safe > cap

  return (
    <span data-slot="badge-count" dir="ltr" className="inline-flex">
      <NumberFlow
        aria-hidden
        value={over ? cap : safe}
        suffix={over ? "+" : undefined}
        format={{ useGrouping: false }}
        className={className}
        {...props}
      />
      <span className="sr-only">{safe}</span>
    </span>
  )
}

export {
  Badge,
  BadgeDot,
  BadgeClose,
  BadgeCount,
  badgeVariants,
  type BadgeProps,
  type BadgeCountProps,
  type BadgeVariant,
  type BadgeAppearance,
  type BadgeSize,
}
