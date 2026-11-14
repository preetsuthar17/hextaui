import { Label } from "@/components/ui/label"
import {
  PasswordInput,
  PasswordInputCapsLock,
  PasswordInputControl,
  PasswordInputGroup,
  PasswordInputStrength,
  PasswordInputToggle,
} from "@/components/ui/ui-sdk-password-input"

function UiSdkPasswordInputRtl() {
  return (
    <div dir="rtl" className="flex w-full max-w-64 flex-col gap-2">
      <Label htmlFor="rtl-password">كلمة المرور</Label>
      <PasswordInput autoComplete="new-password">
        <PasswordInputGroup>
          <PasswordInputControl id="rtl-password" />
          <PasswordInputToggle aria-label="إظهار كلمة المرور" />
        </PasswordInputGroup>
        <PasswordInputCapsLock>مفتاح الأحرف الكبيرة مفعّل</PasswordInputCapsLock>
        <PasswordInputStrength
          label="قوة كلمة المرور"
          labels={["", "ضعيفة", "مقبولة", "جيدة", "قوية"]}
        />
      </PasswordInput>
    </div>
  )
}

export { UiSdkPasswordInputRtl }
