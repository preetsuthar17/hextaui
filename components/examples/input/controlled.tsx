"use client"

import * as React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const limit = 32

export function InputControlled() {
  const [value, setValue] = React.useState("Quarterly planning")

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="input-controlled">Project name</Label>
      <Input
        id="input-controlled"
        value={value}
        maxLength={limit}
        onValueChange={setValue}
        aria-describedby="input-controlled-count"
      />
      <p
        id="input-controlled-count"
        className="text-end text-sm text-muted-foreground tabular-nums"
      >
        {value.length}/{limit}
      </p>
    </div>
  )
}
