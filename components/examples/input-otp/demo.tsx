"use client"

import * as React from "react"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  type InputOTPStatus,
} from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"

export function InputOTPDemo() {
  const [value, setValue] = React.useState("")
  const [status, setStatus] = React.useState<InputOTPStatus>("idle")
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  React.useEffect(() => () => clearTimeout(timer.current), [])

  function verify(code: string) {
    setStatus("loading")
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      if (code === "123456") {
        setStatus("success")
        return
      }
      setStatus("error")
      timer.current = setTimeout(() => {
        setValue("")
        setStatus("idle")
      }, 900)
    }, 1200)
  }

  return (
    <div className="flex max-w-full min-w-0 flex-col items-center gap-3">
      <Label htmlFor="input-otp-demo">Verification code</Label>
      <InputOTP
        id="input-otp-demo"
        length={6}
        variant="separate"
        animated
        status={status}
        value={value}
        onValueChange={(next) => {
          setValue(next)
          setStatus("idle")
        }}
        onValueComplete={verify}
        aria-describedby="input-otp-demo-hint"
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
      <p id="input-otp-demo-hint" className="text-sm text-muted-foreground">
        Type or paste 123456 to pass. Anything else fails.
      </p>
    </div>
  )
}
