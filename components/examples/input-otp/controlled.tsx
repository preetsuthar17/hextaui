"use client"

import * as React from "react"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export function InputOTPControlled() {
  const [value, setValue] = React.useState("")

  return (
    <div className="flex max-w-full min-w-0 flex-col items-center gap-3">
      <InputOTP
        length={6}
        value={value}
        onValueChange={setValue}
        aria-label="Verification code"
      >
        <InputOTPGroup>
          <InputOTPSlot />
          <InputOTPSlot />
          <InputOTPSlot />
          <InputOTPSlot />
          <InputOTPSlot />
          <InputOTPSlot />
        </InputOTPGroup>
      </InputOTP>
      <p className="text-sm text-muted-foreground tabular-nums">
        {value === "" ? "Enter your code." : `You entered: ${value}`}
      </p>
    </div>
  )
}
