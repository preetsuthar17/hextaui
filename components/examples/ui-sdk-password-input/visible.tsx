import { Label } from "@/components/ui/label"
import {
  PasswordInput,
  PasswordInputControl,
  PasswordInputGroup,
  PasswordInputToggle,
} from "@/components/ui/ui-sdk-password-input"

function UiSdkPasswordInputVisible() {
  return (
    <div className="flex w-full max-w-64 flex-col gap-2">
      <Label htmlFor="wifi-password">Wi-Fi password</Label>
      <PasswordInput
        defaultVisible
        defaultValue="maple-orbit-42"
        autoComplete="off"
      >
        <PasswordInputGroup>
          <PasswordInputControl id="wifi-password" />
          <PasswordInputToggle />
        </PasswordInputGroup>
      </PasswordInput>
      <p className="m-0 text-xs text-muted-foreground">
        Guests read it from here, so it starts shown.
      </p>
    </div>
  )
}

export { UiSdkPasswordInputVisible }
