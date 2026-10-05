"use client"

import * as React from "react"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export function InputOTPField() {
  const [value, setValue] = React.useState("")
  const [error, setError] = React.useState<string>()

  return (
    <Field invalid={error !== undefined} className="w-fit">
      <FieldLabel>Verification code</FieldLabel>
      <InputOTP
        length={6}
        value={value}
        onValueChange={(next) => {
          setValue(next)
          setError(undefined)
        }}
        onValueComplete={(code) => {
          if (code !== "000000") {
            setError("That code has expired. Request a new one.")
          }
        }}
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
      <FieldDescription>We sent it to ada@example.com.</FieldDescription>
      <FieldError errors={error ? [{ message: error }] : []} />
    </Field>
  )
}
