"use client"

import * as React from "react"
import {
  DirectionProvider,
  useDirection,
  type TextDirection,
} from "@base-ui/react/direction-provider"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"
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

const TooltipProviderContext = React.createContext(false)

const TooltipGroupContext =
  React.createContext<TooltipPrimitive.Handle<React.ReactNode> | null>(null)

const TooltipTriggerContext =
  React.createContext<React.RefObject<Element | null> | null>(null)

function TooltipProvider({
  delay = 300,
  closeDelay = 0,
  timeout = 400,
  ...props
}: TooltipPrimitive.Provider.Props) {
  return (
    <TooltipProviderContext.Provider value={true}>
      <TooltipPrimitive.Provider
        delay={delay}
        closeDelay={closeDelay}
        timeout={timeout}
        {...props}
      />
    </TooltipProviderContext.Provider>
  )
}

function Tooltip<Payload>({
  onOpenChange,
  children,
  ...props
}: TooltipPrimitive.Root.Props<Payload>) {
  const hasProvider = React.useContext(TooltipProviderContext)
  const inherited = useDirection()
  const triggerRef = React.useRef<Element | null>(null)
  const [triggerDirection, setTriggerDirection] =
    React.useState<TextDirection>()
  const direction = triggerDirection === "rtl" ? "rtl" : inherited

  const root = (
    <TooltipTriggerContext.Provider value={triggerRef}>
      <DirectionProvider direction={direction}>
        <TooltipPrimitive.Root
          onOpenChange={(open, eventDetails) => {
            onOpenChange?.(open, eventDetails)
            if (open && !eventDetails.isCanceled && eventDetails.trigger) {
              triggerRef.current = eventDetails.trigger
              setTriggerDirection(readDirection(eventDetails.trigger))
            }
          }}
          {...props}
        >
          {children}
        </TooltipPrimitive.Root>
      </DirectionProvider>
    </TooltipTriggerContext.Provider>
  )

  return hasProvider ? root : <TooltipProvider>{root}</TooltipProvider>
}

type TooltipTriggerProps<Payload> = Omit<
  TooltipPrimitive.Trigger.Props<Payload>,
  "content"
> & {
  content?: React.ReactNode
}

function TooltipTrigger<Payload>({
  ref,
  render,
  type,
  delay,
  handle,
  payload,
  content,
  ...props
}: TooltipTriggerProps<Payload>) {
  const hasProvider = React.useContext(TooltipProviderContext)
  const triggerRef = React.useContext(TooltipTriggerContext)
  const groupHandle = React.useContext(TooltipGroupContext)
  const grouped = handle === undefined && groupHandle !== null
  const setRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      if (triggerRef && node) {
        triggerRef.current ??= node
      }
      if (typeof ref === "function") {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    },
    [ref, triggerRef]
  )

  return (
    <TooltipPrimitive.Trigger
      ref={setRef}
      data-slot="tooltip-trigger"
      render={render}
      delay={delay ?? (hasProvider ? undefined : 300)}
      type={type ?? (render === undefined ? "button" : undefined)}
      handle={
        grouped
          ? (groupHandle as unknown as TooltipPrimitive.Handle<Payload>)
          : handle
      }
      payload={grouped ? (content as Payload) : payload}
      {...props}
    />
  )
}

function TooltipPortal(props: TooltipPrimitive.Portal.Props) {
  return <TooltipPrimitive.Portal data-slot="tooltip-portal" {...props} />
}

type TooltipContentProps = TooltipPrimitive.Popup.Props &
  Pick<
    TooltipPrimitive.Positioner.Props,
    | "side"
    | "align"
    | "sideOffset"
    | "alignOffset"
    | "anchor"
    | "arrowPadding"
    | "collisionPadding"
    | "collisionAvoidance"
    | "collisionBoundary"
    | "sticky"
    | "positionMethod"
    | "disableAnchorTracking"
  > & {
    portalProps?: Omit<TooltipPrimitive.Portal.Props, "children">
    arrow?: boolean
  }

function TooltipContent({
  className,
  children,
  side = "top",
  align = "center",
  arrow = false,
  sideOffset = arrow ? 8 : 6,
  alignOffset = 0,
  anchor,
  arrowPadding = 8,
  collisionPadding = 8,
  collisionAvoidance,
  collisionBoundary,
  sticky,
  positionMethod,
  disableAnchorTracking,
  portalProps,
  dir,
  ...props
}: TooltipContentProps) {
  const direction = useDirection()
  const triggerRef = React.useContext(TooltipTriggerContext)
  const setPositioner = React.useCallback(
    (positioner: HTMLDivElement | null) => {
      if (!positioner || dir !== undefined || direction === "rtl") {
        return
      }
      if (readDirection(triggerRef?.current) === "rtl") {
        positioner.setAttribute("dir", "rtl")
      }
    },
    [dir, direction, triggerRef]
  )

  return (
    <TooltipPrimitive.Portal {...portalProps}>
      <TooltipPrimitive.Positioner
        ref={setPositioner}
        data-slot="tooltip-positioner"
        dir={dir ?? (direction === "rtl" ? "rtl" : undefined)}
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        anchor={anchor}
        arrowPadding={arrowPadding}
        collisionPadding={collisionPadding}
        collisionAvoidance={collisionAvoidance}
        collisionBoundary={collisionBoundary}
        sticky={sticky}
        positionMethod={positionMethod}
        disableAnchorTracking={disableAnchorTracking}
        className="isolate z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) outline-none focus-visible:outline-hidden has-data-transitioning:duration-250 has-data-transitioning:ease-out-quint data-instant:transition-none motion-safe:has-data-transitioning:transition-[top,left,right,bottom] motion-reduce:transition-none"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={mergeClassName(
            "relative h-(--popup-height,auto) w-(--popup-width,auto) max-w-[min(var(--container-2xs),var(--available-width))] origin-(--transform-origin) rounded-md bg-foreground text-xs/4 text-pretty wrap-anywhere text-background shadow-md/10 transition-[opacity,scale,width,height] duration-[150ms,150ms,250ms,250ms] ease-out-quint outline-none focus-visible:outline-hidden data-ending-style:opacity-0 data-ending-style:duration-100 data-instant:transition-none data-starting-style:opacity-0 motion-safe:data-starting-style:scale-96 motion-reduce:transition-opacity [&_[data-slot=kbd-separator]]:text-background/70 [&_kbd[data-slot=kbd][data-variant]]:rounded-[max(calc(var(--radius-sm)*0.5),calc(var(--radius-md)-0.25rem))] [&_kbd[data-slot=kbd][data-variant]]:bg-background/15 [&_kbd[data-slot=kbd][data-variant]]:text-background [&_kbd[data-slot=kbd][data-variant]]:shadow-none [&_kbd[data-slot=kbd][data-variant]]:inset-ring-background/20 [&_kbd[data-slot=kbd][data-variant]]:[direction:ltr]",
            className
          )}
          {...props}
        >
          <TooltipPrimitive.Viewport
            ref={freezeOutgoingWidth}
            data-slot="tooltip-viewport"
            className={viewport}
          >
            {children}
          </TooltipPrimitive.Viewport>
          {arrow && <TooltipArrow />}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

const viewport =
  "relative size-full overflow-clip rounded-[inherit] [&>*]:flex [&>*]:items-center [&>*]:justify-between [&>*]:gap-2 [&>*]:px-2 [&>*]:py-1 [&>*:has(>[data-slot=kbd-group])]:pe-1 [&>*:has(>[data-slot=kbd])]:pe-1 [&>[data-current]]:w-(--popup-width) [&>[data-previous]]:top-0 [&>[data-previous]]:start-0 [&>[data-current]]:transition-[translate,opacity,filter] [&>[data-previous]]:transition-[translate,opacity,filter] [&>[data-current]]:duration-250 [&>[data-previous]]:duration-150 [&>[data-current]]:ease-out-quint [&>[data-previous]]:ease-out-quint [&>[data-current][data-starting-style]]:opacity-0 [&>[data-previous][data-ending-style]]:opacity-0 motion-safe:[&>[data-current][data-starting-style]]:blur-[1px] motion-safe:[&>[data-previous][data-ending-style]]:blur-[1px] motion-safe:data-[activation-direction~=right]:[&>[data-current][data-starting-style]]:translate-x-4 motion-safe:data-[activation-direction~=right]:[&>[data-previous][data-ending-style]]:-translate-x-4 motion-safe:data-[activation-direction~=left]:[&>[data-current][data-starting-style]]:-translate-x-4 motion-safe:data-[activation-direction~=left]:[&>[data-previous][data-ending-style]]:translate-x-4 motion-safe:data-[activation-direction~=down]:[&>[data-current][data-starting-style]]:translate-y-2 motion-safe:data-[activation-direction~=down]:[&>[data-previous][data-ending-style]]:-translate-y-2 motion-safe:data-[activation-direction~=up]:[&>[data-current][data-starting-style]]:-translate-y-2 motion-safe:data-[activation-direction~=up]:[&>[data-previous][data-ending-style]]:translate-y-2 motion-reduce:[&>*]:transition-opacity data-instant:[&>*]:transition-none"

function freezeOutgoingWidth(viewport: HTMLDivElement | null) {
  if (!viewport || typeof MutationObserver === "undefined") {
    return
  }
  let currentWidth = 0
  const sizes =
    typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver((entries) => {
          for (const entry of entries) {
            if ((entry.target as HTMLElement).hasAttribute("data-current")) {
              currentWidth =
                entry.borderBoxSize?.[0]?.inlineSize ?? entry.contentRect.width
            }
          }
        })
  const sync = () => {
    for (const child of Array.from(viewport.children)) {
      const element = child as HTMLElement
      sizes?.observe(element)
      if (!element.hasAttribute("data-previous")) {
        element.style.removeProperty("width")
        delete element.dataset.frozen
        continue
      }
      const key = element.textContent ?? ""
      if (element.dataset.frozen !== key) {
        element.dataset.frozen = key
        const width = currentWidth || viewport.getBoundingClientRect().width
        element.style.width = `${width}px`
      }
    }
  }
  sync()
  const observer = new MutationObserver(sync)
  observer.observe(viewport, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["data-current", "data-previous"],
  })
  return () => {
    observer.disconnect()
    sizes?.disconnect()
  }
}

function TooltipArrow({ className, ...props }: TooltipPrimitive.Arrow.Props) {
  return (
    <TooltipPrimitive.Arrow
      data-slot="tooltip-arrow"
      className={mergeClassName(
        "h-1.5 w-3 overflow-clip transition-[left,top] duration-250 ease-out-quint before:absolute before:bottom-0 before:left-1/2 before:size-[calc(var(--spacing)*1.5*sqrt(2))] before:-translate-x-1/2 before:translate-y-1/2 before:rotate-45 before:rounded-[1px] before:bg-foreground data-instant:transition-none data-[side=bottom]:-top-1.5 data-[side=inline-end]:-left-[9px] data-[side=inline-end]:-rotate-90 data-[side=inline-start]:-right-[9px] data-[side=inline-start]:rotate-90 data-[side=left]:-right-[9px] data-[side=left]:rotate-90 data-[side=right]:-left-[9px] data-[side=right]:-rotate-90 data-[side=top]:-bottom-1.5 data-[side=top]:rotate-180 motion-reduce:transition-none rtl:data-[side=inline-end]:right-[-9px] rtl:data-[side=inline-end]:left-auto rtl:data-[side=inline-end]:rotate-90 rtl:data-[side=inline-start]:right-auto rtl:data-[side=inline-start]:left-[-9px] rtl:data-[side=inline-start]:-rotate-90",
        className
      )}
      {...props}
    />
  )
}

type TooltipGroupProps = TooltipPrimitive.Provider.Props &
  Omit<TooltipContentProps, "children"> & {
    children?: React.ReactNode
  }

function TooltipGroup({
  delay,
  closeDelay = 100,
  timeout,
  children,
  ...contentProps
}: TooltipGroupProps) {
  const [handle] = React.useState(() =>
    TooltipPrimitive.createHandle<React.ReactNode>()
  )

  return (
    <TooltipProvider delay={delay} closeDelay={closeDelay} timeout={timeout}>
      <TooltipGroupContext.Provider value={handle}>
        {children}
      </TooltipGroupContext.Provider>
      <Tooltip handle={handle}>
        {({ payload }) => (
          <TooltipContent {...contentProps}>
            {payload as React.ReactNode}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}

const createTooltipHandle = TooltipPrimitive.createHandle

export {
  TooltipProvider,
  Tooltip,
  TooltipGroup,
  TooltipTrigger,
  TooltipPortal,
  TooltipContent,
  TooltipArrow,
  createTooltipHandle,
}
export type { TooltipContentProps, TooltipGroupProps, TooltipTriggerProps }
