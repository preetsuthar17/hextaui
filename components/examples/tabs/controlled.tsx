"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const steps = ["Cart", "Shipping", "Payment", "Review"]

export function TabsControlled() {
  const [step, setStep] = React.useState("Cart")
  const index = steps.indexOf(step)

  return (
    <div className="flex flex-col items-start gap-4">
      <Tabs value={step} onValueChange={(value) => setStep(String(value))}>
        <TabsList>
          {steps.map((item) => (
            <TabsTrigger key={item} value={item}>
              {item}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setStep(steps[(index + 1) % steps.length])}
      >
        Next step
      </Button>
    </div>
  )
}
