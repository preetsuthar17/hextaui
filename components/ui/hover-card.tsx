"use client"

import * as React from "react"
import {
  DirectionProvider,
  useDirection,
  type TextDirection,
} from "@base-ui/react/direction-provider"
import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card"
import { cn } from "cn"

import { useSizeMorph } from "@/lib/motion"

type ClassName<State> =
  string | ((state: State) => string | undefined) | undefined

function mergeClassName<State>(base: string, className: ClassName<State>) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

function readDirection(element: Element | null | undefined) {
  if (!element || !element.isConnected) {
    return undefined
  }
  return getComputedStyle(element).direction === "rtl" ? "rtl" : "ltr"
}

function HoverCard<Payload>({
  onOpenChange,
  children,
  ...props
}: PreviewCardPrimitive.Root.Props<Payload>) {
  const inherited = useDirection()
  const [triggerDirection, setTriggerDirection] =
    React.useState<TextDirection>()
  const direction = triggerDirection === "rtl" ? "rtl" : inherited

  return (
    <DirectionProvider direction={direction}>
      <PreviewCardPrimitive.Root
        onOpenChange={(open, eventDetails) => {
          onOpenChange?.(open, eventDetails)
          if (open && !eventDetails.isCanceled && eventDetails.trigger) {
            setTriggerDirection(readDirection(eventDetails.trigger))
          }
        }}
        {...props}
      >
        {children}
      </PreviewCardPrimitive.Root>
    </DirectionProvider>
  )
}

function HoverCardTrigger<Payload>(
  props: PreviewCardPrimitive.Trigger.Props<Payload>
) {
  return (
    <PreviewCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  )
}

function HoverCardPortal(props: PreviewCardPrimitive.Portal.Props) {
  return (
    <PreviewCardPrimitive.Portal data-slot="hover-card-portal" {...props} />
  )
}

type HoverCardContentProps = PreviewCardPrimitive.Popup.Props &
  Pick<
    PreviewCardPrimitive.Positioner.Props,
    | "side"
    | "align"
    | "sideOffset"
    | "alignOffset"
    | "anchor"
    | "collisionPadding"
    | "collisionAvoidance"
    | "collisionBoundary"
    | "sticky"
    | "positionMethod"
    | "disableAnchorTracking"
  > & {
    portalProps?: Omit<PreviewCardPrimitive.Portal.Props, "children">
    arrow?: boolean
  }

type HoverCardSide = NonNullable<HoverCardContentProps["side"]>

function SideLock({
  onSide,
}: {
  onSide: (side: HoverCardSide | null) => void
}) {
  const ref = React.useRef<HTMLSpanElement>(null)

  React.useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      const side = ref.current
        ?.closest("[data-slot=hover-card-positioner]")
        ?.getAttribute("data-side")
      if (side) onSide(side as HoverCardSide)
    })
    return () => {
      cancelAnimationFrame(frame)
      onSide(null)
    }
  }, [onSide])

  return <span ref={ref} hidden />
}

function HoverCardContent({
  className,
  children,
  side = "bottom",
  align = "center",
  arrow = false,
  sideOffset = arrow ? 10 : 6,
  alignOffset = 0,
  anchor,
  collisionPadding = 8,
  collisionAvoidance,
  collisionBoundary,
  sticky,
  positionMethod,
  disableAnchorTracking,
  portalProps,
  ...props
}: HoverCardContentProps) {
  const direction = useDirection()
  const [lockedSide, setLockedSide] = React.useState<HoverCardSide | null>(null)

  return (
    <PreviewCardPrimitive.Portal {...portalProps}>
      <PreviewCardPrimitive.Positioner
        data-slot="hover-card-positioner"
        dir={direction === "rtl" ? "rtl" : undefined}
        side={lockedSide ?? side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        anchor={anchor}
        collisionPadding={collisionPadding}
        collisionAvoidance={
          lockedSide
            ? { ...collisionAvoidance, side: "none" }
            : collisionAvoidance
        }
        collisionBoundary={collisionBoundary}
        sticky={sticky}
        positionMethod={positionMethod}
        disableAnchorTracking={disableAnchorTracking}
        className="isolate z-50 outline-none focus-visible:outline-hidden data-instant:transition-none motion-safe:transition-[top,left,right,bottom] motion-safe:duration-200 motion-safe:ease-out-quint"
      >
        <PreviewCardPrimitive.Popup
          data-slot="hover-card-content"
          className={mergeClassName(
            "relative flex h-(--popup-height,auto) max-h-(--available-height) w-64 max-w-(--available-width) origin-(--transform-origin) flex-col gap-2.5 overflow-x-hidden overflow-y-auto overscroll-none rounded-lg bg-popover p-3 text-sm wrap-anywhere text-popover-foreground shadow-md/5 ring-(length:--hairline) ring-foreground/10 transition-[opacity,scale,translate,width,height] duration-250 ease-spring outline-none focus-visible:outline-hidden data-ending-style:opacity-0 data-ending-style:duration-150 data-ending-style:ease-out-quint data-ending-style:data-instant:transition-none data-starting-style:opacity-0 motion-safe:data-ending-style:scale-97 motion-safe:data-starting-style:scale-95 motion-safe:data-[side=bottom]:data-starting-style:-translate-y-1 motion-safe:data-[side=inline-end]:data-starting-style:-translate-x-1 motion-safe:data-[side=inline-start]:data-starting-style:translate-x-1 motion-safe:data-[side=left]:data-starting-style:translate-x-1 motion-safe:data-[side=right]:data-starting-style:-translate-x-1 motion-safe:data-[side=top]:data-starting-style:translate-y-1 motion-reduce:transition-opacity motion-safe:rtl:data-[side=inline-end]:data-starting-style:translate-x-1 motion-safe:rtl:data-[side=inline-start]:data-starting-style:-translate-x-1 forced-colors:border",
            className
          )}
          {...props}
        >
          <HoverCardViewport>{children}</HoverCardViewport>
        </PreviewCardPrimitive.Popup>
        {arrow && <HoverCardArrow />}
        <SideLock onSide={setLockedSide} />
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  )
}

const slide =
  "[&>[data-current]]:transition-[translate,opacity,filter] [&>[data-previous]]:transition-[translate,opacity,filter] [&>[data-current]]:duration-300 [&>[data-previous]]:duration-200 [&>[data-current]]:ease-out-quint [&>[data-previous]]:ease-out-quint [&>[data-current][data-starting-style]]:opacity-0 [&>[data-previous][data-ending-style]]:opacity-0 motion-safe:[&>[data-current][data-starting-style]]:blur-[2px] motion-safe:[&>[data-previous][data-ending-style]]:blur-[2px] motion-safe:data-[activation-direction~=right]:[&>[data-current][data-starting-style]]:translate-x-6 motion-safe:data-[activation-direction~=right]:[&>[data-previous][data-ending-style]]:-translate-x-6 motion-safe:data-[activation-direction~=left]:[&>[data-current][data-starting-style]]:-translate-x-6 motion-safe:data-[activation-direction~=left]:[&>[data-previous][data-ending-style]]:translate-x-6 motion-safe:data-[activation-direction~=down]:[&>[data-current][data-starting-style]]:translate-y-3 motion-safe:data-[activation-direction~=down]:[&>[data-previous][data-ending-style]]:-translate-y-3 motion-safe:data-[activation-direction~=up]:[&>[data-current][data-starting-style]]:-translate-y-3 motion-safe:data-[activation-direction~=up]:[&>[data-previous][data-ending-style]]:translate-y-3 motion-reduce:[&>*]:transition-opacity"

function HoverCardViewport({ children }: { children: React.ReactNode }) {
  const morphRef = useSizeMorph<HTMLDivElement>({
    axis: "height",
    duration: 250,
  })

  return (
    <PreviewCardPrimitive.Viewport
      data-slot="hover-card-viewport"
      className={cn(
        "relative flex min-h-0 flex-col gap-[inherit] [&>*]:flex [&>*]:flex-col [&>*]:gap-[inherit]",
        slide
      )}
    >
      <div
        ref={morphRef}
        data-slot="hover-card-body"
        className="flex min-w-0 flex-col gap-[inherit] data-morphing:overflow-clip"
      >
        {children}
      </div>
    </PreviewCardPrimitive.Viewport>
  )
}

function HoverCardArrow({
  className,
  ...props
}: PreviewCardPrimitive.Arrow.Props) {
  return (
    <PreviewCardPrimitive.Arrow
      data-slot="hover-card-arrow"
      className={mergeClassName(
        "z-10 h-1.5 w-3 overflow-clip transition-opacity duration-150 ease-out-quint before:absolute before:bottom-0 before:left-1/2 before:size-[calc(var(--spacing)*1.5*sqrt(2))] before:-translate-x-1/2 before:translate-y-1/2 before:rotate-45 before:bg-popover before:ring-(length:--hairline) before:ring-foreground/10 data-[side=bottom]:-top-1.5 data-[side=inline-end]:-left-[9px] data-[side=inline-end]:-rotate-90 data-[side=inline-start]:-right-[9px] data-[side=inline-start]:rotate-90 data-[side=left]:-right-[9px] data-[side=left]:rotate-90 data-[side=right]:-left-[9px] data-[side=right]:-rotate-90 data-[side=top]:-bottom-1.5 data-[side=top]:rotate-180 motion-safe:animate-in motion-safe:fade-in-0 rtl:data-[side=inline-end]:right-[-9px] rtl:data-[side=inline-end]:left-auto rtl:data-[side=inline-end]:rotate-90 rtl:data-[side=inline-start]:right-auto rtl:data-[side=inline-start]:left-[-9px] rtl:data-[side=inline-start]:-rotate-90 data-closed:opacity-0",
        className
      )}
      {...props}
    />
  )
}

const createHoverCardHandle = PreviewCardPrimitive.createHandle

export {
  HoverCard,
  HoverCardTrigger,
  HoverCardPortal,
  HoverCardContent,
  HoverCardArrow,
  createHoverCardHandle,
}
export type { HoverCardContentProps }
