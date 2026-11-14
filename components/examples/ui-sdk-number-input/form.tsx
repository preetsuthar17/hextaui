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
} from "@/components/ui/ui-sdk-number-input"

function UiSdkNumberInputForm() {
  const [submitted, setSubmitted] = React.useState<string | null>(null)

  return (
    <form
      className="flex w-full max-w-48 flex-col gap-2"
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitted(String(new FormData(event.currentTarget).get("amount")))
      }}
      onReset={() => setSubmitted(null)}
    >
      <Label htmlFor="amount">Amount</Label>
      <NumberInput
        name="amount"
        required
        min={1}
        step={0.01}
        defaultValue={1250}
        locale="en-US"
        format={{ style: "currency", currency: "USD" }}
      >
        <NumberInputGroup>
          <NumberInputDecrement />
          <NumberInputControl id="amount" />
          <NumberInputIncrement />
        </NumberInputGroup>
      </NumberInput>
      <div className="flex items-center gap-3 pt-1">
        <Button type="submit" size="sm">
          Submit
        </Button>
        <Button type="reset" size="sm" variant="ghost">
          Reset
        </Button>
      </div>
      <p className="m-0 text-xs text-muted-foreground tabular-nums">
        {submitted === null
          ? "Nothing submitted yet."
          : `Submitted amount=${submitted}`}
      </p>
    </form>
  )
}

export { UiSdkNumberInputForm }
