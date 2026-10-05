"use client"

import * as React from "react"
import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu"
import {
  DirectionProvider,
  useDirection,
  type TextDirection,
} from "@base-ui/react/direction-provider"
import {
  IconCheck,
  IconChevronRight,
  IconCircleFilled,
} from "@tabler/icons-react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

type ClassName<State> =
  string | ((state: State) => string | undefined) | undefined

function mergeClassName<State>(base: string, className: ClassName<State>) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

type ContextMenuContextValue = {
  disabled: boolean
  direction: TextDirection
  chosen: string | null
  choose: (id: string) => void
  readDirection: (node: Element) => void
}

const ContextMenuContext = React.createContext<ContextMenuContextValue | null>(
  null
)

const ContextMenuGroupContext = React.createContext(false)

function useContextMenuContext(part: string) {
  const context = React.useContext(ContextMenuContext)
  if (!context) {
    throw new Error(`${part} must be used within <ContextMenu>.`)
  }
  return context
}

const holdDelay = 120
const holdMoveThreshold = 10

function ContextMenu({
  disabled = false,
  onOpenChange,
  onOpenChangeComplete,
  children,
  ...props
}: ContextMenuPrimitive.Root.Props) {
  const inherited = useDirection()
  const [domDirection, setDomDirection] = React.useState<TextDirection>("ltr")
  const [chosen, setChosen] = React.useState<string | null>(null)
  const direction = domDirection === "rtl" ? "rtl" : inherited

  const readDirection = React.useCallback((node: Element) => {
    if (node.isConnected) {
      setDomDirection(
        getComputedStyle(node).direction === "rtl" ? "rtl" : "ltr"
      )
    }
  }, [])

  const context = React.useMemo(
    () => ({
      disabled,
      direction,
      chosen,
      choose: setChosen,
      readDirection,
    }),
    [disabled, direction, chosen, readDirection]
  )

  return (
    <ContextMenuContext.Provider value={context}>
      <DirectionProvider direction={direction}>
        <ContextMenuPrimitive.Root
          disabled={disabled}
          onOpenChange={(open, eventDetails) => {
            onOpenChange?.(open, eventDetails)
            if (open && !eventDetails.isCanceled) {
              setChosen(null)
            }
          }}
          onOpenChangeComplete={(open) => {
            onOpenChangeComplete?.(open)
            if (!open) {
              setChosen(null)
            }
          }}
          {...props}
        >
          {children}
        </ContextMenuPrimitive.Root>
      </DirectionProvider>
    </ContextMenuContext.Provider>
  )
}

type ContextMenuTriggerProps = ContextMenuPrimitive.Trigger.Props & {
  holdFeedback?: boolean
}

function ContextMenuTrigger({
  className,
  holdFeedback = true,
  onContextMenu,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onTouchCancel,
  ref,
  ...props
}: ContextMenuTriggerProps) {
  const { disabled, readDirection } =
    useContextMenuContext("ContextMenuTrigger")
  const [holding, setHolding] = React.useState(false)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  )
  const originRef = React.useRef<{ x: number; y: number } | null>(null)

  const release = React.useCallback(() => {
    clearTimeout(timerRef.current)
    originRef.current = null
    setHolding(false)
  }, [])

  React.useEffect(() => () => clearTimeout(timerRef.current), [])

  const setRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        readDirection(node)
      }
      if (typeof ref === "function") {
        return ref(node)
      }
      if (ref) {
        ref.current = node
      }
    },
    [ref, readDirection]
  )

  return (
    <ContextMenuPrimitive.Trigger
      ref={setRef}
      data-slot="context-menu-trigger"
      data-holding={holding ? "" : undefined}
      className={mergeClassName(
        "transition-[scale,box-shadow] duration-300 ease-spring outline-none select-none focus-visible:outline-hidden data-popup-open:inset-ring-3 data-popup-open:inset-ring-ring/50 motion-safe:data-holding:not-data-popup-open:scale-98 motion-safe:data-holding:not-data-popup-open:duration-[380ms] motion-safe:data-holding:not-data-popup-open:ease-out-cubic motion-reduce:transition-shadow",
        className
      )}
      onContextMenu={(event) => {
        onContextMenu?.(event)
        readDirection(event.currentTarget)
      }}
      onTouchStart={(event) => {
        onTouchStart?.(event)
        release()
        if (
          !holdFeedback ||
          disabled ||
          event.defaultPrevented ||
          event.touches.length !== 1
        ) {
          return
        }
        readDirection(event.currentTarget)
        const touch = event.touches[0]
        originRef.current = { x: touch.clientX, y: touch.clientY }
        timerRef.current = setTimeout(() => setHolding(true), holdDelay)
      }}
      onTouchMove={(event) => {
        onTouchMove?.(event)
        const origin = originRef.current
        const touch = event.touches[0]
        if (
          origin &&
          (event.touches.length !== 1 ||
            Math.abs(touch.clientX - origin.x) > holdMoveThreshold ||
            Math.abs(touch.clientY - origin.y) > holdMoveThreshold)
        ) {
          release()
        }
      }}
      onTouchEnd={(event) => {
        onTouchEnd?.(event)
        release()
      }}
      onTouchCancel={(event) => {
        onTouchCancel?.(event)
        release()
      }}
      {...props}
    />
  )
}

function ContextMenuPortal(props: ContextMenuPrimitive.Portal.Props) {
  return (
    <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
  )
}

type ContextMenuContentProps = ContextMenuPrimitive.Popup.Props &
  Pick<
    ContextMenuPrimitive.Positioner.Props,
    | "side"
    | "align"
    | "sideOffset"
    | "alignOffset"
    | "anchor"
    | "collisionPadding"
    | "collisionAvoidance"
  >

const contextMenuContentClassName =
  "relative max-h-(--available-height) max-w-[min(var(--available-width),20rem)] min-w-40 origin-(--transform-origin) overflow-x-hidden overflow-y-auto overscroll-none rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-(length:--hairline) forced-colors:border ring-foreground/10 transition-[opacity,scale] duration-150 ease-out-quint outline-none focus-visible:outline-hidden [--context-menu-item-radius:max(calc(var(--radius-sm)*0.5),calc(var(--radius-lg)-0.25rem))] data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:data-instant:transition-none motion-safe:data-starting-style:scale-96 motion-safe:data-[chosen]:data-ending-style:delay-120 motion-reduce:transition-opacity"

function useContentPositioning(part: string) {
  const { direction, chosen } = useContextMenuContext(part)
  return {
    dir: direction === "rtl" ? "rtl" : undefined,
    chosen: chosen === null ? undefined : "",
  }
}

function ContextMenuContent({
  className,
  side,
  align,
  sideOffset,
  alignOffset,
  anchor,
  collisionPadding,
  collisionAvoidance,
  dir,
  ...props
}: ContextMenuContentProps) {
  const positioning = useContentPositioning("ContextMenuContent")

  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Positioner
        data-slot="context-menu-positioner"
        dir={positioning.dir}
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        anchor={anchor}
        collisionPadding={collisionPadding}
        collisionAvoidance={collisionAvoidance}
        className="isolate z-50 outline-none focus-visible:outline-hidden"
      >
        <ContextMenuPrimitive.Popup
          data-slot="context-menu-content"
          data-chosen={positioning.chosen}
          dir={dir}
          className={mergeClassName(contextMenuContentClassName, className)}
          {...props}
        />
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  )
}

function ContextMenuGroup(props: ContextMenuPrimitive.Group.Props) {
  return (
    <ContextMenuGroupContext.Provider value>
      <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
    </ContextMenuGroupContext.Provider>
  )
}

type ContextMenuLabelProps = ContextMenuPrimitive.GroupLabel.Props & {
  inset?: boolean
}

const contextMenuLabelClassName =
  "px-2 pt-2 pb-1 text-xs font-medium text-muted-foreground wrap-anywhere data-inset:ps-8"

function ContextMenuStandaloneLabel({
  className,
  render,
  ...props
}: ContextMenuPrimitive.GroupLabel.Props) {
  const resolved = mergeClassName(contextMenuLabelClassName, className)

  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      {
        className: typeof resolved === "function" ? resolved({}) : resolved,
      },
      props as React.ComponentProps<"div">
    ),
  })
}

function ContextMenuLabel({ inset, ...props }: ContextMenuLabelProps) {
  const inGroup = React.useContext(ContextMenuGroupContext)
  const Label = inGroup
    ? ContextMenuPrimitive.GroupLabel
    : ContextMenuStandaloneLabel

  return (
    <Label
      data-slot="context-menu-label"
      data-inset={inset ? "" : undefined}
      {...props}
      className={
        inGroup
          ? mergeClassName(contextMenuLabelClassName, props.className)
          : props.className
      }
    />
  )
}

const contextMenuItemVariants = cva(
  "relative flex min-h-8 w-full min-w-0 cursor-default items-center gap-2 rounded-(--context-menu-item-radius) px-2 py-1.5 text-start text-sm wrap-anywhere outline-none select-none focus-visible:outline-hidden data-highlighted:bg-accent data-highlighted:text-accent-foreground data-inset:ps-8 motion-safe:data-[chosen]:animate-menu-blink forced-colors:data-highlighted:outline-2 forced-colors:data-highlighted:-outline-offset-2 forced-colors:data-highlighted:outline-solid pointer-coarse:min-h-11 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-highlighted:[&_svg:not([class*='text-'])]:text-accent-foreground",
  {
    variants: {
      variant: {
        default: "",
        destructive:
          "text-destructive [--menu-blink:color-mix(in_oklab,var(--color-destructive)_10%,transparent)] data-highlighted:bg-destructive/10 data-highlighted:text-destructive dark:[--menu-blink:color-mix(in_oklab,var(--color-destructive)_20%,transparent)] dark:data-highlighted:bg-destructive/20 forced-colors:data-highlighted:outline-2 forced-colors:data-highlighted:-outline-offset-2 forced-colors:data-highlighted:outline-solid [&_svg:not([class*='text-'])]:text-destructive data-highlighted:[&_svg:not([class*='text-'])]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type ChoosableEvent = React.MouseEvent<HTMLElement> & {
  baseUIHandlerPrevented?: boolean
}

function useChooseOnClick<E extends ChoosableEvent>(
  closeOnClick: boolean,
  onClick: ((event: E) => void) | undefined
) {
  const context = React.useContext(ContextMenuContext)
  const id = React.useId()

  return {
    chosen: context?.chosen === id ? "" : undefined,
    onClick: (event: E) => {
      onClick?.(event)
      if (
        context &&
        closeOnClick &&
        event.detail !== 0 &&
        !event.defaultPrevented &&
        !event.baseUIHandlerPrevented
      ) {
        context.choose(id)
      }
    },
  }
}

type ContextMenuItemProps = ContextMenuPrimitive.Item.Props &
  VariantProps<typeof contextMenuItemVariants> & {
    inset?: boolean
  }

function ContextMenuItem({
  className,
  variant = "default",
  inset,
  closeOnClick = true,
  onClick,
  ...props
}: ContextMenuItemProps) {
  const choice = useChooseOnClick(closeOnClick, onClick)

  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-variant={variant}
      data-inset={inset ? "" : undefined}
      data-chosen={choice.chosen}
      closeOnClick={closeOnClick}
      onClick={choice.onClick}
      className={mergeClassName(
        contextMenuItemVariants({ variant }),
        className
      )}
      {...props}
    />
  )
}

const contextMenuIndicatorClassName =
  "flex items-center justify-center opacity-0 transition-[opacity,scale] duration-150 ease-out-quint data-checked:opacity-100 motion-safe:scale-50 motion-safe:data-checked:scale-100 motion-reduce:transition-none"

type ContextMenuCheckboxItemProps = ContextMenuPrimitive.CheckboxItem.Props & {
  inset?: boolean
}

function ContextMenuCheckboxItem({
  className,
  children,
  inset,
  closeOnClick = false,
  onClick,
  ...props
}: ContextMenuCheckboxItemProps) {
  const choice = useChooseOnClick(closeOnClick, onClick)

  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      data-inset={inset ? "" : undefined}
      data-chosen={choice.chosen}
      closeOnClick={closeOnClick}
      onClick={choice.onClick}
      className={mergeClassName(
        cn(contextMenuItemVariants(), "ps-8"),
        className
      )}
      {...props}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute start-2 flex size-4 items-center justify-center"
      >
        <ContextMenuPrimitive.CheckboxItemIndicator
          keepMounted
          data-slot="context-menu-checkbox-item-indicator"
          className={contextMenuIndicatorClassName}
        >
          <IconCheck className="text-current" />
        </ContextMenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  )
}

function ContextMenuRadioGroup(props: ContextMenuPrimitive.RadioGroup.Props) {
  return (
    <ContextMenuGroupContext.Provider value>
      <ContextMenuPrimitive.RadioGroup
        data-slot="context-menu-radio-group"
        {...props}
      />
    </ContextMenuGroupContext.Provider>
  )
}

type ContextMenuRadioItemProps = ContextMenuPrimitive.RadioItem.Props & {
  inset?: boolean
}

function ContextMenuRadioItem({
  className,
  children,
  inset,
  closeOnClick = false,
  onClick,
  ...props
}: ContextMenuRadioItemProps) {
  const choice = useChooseOnClick(closeOnClick, onClick)

  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      data-inset={inset ? "" : undefined}
      data-chosen={choice.chosen}
      closeOnClick={closeOnClick}
      onClick={choice.onClick}
      className={mergeClassName(
        cn(contextMenuItemVariants(), "ps-8"),
        className
      )}
      {...props}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute start-2 flex size-4 items-center justify-center"
      >
        <ContextMenuPrimitive.RadioItemIndicator
          keepMounted
          data-slot="context-menu-radio-item-indicator"
          className={contextMenuIndicatorClassName}
        >
          <IconCircleFilled className="size-2 text-current" />
        </ContextMenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  )
}

function ContextMenuSeparator({
  className,
  ...props
}: ContextMenuPrimitive.Separator.Props) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={mergeClassName("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function ContextMenuShortcut({
  className,
  dir = "ltr",
  children,
  ...props
}: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="context-menu-shortcut"
      className={cn(
        "ms-auto shrink-0 ps-3 font-sans text-xs tracking-widest text-muted-foreground in-data-highlighted:text-accent-foreground/70 in-data-[variant=destructive]:text-destructive/70",
        className
      )}
      {...props}
    >
      <span dir={dir} className="[unicode-bidi:isolate]">
        {children}
      </span>
    </kbd>
  )
}

function ContextMenuSub(props: ContextMenuPrimitive.SubmenuRoot.Props) {
  return <ContextMenuPrimitive.SubmenuRoot {...props} />
}

type ContextMenuSubTriggerProps = ContextMenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean
}

function ContextMenuSubTrigger({
  className,
  children,
  inset,
  ...props
}: ContextMenuSubTriggerProps) {
  return (
    <ContextMenuPrimitive.SubmenuTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset ? "" : undefined}
      className={mergeClassName(
        cn(
          contextMenuItemVariants(),
          "data-popup-open:bg-accent data-popup-open:text-accent-foreground forced-colors:data-popup-open:outline-2 forced-colors:data-popup-open:-outline-offset-2 forced-colors:data-popup-open:outline-solid"
        ),
        className
      )}
      {...props}
    >
      {children}
      <IconChevronRight
        aria-hidden
        data-slot="context-menu-sub-trigger-icon"
        className="ms-auto rtl:-scale-x-100"
      />
    </ContextMenuPrimitive.SubmenuTrigger>
  )
}

function ContextMenuSubContent({
  className,
  side,
  align,
  sideOffset = 0,
  alignOffset = -4,
  anchor,
  collisionPadding,
  collisionAvoidance,
  dir,
  ...props
}: ContextMenuContentProps) {
  const positioning = useContentPositioning("ContextMenuSubContent")

  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Positioner
        data-slot="context-menu-sub-positioner"
        dir={positioning.dir}
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        anchor={anchor}
        collisionPadding={collisionPadding}
        collisionAvoidance={collisionAvoidance}
        className="isolate z-50 outline-none focus-visible:outline-hidden"
      >
        <ContextMenuPrimitive.Popup
          data-slot="context-menu-sub-content"
          data-chosen={positioning.chosen}
          dir={dir}
          className={mergeClassName(contextMenuContentClassName, className)}
          {...props}
        />
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  )
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuPortal,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  contextMenuItemVariants,
}
export type {
  ContextMenuTriggerProps,
  ContextMenuContentProps,
  ContextMenuLabelProps,
  ContextMenuItemProps,
  ContextMenuCheckboxItemProps,
  ContextMenuRadioItemProps,
  ContextMenuSubTriggerProps,
}
