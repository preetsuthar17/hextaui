import { Label } from "@/components/ui/label"
import {
  PasswordInput,
  PasswordInputControl,
  PasswordInputGroup,
  PasswordInputToggle,
} from "@/components/ui/ui-sdk-password-input"

function UiSdkPasswordInputDisabled() {
  return (
    <div className="flex w-full max-w-64 flex-col gap-2">
      <Label htmlFor="managed-password">Password</Label>
      <PasswordInput disabled defaultValue="hunter22">
        <PasswordInputGroup>
          <PasswordInputControl id="managed-password" />
          <PasswordInputToggle />
        </PasswordInputGroup>
      </PasswordInput>
      <p className="m-0 text-xs text-muted-foreground">
        Your administrator manages this password.
      </p>
    </div>
  )
}

export { UiSdkPasswordInputDisabled }
