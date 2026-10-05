"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const speeds = ["0.5×", "1×", "1.5×", "2×"]

export function RadioGroupControlled() {
  const [speed, setSpeed] = React.useState("1×")

  return (
    <div className="flex flex-col items-start gap-4 text-sm">
      <RadioGroup
        aria-label="Playback speed"
        value={speed}
        onValueChange={setSpeed}
        className="flex w-fit flex-wrap"
      >
        {speeds.map((value) => (
          <label key={value} className="flex items-center gap-2 tabular-nums">
            <RadioGroupItem value={value} />
            {value}
          </label>
        ))}
      </RadioGroup>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          setSpeed(speeds[(speeds.indexOf(speed) + 1) % speeds.length])
        }
      >
        Next speed
      </Button>
    </div>
  )
}
