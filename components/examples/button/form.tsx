"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { useButtonFeedback } from "@/hooks/use-button-feedback"

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

async function fail(ms: number) {
  await wait(ms)
  throw new Error("Invalid email")
}

export function ButtonForm() {
  const save = useButtonFeedback()
  const [email, setEmail] = React.useState("olivia@example.com")

  return (
    <form
      className="flex w-full max-w-sm items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault()
        save.track(email.includes("@") ? wait(900) : fail(600))
      }}
    >
      <input
        aria-label="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="h-9 min-w-0 flex-1 rounded-md border border-input bg-transparent px-3 text-sm transition-shadow outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden pointer-coarse:text-touch"
      />
      <Button
        type="submit"
        {...save.buttonProps}
        successLabel="Subscribed"
        errorLabel="Invalid email"
      >
        Subscribe
      </Button>
    </form>
  )
}
