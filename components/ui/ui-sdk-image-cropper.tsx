"use client"

import * as React from "react"
import {
  IconFlipHorizontal,
  IconFlipVertical,
  IconRotateClockwise2,
} from "@tabler/icons-react"
import * as ImageCropperPrimitive from "@ui-sdk/react/image-cropper"
import { cva } from "class-variance-authority"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button"

type ClassName<State> =
  string | ((state: State) => string | undefined) | undefined

function mergeClassName<State>(base: string, className: ClassName<State>) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

function ImageCropper({
  className,
  ...props
}: React.ComponentProps<typeof ImageCropperPrimitive.ImageCropper>) {
  return (
    <ImageCropperPrimitive.ImageCropper
      className={mergeClassName(
        "group/image-cropper flex w-full min-w-0 flex-col gap-3",
        className
      )}
      {...props}
    />
  )
}

function ImageCropperViewport({
  className,
  ...props
}: React.ComponentProps<typeof ImageCropperPrimitive.ImageCropperViewport>) {
  return (
    <ImageCropperPrimitive.ImageCropperViewport
      className={mergeClassName(
        "relative aspect-(--image-cropper-aspect-ratio,3/2) w-full touch-none overflow-hidden rounded-lg bg-muted p-3 select-none data-[mode=frame]:aspect-square data-[mode=frame]:p-8 motion-safe:data-loading:animate-pulse data-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function ImageCropperImage({
  className,
  ...props
}: React.ComponentProps<typeof ImageCropperPrimitive.ImageCropperImage>) {
  return (
    <ImageCropperPrimitive.ImageCropperImage
      className={mergeClassName(
        "max-w-none transition-opacity duration-200 ease-out-quint data-error:opacity-0 data-loading:opacity-0 motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

function ImageCropperSelection({
  className,
  ...props
}: React.ComponentProps<typeof ImageCropperPrimitive.ImageCropperSelection>) {
  return (
    <ImageCropperPrimitive.ImageCropperSelection
      className={mergeClassName(
        "shadow-[0_0_0_100vmax_--alpha(var(--color-black)/55%)] inset-ring-1 inset-ring-white/80 outline-none focus-visible:ring-3 focus-visible:inset-ring-2 focus-visible:ring-focus-ring focus-visible:inset-ring-white data-[mode=box]:cursor-move data-[mode=frame]:cursor-grab data-[mode=frame]:data-dragging:cursor-grabbing data-[shape=circle]:rounded-full forced-colors:border forced-colors:border-[Highlight] data-disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
}

function ImageCropperGrid({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ImageCropperPrimitive.ImageCropperGrid>) {
  return (
    <ImageCropperPrimitive.ImageCropperGrid
      className={mergeClassName(
        "overflow-hidden opacity-0 transition-opacity duration-150 ease-out-quint group-data-dragging/image-cropper:opacity-100 group-data-[shape=circle]/image-cropper:rounded-full motion-reduce:transition-none [&>span]:absolute [&>span]:bg-white/45",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          <span className="inset-y-0 left-1/3 w-px" />
          <span className="inset-y-0 left-2/3 w-px" />
          <span className="inset-x-0 top-1/3 h-px" />
          <span className="inset-x-0 top-2/3 h-px" />
        </>
      )}
    </ImageCropperPrimitive.ImageCropperGrid>
  )
}

const imageCropperHandleVariants = cva(
  "absolute z-10 outline-none after:absolute after:-inset-2.5 focus-visible:rounded-xs focus-visible:ring-3 focus-visible:ring-focus-ring forced-colors:border-[Highlight] pointer-coarse:after:-inset-4 data-disabled:cursor-not-allowed",
  {
    variants: {
      position: {
        nw: "-top-0.5 -left-0.5 size-4 cursor-nwse-resize rounded-tl-xs border-t-3 border-l-3 border-white",
        ne: "-top-0.5 -right-0.5 size-4 cursor-nesw-resize rounded-tr-xs border-t-3 border-r-3 border-white",
        se: "-right-0.5 -bottom-0.5 size-4 cursor-nwse-resize rounded-br-xs border-r-3 border-b-3 border-white",
        sw: "-bottom-0.5 -left-0.5 size-4 cursor-nesw-resize rounded-bl-xs border-b-3 border-l-3 border-white",
        n: "-top-0.5 left-1/2 h-0.75 w-6 -translate-x-1/2 cursor-ns-resize rounded-full bg-white forced-colors:border",
        s: "-bottom-0.5 left-1/2 h-0.75 w-6 -translate-x-1/2 cursor-ns-resize rounded-full bg-white forced-colors:border",
        e: "top-1/2 -right-0.5 h-6 w-0.75 -translate-y-1/2 cursor-ew-resize rounded-full bg-white forced-colors:border",
        w: "top-1/2 -left-0.5 h-6 w-0.75 -translate-y-1/2 cursor-ew-resize rounded-full bg-white forced-colors:border",
      },
    },
  }
)

function ImageCropperHandle({
  className,
  position,
  ...props
}: React.ComponentProps<typeof ImageCropperPrimitive.ImageCropperHandle>) {
  return (
    <ImageCropperPrimitive.ImageCropperHandle
      position={position}
      className={mergeClassName(
        imageCropperHandleVariants({ position }),
        className
      )}
      {...props}
    />
  )
}

const imageCropperHandlePositions = [
  "nw",
  "n",
  "ne",
  "e",
  "se",
  "s",
  "sw",
  "w",
] as const

function ImageCropperHandles() {
  return imageCropperHandlePositions.map((position) => (
    <ImageCropperHandle key={position} position={position} />
  ))
}

function ImageCropperZoom({
  className,
  ...props
}: React.ComponentProps<typeof ImageCropperPrimitive.ImageCropperZoom>) {
  return (
    <ImageCropperPrimitive.ImageCropperZoom
      className={mergeClassName(
        "h-5 w-full min-w-0 cursor-pointer appearance-none bg-transparent outline-none disabled:cursor-not-allowed disabled:opacity-50 pointer-coarse:h-8 [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-background [&::-moz-range-thumb]:inset-ring-(length:--hairline) [&::-moz-range-thumb]:inset-ring-foreground/30 focus-visible:[&::-moz-range-thumb]:ring-3 focus-visible:[&::-moz-range-thumb]:ring-focus-ring pointer-coarse:[&::-moz-range-thumb]:size-6 [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-foreground/10 dark:[&::-moz-range-track]:bg-foreground/15 [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-foreground/10 dark:[&::-webkit-slider-runnable-track]:bg-foreground/15 [&::-webkit-slider-thumb]:-mt-1.25 [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:inset-ring-(length:--hairline) [&::-webkit-slider-thumb]:inset-ring-foreground/30 [&::-webkit-slider-thumb]:transition-[box-shadow] [&::-webkit-slider-thumb]:duration-150 focus-visible:[&::-webkit-slider-thumb]:ring-3 focus-visible:[&::-webkit-slider-thumb]:ring-focus-ring pointer-coarse:[&::-webkit-slider-thumb]:-mt-2.25 pointer-coarse:[&::-webkit-slider-thumb]:size-6",
        className
      )}
      {...props}
    />
  )
}

function ImageCropperRotate({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ImageCropperPrimitive.ImageCropperRotate>) {
  return (
    <ImageCropperPrimitive.ImageCropperRotate
      aria-label={children ? undefined : "Rotate"}
      className={mergeClassName(
        buttonVariants({
          variant: "outline",
          size: children ? "sm" : "icon-sm",
        }),
        className
      )}
      {...props}
    >
      {children ?? <IconRotateClockwise2 aria-hidden="true" />}
    </ImageCropperPrimitive.ImageCropperRotate>
  )
}

function ImageCropperFlip({
  className,
  children,
  direction = "horizontal",
  ...props
}: React.ComponentProps<typeof ImageCropperPrimitive.ImageCropperFlip>) {
  const Icon = direction === "vertical" ? IconFlipVertical : IconFlipHorizontal

  return (
    <ImageCropperPrimitive.ImageCropperFlip
      direction={direction}
      aria-label={
        children
          ? undefined
          : direction === "vertical"
            ? "Flip vertically"
            : "Flip horizontally"
      }
      className={mergeClassName(
        buttonVariants({
          variant: "outline",
          size: children ? "sm" : "icon-sm",
        }),
        className
      )}
      {...props}
    >
      {children ?? <Icon aria-hidden="true" />}
    </ImageCropperPrimitive.ImageCropperFlip>
  )
}

const createImageCropperController =
  ImageCropperPrimitive.createImageCropperController

export {
  ImageCropper,
  ImageCropperViewport,
  ImageCropperImage,
  ImageCropperSelection,
  ImageCropperGrid,
  ImageCropperHandle,
  ImageCropperHandles,
  ImageCropperZoom,
  ImageCropperRotate,
  ImageCropperFlip,
  createImageCropperController,
  imageCropperHandleVariants,
}
export type {
  ImageCrop,
  ImageCropperController,
  ImageCropperHandlePosition,
  ImageCropperMode,
  ImageCropperShape,
} from "@ui-sdk/react/image-cropper"
