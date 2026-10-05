"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import {
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  IconSelector,
} from "@tabler/icons-react"
import { cva } from "class-variance-authority"
import { cn } from "cn"

type ClassName<State> =
  string | ((state: State) => string | undefined) | undefined

function mergeClassName<State>(base: string, className: ClassName<State>) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

const SelectTriggerContext =
  React.createContext<React.RefObject<HTMLElement | null> | null>(null)

function Select<Value, Multiple extends boolean | undefined = false>(
  props: SelectPrimitive.Root.Props<Value, Multiple>
) {
  const triggerRef = React.useRef<HTMLElement | null>(null)

  return (
    <SelectTriggerContext.Provider value={triggerRef}>
      <SelectPrimitive.Root {...props} />
    </SelectTriggerContext.Provider>
  )
}

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={mergeClassName("flex flex-col", className)}
      {...props}
    />
  )
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={mergeClassName(
        "flex min-w-0 flex-1 items-center gap-2 truncate text-start",
        className
      )}
      {...props}
    />
  )
}

const selectTriggerVariants = cva(
  "group/select-trigger inline-flex w-fit min-w-0 items-center justify-between gap-2 rounded-md bg-transparent text-sm whitespace-nowrap inset-ring-(length:--hairline) inset-ring-input transition-[color,background-color,box-shadow] duration-150 ease-out-cubic outline-none select-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:inset-ring-ring focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:inset-ring-destructive aria-invalid:focus-visible:ring-destructive/70 data-invalid:inset-ring-destructive data-placeholder:text-muted-foreground data-popup-open:inset-ring-ring dark:bg-input/30 dark:hover:bg-input/50 forced-colors:border pointer-coarse:text-[max(16px,1rem)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [@media(hover:hover)]:hover:bg-muted/50",
  {
    variants: {
      size: {
        sm: "h-8 ps-2.5 pe-1.5",
        default: "h-9 ps-3 pe-2",
        lg: "h-10 ps-3 pe-2.5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

type SelectTriggerProps = SelectPrimitive.Trigger.Props & {
  size?: "sm" | "default" | "lg"
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ref,
  ...props
}: SelectTriggerProps) {
  const triggerRef = React.useContext(SelectTriggerContext)
  const setRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      if (triggerRef) {
        triggerRef.current = node
      }
      if (typeof ref === "function") {
        return ref(node)
      }
      if (ref) {
        ref.current = node
      }
      return undefined
    },
    [triggerRef, ref]
  )

  return (
    <SelectPrimitive.Trigger
      ref={setRef}
      data-slot="select-trigger"
      data-size={size}
      className={mergeClassName(selectTriggerVariants({ size }), className)}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        data-slot="select-icon"
        className="flex text-muted-foreground transition-colors group-data-popup-open/select-trigger:text-foreground"
      >
        <IconSelector />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

type SelectContentProps = SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  >

function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  alignItemWithTrigger = true,
  dir,
  ...props
}: SelectContentProps) {
  const triggerRef = React.useContext(SelectTriggerContext)
  const setPositioner = React.useCallback(
    (positioner: HTMLDivElement | null) => {
      const trigger = triggerRef?.current
      if (!positioner || dir !== undefined || !trigger?.isConnected) {
        return
      }
      if (getComputedStyle(trigger).direction === "rtl") {
        positioner.setAttribute("dir", "rtl")
      } else {
        positioner.removeAttribute("dir")
      }
    },
    [triggerRef, dir]
  )

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        ref={setPositioner}
        dir={dir}
        data-slot="select-positioner"
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50 outline-none select-none focus-visible:outline-hidden"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          className={mergeClassName(
            "group/select-content relative isolate w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-(length:--hairline) ring-foreground/10 outline-none [--select-item-radius:max(calc(var(--radius-sm)*0.5),calc(var(--radius-lg)-0.25rem))] focus-visible:outline-hidden forced-colors:border",
            className
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List
            data-slot="select-list"
            className="relative max-h-(--available-height) scroll-py-7 overflow-y-auto overscroll-none p-1 outline-none focus-visible:outline-hidden"
          >
            {children}
          </SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={mergeClassName(
        "px-2 pt-2 pb-1 text-xs font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={mergeClassName(
        "group/select-item relative flex min-h-8 w-full cursor-default items-center gap-2 rounded-(--select-item-radius) py-1.5 ps-2 pe-7 text-start text-sm outline-none select-none focus-visible:outline-hidden data-highlighted:bg-accent data-highlighted:text-accent-foreground forced-colors:data-highlighted:outline-2 forced-colors:data-highlighted:-outline-offset-2 forced-colors:data-highlighted:outline-solid pointer-coarse:min-h-11 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText
        data-slot="select-item-text"
        className="flex min-w-0 flex-1 items-center gap-2 wrap-anywhere"
      >
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        keepMounted
        data-slot="select-item-indicator"
        className="absolute end-2 flex size-4 items-center justify-center opacity-0 transition-[opacity,scale] duration-150 ease-out-quint data-[selected]:opacity-100 motion-safe:scale-50 motion-safe:data-[selected]:scale-100 motion-reduce:transition-none"
      >
        <IconCheck className="text-foreground" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={mergeClassName(
        "pointer-events-none -mx-1 my-1 h-px bg-border",
        className
      )}
      {...props}
    />
  )
}

const scrollArrowClassName =
  "absolute inset-x-0 z-1 flex h-7 cursor-default items-center justify-center text-muted-foreground [&_svg:not([class*='size-'])]:size-4"

function SelectScrollUpButton({
  className,
  ...props
}: SelectPrimitive.ScrollUpArrow.Props) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={mergeClassName(
        cn(
          scrollArrowClassName,
          "top-0 rounded-t-[inherit] bg-linear-to-b from-popover from-55% to-transparent"
        ),
        className
      )}
      {...props}
    >
      <IconChevronUp />
    </SelectPrimitive.ScrollUpArrow>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: SelectPrimitive.ScrollDownArrow.Props) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={mergeClassName(
        cn(
          scrollArrowClassName,
          "bottom-0 rounded-b-[inherit] bg-linear-to-t from-popover from-55% to-transparent"
        ),
        className
      )}
      {...props}
    >
      <IconChevronDown />
    </SelectPrimitive.ScrollDownArrow>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  selectTriggerVariants,
}
export type { SelectContentProps, SelectTriggerProps }
