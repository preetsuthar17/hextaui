"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"
import { cn } from "cn"

import { DialogLayerProvider, useDialogLayer } from "@/components/ui/sheet"

type ClassName<State> =
  string | ((state: State) => string | undefined) | undefined

function mergeClassName<State>(base: string, className: ClassName<State>) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

type DrawerSwipeDirection = NonNullable<
  DrawerPrimitive.Root.Props["swipeDirection"]
>

type DrawerStack = {
  swipeDirection: DrawerSwipeDirection
  register: () => () => void
}

type DrawerContextValue = {
  modal: DrawerPrimitive.Root.Props["modal"]
  swipeDirection: DrawerSwipeDirection
  showSwipeHandle: boolean
  hasSnapPoints: boolean
  stacked: boolean
  stackedInParent: boolean
  registerWithParent: (() => () => void) | null
}

const DrawerStackContext = React.createContext<DrawerStack | null>(null)

const DrawerContext = React.createContext<DrawerContextValue | null>(null)

function useDrawer(part: string) {
  const context = React.useContext(DrawerContext)

  if (!context) {
    throw new Error(`<${part}> must be used within <Drawer>.`)
  }

  return context
}

function Drawer<Payload>({
  modal = true,
  swipeDirection = "down",
  showSwipeHandle,
  snapPoints,
  children,
  ...props
}: DrawerPrimitive.Root.Props<Payload> & {
  showSwipeHandle?: boolean
}) {
  const parent = React.useContext(DrawerStackContext)
  const [stackedChildren, setStackedChildren] = React.useState(0)

  const register = React.useCallback(() => {
    setStackedChildren((count) => count + 1)
    return () => setStackedChildren((count) => count - 1)
  }, [])

  const stack = React.useMemo<DrawerStack>(
    () => ({ swipeDirection, register }),
    [swipeDirection, register]
  )

  const stackedInParent = parent?.swipeDirection === swipeDirection
  const registerWithParent = stackedInParent ? parent.register : null
  const hasSnapPoints = snapPoints != null && snapPoints.length > 0
  const axisIsVertical = swipeDirection === "down" || swipeDirection === "up"

  const context = React.useMemo<DrawerContextValue>(
    () => ({
      modal,
      swipeDirection,
      showSwipeHandle: showSwipeHandle ?? axisIsVertical,
      hasSnapPoints,
      stacked: stackedChildren > 0,
      stackedInParent,
      registerWithParent,
    }),
    [
      modal,
      swipeDirection,
      showSwipeHandle,
      axisIsVertical,
      hasSnapPoints,
      stackedChildren,
      stackedInParent,
      registerWithParent,
    ]
  )

  return (
    <DialogLayerProvider>
      <DrawerStackContext.Provider value={stack}>
        <DrawerContext.Provider value={context}>
          <DrawerPrimitive.Root
            data-slot="drawer"
            modal={modal}
            swipeDirection={swipeDirection}
            snapPoints={snapPoints}
            {...props}
          >
            {children}
          </DrawerPrimitive.Root>
        </DrawerContext.Provider>
      </DrawerStackContext.Provider>
    </DialogLayerProvider>
  )
}

function DrawerTrigger<Payload>(props: DrawerPrimitive.Trigger.Props<Payload>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerPortal(props: DrawerPrimitive.Portal.Props) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

function DrawerClose(props: DrawerPrimitive.Close.Props) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

function DrawerVirtualKeyboardProvider(
  props: DrawerPrimitive.VirtualKeyboardProvider.Props
) {
  return <DrawerPrimitive.VirtualKeyboardProvider {...props} />
}

function DrawerOverlay({
  className,
  forceRender,
  ...props
}: DrawerPrimitive.Backdrop.Props) {
  const { hasSnapPoints, stackedInParent } = useDrawer("DrawerOverlay")
  const nested = useDialogLayer() > 1
  const layered = nested && !stackedInParent

  return (
    <DrawerPrimitive.Backdrop
      data-slot="drawer-overlay"
      data-nested={layered ? "" : undefined}
      data-snap-points={hasSnapPoints ? "" : undefined}
      forceRender={forceRender ?? layered}
      className={mergeClassName(
        cn(
          "fixed inset-0 z-50 min-h-dvh opacity-[max(var(--drawer-overlay-min-opacity,0),calc(1-var(--drawer-swipe-progress,0)))] transition-opacity duration-300 ease-drawer select-none data-ending-style:pointer-events-none data-ending-style:opacity-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength,0.7)*300ms)] data-snap-points:[--drawer-overlay-min-opacity:0.5] data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs supports-[-webkit-touch-callout:none]:absolute [&[data-swiping]:not([data-ending-style])]:duration-0",
          layered
            ? "bg-black/20 dark:bg-black/30"
            : "bg-black/40 dark:bg-black/60"
        ),
        className
      )}
      {...props}
    />
  )
}

function DrawerSwipeHandle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-swipe-handle"
      aria-hidden="true"
      className={cn(
        "group/drawer-handle relative z-10 flex shrink-0 cursor-grab touch-none transition-opacity duration-200 ease-out-cubic group-data-[stack]/drawer-popup:group-data-nested-drawer-open/drawer-popup:opacity-0 group-data-[swipe-axis=x]/drawer-popup:w-4 group-data-[swipe-axis=x]/drawer-popup:items-center group-data-[swipe-axis=y]/drawer-popup:h-4 group-data-[swipe-axis=y]/drawer-popup:w-full group-data-[swipe-axis=y]/drawer-popup:justify-center group-data-[swipe-direction=down]/drawer-popup:items-end group-data-[swipe-direction=left]/drawer-popup:order-last group-data-[swipe-direction=left]/drawer-popup:justify-start group-data-[swipe-direction=right]/drawer-popup:justify-end group-data-[swipe-direction=up]/drawer-popup:order-last group-data-[swipe-direction=up]/drawer-popup:items-start after:block after:shrink-0 after:rounded-full after:bg-muted-foreground/30 after:transition-colors after:duration-150 group-data-[swipe-axis=x]/drawer-popup:after:h-10 group-data-[swipe-axis=x]/drawer-popup:after:w-1 group-data-[swipe-axis=y]/drawer-popup:after:h-1 group-data-[swipe-axis=y]/drawer-popup:after:w-10 hover:after:bg-muted-foreground/50 active:cursor-grabbing active:after:bg-muted-foreground/60",
        className
      )}
      {...props}
    />
  )
}

function DrawerStackRegistration({ register }: { register: () => () => void }) {
  React.useLayoutEffect(() => register(), [register])
  return null
}

const drawerPopupClassName = cn(
  "group/drawer-popup pointer-events-auto fixed z-50 m-(--drawer-inset,0px) flex h-(--drawer-content-height) max-h-(--drawer-content-max-height,none) min-h-0 w-(--drawer-content-width,auto) transform-[translate3d(var(--translate-x,0px),var(--translate-y,0px),0)_scale(var(--stack-scale))] flex-col bg-popover text-popover-foreground shadow-lg ring-(length:--hairline) ring-foreground/10 transition-[transform,height,opacity] duration-300 ease-drawer outline-none [interpolate-size:allow-keywords] focus-visible:outline-hidden data-swiping:cursor-grabbing data-swiping:select-none forced-colors:border",
  "after:pointer-events-none after:absolute after:bg-(--drawer-bleed-background,var(--color-popover)) data-[swipe-axis=x]:after:inset-y-0 data-[swipe-axis=x]:after:w-(--bleed) data-[swipe-axis=y]:after:inset-x-0 data-[swipe-axis=y]:after:h-(--bleed) data-[swipe-direction=down]:after:top-full data-[swipe-direction=left]:after:right-full data-[swipe-direction=right]:after:left-full data-[swipe-direction=up]:after:bottom-full",
  "[--drawer-content-height:var(--drawer-height,auto)] data-[swipe-axis=x]:[--drawer-content-width:75%] data-[swipe-axis=y]:[--drawer-content-max-height:calc(100dvh-4rem)] data-[swipe-axis=y]:data-snap-points:[--drawer-content-height:calc(100dvh-4rem)] data-[swipe-axis=x]:sm:[--drawer-content-width:24rem]",
  "[--bleed:3rem] [--peek:1rem] [--stack-offset:0px] [--stack-progress:clamp(0,var(--drawer-swipe-progress,0),1)] [--stack-scale:calc(1-0.02*max(0,var(--nested-drawers,0)-var(--stack-progress)))] [--stack-shrink:calc(1-var(--stack-scale))] [--stack-step:0.05]",
  "data-[stack]:[--stack-height:var(--drawer-frontmost-height,var(--drawer-height,0px))] data-[stack]:[--stack-peek-offset:max(0px,calc((var(--nested-drawers,0)-var(--stack-progress))*var(--peek)))] data-[stack]:[--stack-scale:clamp(0,calc(max(0,calc(1-var(--nested-drawers,0)*var(--stack-step)))+var(--stack-step)*var(--stack-progress)),1)] data-[stack]:data-nested-drawer-open:overflow-hidden data-[stack]:data-[swipe-axis=x]:[--stack-offset:calc(var(--stack-peek-offset)+var(--stack-shrink)*100%)] data-[stack]:data-[swipe-axis=y]:[--stack-offset:calc(var(--stack-peek-offset)+var(--stack-shrink)*var(--stack-height))] data-[stack]:data-nested-drawer-open:data-[swipe-axis=y]:h-(--stack-height)",
  "data-ending-style:transform-(--closed-transform) data-ending-style:duration-[calc(var(--drawer-swipe-strength,0.7)*300ms)] data-starting-style:transform-(--closed-transform) motion-reduce:transition-opacity motion-reduce:[--closed-transform:translate3d(var(--translate-x,0px),var(--translate-y,0px),0)] motion-reduce:data-ending-style:opacity-0 motion-reduce:data-starting-style:opacity-0 [&[data-nested-drawer-swiping]:not([data-ending-style])]:duration-0 [&[data-swiping]:not([data-ending-style])]:duration-0",
  "data-[swipe-axis=x]:inset-y-0 data-[swipe-axis=x]:flex-row data-[swipe-axis=y]:inset-x-0 data-[swipe-axis=x]:rtl:flex-row-reverse",
  "data-[swipe-direction=down]:bottom-0 data-[swipe-direction=down]:origin-bottom data-[swipe-direction=down]:rounded-t-2xl data-[swipe-direction=down]:pb-[env(safe-area-inset-bottom)] data-[swipe-direction=down]:[--closed-transform:translate3d(0,calc(100%+var(--drawer-inset,0px)+2px),0)] data-[swipe-direction=down]:[--translate-y:calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y,0px)-var(--stack-offset))] data-[swipe-direction=down]:data-snap-points:pb-[max(env(safe-area-inset-bottom),calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y,0px)))]",
  "data-[swipe-direction=up]:top-0 data-[swipe-direction=up]:origin-top data-[swipe-direction=up]:rounded-b-2xl data-[swipe-direction=up]:pt-[env(safe-area-inset-top)] data-[swipe-direction=up]:[--closed-transform:translate3d(0,calc(-100%-var(--drawer-inset,0px)-2px),0)] data-[swipe-direction=up]:[--translate-y:calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y,0px)+var(--stack-offset))]",
  "data-[swipe-direction=left]:left-0 data-[swipe-direction=left]:origin-left data-[swipe-direction=left]:rounded-r-2xl data-[swipe-direction=left]:pl-[env(safe-area-inset-left)] data-[swipe-direction=left]:[--closed-transform:translate3d(calc(-100%-var(--drawer-inset,0px)-2px),0,0)] data-[swipe-direction=left]:[--translate-x:calc(var(--drawer-swipe-movement-x,0px)+var(--stack-offset))]",
  "data-[swipe-direction=right]:right-0 data-[swipe-direction=right]:origin-right data-[swipe-direction=right]:rounded-l-2xl data-[swipe-direction=right]:pr-[env(safe-area-inset-right)] data-[swipe-direction=right]:[--closed-transform:translate3d(calc(100%+var(--drawer-inset,0px)+2px),0,0)] data-[swipe-direction=right]:[--translate-x:calc(var(--drawer-swipe-movement-x,0px)-var(--stack-offset))]"
)

function DrawerContent({
  className,
  children,
  ...props
}: DrawerPrimitive.Popup.Props) {
  const {
    modal,
    swipeDirection,
    showSwipeHandle,
    hasSnapPoints,
    stacked,
    registerWithParent,
  } = useDrawer("DrawerContent")
  const swipeAxis =
    swipeDirection === "down" || swipeDirection === "up" ? "y" : "x"

  return (
    <DrawerPortal>
      {modal === true ? <DrawerOverlay /> : null}
      <DrawerPrimitive.Viewport
        data-slot="drawer-viewport"
        data-modal={modal === true ? "" : undefined}
        className="pointer-events-none fixed inset-0 z-50 data-modal:pointer-events-auto"
      >
        <DrawerPrimitive.Popup
          data-slot="drawer-popup"
          data-swipe-axis={swipeAxis}
          data-snap-points={hasSnapPoints ? "" : undefined}
          data-stack={stacked ? "" : undefined}
          className={mergeClassName(drawerPopupClassName, className)}
          {...props}
        >
          {registerWithParent ? (
            <DrawerStackRegistration register={registerWithParent} />
          ) : null}
          {showSwipeHandle ? <DrawerSwipeHandle /> : null}
          <DrawerPrimitive.Content
            data-slot="drawer-content"
            className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overscroll-contain rounded-[inherit] transition-opacity duration-300 ease-out-cubic select-text group-data-swiping/drawer-popup:select-none [[data-stack][data-nested-drawer-open]:not([data-nested-drawer-swiping])>&]:opacity-0"
          >
            {children}
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Popup>
      </DrawerPrimitive.Viewport>
    </DrawerPortal>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        "flex shrink-0 flex-col gap-1.5 p-4 pb-0 text-start group-data-[swipe-axis=y]/drawer-popup:max-sm:text-center",
        className
      )}
      {...props}
    />
  )
}

function DrawerBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-body"
      className={cn(
        "min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain p-4 wrap-anywhere",
        className
      )}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn(
        "mt-auto flex shrink-0 flex-col gap-2 p-4 pt-0 max-sm:[&>*:not([data-slot=button-status])]:h-10",
        className
      )}
      {...props}
    />
  )
}

function DrawerTitle({ className, ...props }: DrawerPrimitive.Title.Props) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={mergeClassName(
        "min-w-0 text-lg leading-snug font-semibold text-pretty wrap-anywhere text-foreground",
        className
      )}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ...props
}: DrawerPrimitive.Description.Props) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={mergeClassName(
        "min-w-0 text-sm text-pretty wrap-anywhere text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

const createDrawerHandle = DrawerPrimitive.createHandle

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerSwipeHandle,
  DrawerTrigger,
  DrawerClose,
  DrawerVirtualKeyboardProvider,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  createDrawerHandle,
}
export type { DrawerSwipeDirection }
