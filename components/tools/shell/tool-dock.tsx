"use client"

import * as React from "react"
import { cn } from "cn"

import { useIsPhone, useToolShortcut } from "@/components/tools/shell/use-tool-shortcut"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Kbd } from "@/components/ui/kbd"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { TooltipGroup, TooltipTrigger } from "@/components/ui/tooltip"

const dockItemClassName =
  "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium whitespace-nowrap text-muted-foreground outline-none select-none transition-colors duration-150 ease-out-cubic hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-focus-ring aria-pressed:bg-muted aria-pressed:text-foreground data-popup-open:bg-muted data-popup-open:text-foreground motion-reduce:transition-none pointer-coarse:h-10 pointer-coarse:px-3 forced-colors:aria-pressed:outline-2 forced-colors:aria-pressed:outline-solid [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

function ToolDock({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <TooltipGroup side="top" sideOffset={10}>
      <div
        data-slot="tool-dock"
        className="pointer-events-none absolute inset-x-2 bottom-2 z-20 flex justify-center sm:inset-x-4 sm:bottom-5"
      >
        <div
          role="group"
          aria-label={label}
          className={cn(
            "pointer-events-auto flex max-w-full items-center gap-0.5 overflow-x-auto overscroll-x-contain rounded-xl bg-popover p-1 text-popover-foreground shadow-lg ring-(length:--hairline) ring-foreground/10 [scrollbar-width:none] max-sm:w-full forced-colors:border [&::-webkit-scrollbar]:hidden",
            className
          )}
        >
          {children}
        </div>
      </div>
    </TooltipGroup>
  )
}

function ToolDockSeparator() {
  return <span aria-hidden="true" className="mx-1 h-4 shrink-0 border-s" />
}

type ToolDockItemProps = {
  icon: React.ReactNode
  label: string
  value?: React.ReactNode
  shortcut?: string
  hint?: string
  hideLabel?: boolean
}

function DockItemFace({
  icon,
  label,
  value,
  hideLabel,
}: Pick<ToolDockItemProps, "icon" | "label" | "value" | "hideLabel">) {
  return (
    <>
      {icon}
      <span className={cn(hideLabel && "sr-only")}>{label}</span>
      {value != null && !hideLabel ? (
        <span className="max-w-24 truncate font-normal text-muted-foreground max-sm:hidden">
          {value}
        </span>
      ) : null}
    </>
  )
}

function withTip(
  element: React.ReactElement,
  { label, hint, shortcut, hideLabel }: Omit<ToolDockItemProps, "icon">
) {
  if (!shortcut && !hideLabel && !hint) return element
  return (
    <TooltipTrigger
      content={
        <span className="flex items-center gap-2">
          {hint ?? label}
          {shortcut ? <Kbd size="sm">{shortcut.toUpperCase()}</Kbd> : null}
        </span>
      }
      render={element}
    />
  )
}

function ToolDockButton({
  icon,
  label,
  value,
  shortcut,
  listen = true,
  hint,
  hideLabel,
  className,
  onClick,
  ...props
}: ToolDockItemProps &
  Omit<React.ComponentProps<"button">, "children" | "value" | "onClick"> & {
    listen?: boolean
    onClick?: () => void
  }) {
  useToolShortcut(listen ? shortcut : undefined, () => onClick?.())
  return withTip(
    <button
      type="button"
      aria-label={hideLabel ? label : undefined}
      className={cn(dockItemClassName, className)}
      onClick={() => onClick?.()}
      {...props}
    >
      <DockItemFace icon={icon} label={label} value={value} hideLabel={hideLabel} />
    </button>,
    { label, shortcut, hint, hideLabel }
  )
}

function ToolDockPopover({
  icon,
  label,
  value,
  shortcut,
  hint,
  hideLabel,
  title,
  description,
  action,
  open: controlledOpen,
  onOpenChange,
  className,
  contentClassName,
  children,
}: ToolDockItemProps & {
  title?: string
  description?: React.ReactNode
  action?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  contentClassName?: string
  children: React.ReactNode
}) {
  const isPhone = useIsPhone()
  const [innerOpen, setInnerOpen] = React.useState(false)
  const open = controlledOpen ?? innerOpen
  const setOpen = (next: boolean) => {
    onOpenChange?.(next)
    if (controlledOpen === undefined) setInnerOpen(next)
  }

  useToolShortcut(shortcut, () => setOpen(!open))

  const face = (
    <DockItemFace icon={icon} label={label} value={value} hideLabel={hideLabel} />
  )
  const button = (
    <button
      type="button"
      aria-label={hideLabel ? label : undefined}
      className={cn(dockItemClassName, className)}
    />
  )
  const heading = title ?? label

  if (isPhone) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger render={button}>{face}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <div className="flex items-center justify-between gap-2">
              <DrawerTitle>{heading}</DrawerTitle>
              {action}
            </div>
            {description ? <DrawerDescription>{description}</DrawerDescription> : null}
          </DrawerHeader>
          <DrawerBody>
            <div className="pb-4">{children}</div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {withTip(<PopoverTrigger render={button}>{face}</PopoverTrigger>, {
        label,
        shortcut,
        hint,
        hideLabel,
      })}
      <PopoverContent
        side="top"
        sideOffset={12}
        collisionPadding={12}
        className={cn("w-80 gap-3 p-3", contentClassName)}
      >
        <div className="flex min-h-6 items-center justify-between gap-2">
          <PopoverTitle>{heading}</PopoverTitle>
          {action}
        </div>
        {description ? <PopoverDescription>{description}</PopoverDescription> : null}
        {children}
      </PopoverContent>
    </Popover>
  )
}

function ToolDockSegmented<Value extends string>({
  label,
  value,
  onValueChange,
  options,
}: {
  label: string
  value: Value
  onValueChange: (value: Value) => void
  options: {
    value: Value
    label: string
    icon?: React.ReactNode
    hideLabel?: boolean
    hint?: string
  }[]
}) {
  return (
    <div role="group" aria-label={label} className="flex shrink-0 items-center gap-0.5">
      {options.map((option) =>
        option.hideLabel || option.hint ? (
          <React.Fragment key={option.value}>
            {withTip(
              <button
                type="button"
                aria-pressed={option.value === value}
                aria-label={option.hideLabel ? option.label : undefined}
                onClick={() => onValueChange(option.value)}
                className={dockItemClassName}
              >
                {option.icon}
                <span className={cn(option.hideLabel && "sr-only")}>
                  {option.label}
                </span>
              </button>,
              { label: option.label, hint: option.hint, hideLabel: option.hideLabel }
            )}
          </React.Fragment>
        ) : (
          <button
            key={option.value}
            type="button"
            aria-pressed={option.value === value}
            onClick={() => onValueChange(option.value)}
            className={dockItemClassName}
          >
            {option.icon}
            {option.label}
          </button>
        )
      )}
    </div>
  )
}

export {
  ToolDock,
  ToolDockButton,
  ToolDockPopover,
  ToolDockSegmented,
  ToolDockSeparator,
}
