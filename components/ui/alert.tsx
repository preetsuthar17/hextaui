"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { IconX } from "@tabler/icons-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { easeOut, easeSpring } from "@/lib/motion"

import { Button } from "@/components/ui/button"

const alertVariants = cva(
  "grid w-full grid-cols-[auto_minmax(0,1fr)_fit-content(50%)_auto] items-center rounded-lg px-4 py-3 text-sm text-card-foreground inset-ring-(length:--hairline) inset-ring-border has-[>[data-slot=alert-description]]:items-start forced-colors:border [&>svg]:col-start-1 [&>svg]:row-start-1 [&>svg]:me-3 [&>svg]:shrink-0 has-[>[data-slot=alert-description]]:[&>svg]:mt-0.5 [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "[&>svg]:text-foreground",
        destructive: "[&>svg]:text-destructive",
        success: "[&>svg]:text-success",
        info: "[&>svg]:text-info",
        warning: "[&>svg]:text-warning",
      },
      appearance: {
        outline: "bg-card",
        soft: "inset-ring-transparent [&>[data-slot=alert-close]]:hover:bg-foreground/5 [&>[data-slot=alert-description]]:text-foreground/75",
      },
    },
    compoundVariants: [
      { appearance: "soft", variant: "default", className: "bg-muted" },
      {
        appearance: "soft",
        variant: "destructive",
        className: "bg-destructive/8 dark:bg-destructive/15",
      },
      {
        appearance: "soft",
        variant: "success",
        className: "bg-success/8 dark:bg-success/15",
      },
      {
        appearance: "soft",
        variant: "info",
        className: "bg-info/8 dark:bg-info/15",
      },
      {
        appearance: "soft",
        variant: "warning",
        className: "bg-warning/8 dark:bg-warning/15",
      },
    ],
    defaultVariants: {
      variant: "default",
      appearance: "outline",
    },
  }
)

type AlertVariant = NonNullable<VariantProps<typeof alertVariants>["variant"]>
type AlertAppearance = NonNullable<
  VariantProps<typeof alertVariants>["appearance"]
>

const assertiveVariants: AlertVariant[] = ["destructive", "warning"]

const AlertContext = React.createContext<{ close: () => void } | null>(null)

function useAlertContext(part: string) {
  const context = React.useContext(AlertContext)

  if (!context) {
    throw new Error(`<${part}> must be used within <Alert>.`)
  }

  return context
}

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'

function focusNearest(from: HTMLElement) {
  const candidates = Array.from(
    document.querySelectorAll<HTMLElement>(focusableSelector)
  ).filter((node) => !from.contains(node) && node.checkVisibility())

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

function dataAttributes(slot: string, extra?: Record<string, string>) {
  return { "data-slot": slot, ...extra } as Record<string, string>
}

function collapsedMargins(element: HTMLElement) {
  const parent = element.parentElement
  const hasSiblings = Boolean(
    element.previousElementSibling || element.nextElementSibling
  )
  let gap = 0

  if (parent && hasSiblings) {
    const style = getComputedStyle(parent)
    const stacksVertically =
      style.display.includes("grid") ||
      (style.display.includes("flex") &&
        style.flexDirection.startsWith("column"))

    if (stacksVertically) {
      gap = parseFloat(style.rowGap) || 0
    }
  }

  return element.previousElementSibling
    ? { marginBlockStart: `${-gap}px`, marginBlockEnd: "0px" }
    : { marginBlockStart: "0px", marginBlockEnd: `${-gap}px` }
}

function subscribe() {
  return () => {}
}

type AlertProps = useRender.ComponentProps<"div"> & {
  variant?: AlertVariant
  appearance?: AlertAppearance
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

function Alert({
  className,
  variant = "default",
  appearance = "outline",
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  render,
  ref,
  ...props
}: AlertProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const open = openProp ?? uncontrolledOpen
  const [present, setPresent] = React.useState(open)
  const elementRef = React.useRef<HTMLDivElement>(null)

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
    const element = elementRef.current

    if (open || !present || !element) {
      return
    }

    if (typeof element.animate !== "function") {
      setPresent(false)
      return
    }

    const hadFocus = element.contains(document.activeElement)
    const reduceMotion =
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    element.style.overflow = "hidden"
    element.dataset.endingStyle = ""

    const animation = element.animate(
      [
        {
          height: `${element.offsetHeight}px`,
        },
        {
          height: "0px",
          paddingBlock: "0px",
          borderBlockWidth: "0px",
          ...collapsedMargins(element),
        },
      ],
      {
        duration: reduceMotion ? 0 : 260,
        easing: easeSpring,
        fill: "forwards",
      }
    )

    const fade = element.animate(
      [
        { opacity: 1, scale: 1 },
        { opacity: 0, scale: 0.98 },
      ],
      {
        duration: reduceMotion ? 0 : 140,
        easing: easeOut,
        fill: "forwards",
      }
    )

    animation.onfinish = () => {
      if (hadFocus) {
        focusNearest(element)
      }
      setAnimateIn(true)
      setPresent(false)
    }

    return () => {
      animation.onfinish = null
      animation.cancel()
      fade.cancel()
      element.style.overflow = ""
      delete element.dataset.endingStyle
    }
  }, [open, present])

  const context = React.useMemo(
    () => ({
      close: () => {
        if (openProp === undefined) {
          setUncontrolledOpen(false)
        }
        onOpenChange?.(false)
      },
    }),
    [openProp, onOpenChange]
  )

  const element = useRender({
    defaultTagName: "div",
    render,
    ref: ref ? [elementRef, ref] : elementRef,
    enabled: present,
    props: mergeProps<"div">(
      {
        role: assertiveVariants.includes(variant) ? "alert" : "status",
        className: cn(
          alertVariants({ variant, appearance }),
          animateIn &&
            "motion-safe:animate-in motion-safe:ease-out-quint motion-safe:animation-duration-200 motion-safe:fade-in-0 motion-safe:slide-in-from-top-1",
          className
        ),
      },
      props,
      dataAttributes("alert", {
        "data-variant": variant,
        "data-appearance": appearance,
      })
    ),
  })

  return (
    <AlertContext.Provider value={context}>{element}</AlertContext.Provider>
  )
}

function AlertTitle({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      {
        className: cn(
          "col-start-2 min-w-0 leading-5 font-medium text-pretty wrap-anywhere",
          className
        ),
      },
      props,
      dataAttributes("alert-title")
    ),
  })
}

function AlertDescription({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      {
        className: cn(
          "col-start-2 min-w-0 leading-5 text-pretty wrap-anywhere text-muted-foreground [&_a:not([data-slot])]:text-foreground [&_a:not([data-slot])]:underline [&_a:not([data-slot])]:decoration-current/40 [&_a:not([data-slot])]:underline-offset-3 [&_a:not([data-slot])]:transition-[text-decoration-color] [&_a:not([data-slot])]:duration-150 [&_a:not([data-slot])]:hover:decoration-current [&>p:not(:last-child)]:mb-2 [[data-slot=alert-title]+&]:mt-0.5",
          className
        ),
      },
      props,
      dataAttributes("alert-description")
    ),
  })
}

function AlertAction({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      {
        className: cn(
          "col-start-3 row-start-1 ms-3 flex h-5 items-center gap-2 self-start",
          className
        ),
      },
      props,
      dataAttributes("alert-action")
    ),
  })
}

type AlertCloseProps = Omit<
  React.ComponentProps<typeof Button>,
  "className"
> & {
  className?: string
}

function AlertClose({
  className,
  children,
  onClick,
  "aria-label": ariaLabel = "Dismiss",
  ...props
}: AlertCloseProps) {
  const { close } = useAlertContext("AlertClose")

  return (
    <Button
      variant="ghost"
      size="icon-xs"
      aria-label={ariaLabel}
      className={cn(
        "col-start-4 row-start-1 -my-0.5 ms-2 -me-1.5 self-start text-muted-foreground hover:text-foreground",
        className
      )}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          close()
        }
      }}
      {...props}
      data-slot="alert-close"
    >
      {children ?? <IconX />}
    </Button>
  )
}

export {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertAction,
  AlertClose,
  alertVariants,
}
