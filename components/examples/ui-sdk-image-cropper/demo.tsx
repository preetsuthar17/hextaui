"use client"

import * as React from "react"
import { cropImage } from "@ui-sdk/react/image"

import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
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

const ratios = [
  { label: "Free", value: "free", ratio: undefined },
  { label: "Square", value: "square", ratio: 1 },
  { label: "Wide", value: "wide", ratio: 16 / 9 },
]

function UiSdkImageCropperDemo() {
  const [ratio, setRatio] = React.useState("wide")
  const [crop, setCrop] = React.useState<ImageCrop>()
  const [result, setResult] = React.useState<string>()

  React.useEffect(
    () => () => {
      if (result) URL.revokeObjectURL(result)
    },
    [result]
  )

  async function save() {
    if (!crop) return
    const file = await cropImage(photo, crop, { width: 480 })
    setResult(URL.createObjectURL(file))
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <ToggleGroup
        aria-label="Aspect ratio"
        value={[ratio]}
        onValueChange={(next) => {
          if (next[0]) setRatio(next[0])
        }}
        variant="outline"
        size="sm"
      >
        {ratios.map((item) => (
          <ToggleGroupItem key={item.value} value={item.value}>
            {item.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <ImageCropper
        aria-label="Photo"
        src={photo}
        aspectRatio={ratios.find((item) => item.value === ratio)?.ratio}
        minWidth={80}
        minHeight={80}
        crop={crop}
        onCropChange={setCrop}
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
        <Button size="sm" onClick={save} disabled={!crop}>
          Crop
        </Button>
        {crop && (
          <span className="text-sm text-muted-foreground tabular-nums">
            {Math.round(crop.width)} × {Math.round(crop.height)}
          </span>
        )}
      </div>
      {result && (
        <img
          src={result}
          alt="The cropped photo"
          className="w-full rounded-lg"
        />
      )}
    </div>
  )
}

export { UiSdkImageCropperDemo }
