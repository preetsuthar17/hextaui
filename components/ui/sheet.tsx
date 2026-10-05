"use client"

import * as React from "react"
import { Drawer as SheetPrimitive } from "@base-ui/react/drawer"
import { IconX } from "@tabler/icons-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { Button } from "@/components/ui/button"

type ClassName<State> =
  string | ((state: State) => string | undefined) | undefined

function mergeClassName<State>(base: string, className: ClassName<State>) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

const DialogLayerContext = React.createContext(0)

function DialogLayerProvider({ children }: { children: React.ReactNode }) {
  const depth = React.useContext(DialogLayerContext)

  return (
    <DialogLayerContext.Provider value={depth + 1}>
      {children}
    </DialogLayerContext.Provider>
  )
}

function useDialogLayer() {
  return React.useContext(DialogLayerContext)
}

type SwipeDirection = "up" | "down" | "left" | "right"

const SheetRootContext = React.createContext<
  ((direction: SwipeDirection) => void) | null
>(null)

function Sheet<Payload>({
  swipeDirection,
  ...props
}: SheetPrimitive.Root.Props<Payload>) {
  const [contentDirection, setContentDirection] =
    React.useState<SwipeDirection>("right")

  return (
    <DialogLayerProvider>
      <SheetRootContext.Provider value={setContentDirection}>
        <SheetPrimitive.Root
          data-slot="sheet"
          swipeDirection={swipeDirection ?? contentDirection}
          {...props}
        />
      </SheetRootContext.Provider>
    </DialogLayerProvider>
  )
}

function SheetTrigger<Payload>(props: SheetPrimitive.Trigger.Props<Payload>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetPortal(props: SheetPrimitive.Portal.Props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetClose(props: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

const sheetOverlayVariants = cva(
  "fixed inset-0 z-50 min-h-dvh opacity-[calc(1-var(--drawer-swipe-progress,0))] transition-opacity duration-300 ease-drawer data-ending-style:opacity-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength,0.7)*300ms)] data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs supports-[-webkit-touch-callout:none]:absolute sm:has-[~[data-slot=sheet-viewport]>[data-slot$=dialog-content]]:duration-200 sm:has-[~[data-slot=sheet-viewport]>[data-slot$=dialog-content]]:ease-out-quint sm:has-[~[data-slot=sheet-viewport]>[data-slot$=dialog-content]]:data-ending-style:duration-150 [&[data-swiping]:not([data-ending-style])]:duration-0",
  {
    variants: {
      nested: {
        false: "bg-black/40 dark:bg-black/60",
        true: "bg-black/20 dark:bg-black/30",
      },
    },
    defaultVariants: {
      nested: false,
    },
  }
)

function SheetOverlay({
  className,
  forceRender,
  ...props
}: SheetPrimitive.Backdrop.Props) {
  const nested = useDialogLayer() > 1

  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      data-nested={nested ? "" : undefined}
      forceRender={forceRender ?? nested}
      className={mergeClassName(sheetOverlayVariants({ nested }), className)}
      {...props}
    />
  )
}

const sheetContentVariants = cva(
  "fixed z-50 flex flex-col gap-4 overflow-y-auto overscroll-none bg-popover text-popover-foreground shadow-lg ring-(length:--hairline) ring-foreground/10 transition-[transform,translate,scale,opacity,top] duration-300 ease-drawer outline-none [--bleed:3rem] focus-visible:outline-hidden data-ending-style:duration-[calc(var(--drawer-swipe-strength,0.7)*300ms)] data-nested-dialog-open:scale-[calc(1-0.02*var(--nested-dialogs))] data-nested-drawer-open:scale-[calc(1-0.02*var(--nested-drawers))] data-swiping:cursor-grabbing data-swiping:select-none motion-reduce:transition-opacity motion-reduce:data-ending-style:opacity-0 motion-reduce:data-starting-style:opacity-0 rtl:[--sheet-dir:-1] forced-colors:border [&[data-swiping]:not([data-ending-style])]:duration-0",
  {
    variants: {
      side: {
        top: "inset-x-0 top-[calc(var(--bleed)*-1)] max-h-[calc(100dvh-2rem+var(--bleed))] [transform:translateY(var(--drawer-swipe-movement-y,0px))] rounded-b-2xl pt-(--bleed) [--sheet-close-top:calc(0.75rem+var(--bleed))] motion-safe:data-ending-style:translate-y-[calc(-100%+var(--bleed))] motion-safe:data-starting-style:translate-y-[calc(-100%+var(--bleed))]",
        right:
          "inset-y-0 end-[calc(var(--bleed)*-1)] h-full w-[calc(75%+var(--bleed))] [transform:translateX(var(--drawer-swipe-movement-x,0px))] rounded-s-2xl pe-(--bleed) [--sheet-close-end:calc(0.75rem+var(--bleed))] motion-safe:data-ending-style:translate-x-[calc(var(--sheet-dir,1)*(100%-var(--bleed)))] motion-safe:data-starting-style:translate-x-[calc(var(--sheet-dir,1)*(100%-var(--bleed)))] sm:max-w-[calc(24rem+var(--bleed))]",
        bottom:
          "inset-x-0 bottom-[calc(var(--bleed)*-1)] max-h-[calc(100dvh-2rem+var(--bleed))] [transform:translateY(var(--drawer-swipe-movement-y,0px))] rounded-t-2xl pb-[calc(var(--bleed)+env(safe-area-inset-bottom))] [--sheet-close-radius:calc(var(--radius-2xl)-0.75rem)] motion-safe:data-ending-style:translate-y-[calc(100%-var(--bleed))] motion-safe:data-starting-style:translate-y-[calc(100%-var(--bleed))]",
        left: "inset-y-0 start-[calc(var(--bleed)*-1)] h-full w-[calc(75%+var(--bleed))] [transform:translateX(var(--drawer-swipe-movement-x,0px))] rounded-e-2xl ps-(--bleed) [--sheet-close-radius:calc(var(--radius-2xl)-0.75rem)] motion-safe:data-ending-style:translate-x-[calc(var(--sheet-dir,1)*(var(--bleed)-100%))] motion-safe:data-starting-style:translate-x-[calc(var(--sheet-dir,1)*(var(--bleed)-100%))] sm:max-w-[calc(24rem+var(--bleed))]",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

const sheetHandleVariants = cva(
  "group/sheet-handle absolute z-10 flex cursor-grab touch-none items-center justify-center active:cursor-grabbing",
  {
    variants: {
      side: {
        top: "inset-x-0 bottom-0 h-6",
        right: "inset-y-0 start-0 w-6",
        bottom: "inset-x-0 top-0 h-6",
        left: "inset-y-0 end-0 w-6",
      },
    },
  }
)

const sheetHandleBarVariants = cva(
  "rounded-full bg-muted-foreground/30 transition-colors duration-150 group-hover/sheet-handle:bg-muted-foreground/50 group-active/sheet-handle:bg-muted-foreground/60",
  {
    variants: {
      side: {
        top: "h-1 w-10",
        right: "h-10 w-1",
        bottom: "h-1 w-10",
        left: "h-10 w-1",
      },
    },
  }
)

type SheetSide = NonNullable<VariantProps<typeof sheetContentVariants>["side"]>

const SheetContentContext = React.createContext<{
  showCloseButton: boolean
}>({ showCloseButton: false })

function resolveSwipeDirection(side: SheetSide, rtl: boolean): SwipeDirection {
  if (side === "top") {
    return "up"
  }
  if (side === "bottom") {
    return "down"
  }
  return (side === "right") !== rtl ? "right" : "left"
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  dir,
  ...props
}: SheetPrimitive.Popup.Props &
  VariantProps<typeof sheetContentVariants> & {
    showCloseButton?: boolean
  }) {
  const resolvedSide = side ?? "right"
  const setSwipeDirection = React.useContext(SheetRootContext)
  const context = React.useMemo(() => ({ showCloseButton }), [showCloseButton])

  React.useEffect(() => {
    const rtl =
      (dir ?? getComputedStyle(document.documentElement).direction) === "rtl"
    setSwipeDirection?.(resolveSwipeDirection(resolvedSide, rtl))
  }, [dir, resolvedSide, setSwipeDirection])

  return (
    <SheetContentContext.Provider value={context}>
      <SheetPortal>
        <SheetOverlay />
        <SheetPrimitive.Viewport
          data-slot="sheet-viewport"
          dir={dir}
          className="fixed inset-0 z-50"
        >
          <SheetPrimitive.Popup
            data-slot="sheet-content"
            data-side={resolvedSide}
            dir={dir}
            className={mergeClassName(
              sheetContentVariants({ side: resolvedSide }),
              className
            )}
            {...props}
          >
            <div
              data-slot="sheet-handle"
              aria-hidden="true"
              className={sheetHandleVariants({ side: resolvedSide })}
            >
              <div className={sheetHandleBarVariants({ side: resolvedSide })} />
            </div>
            <SheetPrimitive.Content
              data-slot="sheet-inner"
              className="flex min-h-0 flex-1 flex-col gap-4"
            >
              {children}
            </SheetPrimitive.Content>
            {showCloseButton ? (
              <SheetPrimitive.Close
                data-slot="sheet-close-button"
                aria-label="Close"
                render={<Button variant="ghost" size="icon-sm" />}
                className="absolute end-(--sheet-close-end,0.75rem) top-(--sheet-close-top,0.75rem) z-20 rounded-(--sheet-close-radius,var(--radius-md)) text-muted-foreground hover:text-foreground"
              >
                <IconX />
              </SheetPrimitive.Close>
            ) : null}
          </SheetPrimitive.Popup>
        </SheetPrimitive.Viewport>
      </SheetPortal>
    </SheetContentContext.Provider>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  const { showCloseButton } = React.useContext(SheetContentContext)

  return (
    <div
      data-slot="sheet-header"
      className={cn(
        "flex flex-col gap-1.5 px-6 pt-6",
        showCloseButton && "pe-12",
        className
      )}
      {...props}
    />
  )
}

function SheetBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-body"
      className={cn(
        "min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-none px-6 wrap-anywhere",
        className
      )}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "mt-auto flex flex-col-reverse gap-2 px-6 pb-6 sm:flex-row sm:justify-end max-sm:[&>*:not([data-slot=button-status])]:h-10",
        className
      )}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={mergeClassName(
        "min-w-0 text-lg leading-snug font-semibold text-pretty wrap-anywhere",
        className
      )}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={mergeClassName(
        "min-w-0 text-sm text-pretty wrap-anywhere text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

const createSheetHandle = SheetPrimitive.createHandle

export {
  Sheet,
  SheetTrigger,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
  sheetContentVariants,
  sheetOverlayVariants,
  createSheetHandle,
  DialogLayerProvider,
  useDialogLayer,
}
