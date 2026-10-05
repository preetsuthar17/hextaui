"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export function InputOTPAnimated() {
  const [value, setValue] = React.useState("")

  return (
    <div className="flex max-w-full min-w-0 flex-col items-center gap-4">
      <InputOTP
        length={6}
        variant="separate"
        animated
        value={value}
        onValueChange={setValue}
        aria-label="Verification code"
      >
        <InputOTPGroup>
          <InputOTPSlot />
          <InputOTPSlot />
          <InputOTPSlot />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot />
          <InputOTPSlot />
          <InputOTPSlot />
        </InputOTPGroup>
      </InputOTP>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => setValue("482913")}>
          Fill code
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setValue("")}>
          Clear
        </Button>
      </div>
    </div>
  )
}
