import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"

export function InputOTPRtl() {
  return (
    <div
      dir="rtl"
      className="flex max-w-full min-w-0 flex-col items-start gap-2"
    >
      <Label htmlFor="input-otp-rtl">رمز التحقق</Label>
      <InputOTP id="input-otp-rtl" length={6} animated>
        <InputOTPGroup>
          <InputOTPSlot />
          <InputOTPSlot aria-label="الخانة ٢ من ٦" />
          <InputOTPSlot aria-label="الخانة ٣ من ٦" />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot aria-label="الخانة ٤ من ٦" />
          <InputOTPSlot aria-label="الخانة ٥ من ٦" />
          <InputOTPSlot aria-label="الخانة ٦ من ٦" />
        </InputOTPGroup>
      </InputOTP>
    </div>
  )
}
