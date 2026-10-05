import { IconPointFilled } from "@tabler/icons-react"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export function InputOTPCustomSeparator() {
  return (
    <InputOTP length={6} variant="separate" aria-label="Pairing code">
      <InputOTPGroup>
        <InputOTPSlot />
        <InputOTPSlot />
      </InputOTPGroup>
      <InputOTPSeparator>
        <IconPointFilled aria-hidden="true" />
      </InputOTPSeparator>
      <InputOTPGroup>
        <InputOTPSlot />
        <InputOTPSlot />
      </InputOTPGroup>
      <InputOTPSeparator>
        <IconPointFilled aria-hidden="true" />
      </InputOTPSeparator>
      <InputOTPGroup>
        <InputOTPSlot />
        <InputOTPSlot />
      </InputOTPGroup>
    </InputOTP>
  )
}
