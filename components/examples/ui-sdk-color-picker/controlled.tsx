"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerInput,
  ColorPickerSlider,
  createColorPickerController,
} from "@/components/ui/ui-sdk-color-picker"

function UiSdkColorPickerControlled() {
  const [picker] = React.useState(() => createColorPickerController())
  const [value, setValue] = React.useState("#0ea5e9")
  const [saved, setSaved] = React.useState("#0ea5e9")

  return (
    <div className="flex w-full max-w-64 flex-col gap-3">
      <ColorPicker
        aria-label="Theme color"
        value={value}
        onValueChange={setValue}
        onValueCommit={setSaved}
        controller={picker}
      >
        <ColorPickerArea />
        <ColorPickerSlider channel="hue" />
        <ColorPickerInput aria-label="Hex" />
      </ColorPicker>
      <div className="flex items-center justify-between gap-2 text-sm">
        <p className="text-muted-foreground">
          Saved <span className="font-mono text-foreground">{saved}</span>
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => picker.setValue("#663399")}
        >
          Use purple
        </Button>
      </div>
    </div>
  )
}

export { UiSdkColorPickerControlled }
