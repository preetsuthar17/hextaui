"use client"

import * as React from "react"
import { Drawer as AlertDialogPrimitive } from "@base-ui/react/drawer"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetOverlay,
  SheetPortal,
  SheetTrigger,
} from "@/components/ui/sheet"

type ClassName<State> =
  string | ((state: State) => string | undefined) | undefined

function mergeClassName<State>(base: string, className: ClassName<State>) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    }
  }
}

function isThenable(value: unknown): value is PromiseLike<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as PromiseLike<unknown>).then === "function"
  )
}

type AlertDialogContextValue = {
  pendingActionId: string | null
  close: () => void
  runAction: (id: string, action: PromiseLike<unknown>) => void
}

const AlertDialogContext = React.createContext<AlertDialogContextValue | null>(
  null
)

function useAlertDialogContext(part: string) {
  const context = React.useContext(AlertDialogContext)

  if (!context) {
    throw new Error(`<${part}> must be used within <AlertDialog>.`)
  }

  return context
}

function AlertDialog<Payload>({
  actionsRef,
  onOpenChange,
  onOpenChangeComplete,
  disablePointerDismissal = true,
  ...props
}: AlertDialogPrimitive.Root.Props<Payload>) {
  const [pendingActionId, setPendingActionId] = React.useState<string | null>(
    null
  )
  const pendingRef = React.useRef(false)
  const localActionsRef = React.useRef<AlertDialogPrimitive.Root.Actions>(null)

  React.useImperativeHandle(actionsRef, () => ({
    close: () => localActionsRef.current?.close(),
    unmount: () => localActionsRef.current?.unmount(),
  }))

  const context = React.useMemo<AlertDialogContextValue>(
    () => ({
      pendingActionId,
      close: () => localActionsRef.current?.close(),
      runAction: (id, action) => {
        pendingRef.current = true
        setPendingActionId(id)

        Promise.resolve(action).then(
          () => {
            pendingRef.current = false
            localActionsRef.current?.close()
          },
          () => {
            pendingRef.current = false
            setPendingActionId(null)
          }
        )
      },
    }),
    [pendingActionId]
  )

  return (
    <AlertDialogContext.Provider value={context}>
      <Sheet
        disablePointerDismissal={disablePointerDismissal}
        actionsRef={localActionsRef}
        onOpenChange={(open, details) => {
          if (!open && pendingRef.current) {
            details.cancel()
            return
          }
          if (open) {
            setPendingActionId(null)
          }
          onOpenChange?.(open, details)
        }}
        onOpenChangeComplete={(open) => {
          if (!open) {
            setPendingActionId(null)
          }
          onOpenChangeComplete?.(open)
        }}
        {...props}
      />
    </AlertDialogContext.Provider>
  )
}

function AlertDialogTrigger<Payload>(
  props: AlertDialogPrimitive.Trigger.Props<Payload>
) {
  return <SheetTrigger data-slot="alert-dialog-trigger" {...props} />
}

function AlertDialogPortal(props: AlertDialogPrimitive.Portal.Props) {
  return <SheetPortal data-slot="alert-dialog-portal" {...props} />
}

function AlertDialogOverlay(props: AlertDialogPrimitive.Backdrop.Props) {
  return <SheetOverlay data-slot="alert-dialog-overlay" {...props} />
}

type AlertDialogSize = "default" | "sm"

const AlertDialogSizeContext = React.createContext<AlertDialogSize>("default")

const alertDialogContentVariants = cva(
  "p-6 pb-[calc(1.5rem+var(--bleed)+env(safe-area-inset-bottom))] data-nested-drawer-open:scale-[calc(1-0.04*var(--nested-drawers))] max-sm:origin-bottom sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:w-[calc(100%-2rem)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl sm:pb-6 sm:duration-200 sm:ease-out-quint sm:[--bleed:0px] sm:data-ending-style:opacity-0 sm:data-ending-style:duration-150 sm:data-nested-drawer-open:top-[calc(50%-0.5rem*var(--nested-drawers))] sm:data-starting-style:opacity-0 sm:motion-safe:data-ending-style:-translate-y-1/2 sm:motion-safe:data-ending-style:scale-96 sm:motion-safe:data-starting-style:-translate-y-1/2 sm:motion-safe:data-starting-style:scale-96 sm:[&>[data-slot=sheet-handle]]:hidden [&>[data-slot=sheet-inner]]:gap-6",
  {
    variants: {
      size: {
        default: "sm:max-w-md",
        sm: "sm:max-w-sm",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function AlertDialogContent({
  className,
  size = "default",
  initialFocus,
  ref,
  onPointerDown,
  onTouchStart,
  ...props
}: AlertDialogPrimitive.Popup.Props &
  VariantProps<typeof alertDialogContentVariants>) {
  const pending = React.useContext(AlertDialogContext)?.pendingActionId != null
  const popupRef = React.useRef<HTMLDivElement>(null)
  const resolvedSize = size ?? "default"
  const setRef = React.useMemo(() => mergeRefs(popupRef, ref), [ref])

  return (
    <AlertDialogSizeContext.Provider value={resolvedSize}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        role="alertdialog"
        ref={setRef}
        onPointerDown={(event) => {
          onPointerDown?.(event)
          if (pending) {
            event.stopPropagation()
          }
        }}
        onTouchStart={(event) => {
          onTouchStart?.(event)
          if (pending) {
            event.stopPropagation()
          }
        }}
        data-slot="alert-dialog-content"
        data-size={resolvedSize}
        initialFocus={
          initialFocus ??
          (() =>
            popupRef.current?.querySelector<HTMLElement>(
              "[data-slot=alert-dialog-cancel]"
            ) ?? true)
        }
        className={mergeClassName(
          alertDialogContentVariants({ size: resolvedSize }),
          className
        )}
        {...props}
      />
    </AlertDialogSizeContext.Provider>
  )
}

const alertDialogHeaderVariants = cva(
  "grid justify-items-center gap-1.5 text-center",
  {
    variants: {
      size: {
        default:
          "sm:justify-items-start sm:text-start sm:has-[>[data-slot=alert-dialog-media]]:grid-cols-[auto_1fr] sm:has-[>[data-slot=alert-dialog-media]]:gap-x-4",
        sm: "",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const size = React.useContext(AlertDialogSizeContext)

  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(alertDialogHeaderVariants({ size }), className)}
      {...props}
    />
  )
}

const alertDialogFooterVariants = cva("gap-2", {
  variants: {
    size: {
      default:
        "flex flex-col-reverse sm:flex-row sm:justify-end max-sm:[&>*:not([data-slot=button-status])]:h-10 max-sm:[&>*:not([data-slot=button-status])]:w-full",
      sm: "grid grid-cols-2 max-sm:[&>*:not([data-slot=button-status])]:h-10",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

const footerArrowKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]

function focusAdjacentFooterButton(event: React.KeyboardEvent<HTMLDivElement>) {
  const footer = event.currentTarget
  const current = event.target as HTMLElement

  if (
    !footerArrowKeys.includes(event.key) ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey
  ) {
    return
  }

  const buttons = Array.from(
    footer.querySelectorAll<HTMLElement>("button, a[href]")
  ).filter(
    (button) =>
      button.closest("[data-slot=alert-dialog-footer]") === footer &&
      !button.hasAttribute("disabled")
  )

  if (!buttons.includes(current)) {
    return
  }

  const rtl = getComputedStyle(footer).direction === "rtl"
  const ordered = buttons
    .map((button) => ({ button, rect: button.getBoundingClientRect() }))
    .sort((a, b) =>
      Math.abs(a.rect.top - b.rect.top) > 1
        ? a.rect.top - b.rect.top
        : rtl
          ? b.rect.left - a.rect.left
          : a.rect.left - b.rect.left
    )
    .map(({ button }) => button)

  const forward =
    event.key === "ArrowDown" ||
    event.key === (rtl ? "ArrowLeft" : "ArrowRight")
  const index = ordered.indexOf(current)
  const next =
    ordered[(index + (forward ? 1 : -1) + ordered.length) % ordered.length]

  event.preventDefault()
  next.focus()
}

function AlertDialogFooter({
  className,
  onKeyDown,
  ...props
}: React.ComponentProps<"div">) {
  const size = React.useContext(AlertDialogSizeContext)

  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(alertDialogFooterVariants({ size }), className)}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (!event.defaultPrevented) {
          focusAdjacentFooterButton(event)
        }
      }}
      {...props}
    />
  )
}

const alertDialogMediaVariants = cva(
  "mb-2 flex size-10 shrink-0 items-center justify-center rounded-lg sm:row-span-2 sm:mb-0 [&>svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default: "bg-muted text-foreground",
        destructive: "bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function AlertDialogMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof alertDialogMediaVariants>) {
  return (
    <div
      data-slot="alert-dialog-media"
      className={cn(alertDialogMediaVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertDialogTitle({
  className,
  ...props
}: AlertDialogPrimitive.Title.Props) {
  const size = React.useContext(AlertDialogSizeContext)

  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={mergeClassName(
        cn(
          "min-w-0 font-semibold text-pretty wrap-anywhere",
          size === "sm" ? "text-base" : "text-lg leading-snug"
        ),
        className
      )}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: AlertDialogPrimitive.Description.Props) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={mergeClassName(
        "min-w-0 text-sm text-pretty wrap-anywhere text-muted-foreground [&_a:not([data-slot])]:text-foreground [&_a:not([data-slot])]:underline [&_a:not([data-slot])]:decoration-current/40 [&_a:not([data-slot])]:underline-offset-3 [&_a:not([data-slot])]:transition-[text-decoration-color] [&_a:not([data-slot])]:hover:decoration-current [&>p:not(:last-child)]:mb-2",
        className
      )}
      {...props}
    />
  )
}

type ButtonProps = React.ComponentProps<typeof Button>

type AlertDialogActionProps = Omit<ButtonProps, "className" | "onClick"> & {
  className?: string
  onClick?: (
    event: Parameters<NonNullable<ButtonProps["onClick"]>>[0]
  ) => void | PromiseLike<unknown>
}

function AlertDialogAction({
  className,
  children,
  onClick,
  disabled,
  ...props
}: AlertDialogActionProps) {
  const { pendingActionId, close, runAction } =
    useAlertDialogContext("AlertDialogAction")
  const id = React.useId()
  const loading = pendingActionId === id

  return (
    <Button
      data-slot="alert-dialog-action"
      focusableWhenDisabled
      loading={loading}
      disabled={disabled || (pendingActionId !== null && !loading)}
      className={className}
      onClick={(event) => {
        const result = onClick?.(event)

        if (isThenable(result)) {
          runAction(id, result)
        } else if (!event.defaultPrevented) {
          close()
        }
      }}
      {...props}
    >
      {children}
    </Button>
  )
}

type AlertDialogCancelProps = AlertDialogPrimitive.Close.Props &
  Pick<ButtonProps, "variant" | "size">

function AlertDialogCancel({
  className,
  variant = "outline",
  size,
  disabled,
  ...props
}: AlertDialogCancelProps) {
  const { pendingActionId } = useAlertDialogContext("AlertDialogCancel")

  return (
    <AlertDialogPrimitive.Close
      data-slot="alert-dialog-cancel"
      disabled={disabled || pendingActionId !== null}
      render={<Button variant={variant} size={size} focusableWhenDisabled />}
      className={mergeClassName("data-disabled:opacity-50", className)}
      {...props}
    />
  )
}

const createAlertDialogHandle = AlertDialogPrimitive.createHandle

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  alertDialogContentVariants,
  createAlertDialogHandle,
}
