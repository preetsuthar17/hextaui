"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"
import { useDirection } from "@base-ui/react/direction-provider"
import {
  IconCheck,
  IconChevronDown,
  IconSearch,
  IconX,
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

const ComboboxFieldContext =
  React.createContext<React.RefObject<HTMLElement | null> | null>(null)

const ComboboxContentContext = React.createContext(false)

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    }
  }
}

function markReady(node: HTMLElement | null) {
  if (node) {
    requestAnimationFrame(() => {
      node.dataset.ready = ""
    })
  }
}

function useFieldRef<T extends HTMLElement>(
  ref: React.Ref<T> | undefined,
  ...extra: React.RefCallback<T>[]
) {
  const fieldRef = React.useContext(ComboboxFieldContext)
  const [first] = extra

  return React.useMemo(
    () => mergeRefs<T>(fieldRef as React.Ref<T> | null, ref, first),
    [fieldRef, ref, first]
  )
}

function Combobox<
  Value,
  Multiple extends boolean | undefined = false,
  Item = Value,
>(props: ComboboxPrimitive.Root.Props<Value, Multiple, Item>) {
  const fieldRef = React.useRef<HTMLElement | null>(null)

  return (
    <ComboboxFieldContext.Provider value={fieldRef}>
      <ComboboxPrimitive.Root {...props} />
    </ComboboxFieldContext.Provider>
  )
}

function ComboboxValue(props: ComboboxPrimitive.Value.Props) {
  return <ComboboxPrimitive.Value {...props} />
}

const comboboxFieldVariants = cva(
  "w-full min-w-0 rounded-md bg-transparent text-sm inset-ring-(length:--hairline) inset-ring-input transition-[color,box-shadow,border-color] outline-none focus-visible:outline-hidden dark:bg-input/30 forced-colors:border"
)

const comboboxIconButton =
  "relative inline-flex size-7 shrink-0 items-center justify-center rounded-[max(calc(var(--radius-sm)*0.5),calc(var(--radius-md)-0.3125rem))] text-muted-foreground outline-none focus-visible:outline-hidden select-none after:absolute after:-inset-1 hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-focus-ring disabled:pointer-events-none pointer-coarse:after:-inset-2 dark:hover:bg-muted/50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

function ComboboxTrigger({
  className,
  children,
  render,
  ref,
  ...props
}: ComboboxPrimitive.Trigger.Props) {
  const setRef = useFieldRef(ref)
  const styled = render === undefined

  return (
    <ComboboxPrimitive.Trigger
      ref={setRef}
      data-slot="combobox-trigger"
      render={render}
      className={mergeClassName(
        cn(
          "group/combobox-trigger [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          styled &&
            cn(
              comboboxFieldVariants(),
              "inline-flex h-9 items-center justify-between gap-2 ps-2.5 pe-2 text-start select-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:inset-ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:inset-ring-destructive data-placeholder:text-muted-foreground data-popup-open:inset-ring-ring dark:hover:bg-input/50 pointer-coarse:text-[1rem] [@media(hover:hover)]:hover:bg-muted/50"
            )
        ),
        className
      )}
      {...props}
    >
      {children !== undefined ? (
        <span
          data-slot="combobox-trigger-value"
          className="min-w-0 flex-1 truncate text-start"
        >
          {children}
        </span>
      ) : null}
      <IconChevronDown
        aria-hidden
        data-slot="combobox-trigger-icon"
        className="text-muted-foreground transition-transform duration-200 ease-spring group-data-popup-open/combobox-trigger:rotate-180 motion-reduce:transition-none"
      />
    </ComboboxPrimitive.Trigger>
  )
}

function ComboboxClear({
  className,
  children,
  ...props
}: ComboboxPrimitive.Clear.Props) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      aria-label="Clear selection"
      className={mergeClassName(
        cn(
          comboboxIconButton,
          "transition-[color,background-color,opacity,scale] duration-150 ease-out-quint data-ending-style:opacity-0 data-starting-style:opacity-0 motion-safe:data-ending-style:scale-75 motion-safe:data-starting-style:scale-75"
        ),
        className
      )}
      {...props}
    >
      {children ?? <IconX />}
    </ComboboxPrimitive.Clear>
  )
}

type ComboboxInputProps = Omit<ComboboxPrimitive.Input.Props, "className"> & {
  className?: string
  showTrigger?: boolean
  showClear?: boolean
}

function ComboboxInput({
  className,
  children,
  disabled,
  showTrigger,
  showClear = false,
  ...props
}: ComboboxInputProps) {
  const inContent = React.useContext(ComboboxContentContext)
  const setFieldRef = useFieldRef<HTMLDivElement>(undefined)
  const trigger = showTrigger ?? !inContent

  return (
    <ComboboxPrimitive.InputGroup
      ref={inContent ? undefined : setFieldRef}
      data-slot="combobox-input-group"
      className={cn(
        "group/combobox-input relative flex shrink-0 items-center",
        inContent
          ? "m-1 mb-0 h-8 rounded-[var(--combobox-item-radius)] bg-muted/60 ps-2 text-sm dark:bg-input/30"
          : cn(
              comboboxFieldVariants(),
              "h-9 focus-within:ring-3 focus-within:ring-focus-ring focus-within:inset-ring-ring has-[[aria-invalid=true]]:inset-ring-destructive has-[[aria-invalid=true]]:focus-within:ring-destructive/20 data-invalid:inset-ring-destructive dark:has-[[aria-invalid=true]]:focus-within:ring-destructive/40 data-disabled:cursor-not-allowed data-disabled:opacity-50"
            ),
        className
      )}
    >
      {inContent ? (
        <IconSearch
          aria-hidden
          className="size-4 shrink-0 text-muted-foreground"
        />
      ) : null}
      <ComboboxPrimitive.Input
        data-slot="combobox-input"
        disabled={disabled}
        className={cn(
          "h-full w-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground focus-visible:outline-hidden disabled:cursor-not-allowed pointer-coarse:text-[1rem]",
          inContent ? "px-2" : "ps-2.5 pe-1"
        )}
        {...props}
      />
      {trigger || showClear ? (
        <div
          data-slot="combobox-input-actions"
          className="me-1 grid shrink-0 place-items-center *:col-start-1 *:row-start-1"
        >
          {showClear ? (
            <ComboboxClear
              disabled={disabled}
              className="peer/combobox-clear"
            />
          ) : null}
          {trigger ? (
            <ComboboxPrimitive.Trigger
              data-slot="combobox-trigger"
              aria-label="Show options"
              disabled={disabled}
              className={cn(
                comboboxIconButton,
                "group/combobox-trigger transition-[color,background-color,opacity,scale] duration-150 ease-out-quint peer-data-visible/combobox-clear:pointer-events-none peer-data-visible/combobox-clear:opacity-0 motion-safe:peer-data-visible/combobox-clear:scale-75"
              )}
            >
              <IconChevronDown
                aria-hidden
                className="transition-transform duration-200 ease-spring group-data-popup-open/combobox-trigger:rotate-180 motion-reduce:transition-none"
              />
            </ComboboxPrimitive.Trigger>
          ) : null}
        </div>
      ) : null}
      {children}
    </ComboboxPrimitive.InputGroup>
  )
}

function useDirectionAttribute(dir: string | undefined) {
  const direction = useDirection()
  const fieldRef = React.useContext(ComboboxFieldContext)

  return React.useCallback(
    (popup: HTMLElement) => {
      if (dir !== undefined) {
        return
      }
      const field = fieldRef?.current
      const fieldDirection =
        field && field.isConnected ? getComputedStyle(field).direction : null
      if (fieldDirection === "rtl" || direction === "rtl") {
        popup.setAttribute("dir", "rtl")
      }
    },
    [dir, direction, fieldRef]
  )
}

function useAnimatedHeight(applyDirection: (popup: HTMLElement) => void) {
  return React.useCallback(
    (sizer: HTMLDivElement | null) => {
      const popup = sizer?.parentElement
      if (!sizer || !popup) {
        return
      }
      applyDirection(popup)
      if (typeof ResizeObserver === "undefined") {
        return
      }
      const observer = new ResizeObserver(([entry]) => {
        const height =
          entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height
        popup.style.height = `${height}px`
      })
      observer.observe(sizer)
      return () => {
        observer.disconnect()
        popup.style.height = ""
      }
    },
    [applyDirection]
  )
}

type ComboboxContentProps = ComboboxPrimitive.Popup.Props &
  Pick<
    ComboboxPrimitive.Positioner.Props,
    "side" | "align" | "sideOffset" | "alignOffset" | "anchor"
  >

function ComboboxContent({
  className,
  children,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  anchor,
  dir,
  ...props
}: ComboboxContentProps) {
  const applyDirection = useDirectionAttribute(dir)
  const sizerRef = useAnimatedHeight(applyDirection)

  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        data-slot="combobox-positioner"
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="isolate z-50 outline-none focus-visible:outline-hidden"
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          dir={dir}
          className={mergeClassName(
            "group/combobox-content relative w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-(length:--hairline) ring-foreground/10 transition-[opacity,scale,height] duration-150 ease-out-quint outline-none [--combobox-item-radius:max(calc(var(--radius-sm)*0.5),calc(var(--radius-lg)-0.25rem))] focus-visible:outline-hidden has-[>[data-slot=combobox-content-sizer]>[data-slot=combobox-input-group]]:w-[max(var(--anchor-width),15rem)] data-ending-style:opacity-0 data-ending-style:duration-100 data-starting-style:opacity-0 motion-safe:data-ending-style:scale-96 motion-safe:data-starting-style:scale-96 motion-reduce:transition-opacity forced-colors:border",
            className
          )}
          {...props}
        >
          <ComboboxPrimitive.Arrow
            data-slot="combobox-origin"
            className="pointer-events-none invisible size-0"
          />
          <div
            ref={sizerRef}
            data-slot="combobox-content-sizer"
            className="flex max-h-[min(var(--available-height),24rem)] flex-col"
          >
            <ComboboxContentContext.Provider value>
              {children}
            </ComboboxContentContext.Provider>
          </div>
        </ComboboxPrimitive.Popup>
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  )
}

function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={mergeClassName(
        "min-h-0 scroll-py-1 overflow-y-auto overscroll-none p-1 outline-none focus-visible:outline-hidden data-empty:p-0",
        className
      )}
      {...props}
    />
  )
}

function ComboboxItem({
  className,
  children,
  ...props
}: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={mergeClassName(
        "group/combobox-item relative flex min-h-8 w-full cursor-default items-center gap-2 rounded-(--combobox-item-radius) py-1.5 ps-2 pe-2 text-start text-sm wrap-anywhere outline-none select-none focus-visible:outline-hidden data-highlighted:bg-accent data-highlighted:text-accent-foreground forced-colors:data-highlighted:outline-2 forced-colors:data-highlighted:-outline-offset-2 forced-colors:data-highlighted:outline-solid pointer-coarse:min-h-11 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
      <ComboboxPrimitive.ItemIndicator
        keepMounted
        data-slot="combobox-item-indicator"
        className="ms-auto flex size-4 shrink-0 items-center justify-center opacity-0 transition-[opacity,scale] duration-150 ease-out-quint data-[selected]:opacity-100 motion-safe:scale-50 motion-safe:data-[selected]:scale-100 motion-reduce:transition-none"
      >
        <IconCheck className="text-foreground" />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  )
}

function ComboboxGroup({ className, ...props }: ComboboxPrimitive.Group.Props) {
  return (
    <ComboboxPrimitive.Group
      data-slot="combobox-group"
      className={mergeClassName("flex flex-col", className)}
      {...props}
    />
  )
}

function ComboboxLabel({
  className,
  ...props
}: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-label"
      className={mergeClassName(
        "px-2 pt-2 pb-1 text-xs font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function ComboboxCollection(props: ComboboxPrimitive.Collection.Props) {
  return <ComboboxPrimitive.Collection {...props} />
}

function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={mergeClassName(
        "shrink-0 text-center text-sm text-balance wrap-anywhere text-muted-foreground not-empty:px-3 not-empty:py-6",
        className
      )}
      {...props}
    />
  )
}

function ComboboxStatus({
  className,
  ...props
}: ComboboxPrimitive.Status.Props) {
  return (
    <ComboboxPrimitive.Status
      data-slot="combobox-status"
      className={mergeClassName(
        "flex shrink-0 items-center gap-2 text-sm text-muted-foreground not-empty:px-3 not-empty:py-2.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function ComboboxSeparator({
  className,
  ...props
}: ComboboxPrimitive.Separator.Props) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
      className={mergeClassName(
        "-mx-1 my-1 h-px shrink-0 bg-border",
        className
      )}
      {...props}
    />
  )
}

type ComboboxChipsProps = Omit<
  ComboboxPrimitive.InputGroup.Props,
  "className"
> & {
  className?: string
}

function ComboboxChips({
  className,
  children,
  ref,
  ...props
}: ComboboxChipsProps) {
  const setRef = useFieldRef<HTMLDivElement>(ref, markReady)

  return (
    <ComboboxPrimitive.InputGroup
      ref={setRef}
      data-slot="combobox-chips"
      className={cn(
        comboboxFieldVariants(),
        "flex min-h-9 cursor-text flex-wrap items-center gap-1 p-1 focus-within:ring-3 focus-within:ring-focus-ring focus-within:inset-ring-ring has-[[aria-invalid=true]]:inset-ring-destructive has-[[aria-invalid=true]]:focus-within:ring-destructive/20 data-invalid:inset-ring-destructive dark:has-[[aria-invalid=true]]:focus-within:ring-destructive/40 data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <ComboboxPrimitive.Chips className="contents">
        {children}
      </ComboboxPrimitive.Chips>
    </ComboboxPrimitive.InputGroup>
  )
}

type ComboboxChipProps = ComboboxPrimitive.Chip.Props & {
  showRemove?: boolean
}

function ComboboxChip({
  className,
  children,
  showRemove = true,
  ...props
}: ComboboxChipProps) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={mergeClassName(
        cn(
          "inline-flex h-6 max-w-full min-w-0 items-center gap-0.5 rounded-[max(calc(var(--radius-sm)*0.5),calc(var(--radius-md)-0.3125rem))] bg-secondary ps-2 text-xs font-medium text-secondary-foreground transition-[background-color,box-shadow] duration-150 outline-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden motion-safe:in-data-ready:animate-in motion-safe:in-data-ready:animation-duration-150 motion-safe:in-data-ready:fade-in-0 motion-safe:in-data-ready:zoom-in-90 data-disabled:opacity-50 [&:focus]:bg-accent [&:focus]:text-accent-foreground",
          showRemove ? "pe-0.5" : "pe-2"
        ),
        className
      )}
      {...props}
    >
      <span data-slot="combobox-chip-label" className="min-w-0 truncate">
        {children}
      </span>
      {showRemove ? (
        <ComboboxPrimitive.ChipRemove
          data-slot="combobox-chip-remove"
          aria-label="Remove"
          className="relative inline-flex size-5 shrink-0 items-center justify-center rounded-[max(calc(var(--radius-sm)*0.5),calc(var(--radius-md)-0.4375rem))] text-muted-foreground outline-none after:absolute after:-inset-0.5 hover:bg-foreground/10 hover:text-foreground focus-visible:outline-hidden pointer-coarse:after:-inset-2 [&_svg]:pointer-events-none [&_svg]:size-3.5"
        >
          <IconX />
        </ComboboxPrimitive.ChipRemove>
      ) : null}
    </ComboboxPrimitive.Chip>
  )
}

function ComboboxChipsInput({
  className,
  ...props
}: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chips-input"
      className={mergeClassName(
        "h-6 min-w-16 flex-1 bg-transparent px-1.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:outline-hidden disabled:cursor-not-allowed pointer-coarse:text-[1rem]",
        className
      )}
      {...props}
    />
  )
}

function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null)
}

const useComboboxFilter = ComboboxPrimitive.useFilter
const useComboboxFilteredItems = ComboboxPrimitive.useFilteredItems
const createComboboxItems = ComboboxPrimitive.createItems

export {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxStatus,
  ComboboxSeparator,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxTrigger,
  ComboboxValue,
  ComboboxClear,
  comboboxFieldVariants,
  useComboboxAnchor,
  useComboboxFilter,
  useComboboxFilteredItems,
  createComboboxItems,
}
export type {
  ComboboxInputProps,
  ComboboxContentProps,
  ComboboxChipsProps,
  ComboboxChipProps,
}
