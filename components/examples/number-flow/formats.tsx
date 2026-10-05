"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { NumberFlow } from "@/components/ui/number-flow"

const factors = [1, 1.37, 0.62, 2.91]

export function NumberFlowFormats() {
  const [step, setStep] = React.useState(0)
  const factor = factors[step % factors.length]

  const rows = [
    {
      label: "Currency",
      value: (
        <NumberFlow
          value={1234.56 * factor}
          format={{ style: "currency", currency: "USD" }}
        />
      ),
    },
    {
      label: "Percent",
      value: (
        <NumberFlow
          value={0.4213 * factor}
          format={{ style: "percent", maximumFractionDigits: 1 }}
        />
      ),
    },
    {
      label: "Compact",
      value: (
        <NumberFlow
          value={1234567 * factor}
          format={{ notation: "compact", maximumFractionDigits: 1 }}
        />
      ),
    },
    {
      label: "Fixed decimals",
      value: (
        <NumberFlow
          value={3.14159 * factor}
          format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
        />
      ),
    },
    {
      label: "de-DE",
      value: <NumberFlow value={9876543.21 * factor} locales="de-DE" />,
    },
    {
      label: "Signed",
      value: (
        <NumberFlow
          value={(factor - 1) * 100}
          format={{ signDisplay: "exceptZero", maximumFractionDigits: 0 }}
          suffix="%"
        />
      ),
    },
    {
      label: "ar-EG",
      value: (
        <NumberFlow
          value={4821 * factor}
          locales="ar-EG"
          format={{ maximumFractionDigits: 0 }}
        />
      ),
    },
    {
      label: "Prefix and suffix",
      value: (
        <NumberFlow
          value={Math.round(1840 * factor)}
          prefix="~"
          suffix=" users"
        />
      ),
    },
  ]

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-4 border-b py-1.5"
          >
            <dt className="text-muted-foreground">{row.label}</dt>
            <dd className="font-medium">{row.value}</dd>
          </div>
        ))}
      </dl>
      <Button
        variant="outline"
        size="sm"
        className="self-start"
        onClick={() => setStep(step + 1)}
      >
        Change values
      </Button>
    </div>
  )
}
