"use client"

import * as React from "react"
import type { DateRange } from "react-day-picker"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DateRangePicker } from "@/components/ui/date-picker"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

function AwayCard() {
  const [range, setRange] = React.useState<DateRange | null>(null)
  const [reply, setReply] = React.useState(true)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Out of office</CardTitle>
        <CardDescription>Let people know you’re away.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel>Dates</FieldLabel>
            <DateRangePicker
              value={range}
              onValueChange={setRange}
              clearable
              className="w-full"
            />
          </Field>
          <label className="flex items-center justify-between gap-4">
            <span className="flex flex-col gap-0.5">
              <span className="font-medium">Auto-reply</span>
              <span className="text-muted-foreground">
                Answer new messages for you.
              </span>
            </span>
            <Switch checked={reply} onCheckedChange={setReply} />
          </label>
          {reply ? (
            <Textarea
              aria-label="Auto-reply message"
              defaultValue="Thanks for your note. I’m away and will reply when I’m back."
            />
          ) : null}
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export { AwayCard }
