"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { useInvalidShake } from "@/hooks/use-invalid-shake"

export function UseInvalidShakeDemo() {
  const ref = React.useRef<HTMLSelectElement>(null)
  const [sent, setSent] = React.useState<string>()
  useInvalidShake(ref)

  return (
    <form
      className="flex w-full max-w-xs flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        setSent(String(new FormData(event.currentTarget).get("plan")))
      }}
    >
      <label className="flex flex-col gap-2 text-sm font-medium">
        Plan
        <select
          ref={ref}
          name="plan"
          required
          defaultValue=""
          className="h-9 rounded-md bg-muted px-2.5 text-sm font-normal outline-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden data-shake:motion-safe:animate-button-shake pointer-coarse:text-touch [&:user-invalid]:ring-2 [&:user-invalid]:ring-destructive/40"
        >
          <option value="" disabled>
            Choose a plan
          </option>
          <option value="hobby">Hobby</option>
          <option value="pro">Pro</option>
        </select>
      </label>
      <Button type="submit" size="sm">
        Continue
      </Button>
      <output className="text-sm text-muted-foreground">
        {sent ? `plan=${sent}` : "Submit without choosing."}
      </output>
    </form>
  )
}
