"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { Menubar as MenubarPrimitive } from "@base-ui/react/menubar"
import { cn } from "cn"

import { useSlidingHighlight } from "@/lib/motion"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  type DropdownMenuCheckboxItemProps,
  type DropdownMenuContentProps,
  type DropdownMenuItemProps,
  type DropdownMenuLabelProps,
  type DropdownMenuRadioItemProps,
  type DropdownMenuSubTriggerProps,
} from "@/components/ui/dropdown-menu"

type ClassName<State> =
  string | ((state: State) => string | undefined) | undefined

function mergeClassName<State>(base: string, className: ClassName<State>) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

type MenubarProps = MenubarPrimitive.Props

function Menubar({ className, children, ref, ...props }: MenubarProps) {
  const barRef = React.useRef<HTMLDivElement | null>(null)
  const highlightRef = React.useRef<HTMLSpanElement | null>(null)
  useSlidingHighlight(
    barRef,
    highlightRef,
    "[data-slot=menubar-trigger][data-popup-open]"
  )

  const setRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      barRef.current = node
      if (typeof ref === "function") {
        return ref(node)
      }
      if (ref) {
        ref.current = node
      }
      return undefined
    },
    [ref]
  )

  return (
    <MenubarPrimitive
      ref={setRef}
      data-slot="menubar"
      className={mergeClassName(
        "group/menubar relative isolate flex h-9 w-fit max-w-full [scrollbar-width:none] items-center gap-0.5 overflow-x-auto overscroll-none rounded-lg bg-background p-1 ring-(length:--hairline) ring-border [--menubar-radius:var(--radius-lg)] [--menubar-trigger-radius:max(calc(var(--radius-sm)*0.5),calc(var(--menubar-radius)-0.25rem))] data-[orientation=vertical]:h-auto data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch forced-colors:border pointer-coarse:h-11",
        className
      )}
      {...props}
    >
      <span
        ref={highlightRef}
        aria-hidden="true"
        data-slot="menubar-highlight"
        className="pointer-events-none absolute top-0 -z-1 rounded-(--menubar-trigger-radius) bg-accent opacity-0 transition-[transform,width,height,opacity] duration-200 ease-out-quint data-instant:transition-opacity data-visible:opacity-100 motion-reduce:transition-opacity"
      />
      {children}
    </MenubarPrimitive>
  )
}

function MenubarMenu<Payload>(props: MenuPrimitive.Root.Props<Payload>) {
  return <DropdownMenu {...props} />
}

function MenubarTrigger<Payload>({
  className,
  children,
  ...props
}: MenuPrimitive.Trigger.Props<Payload>) {
  const iconOnly =
    React.Children.count(children) === 1 &&
    React.isValidElement(children) &&
    (typeof children.type !== "string" || children.type === "svg")

  return (
    <MenuPrimitive.Trigger
      data-slot="menubar-trigger"
      data-icon-only={iconOnly ? "" : undefined}
      className={mergeClassName(
        "flex h-7 shrink-0 items-center gap-1.5 rounded-(--menubar-trigger-radius) px-2.5 text-sm font-medium whitespace-nowrap outline-none select-none focus-visible:ring-3 focus-visible:inset-ring-(length:--hairline) focus-visible:ring-focus-ring focus-visible:inset-ring-ring focus-visible:outline-hidden not-data-icon-only:has-[>svg:first-child]:ps-2 data-icon-only:aspect-square data-icon-only:justify-center data-icon-only:px-0 data-popup-open:text-accent-foreground pointer-coarse:h-9 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&>svg:not([class*='text-'])]:text-muted-foreground data-popup-open:[&>svg:not([class*='text-'])]:text-accent-foreground [@media(hover:hover)]:group-not-data-has-submenu-open/menubar:hover:bg-muted/70",
        className
      )}
      {...props}
    >
      {children}
    </MenuPrimitive.Trigger>
  )
}

function MenubarContent({
  className,
  align = "start",
  sideOffset = 8,
  alignOffset = -4,
  ...props
}: DropdownMenuContentProps) {
  return (
    <DropdownMenuContent
      data-slot="menubar-content"
      align={align}
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      className={mergeClassName(
        "min-w-48 data-[instant=group]:transition-none",
        className
      )}
      {...props}
    />
  )
}

function MenubarPortal(props: MenuPrimitive.Portal.Props) {
  return <DropdownMenuPortal data-slot="menubar-portal" {...props} />
}

function MenubarGroup(props: MenuPrimitive.Group.Props) {
  return <DropdownMenuGroup data-slot="menubar-group" {...props} />
}

function MenubarLabel(props: DropdownMenuLabelProps) {
  return <DropdownMenuLabel data-slot="menubar-label" {...props} />
}

function MenubarItem(props: DropdownMenuItemProps) {
  return <DropdownMenuItem data-slot="menubar-item" {...props} />
}

function MenubarCheckboxItem(props: DropdownMenuCheckboxItemProps) {
  return (
    <DropdownMenuCheckboxItem data-slot="menubar-checkbox-item" {...props} />
  )
}

function MenubarRadioGroup(props: MenuPrimitive.RadioGroup.Props) {
  return <DropdownMenuRadioGroup data-slot="menubar-radio-group" {...props} />
}

function MenubarRadioItem(props: DropdownMenuRadioItemProps) {
  return <DropdownMenuRadioItem data-slot="menubar-radio-item" {...props} />
}

function MenubarSeparator(props: MenuPrimitive.Separator.Props) {
  return <DropdownMenuSeparator data-slot="menubar-separator" {...props} />
}

function MenubarShortcut(props: React.ComponentProps<"kbd">) {
  return <DropdownMenuShortcut data-slot="menubar-shortcut" {...props} />
}

function MenubarSub(props: MenuPrimitive.SubmenuRoot.Props) {
  return <DropdownMenuSub {...props} />
}

function MenubarSubTrigger(props: DropdownMenuSubTriggerProps) {
  return <DropdownMenuSubTrigger data-slot="menubar-sub-trigger" {...props} />
}

function MenubarSubContent(props: DropdownMenuContentProps) {
  return <DropdownMenuSubContent data-slot="menubar-sub-content" {...props} />
}

export {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
}
export type { MenubarProps }
