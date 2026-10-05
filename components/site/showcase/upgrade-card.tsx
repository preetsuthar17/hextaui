"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { NumberFlow } from "@/components/ui/number-flow"
import { Slider, SliderLabel, SliderValue } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/toast"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const prices = { monthly: 12, yearly: 10 }

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

function UpgradeCard() {
  const [billing, setBilling] = React.useState<keyof typeof prices>("yearly")
  const [seats, setSeats] = React.useState(8)
  const [support, setSupport] = React.useState(false)
  const total = seats * prices[billing] + (support ? 29 : 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upgrade to Pro</CardTitle>
        <CardDescription>For growing teams</CardDescription>
        <CardAction>
          <ToggleGroup
            aria-label="Billing"
            size="sm"
            value={[billing]}
            onValueChange={(next) => {
              if (next[0]) {
                setBilling(next[0] as keyof typeof prices)
              }
            }}
          >
            <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
            <ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <Slider value={seats} onValueChange={setSeats} min={1} max={50}>
            <SliderLabel>Seats</SliderLabel>
            <SliderValue />
          </Slider>
          <label className="flex items-center justify-between gap-4">
            <span className="flex flex-col gap-0.5">
              <span className="font-medium">Priority support</span>
              <span className="text-muted-foreground">
                Replies within an hour
              </span>
            </span>
            <Switch checked={support} onCheckedChange={setSupport} />
          </label>
        </div>
      </CardContent>
      <CardFooter className="items-end justify-between">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">
            {billing === "yearly" ? "Per month, billed yearly" : "Per month"}
          </span>
          <NumberFlow
            value={total}
            prefix="$"
            className="text-3xl font-semibold tracking-tight"
          />
        </div>
        <Button
          feedback
          onClick={async () => {
            await wait(900)
            toast("Plan upgraded", {
              description: `${seats} ${seats === 1 ? "seat" : "seats"} at $${total} a month.`,
            })
          }}
        >
          Upgrade
        </Button>
      </CardFooter>
    </Card>
  )
}

export { UpgradeCard }
