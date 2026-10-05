"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  type InputOTPStatus,
} from "@/components/ui/input-otp"
import { toast } from "@/components/ui/toast"

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

function VerifyCard() {
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
    }, 1000)
  }

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex flex-col gap-1">
            <span className="text-base font-medium">
              {status === "success" ? "You’re in" : "Check your inbox"}
            </span>
            <span
              id="showcase-verify-hint"
              className="text-pretty text-muted-foreground"
            >
              {status === "success"
                ? "Code accepted. Welcome back."
                : "Type 123456 to pass. Anything else shakes."}
            </span>
          </div>
          <InputOTP
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
            aria-label="Verification code"
            aria-describedby="showcase-verify-hint"
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
          <Button
            variant="ghost"
            size="sm"
            feedback
            onClick={async () => {
              await wait(700)
              toast("New code sent", { description: "It’s still 123456." })
            }}
          >
            Resend code
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export { VerifyCard }
