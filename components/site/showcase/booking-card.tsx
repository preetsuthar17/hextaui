"use client"

import * as React from "react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { toast } from "@/components/ui/toast"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const slots = ["09:30", "11:00", "14:30", "16:00"]

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

function BookingCard() {
  const [date, setDate] = React.useState<Date>()
  const [slot, setSlot] = React.useState("11:00")

  return (
    <Card size="sm">
      <CardContent className="items-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="w-fit"
        />
      </CardContent>
      <CardFooter className="border-t">
        <div className="flex w-full flex-col gap-3">
          <ToggleGroup
            aria-label="Time"
            size="sm"
            value={[slot]}
            onValueChange={(next) => {
              if (next[0]) {
                setSlot(next[0])
              }
            }}
          >
            {slots.map((item) => (
              <ToggleGroupItem key={item} value={item} className="flex-1">
                {item}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <Button
            feedback
            disabled={!date}
            onClick={async () => {
              await wait(900)
              if (date) {
                toast("Call booked", {
                  description: `${format(date, "EEEE, MMMM d")} at ${slot}.`,
                })
              }
            }}
          >
            {date ? `Book ${format(date, "MMM d")} at ${slot}` : "Pick a day"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export { BookingCard }
