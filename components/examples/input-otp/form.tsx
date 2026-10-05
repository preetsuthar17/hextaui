"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"

export function InputOTPForm() {
  const [submitted, setSubmitted] = React.useState<string>()

  return (
    <form
      className="flex max-w-full min-w-0 flex-col items-start gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitted(String(new FormData(event.currentTarget).get("code")))
      }}
    >
      <Label htmlFor="input-otp-form">Sign-in code</Label>
      <InputOTP id="input-otp-form" name="code" length={6} required autoSubmit>
        <InputOTPGroup>
          <InputOTPSlot />
          <InputOTPSlot />
          <InputOTPSlot />
          <InputOTPSlot />
          <InputOTPSlot />
          <InputOTPSlot />
        </InputOTPGroup>
      </InputOTP>
      <div className="flex items-center gap-3">
        <Button type="submit" size="sm">
          Continue
        </Button>
        <p role="status" className="text-sm text-muted-foreground tabular-nums">
          {submitted ? `Submitted ${submitted}` : null}
        </p>
      </div>
    </form>
  )
}
