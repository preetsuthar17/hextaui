"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  createImageCropperController,
  ImageCropper,
  ImageCropperGrid,
  ImageCropperHandles,
  ImageCropperImage,
  ImageCropperSelection,
  ImageCropperViewport,
  type ImageCrop,
} from "@/components/ui/ui-sdk-image-cropper"

const photo =
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80&auto=format&fit=crop"

const start = { x: 120, y: 80, width: 480, height: 480 }

function UiSdkImageCropperControlled() {
  const [cropper] = React.useState(createImageCropperController)
  const [saved, setSaved] = React.useState<ImageCrop | null>(null)

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <ImageCropper
        aria-label="Photo"
        src={photo}
        aspectRatio={1}
        defaultCrop={start}
        controller={cropper}
        onCropCommit={setSaved}
      >
        <ImageCropperViewport>
          <ImageCropperImage alt="A rowing boat on a green mountain lake" />
          <ImageCropperSelection>
            <ImageCropperGrid />
            <ImageCropperHandles />
          </ImageCropperSelection>
        </ImageCropperViewport>
      </ImageCropper>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => cropper.setCrop(start)}
        >
          Reset
        </Button>
        <span className="text-sm text-muted-foreground tabular-nums">
          {saved
            ? `Saved ${Math.round(saved.width)} × ${Math.round(saved.height)} at ${Math.round(saved.x)}, ${Math.round(saved.y)}`
            : "Move the crop to save it."}
        </span>
      </div>
    </div>
  )
}

export { UiSdkImageCropperControlled }
