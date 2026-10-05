"use client"

import * as React from "react"
import {
  DirectionProvider,
  useDirection,
  type TextDirection,
} from "@base-ui/react/direction-provider"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { cn } from "cn"

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

function Popover<Payload>({
  onOpenChange,
  children,
  ...props
}: PopoverPrimitive.Root.Props<Payload>) {
  const inherited = useDirection()
  const [triggerDirection, setTriggerDirection] =
    React.useState<TextDirection>()
  const direction = triggerDirection === "rtl" ? "rtl" : inherited

  return (
    <DirectionProvider direction={direction}>
      <PopoverPrimitive.Root
        onOpenChange={(open, eventDetails) => {
          onOpenChange?.(open, eventDetails)
          if (open && !eventDetails.isCanceled && eventDetails.trigger) {
            setTriggerDirection(readDirection(eventDetails.trigger))
          }
        }}
        {...props}
      >
        {children}
      </PopoverPrimitive.Root>
    </DirectionProvider>
  )
}

function PopoverTrigger<Payload>(
  props: PopoverPrimitive.Trigger.Props<Payload>
) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverPortal(props: PopoverPrimitive.Portal.Props) {
  return <PopoverPrimitive.Portal data-slot="popover-portal" {...props} />
}

const tracking = 80

function useAnimatedHeight() {
  return React.useCallback((sizer: HTMLDivElement | null) => {
    const popup = sizer?.parentElement
    if (!sizer || !popup || typeof ResizeObserver === "undefined") {
      return
    }
    const positioner = popup.parentElement
    if (positioner && !positioner.hasAttribute("dir")) {
      const trigger = popup.id
        ? popup.ownerDocument.querySelector(
            `[aria-controls="${CSS.escape(popup.id)}"]`
          )
        : null
      if (readDirection(trigger) === "rtl") {
        positioner.setAttribute("dir", "rtl")
      }
    }
    let last = 0
    let settle: ReturnType<typeof setTimeout> | undefined
    let sized: ReturnType<typeof setTimeout> | undefined
    const endSizing = (event?: TransitionEvent) => {
      if (
        event &&
        (event.target !== popup || event.propertyName !== "height")
      ) {
        return
      }
      clearTimeout(sized)
      delete popup.dataset.sizing
    }
    popup.addEventListener("transitionend", endSizing)
    popup.addEventListener("transitioncancel", endSizing)
    const observer = new ResizeObserver(([entry]) => {
      const now = performance.now()
      const continuous = now - last < tracking
      if (continuous) {
        popup.dataset.resizing = ""
      }
      last = now
      clearTimeout(settle)
      settle = setTimeout(() => {
        delete popup.dataset.resizing
      }, tracking)
      if (popup.style.height && !continuous) {
        popup.dataset.sizing = ""
        clearTimeout(sized)
        sized = setTimeout(endSizing, 300)
      }
      const style = getComputedStyle(popup)
      const chrome =
        parseFloat(style.paddingTop) +
        parseFloat(style.paddingBottom) +
        parseFloat(style.borderTopWidth) +
        parseFloat(style.borderBottomWidth)
      const height =
        entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height
      popup.style.height = `${height + chrome}px`
    })
    observer.observe(sizer)
    return () => {
      observer.disconnect()
      clearTimeout(settle)
      clearTimeout(sized)
      popup.removeEventListener("transitionend", endSizing)
      popup.removeEventListener("transitioncancel", endSizing)
      delete popup.dataset.resizing
      delete popup.dataset.sizing
      popup.style.height = ""
    }
  }, [])
}

type PopoverContentProps = PopoverPrimitive.Popup.Props &
  Pick<
    PopoverPrimitive.Positioner.Props,
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
  > & {
    portalProps?: Omit<PopoverPrimitive.Portal.Props, "children">
  }

function PopoverContent({
  className,
  children,
  side = "bottom",
  align = "center",
  sideOffset = 6,
  alignOffset = 0,
  anchor,
  collisionPadding = 8,
  collisionAvoidance,
  collisionBoundary,
  sticky,
  positionMethod,
  portalProps,
  ...props
}: PopoverContentProps) {
  const sizerRef = useAnimatedHeight()
  const direction = useDirection()

  return (
    <PopoverPrimitive.Portal {...portalProps}>
      <PopoverPrimitive.Positioner
        data-slot="popover-positioner"
        dir={direction === "rtl" ? "rtl" : undefined}
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        anchor={anchor}
        collisionPadding={collisionPadding}
        collisionAvoidance={collisionAvoidance}
        collisionBoundary={collisionBoundary}
        sticky={sticky}
        positionMethod={positionMethod}
        className="isolate z-50 outline-none focus-visible:outline-hidden"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={mergeClassName(
            "relative flex max-h-(--available-height) w-72 max-w-(--available-width) origin-(--transform-origin) flex-col gap-2.5 overflow-x-hidden overflow-y-auto overscroll-none rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-(length:--hairline) ring-foreground/10 transition-[opacity,scale,height] duration-150 ease-out-quint outline-none focus-visible:outline-hidden data-ending-style:opacity-0 data-ending-style:duration-100 data-ending-style:data-instant:transition-none data-starting-style:opacity-0 data-[resizing]:transition-[opacity,scale] data-[sizing]:overflow-y-hidden motion-safe:data-ending-style:scale-96 motion-safe:data-starting-style:scale-96 motion-reduce:transition-opacity forced-colors:border",
            className
          )}
          {...props}
        >
          <div
            ref={sizerRef}
            data-slot="popover-content-sizer"
            className="flex min-w-0 shrink-0 flex-col gap-[inherit]"
          >
            {children}
          </div>
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex min-w-0 flex-col gap-0.5 text-sm", className)}
      {...props}
    />
  )
}

function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      className={mergeClassName(
        "text-sm font-medium text-pretty wrap-anywhere",
        className
      )}
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  ...props
}: PopoverPrimitive.Description.Props) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={mergeClassName(
        "text-sm text-pretty wrap-anywhere text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function PopoverClose(props: PopoverPrimitive.Close.Props) {
  return <PopoverPrimitive.Close data-slot="popover-close" {...props} />
}

const createPopoverHandle = PopoverPrimitive.createHandle

export {
  Popover,
  PopoverTrigger,
  PopoverPortal,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  PopoverClose,
  createPopoverHandle,
}
export type { PopoverContentProps }
