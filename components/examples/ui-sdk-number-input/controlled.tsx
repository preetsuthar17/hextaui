"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
  createNumberInputController,
} from "@/components/ui/ui-sdk-number-input"

function UiSdkNumberInputControlled() {
  const [seats, setSeats] = React.useState<number | null>(5)
  const [saved, setSaved] = React.useState<number | null>(5)
  const [controller] = React.useState(createNumberInputController)

  return (
    <div className="flex w-full max-w-56 flex-col gap-2">
      <Label htmlFor="seats">Seats</Label>
      <NumberInput
        controller={controller}
        value={seats}
        min={1}
        max={50}
        onValueChange={(value) => setSeats(value)}
        onValueCommit={(value) => setSaved(value)}
      >
        <NumberInputGroup>
          <NumberInputDecrement />
          <NumberInputControl id="seats" />
          <NumberInputIncrement />
        </NumberInputGroup>
      </NumberInput>
      <div className="flex items-center gap-2 pt-1">
        <Button
          size="sm"
          variant="outline"
          onClick={() => controller.increment({ large: true })}
        >
          Add 10
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => controller.setValue(1)}
        >
          Reset to 1
        </Button>
      </div>
      <p className="m-0 text-xs text-muted-foreground tabular-nums">
        {`Showing ${seats ?? "nothing"}, saved ${saved ?? "nothing"}.`}
      </p>
    </div>
  )
}

export { UiSdkNumberInputControlled }
