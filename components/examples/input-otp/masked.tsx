import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export function InputOTPMasked() {
  return (
    <InputOTP
      length={4}
      mask
      animated
      variant="separate"
      autoComplete="off"
      aria-label="PIN"
    >
      <InputOTPGroup>
        <InputOTPSlot />
        <InputOTPSlot />
        <InputOTPSlot />
        <InputOTPSlot />
      </InputOTPGroup>
    </InputOTP>
  )
}
