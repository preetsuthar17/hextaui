"use client"

import * as React from "react"
import { Drawer as DialogPrimitive } from "@base-ui/react/drawer"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
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

function Dialog<Payload>(props: DialogPrimitive.Root.Props<Payload>) {
  return <Sheet {...props} />
}

function DialogTrigger<Payload>(props: DialogPrimitive.Trigger.Props<Payload>) {
  return <SheetTrigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal(props: DialogPrimitive.Portal.Props) {
  return <SheetPortal data-slot="dialog-portal" {...props} />
}

function DialogOverlay(props: DialogPrimitive.Backdrop.Props) {
  return <SheetOverlay data-slot="dialog-overlay" {...props} />
}

function DialogClose(props: DialogPrimitive.Close.Props) {
  return <SheetClose data-slot="dialog-close" {...props} />
}

const DialogContentContext = React.createContext<{
  showCloseButton: boolean
}>({ showCloseButton: false })

const dialogContentVariants = cva(
  "data-nested-drawer-open:scale-[calc(1-0.04*var(--nested-drawers))] max-sm:origin-bottom sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:w-[calc(100%-2rem)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl sm:duration-200 sm:ease-out-quint sm:[--bleed:0px] sm:[--sheet-close-radius:calc(var(--radius-xl)-0.75rem)] sm:data-ending-style:opacity-0 sm:data-ending-style:duration-150 sm:data-nested-drawer-open:top-[calc(50%-0.5rem*var(--nested-drawers))] sm:data-starting-style:opacity-0 sm:motion-safe:data-ending-style:-translate-y-1/2 sm:motion-safe:data-ending-style:scale-96 sm:motion-safe:data-starting-style:-translate-y-1/2 sm:motion-safe:data-starting-style:scale-96 sm:[&>[data-slot=sheet-handle]]:hidden [&>[data-slot=sheet-inner]>:last-child:not([data-slot=dialog-footer])]:pb-6",
  {
    variants: {
      size: {
        default: "sm:max-w-lg",
        sm: "sm:max-w-sm",
        lg: "sm:max-w-2xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function DialogContent({
  className,
  size = "default",
  showCloseButton = true,
  initialFocus,
  ref,
  ...props
}: DialogPrimitive.Popup.Props &
  VariantProps<typeof dialogContentVariants> & {
    showCloseButton?: boolean
  }) {
  const popupRef = React.useRef<HTMLDivElement>(null)
  const resolvedSize = size ?? "default"
  const setRef = React.useMemo(() => mergeRefs(popupRef, ref), [ref])
  const context = React.useMemo(() => ({ showCloseButton }), [showCloseButton])

  return (
    <DialogContentContext.Provider value={context}>
      <SheetContent
        side="bottom"
        showCloseButton={showCloseButton}
        ref={setRef}
        data-slot="dialog-content"
        data-size={resolvedSize}
        initialFocus={
          initialFocus ??
          ((openType) => (openType === "touch" ? popupRef.current : true))
        }
        className={mergeClassName(
          dialogContentVariants({ size: resolvedSize }),
          className
        )}
        {...props}
      />
    </DialogContentContext.Provider>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  const { showCloseButton } = React.useContext(DialogContentContext)

  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "flex min-w-0 flex-col gap-1.5 px-6 pt-6",
        showCloseButton && "pe-12",
        className
      )}
      {...props}
    />
  )
}

function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-body"
      className={cn(
        "-my-1 min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-none px-6 py-1 wrap-anywhere",
        className
      )}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & { showCloseButton?: boolean }) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "mt-auto flex flex-col-reverse gap-2 px-6 pb-6 sm:flex-row sm:justify-end max-sm:[&>*:not([data-slot=button-status])]:h-10",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton ? (
        <DialogClose render={<Button variant="outline" />}>Close</DialogClose>
      ) : null}
    </div>
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={mergeClassName(
        "min-w-0 text-lg leading-snug font-semibold text-pretty wrap-anywhere",
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={mergeClassName(
        "min-w-0 text-sm text-pretty wrap-anywhere text-muted-foreground [&_a:not([data-slot])]:text-foreground [&_a:not([data-slot])]:underline [&_a:not([data-slot])]:decoration-current/40 [&_a:not([data-slot])]:underline-offset-3 [&_a:not([data-slot])]:transition-[text-decoration-color] [&_a:not([data-slot])]:hover:decoration-current [&>p:not(:last-child)]:mb-2",
        className
      )}
      {...props}
    />
  )
}

const createDialogHandle = DialogPrimitive.createHandle

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  dialogContentVariants,
  createDialogHandle,
}
