"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { NumberFlow } from "@/components/ui/number-flow"

export function NumberFlowRtl() {
  const [value, setValue] = React.useState(1250)

  return (
    <div dir="rtl" className="flex flex-col items-center gap-4">
      <NumberFlow
        value={value}
        locales="ar-EG"
        className="text-3xl font-semibold"
      />
      <Button variant="outline" size="sm" onClick={() => setValue(value + 17)}>
        ١٧+
      </Button>
    </div>
  )
}
