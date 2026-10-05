"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Slider, SliderLabel, SliderValue } from "@/components/ui/slider"

export function SliderControlled() {
  const [value, setValue] = React.useState(40)
  const [saved, setSaved] = React.useState(40)

  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <Slider
        value={value}
        onValueChange={setValue}
        onValueCommitted={setSaved}
      >
        <SliderLabel>Brightness</SliderLabel>
        <SliderValue />
      </Slider>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">Saved: {saved}</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setValue(0)}>
            Off
          </Button>
          <Button variant="outline" size="sm" onClick={() => setValue(100)}>
            Max
          </Button>
        </div>
      </div>
    </div>
  )
}
