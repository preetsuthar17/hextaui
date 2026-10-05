"use client"

import * as React from "react"
import {
  DirectionProvider,
  useDirection,
  type TextDirection,
} from "@base-ui/react/direction-provider"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import {
  IconCheck,
  IconChevronRight,
  IconCircleFilled,
} from "@tabler/icons-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { SafeAreaOverlay } from "@/components/ui/safe-area"

type ClassName<State> =
  string | ((state: State) => string | undefined) | undefined

function mergeClassName<State>(base: string, className: ClassName<State>) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

type DropdownMenuContextValue = {
  direction: TextDirection
  chosen: string | null
  choose: (id: string) => void
}

const DropdownMenuContext =
  React.createContext<DropdownMenuContextValue | null>(null)

const DropdownMenuGroupContext = React.createContext(false)

function useDropdownMenuContext(part: string) {
  const context = React.useContext(DropdownMenuContext)
  if (!context) {
    throw new Error(`${part} must be used within <DropdownMenu>.`)
  }
  return context
}

function readDirection(element: Element | null | undefined) {
  if (!element || !element.isConnected) {
    return undefined
  }
  return getComputedStyle(element).direction === "rtl" ? "rtl" : "ltr"
}

function getSubmenuElements() {
  const triggers = document.querySelectorAll(
    "[data-slot=dropdown-menu-sub-trigger][data-popup-open]"
  )
  const reference = triggers[triggers.length - 1]
  const id = reference?.getAttribute("aria-controls")
  const floating = id ? document.getElementById(id) : null
  return reference && floating ? { reference, floating } : null
}

type DropdownMenuProps<Payload> = MenuPrimitive.Root.Props<Payload> & {
  showSafeArea?: boolean
}

function DropdownMenu<Payload>({
  onOpenChange,
  onOpenChangeComplete,
  showSafeArea = false,
  children,
  ...props
}: DropdownMenuProps<Payload>) {
  const [open, setOpen] = React.useState(false)
  const inherited = useDirection()
  const [triggerDirection, setTriggerDirection] =
    React.useState<TextDirection>()
  const [chosen, setChosen] = React.useState<string | null>(null)
  const direction = triggerDirection === "rtl" ? "rtl" : inherited

  const context = React.useMemo(
    () => ({ direction, chosen, choose: setChosen }),
    [direction, chosen]
  )

  return (
    <DropdownMenuContext.Provider value={context}>
      <DirectionProvider direction={direction}>
        <MenuPrimitive.Root
          onOpenChange={(open, eventDetails) => {
            onOpenChange?.(open, eventDetails)
            if (!eventDetails.isCanceled) {
              setOpen(open)
            }
            if (open && !eventDetails.isCanceled) {
              setChosen(null)
              if (eventDetails.trigger) {
                setTriggerDirection(readDirection(eventDetails.trigger))
              }
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
        </MenuPrimitive.Root>
        {showSafeArea && (props.open ?? open) ? (
          <SafeAreaOverlay getElements={getSubmenuElements} />
        ) : null}
      </DirectionProvider>
    </DropdownMenuContext.Provider>
  )
}

function DropdownMenuTrigger<Payload>(
  props: MenuPrimitive.Trigger.Props<Payload>
) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

function DropdownMenuPortal(props: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
}

type DropdownMenuContentProps = MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    | "side"
    | "align"
    | "sideOffset"
    | "alignOffset"
    | "anchor"
    | "collisionPadding"
    | "collisionAvoidance"
    | "sticky"
  > & {
    portalProps?: Omit<MenuPrimitive.Portal.Props, "children">
  }

const dropdownMenuContentClassName =
  "relative max-h-(--available-height) max-w-[min(var(--available-width),20rem)] min-w-40 origin-(--transform-origin) overflow-x-hidden overflow-y-auto overscroll-none rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-(length:--hairline) forced-colors:border ring-foreground/10 transition-[opacity,scale] duration-150 ease-out-quint outline-none focus-visible:outline-hidden [--dropdown-menu-item-radius:max(calc(var(--radius-sm)*0.5),calc(var(--radius-lg)-0.25rem))] data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:data-instant:transition-none motion-safe:data-starting-style:scale-96 motion-safe:data-[chosen]:data-ending-style:delay-120 motion-reduce:transition-opacity"

const SIDE_COLLISION_AVOIDANCE = { fallbackAxisSide: "end" } as const

function DropdownMenuPopup({
  slot,
  className,
  side,
  align,
  sideOffset,
  alignOffset,
  anchor,
  collisionPadding = 8,
  collisionAvoidance,
  sticky,
  portalProps,
  ...props
}: DropdownMenuContentProps & { slot: string }) {
  const { direction, chosen } = useDropdownMenuContext(
    slot === "dropdown-menu-content"
      ? "DropdownMenuContent"
      : "DropdownMenuSubContent"
  )

  return (
    <MenuPrimitive.Portal {...portalProps}>
      <MenuPrimitive.Positioner
        data-slot={slot.replace("content", "positioner")}
        dir={direction === "rtl" ? "rtl" : undefined}
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        anchor={anchor}
        collisionPadding={collisionPadding}
        collisionAvoidance={
          collisionAvoidance ??
          (side === "bottom" || side === "top"
            ? undefined
            : SIDE_COLLISION_AVOIDANCE)
        }
        sticky={sticky}
        className="isolate z-50 outline-none focus-visible:outline-hidden"
      >
        <MenuPrimitive.Popup
          data-slot={slot}
          data-chosen={chosen === null ? undefined : ""}
          className={mergeClassName(
            cn(
              dropdownMenuContentClassName,
              slot === "dropdown-menu-content" &&
                "min-w-[max(var(--anchor-width),10rem)]"
            ),
            className
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

function DropdownMenuContent({
  side = "bottom",
  align = "start",
  sideOffset = 4,
  alignOffset = 0,
  ...props
}: DropdownMenuContentProps) {
  return (
    <DropdownMenuPopup
      slot="dropdown-menu-content"
      side={side}
      align={align}
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      {...props}
    />
  )
}

function DropdownMenuGroup(props: MenuPrimitive.Group.Props) {
  return (
    <DropdownMenuGroupContext.Provider value>
      <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
    </DropdownMenuGroupContext.Provider>
  )
}

type DropdownMenuLabelProps = MenuPrimitive.GroupLabel.Props & {
  inset?: boolean
}

const dropdownMenuLabelClassName =
  "px-2 pt-2 pb-1 text-xs font-medium text-muted-foreground wrap-anywhere data-inset:ps-8"

function DropdownMenuStandaloneLabel({
  className,
  render,
  ...props
}: MenuPrimitive.GroupLabel.Props) {
  const resolved = mergeClassName(dropdownMenuLabelClassName, className)

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

function DropdownMenuLabel({ inset, ...props }: DropdownMenuLabelProps) {
  const inGroup = React.useContext(DropdownMenuGroupContext)
  const Label = inGroup ? MenuPrimitive.GroupLabel : DropdownMenuStandaloneLabel

  return (
    <Label
      data-slot="dropdown-menu-label"
      data-inset={inset ? "" : undefined}
      {...props}
      className={
        inGroup
          ? mergeClassName(dropdownMenuLabelClassName, props.className)
          : props.className
      }
    />
  )
}

const dropdownMenuItemVariants = cva(
  "relative flex min-h-8 w-full min-w-0 cursor-default items-center gap-2 rounded-(--dropdown-menu-item-radius) px-2 py-1.5 text-start text-sm wrap-anywhere outline-none select-none focus-visible:outline-hidden data-highlighted:bg-accent data-highlighted:text-accent-foreground data-inset:ps-8 motion-safe:data-[chosen]:animate-menu-blink forced-colors:data-highlighted:outline-2 forced-colors:data-highlighted:-outline-offset-2 forced-colors:data-highlighted:outline-solid pointer-coarse:min-h-11 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-highlighted:[&_svg:not([class*='text-'])]:text-accent-foreground",
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
  const context = React.useContext(DropdownMenuContext)
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

type DropdownMenuItemProps = MenuPrimitive.Item.Props &
  VariantProps<typeof dropdownMenuItemVariants> & {
    inset?: boolean
  }

function DropdownMenuItem({
  className,
  variant = "default",
  inset,
  closeOnClick = true,
  onClick,
  ...props
}: DropdownMenuItemProps) {
  const choice = useChooseOnClick(closeOnClick, onClick)

  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-variant={variant}
      data-inset={inset ? "" : undefined}
      data-chosen={choice.chosen}
      closeOnClick={closeOnClick}
      onClick={choice.onClick}
      className={mergeClassName(
        dropdownMenuItemVariants({ variant }),
        className
      )}
      {...props}
    />
  )
}

const dropdownMenuIndicatorClassName =
  "flex items-center justify-center opacity-0 transition-[opacity,scale] duration-150 ease-out-quint data-checked:opacity-100 motion-safe:scale-50 motion-safe:data-checked:scale-100 motion-reduce:transition-none"

type DropdownMenuCheckboxItemProps = MenuPrimitive.CheckboxItem.Props & {
  inset?: boolean
}

function DropdownMenuCheckboxItem({
  className,
  children,
  inset,
  closeOnClick = false,
  onClick,
  ...props
}: DropdownMenuCheckboxItemProps) {
  const choice = useChooseOnClick(closeOnClick, onClick)

  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset ? "" : undefined}
      data-chosen={choice.chosen}
      closeOnClick={closeOnClick}
      onClick={choice.onClick}
      className={mergeClassName(
        cn(dropdownMenuItemVariants(), "ps-8"),
        className
      )}
      {...props}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute start-2 flex size-4 items-center justify-center"
      >
        <MenuPrimitive.CheckboxItemIndicator
          keepMounted
          data-slot="dropdown-menu-checkbox-item-indicator"
          className={dropdownMenuIndicatorClassName}
        >
          <IconCheck className="text-current" />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup(props: MenuPrimitive.RadioGroup.Props) {
  return (
    <DropdownMenuGroupContext.Provider value>
      <MenuPrimitive.RadioGroup
        data-slot="dropdown-menu-radio-group"
        {...props}
      />
    </DropdownMenuGroupContext.Provider>
  )
}

type DropdownMenuRadioItemProps = MenuPrimitive.RadioItem.Props & {
  inset?: boolean
}

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  closeOnClick = false,
  onClick,
  ...props
}: DropdownMenuRadioItemProps) {
  const choice = useChooseOnClick(closeOnClick, onClick)

  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset ? "" : undefined}
      data-chosen={choice.chosen}
      closeOnClick={closeOnClick}
      onClick={choice.onClick}
      className={mergeClassName(
        cn(dropdownMenuItemVariants(), "ps-8"),
        className
      )}
      {...props}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute start-2 flex size-4 items-center justify-center"
      >
        <MenuPrimitive.RadioItemIndicator
          keepMounted
          data-slot="dropdown-menu-radio-item-indicator"
          className={dropdownMenuIndicatorClassName}
        >
          <IconCircleFilled className="size-2 text-current" />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={mergeClassName("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  dir = "ltr",
  children,
  ...props
}: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="dropdown-menu-shortcut"
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

function DropdownMenuSub(props: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot {...props} />
}

type DropdownMenuSubTriggerProps = MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean
}

function DropdownMenuSubTrigger({
  className,
  children,
  inset,
  ...props
}: DropdownMenuSubTriggerProps) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset ? "" : undefined}
      className={mergeClassName(
        cn(
          dropdownMenuItemVariants(),
          "data-popup-open:bg-accent data-popup-open:text-accent-foreground forced-colors:data-popup-open:outline-2 forced-colors:data-popup-open:-outline-offset-2 forced-colors:data-popup-open:outline-solid"
        ),
        className
      )}
      {...props}
    >
      {children}
      <IconChevronRight
        aria-hidden
        data-slot="dropdown-menu-sub-trigger-icon"
        className="ms-auto rtl:-scale-x-100"
      />
    </MenuPrimitive.SubmenuTrigger>
  )
}

function DropdownMenuSubContent({
  sideOffset = 0,
  alignOffset = -4,
  ...props
}: DropdownMenuContentProps) {
  return (
    <DropdownMenuPopup
      slot="dropdown-menu-sub-content"
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      {...props}
    />
  )
}

const createDropdownMenuHandle = MenuPrimitive.createHandle

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  createDropdownMenuHandle,
  dropdownMenuItemVariants,
}
export type {
  DropdownMenuProps,
  DropdownMenuContentProps,
  DropdownMenuLabelProps,
  DropdownMenuItemProps,
  DropdownMenuCheckboxItemProps,
  DropdownMenuRadioItemProps,
  DropdownMenuSubTriggerProps,
}
