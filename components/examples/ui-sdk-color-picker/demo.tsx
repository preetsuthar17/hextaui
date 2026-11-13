"use client"

import * as React from "react"

import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerEyeDropper,
  ColorPickerInput,
  ColorPickerPopover,
  ColorPickerSlider,
  ColorPickerSwatch,
  ColorPickerSwatches,
  ColorPickerSwatchItem,
  ColorPickerTrigger,
} from "@/components/ui/ui-sdk-color-picker"

const presets = [
  "#0f172a",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#0ea5e9",
  "#6366f1",
  "#a855f7",
  "#ec4899",
]

function UiSdkColorPickerDemo() {
  const [value, setValue] = React.useState("#6366f1")

  return (
    <ColorPicker
      aria-label="Accent color"
      value={value}
      onValueChange={setValue}
    >
      <ColorPickerPopover>
        <ColorPickerTrigger aria-label={`Accent color, ${value}`}>
          <ColorPickerSwatch />
          <span className="font-mono text-xs uppercase tabular-nums">
            {value}
          </span>
        </ColorPickerTrigger>
        <ColorPickerContent>
          <ColorPickerArea />
          <ColorPickerSlider channel="hue" />
          <div className="flex items-center gap-2">
            <ColorPickerInput aria-label="Hex" />
            <ColorPickerEyeDropper aria-label="Pick a color from the screen" />
          </div>
          <ColorPickerSwatches aria-label="Presets">
            {presets.map((preset) => (
              <ColorPickerSwatchItem key={preset} value={preset} />
            ))}
          </ColorPickerSwatches>
        </ColorPickerContent>
      </ColorPickerPopover>
    </ColorPicker>
  )
}

export { UiSdkColorPickerDemo }
