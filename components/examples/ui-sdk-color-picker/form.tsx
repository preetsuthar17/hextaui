"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerSlider,
  ColorPickerSwatch,
} from "@/components/ui/ui-sdk-color-picker"

function UiSdkColorPickerForm() {
  const [submitted, setSubmitted] = React.useState<string | null>(null)

  return (
    <form
      className="flex w-full max-w-64 flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitted(String(new FormData(event.currentTarget).get("brand")))
      }}
      onReset={() => setSubmitted(null)}
    >
      <ColorPicker aria-label="Brand color" name="brand" defaultValue="#f97316">
        <ColorPickerArea />
        <div className="flex items-center gap-2">
          <ColorPickerSwatch />
          <div className="min-w-0 flex-1">
            <ColorPickerSlider channel="hue" />
          </div>
        </div>
      </ColorPicker>
      <div className="flex gap-2">
        <Button type="submit" size="sm">
          Save
        </Button>
        <Button type="reset" variant="outline" size="sm">
          Reset
        </Button>
      </div>
      <p role="status" className="text-sm text-muted-foreground">
        {submitted ? (
          <>
            Submitted brand=
            <span className="font-mono text-foreground">{submitted}</span>
          </>
        ) : (
          "Nothing submitted yet."
        )}
      </p>
    </form>
  )
}

export { UiSdkColorPickerForm }
