"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

export function CheckboxForm() {
  const [submitted, setSubmitted] = React.useState<string>()

  return (
    <form
      className="flex flex-col items-start gap-3 text-sm"
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        setSubmitted(JSON.stringify(Object.fromEntries(data.entries())))
      }}
    >
      <label className="flex items-center gap-3">
        <Checkbox name="terms" required />I agree to the terms
      </label>
      <label className="flex items-center gap-3">
        <Checkbox name="newsletter" value="weekly" defaultChecked />
        Weekly newsletter
      </label>
      <Button type="submit" size="sm">
        Submit
      </Button>
      <output className="text-muted-foreground">
        {submitted ?? "Nothing submitted yet."}
      </output>
    </form>
  )
}
