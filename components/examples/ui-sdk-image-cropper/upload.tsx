"use client"

import * as React from "react"

import { Input } from "@/components/ui/input"
import {
  ImageCropper,
  ImageCropperGrid,
  ImageCropperHandles,
  ImageCropperImage,
  ImageCropperSelection,
  ImageCropperViewport,
} from "@/components/ui/ui-sdk-image-cropper"

function UiSdkImageCropperUpload() {
  const [src, setSrc] = React.useState<string>()

  React.useEffect(
    () => () => {
      if (src) URL.revokeObjectURL(src)
    },
    [src]
  )

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Input
        type="file"
        accept="image/*"
        aria-label="Choose a photo"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) setSrc(URL.createObjectURL(file))
        }}
      />
      {src ? (
        <ImageCropper key={src} aria-label="Photo" src={src} aspectRatio={1}>
          <ImageCropperViewport>
            <ImageCropperImage alt="The photo you chose" />
            <ImageCropperSelection>
              <ImageCropperGrid />
              <ImageCropperHandles />
            </ImageCropperSelection>
          </ImageCropperViewport>
        </ImageCropper>
      ) : (
        <p className="text-sm text-muted-foreground">
          Choose a photo to crop it.
        </p>
      )}
    </div>
  )
}

export { UiSdkImageCropperUpload }
