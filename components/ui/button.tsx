"use client"

import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { IconAlertCircle, IconCircleCheck } from "@tabler/icons-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { Spinner } from "@/components/ui/spinner"
import {
  useButtonFeedback,
  type ButtonFeedbackOptions,
  type ButtonStatus,
} from "@/hooks/use-button-feedback"

const buttonVariants = cva(
  "group/button relative inline-flex items-center justify-center rounded-md bg-clip-padding text-sm font-medium whitespace-nowrap inset-ring-(length:--hairline) inset-ring-transparent transition-[color,background-color,box-shadow,opacity,translate,scale] duration-200 ease-out-quint outline-none select-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:inset-ring-ring focus-visible:outline-hidden active:duration-100 active:not-aria-[haspopup]:not-aria-busy:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-busy:cursor-progress aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:inset-ring-destructive motion-safe:active:not-aria-[haspopup]:not-aria-busy:scale-[0.97] dark:aria-invalid:ring-destructive/40 dark:aria-invalid:inset-ring-destructive/50 forced-colors:border [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "bg-background inset-ring-border hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:bg-input/30 dark:inset-ring-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 forced-colors:border-0",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:ring-destructive/70 focus-visible:inset-ring-destructive/40 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/70",
        link: "text-primary underline-offset-4 hover:underline forced-colors:border-0",
        success:
          "bg-success text-success-foreground hover:bg-success/90 focus-visible:ring-success/70 focus-visible:inset-ring-success/40",
        error:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/70 focus-visible:inset-ring-destructive/40 motion-safe:animate-button-shake",
      },
      size: {
        default:
          "h-9 gap-1.5 px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),8px)] px-2 text-xs in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 rounded-[min(var(--radius-md),10px)] px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5",
        lg: "h-10 gap-1.5 px-2.5 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2",
        icon: "size-9 shrink-0",
        "icon-xs":
          "size-6 shrink-0 rounded-[min(var(--radius-md),8px)] in-data-[slot=button-group]:rounded-md pointer-coarse:after:absolute pointer-coarse:after:-inset-2.5 pointer-coarse:in-data-[slot=button-group]:after:hidden [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-8 shrink-0 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-md pointer-coarse:after:absolute pointer-coarse:after:-inset-1.5 pointer-coarse:in-data-[slot=button-group]:after:hidden",
        "icon-lg": "size-10 shrink-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type ButtonVariant = Exclude<
  NonNullable<VariantProps<typeof buttonVariants>["variant"]>,
  "success" | "error"
>

type ButtonClickEvent = Parameters<
  NonNullable<ButtonPrimitive.Props["onClick"]>
>[0]

type ButtonProps = Omit<ButtonPrimitive.Props, "onClick"> &
  Omit<VariantProps<typeof buttonVariants>, "variant"> &
  ButtonFeedbackOptions & {
    variant?: ButtonVariant | null
    onClick?: (event: ButtonClickEvent) => unknown
    feedback?: boolean
    loading?: boolean
    status?: ButtonStatus
    loadingLabel?: React.ReactNode
    successLabel?: React.ReactNode
    errorLabel?: React.ReactNode | ((error: unknown) => React.ReactNode)
  }

const stateTransitionTime = 220
const statuses: ButtonStatus[] = ["idle", "loading", "success", "error"]
const quietVariants: ButtonVariant[] = ["ghost", "link"]
const quietStatusClasses: Partial<Record<ButtonStatus, string>> = {
  success: "text-success hover:text-success",
  error:
    "text-destructive hover:text-destructive motion-safe:animate-button-shake",
}

function isThenable(value: unknown): value is PromiseLike<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as PromiseLike<unknown>).then === "function"
  )
}

function useStatusTransition(status: ButtonStatus) {
  const [shown, setShown] = React.useState(status)
  const [leaving, setLeaving] = React.useState<ButtonStatus | null>(null)
  const [transitionKey, setTransitionKey] = React.useState(0)

  if (status !== shown) {
    setLeaving(shown)
    setShown(status)
    setTransitionKey((key) => key + 1)
  }

  React.useEffect(() => {
    if (leaving === null) {
      return
    }
    const timer = setTimeout(() => setLeaving(null), stateTransitionTime)
    return () => clearTimeout(timer)
  }, [leaving, transitionKey])

  return { leaving, transitionKey }
}

function useLayerWidth(status: ButtonStatus, active: boolean) {
  const contentRef = React.useRef<HTMLSpanElement>(null)
  const layersRef = React.useRef(new Map<ButtonStatus, HTMLElement>())
  const observerRef = React.useRef<ResizeObserver | null>(null)
  const statusRef = React.useRef(status)

  const applyWidth = React.useCallback(() => {
    const content = contentRef.current
    const layer = layersRef.current.get(statusRef.current)
    if (!content || !layer) {
      return
    }
    const natural = parseFloat(getComputedStyle(layer).width)
    if (!Number.isFinite(natural)) {
      return
    }
    content.style.width = `${natural}px`
    if (!content.hasAttribute("data-measured")) {
      requestAnimationFrame(() => content.setAttribute("data-measured", ""))
    }
  }, [])

  React.useLayoutEffect(() => {
    statusRef.current = status
    if (active) {
      applyWidth()
    }
  }, [active, applyWidth, status])

  React.useLayoutEffect(() => {
    if (!active || typeof ResizeObserver === "undefined") {
      return
    }
    const observer = new ResizeObserver(applyWidth)
    observerRef.current = observer
    layersRef.current.forEach((layer) => observer.observe(layer))
    document.fonts?.addEventListener?.("loadingdone", applyWidth)
    return () => {
      observer.disconnect()
      observerRef.current = null
      document.fonts?.removeEventListener?.("loadingdone", applyWidth)
    }
  }, [active, applyWidth])

  const layerRef = React.useCallback((node: HTMLElement | null) => {
    if (!node) {
      return
    }
    const layer = node.dataset.layer as ButtonStatus
    layersRef.current.set(layer, node)
    observerRef.current?.observe(node)
    return () => {
      observerRef.current?.unobserve(node)
      if (layersRef.current.get(layer) === node) {
        layersRef.current.delete(layer)
      }
    }
  }, [])

  return { contentRef, layerRef }
}

function composeHandlers<Event>(
  first: ((event: Event) => void) | undefined,
  second: (event: Event) => void
) {
  return (event: Event) => {
    first?.(event)
    second(event)
  }
}

function Button({
  className,
  variant = "default",
  size = "default",
  children,
  onClick,
  disabled,
  focusableWhenDisabled,
  feedback,
  loading,
  status: statusProp,
  onStatusChange,
  onError,
  resetAfter,
  loadingLabel,
  successLabel = "Done",
  errorLabel = "Failed",
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: ButtonProps) {
  const internal = useButtonFeedback({ resetAfter, onStatusChange, onError })
  const status = statusProp ?? (loading ? "loading" : internal.status)
  const requested =
    Boolean(feedback) || loading !== undefined || statusProp !== undefined
  const [enabled, setEnabled] = React.useState(requested)
  if (requested && !enabled) {
    setEnabled(true)
  }

  const { leaving, transitionKey } = useStatusTransition(status)
  const iconOnly = size?.startsWith("icon") ?? false
  const widthStatus =
    status === "loading" && loadingLabel === undefined ? "idle" : status
  const { contentRef, layerRef } = useLayerWidth(
    widthStatus,
    enabled && !iconOnly
  )
  const isLoading = status === "loading"
  const quiet = quietVariants.includes(variant ?? "default")
  const resolvedVariant =
    !quiet && status === "success"
      ? "success"
      : !quiet && status === "error"
        ? "error"
        : variant
  const resolvedErrorLabel =
    typeof errorLabel !== "function"
      ? errorLabel
      : internal.error !== undefined
        ? errorLabel(internal.error)
        : "Failed"

  const handleClick = (event: ButtonClickEvent) => {
    if (feedback && internal.isPending()) {
      return
    }
    const result = onClick?.(event)
    if (feedback && isThenable(result)) {
      internal.track(result)
    }
  }

  const layerContent = (layer: ButtonStatus, animated: boolean) => {
    if (layer === "idle") {
      return children
    }
    if (layer === "loading") {
      return (
        <>
          <Spinner aria-hidden size={null} animated={animated} />
          {iconOnly ? null : loadingLabel}
        </>
      )
    }
    if (layer === "success") {
      return (
        <>
          <IconCircleCheck
            className={cn(
              animated &&
                "motion-safe:[&>path:first-child]:animate-button-draw-circle motion-safe:[&>path:first-child]:[stroke-dasharray:57] motion-safe:[&>path:first-child]:[stroke-dashoffset:57] motion-safe:[&>path:last-child]:animate-button-draw-check motion-safe:[&>path:last-child]:[stroke-dasharray:9] motion-safe:[&>path:last-child]:[stroke-dashoffset:9]"
            )}
          />
          {iconOnly ? null : successLabel}
        </>
      )
    }
    return (
      <>
        <IconAlertCircle />
        {iconOnly ? null : resolvedErrorLabel}
      </>
    )
  }

  const button = (
    <ButtonPrimitive
      data-slot="button"
      data-status={enabled ? status : undefined}
      aria-busy={isLoading || undefined}
      disabled={disabled || isLoading}
      focusableWhenDisabled={focusableWhenDisabled ?? (isLoading || undefined)}
      className={cn(
        buttonVariants({ variant: resolvedVariant, size }),
        quiet && quietStatusClasses[status],
        className
      )}
      onClick={handleClick}
      onPointerEnter={composeHandlers(
        onPointerEnter,
        internal.buttonProps.onPointerEnter
      )}
      onPointerLeave={composeHandlers(
        onPointerLeave,
        internal.buttonProps.onPointerLeave
      )}
      onFocus={composeHandlers(onFocus, internal.buttonProps.onFocus)}
      onBlur={composeHandlers(onBlur, internal.buttonProps.onBlur)}
      {...props}
    >
      {enabled ? (
        <span
          ref={contentRef}
          data-slot="button-content"
          className="relative inline-grid grid-cols-[minmax(0,1fr)] place-items-center gap-[inherit] overflow-x-clip *:col-start-1 *:row-start-1 motion-safe:data-measured:transition-[width] motion-safe:data-measured:duration-220 motion-safe:data-measured:ease-[cubic-bezier(0.2,0,0,1)]"
        >
          {statuses.map((layer) => {
            const active = layer === status
            const exiting = layer === leaving
            const namesButton =
              layer === "idle" && isLoading && loadingLabel === undefined

            return (
              <span
                key={active ? `${layer}-${transitionKey}` : layer}
                ref={layerRef}
                data-slot="button-layer"
                data-layer={layer}
                aria-hidden={active || namesButton ? undefined : true}
                className={cn(
                  "inline-flex items-center justify-center gap-[inherit] backface-hidden",
                  !active &&
                    !exiting &&
                    "pointer-events-none absolute opacity-0",
                  active &&
                    transitionKey > 0 &&
                    "origin-bottom motion-safe:animate-button-state-in motion-reduce:animate-in motion-reduce:animation-duration-150 motion-reduce:fade-in-0",
                  exiting &&
                    "pointer-events-none origin-top opacity-0 motion-safe:animate-button-state-out"
                )}
              >
                {layerContent(layer, active || exiting)}
              </span>
            )
          })}
        </span>
      ) : (
        children
      )}
    </ButtonPrimitive>
  )

  if (!enabled) {
    return button
  }

  const announcement =
    status === "loading"
      ? typeof loadingLabel === "string"
        ? loadingLabel
        : "Loading"
      : status === "success"
        ? typeof successLabel === "string"
          ? successLabel
          : "Done"
        : status === "error"
          ? typeof resolvedErrorLabel === "string"
            ? resolvedErrorLabel
            : "Failed"
          : ""

  return (
    <>
      {button}
      <span data-slot="button-status" role="status" className="sr-only">
        {announcement}
      </span>
    </>
  )
}

export { Button, buttonVariants, useButtonFeedback }
export type { ButtonProps, ButtonStatus, ButtonFeedbackOptions }
