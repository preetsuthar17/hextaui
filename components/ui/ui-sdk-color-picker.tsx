"use client"

import * as React from "react"
import { IconColorPicker } from "@tabler/icons-react"
import * as ColorPickerPrimitive from "@ui-sdk/react/color-picker"
import {
  Popover as PopoverPrimitive,
  PopoverContent as PopoverContentPrimitive,
  PopoverTrigger as PopoverTriggerPrimitive,
} from "@ui-sdk/react/popover"
import { cn } from "cn"

type ClassName<State> =
  string | ((state: State) => string | undefined) | undefined

function mergeClassName<State>(base: string, className: ClassName<State>) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

const thumbClassName =
  "absolute z-10 size-4 -translate-1/2 cursor-grab rounded-full border-2 border-white bg-(--color-picker-color) ring-(length:--hairline) ring-black/40 transition-[scale,box-shadow] duration-150 ease-out-quint outline-none select-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden data-disabled:cursor-not-allowed data-readonly:cursor-default motion-reduce:transition-none forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] pointer-coarse:size-5"

const fieldClassName =
  "h-9 w-full min-w-0 rounded-md bg-transparent px-3 font-mono text-sm text-foreground tabular-nums inset-ring-(length:--hairline) inset-ring-input transition-[color,background-color,box-shadow] duration-150 ease-out-cubic outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:inset-ring-ring focus-visible:outline-hidden disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:inset-ring-destructive data-readonly:bg-muted/40 motion-reduce:transition-none dark:bg-input/30 dark:data-readonly:bg-input/20 forced-colors:border pointer-coarse:text-[max(16px,1rem)] [@media(hover:hover)]:hover:not-focus-visible:not-disabled:not-data-readonly:inset-ring-ring/70"

type ColorPickerProps = React.ComponentProps<
  typeof ColorPickerPrimitive.ColorPicker
>

function ColorPicker({ className, ...props }: ColorPickerProps) {
  return (
    <ColorPickerPrimitive.ColorPicker
      className={mergeClassName(
        "group/color-picker flex w-full max-w-64 min-w-0 flex-col gap-3 data-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

type ColorPickerAreaProps = React.ComponentProps<
  typeof ColorPickerPrimitive.ColorPickerArea
>

function ColorPickerArea({
  className,
  children = <ColorPickerAreaThumb />,
  ...props
}: ColorPickerAreaProps) {
  return (
    <ColorPickerPrimitive.ColorPickerArea
      className={mergeClassName(
        "group/color-picker-area relative isolate aspect-[4/3] w-full shrink-0 cursor-crosshair touch-none rounded-[var(--color-picker-radius,var(--radius-lg))] bg-(image:--color-area-background) inset-ring-(length:--hairline) inset-ring-black/10 select-none data-readonly:cursor-default dark:inset-ring-white/10 forced-colors:border data-disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </ColorPickerPrimitive.ColorPickerArea>
  )
}

function ColorPickerAreaCanvas({
  className,
  ...props
}: React.ComponentProps<typeof ColorPickerPrimitive.ColorPickerAreaCanvas>) {
  return (
    <ColorPickerPrimitive.ColorPickerAreaCanvas
      className={mergeClassName(
        "pointer-events-none absolute inset-0 -z-10 size-full rounded-[inherit]",
        className
      )}
      {...props}
    />
  )
}

function ColorPickerAreaThumb({
  className,
  ...props
}: React.ComponentProps<typeof ColorPickerPrimitive.ColorPickerAreaThumb>) {
  return (
    <ColorPickerPrimitive.ColorPickerAreaThumb
      className={mergeClassName(
        cn(
          thumbClassName,
          "group-active/color-picker-area:cursor-grabbing motion-safe:group-active/color-picker-area:not-data-disabled:not-data-readonly:scale-125"
        ),
        className
      )}
      {...props}
    />
  )
}

type ColorPickerSliderProps = React.ComponentProps<
  typeof ColorPickerPrimitive.ColorPickerSlider
>

function ColorPickerSlider({
  className,
  children = <ColorPickerSliderThumb />,
  ...props
}: ColorPickerSliderProps) {
  return (
    <ColorPickerPrimitive.ColorPickerSlider
      className={mergeClassName(
        "group/color-picker-slider relative shrink-0 cursor-pointer touch-none rounded-full bg-(image:--color-slider-background) inset-ring-(length:--hairline) inset-ring-black/10 select-none before:absolute before:content-[''] data-readonly:cursor-default data-[channel=alpha]:[background:var(--color-slider-background),repeating-conic-gradient(var(--color-muted)_0_25%,var(--color-background)_0_50%)_0_0/0.5rem_0.5rem] data-[orientation=horizontal]:h-3 data-[orientation=horizontal]:w-full data-[orientation=horizontal]:before:-inset-y-1.5 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-32 data-[orientation=vertical]:w-3 data-[orientation=vertical]:before:-inset-x-1.5 dark:inset-ring-white/10 forced-colors:border pointer-coarse:data-[orientation=horizontal]:before:-inset-y-3 pointer-coarse:data-[orientation=vertical]:before:-inset-x-3 data-disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </ColorPickerPrimitive.ColorPickerSlider>
  )
}

function ColorPickerSliderThumb({
  className,
  ...props
}: React.ComponentProps<typeof ColorPickerPrimitive.ColorPickerSliderThumb>) {
  return (
    <ColorPickerPrimitive.ColorPickerSliderThumb
      className={mergeClassName(
        cn(
          thumbClassName,
          "group-active/color-picker-slider:cursor-grabbing data-[orientation=horizontal]:top-1/2 data-[orientation=vertical]:left-1/2 motion-safe:group-active/color-picker-slider:not-data-disabled:not-data-readonly:scale-125"
        ),
        className
      )}
      {...props}
    />
  )
}

function ColorPickerSwatch({
  className,
  ...props
}: React.ComponentProps<typeof ColorPickerPrimitive.ColorPickerSwatch>) {
  return (
    <ColorPickerPrimitive.ColorPickerSwatch
      className={mergeClassName(
        "relative size-9 shrink-0 overflow-hidden rounded-md inset-ring-(length:--hairline) inset-ring-black/10 [background:linear-gradient(var(--color-picker-color),var(--color-picker-color)),repeating-conic-gradient(var(--color-muted)_0_25%,var(--color-background)_0_50%)_0_0/0.5rem_0.5rem] dark:inset-ring-white/15 forced-colors:border",
        className
      )}
      {...props}
    />
  )
}

function ColorPickerInput({
  className,
  ...props
}: React.ComponentProps<typeof ColorPickerPrimitive.ColorPickerInput>) {
  return (
    <ColorPickerPrimitive.ColorPickerInput
      dir="auto"
      autoComplete="off"
      spellCheck={false}
      className={mergeClassName(fieldClassName, className)}
      {...props}
    />
  )
}

function ColorPickerChannelInput({
  className,
  ...props
}: React.ComponentProps<typeof ColorPickerPrimitive.ColorPickerChannelInput>) {
  return (
    <ColorPickerPrimitive.ColorPickerChannelInput
      dir="auto"
      className={mergeClassName(
        cn(fieldClassName, "px-2 text-center"),
        className
      )}
      {...props}
    />
  )
}

function ColorPickerEyeDropper({
  className,
  children = <IconColorPicker aria-hidden="true" />,
  ...props
}: React.ComponentProps<typeof ColorPickerPrimitive.ColorPickerEyeDropper>) {
  return (
    <ColorPickerPrimitive.ColorPickerEyeDropper
      className={mergeClassName(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground inset-ring-(length:--hairline) inset-ring-input transition-[color,background-color,box-shadow,scale] duration-150 ease-out-cubic outline-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:inset-ring-ring focus-visible:outline-hidden active:not-disabled:text-foreground disabled:pointer-events-none disabled:opacity-50 data-unsupported:hidden motion-safe:active:not-disabled:scale-96 motion-reduce:transition-none dark:bg-input/30 forced-colors:border [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [@media(hover:hover)]:hover:not-disabled:bg-muted [@media(hover:hover)]:hover:not-disabled:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </ColorPickerPrimitive.ColorPickerEyeDropper>
  )
}

function ColorPickerSwatches({
  className,
  ...props
}: React.ComponentProps<typeof ColorPickerPrimitive.ColorPickerSwatches>) {
  return (
    <ColorPickerPrimitive.ColorPickerSwatches
      className={mergeClassName(
        "flex flex-wrap gap-1.5 outline-none",
        className
      )}
      {...props}
    />
  )
}

function ColorPickerSwatchItem({
  className,
  ...props
}: React.ComponentProps<typeof ColorPickerPrimitive.ColorPickerSwatchItem>) {
  return (
    <ColorPickerPrimitive.ColorPickerSwatchItem
      className={mergeClassName(
        "relative size-6 shrink-0 cursor-pointer rounded-md inset-ring-(length:--hairline) inset-ring-black/10 ring-offset-2 ring-offset-background transition-[scale,box-shadow] duration-150 ease-out-quint outline-none [background:linear-gradient(var(--color-picker-color),var(--color-picker-color)),repeating-conic-gradient(var(--color-muted)_0_25%,var(--color-background)_0_50%)_0_0/0.5rem_0.5rem] focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:outline-hidden disabled:cursor-not-allowed data-readonly:cursor-default data-[selected]:ring-2 data-[selected]:ring-foreground motion-safe:active:not-data-disabled:not-data-readonly:scale-90 motion-reduce:transition-none dark:inset-ring-white/15 forced-colors:border forced-colors:data-[selected]:outline-2 forced-colors:data-[selected]:outline-offset-2 forced-colors:data-[selected]:outline-[Highlight] forced-colors:data-[selected]:outline-solid pointer-coarse:size-8 data-disabled:cursor-not-allowed [@media(hover:hover)]:hover:not-data-disabled:not-data-readonly:scale-110",
        className
      )}
      {...props}
    />
  )
}

function ColorPickerPopover(
  props: React.ComponentProps<typeof PopoverPrimitive>
) {
  return <PopoverPrimitive {...props} />
}

type ColorPickerTriggerProps = React.ComponentProps<
  typeof PopoverTriggerPrimitive
>

function ColorPickerTrigger({ className, ...props }: ColorPickerTriggerProps) {
  return (
    <PopoverTriggerPrimitive
      className={mergeClassName(
        "inline-flex h-9 max-w-full min-w-0 shrink-0 items-center gap-2 rounded-md bg-transparent ps-1.5 pe-3 text-sm text-foreground inset-ring-(length:--hairline) inset-ring-input transition-[color,background-color,box-shadow,scale] duration-150 ease-out-cubic outline-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:inset-ring-ring focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 motion-safe:active:not-disabled:scale-98 motion-reduce:transition-none dark:bg-input/30 forced-colors:border data-open:inset-ring-ring [&>[data-slot=color-picker-swatch]]:size-6 [&>[data-slot=color-picker-swatch]]:rounded-[max(calc(var(--radius-sm)*0.5),calc(var(--radius-md)-var(--spacing)*1.5))] [@media(hover:hover)]:hover:not-disabled:bg-muted/60",
        className
      )}
      {...props}
    />
  )
}

function ColorPickerContent({
  className,
  sideOffset = 6,
  align = "start",
  ...props
}: React.ComponentProps<typeof PopoverContentPrimitive>) {
  return (
    <PopoverContentPrimitive
      sideOffset={sideOffset}
      align={align}
      className={mergeClassName(
        "m-0 flex max-h-(--available-height) w-64 max-w-(--available-width) origin-(--transform-origin) flex-col gap-3 overflow-y-auto overscroll-contain rounded-xl border-0 bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-(length:--hairline) ring-foreground/10 transition-[opacity,scale] duration-150 ease-out-quint outline-none [--color-picker-radius:calc(var(--radius-xl)-var(--spacing)*2.5)] data-ending-style:opacity-0 data-ending-style:duration-100 data-starting-style:opacity-0 motion-safe:data-ending-style:scale-96 motion-safe:data-starting-style:scale-96 motion-reduce:transition-opacity forced-colors:border",
        className
      )}
      {...props}
    />
  )
}

export {
  ColorPicker,
  ColorPickerArea,
  ColorPickerAreaCanvas,
  ColorPickerAreaThumb,
  ColorPickerChannelInput,
  ColorPickerContent,
  ColorPickerEyeDropper,
  ColorPickerInput,
  ColorPickerPopover,
  ColorPickerSlider,
  ColorPickerSliderThumb,
  ColorPickerSwatch,
  ColorPickerSwatches,
  ColorPickerSwatchItem,
  ColorPickerTrigger,
}
export { createColorPickerController } from "@ui-sdk/react/color-picker"
export type {
  ColorPickerProps,
  ColorPickerSliderProps,
  ColorPickerTriggerProps,
}
