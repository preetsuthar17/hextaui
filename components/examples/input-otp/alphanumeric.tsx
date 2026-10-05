"use client"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export function InputOTPAlphanumeric() {
  return (
    <InputOTP
      length={8}
      validationType="alphanumeric"
      normalizeValue={(value) => value.toUpperCase()}
      aria-label="Recovery code"
    >
      <InputOTPGroup>
        <InputOTPSlot />
        <InputOTPSlot />
        <InputOTPSlot />
        <InputOTPSlot />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot />
        <InputOTPSlot />
        <InputOTPSlot />
        <InputOTPSlot />
      </InputOTPGroup>
    </InputOTP>
  )
}
