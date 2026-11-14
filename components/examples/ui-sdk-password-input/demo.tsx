import { Label } from "@/components/ui/label"
import {
  PasswordInput,
  PasswordInputCapsLock,
  PasswordInputControl,
  PasswordInputGroup,
  PasswordInputToggle,
} from "@/components/ui/ui-sdk-password-input"

function UiSdkPasswordInputDemo() {
  return (
    <div className="flex w-full max-w-64 flex-col gap-2">
      <Label htmlFor="demo-password">Password</Label>
      <PasswordInput>
        <PasswordInputGroup>
          <PasswordInputControl id="demo-password" />
          <PasswordInputToggle />
        </PasswordInputGroup>
        <PasswordInputCapsLock />
      </PasswordInput>
    </div>
  )
}

export { UiSdkPasswordInputDemo }
