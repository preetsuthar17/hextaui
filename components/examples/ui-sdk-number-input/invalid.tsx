"use client"

import * as React from "react"

import { Label } from "@/components/ui/label"
import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
} from "@/components/ui/ui-sdk-number-input"

const stock = 12

function UiSdkNumberInputInvalid() {
  const [quantity, setQuantity] = React.useState<number | null>(14)
  const invalid = quantity !== null && quantity > stock

  return (
    <div className="flex w-full max-w-40 flex-col gap-2">
      <Label htmlFor="order-quantity">Quantity</Label>
      <NumberInput
        defaultValue={14}
        min={1}
        invalid={invalid}
        onValueChange={(value) => setQuantity(value)}
      >
        <NumberInputGroup>
          <NumberInputDecrement />
          <NumberInputControl
            id="order-quantity"
            aria-describedby="order-quantity-message"
          />
          <NumberInputIncrement />
        </NumberInputGroup>
      </NumberInput>
      <p
        id="order-quantity-message"
        className={
          invalid
            ? "m-0 text-xs text-destructive"
            : "m-0 text-xs text-muted-foreground"
        }
      >
        {invalid ? `Only ${stock} left in stock.` : `${stock} in stock.`}
      </p>
    </div>
  )
}

export { UiSdkNumberInputInvalid }
