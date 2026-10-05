"use client"

import * as React from "react"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  type InputOTPStatus,
} from "@/components/ui/input-otp"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const statuses: InputOTPStatus[] = ["idle", "loading", "success", "error"]

export function InputOTPStatusExample() {
  const [status, setStatus] = React.useState<InputOTPStatus>("loading")

  return (
    <div className="flex max-w-full min-w-0 flex-col items-center gap-4">
      <InputOTP
        length={6}
        variant="separate"
        animated
        status={status}
        defaultValue="381904"
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
      <ToggleGroup
        aria-label="Status"
        size="sm"
        value={[status]}
        onValueChange={(next) => {
          if (next[0]) {
            setStatus(next[0] as InputOTPStatus)
          }
        }}
      >
        {statuses.map((item) => (
          <ToggleGroupItem key={item} value={item}>
            {item}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
