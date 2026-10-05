import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export function InputOTPInvalid() {
  return (
    <div className="flex max-w-full min-w-0 flex-col items-start gap-2">
      <InputOTP
        length={6}
        defaultValue="111111"
        aria-invalid
        aria-label="Verification code"
        aria-describedby="input-otp-invalid-error"
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
      <p id="input-otp-invalid-error" className="text-sm text-destructive">
        That code doesn’t match. Check the latest message.
      </p>
    </div>
  )
}
