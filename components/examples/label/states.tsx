"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LabelStates() {
  const [locked, setLocked] = React.useState(true)

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="flex flex-col gap-2">
        <Label htmlFor="label-states-domain">Custom domain</Label>
        <Input
          id="label-states-domain"
          defaultValue="docs.example.com"
          disabled={locked}
        />
      </div>
      <Button
        variant="outline"
        size="sm"
        className="self-start"
        onClick={() => setLocked(!locked)}
      >
        {locked ? "Unlock" : "Lock"}
      </Button>
    </div>
  )
}
