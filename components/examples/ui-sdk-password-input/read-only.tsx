import { Label } from "@/components/ui/label"
import {
  PasswordInput,
  PasswordInputControl,
  PasswordInputGroup,
  PasswordInputToggle,
} from "@/components/ui/ui-sdk-password-input"

function UiSdkPasswordInputReadOnly() {
  return (
    <div className="flex w-full max-w-64 flex-col gap-2">
      <Label htmlFor="recovery-key">Recovery key</Label>
      <PasswordInput readOnly defaultValue="7Hq2-vX9p-Lm4c" autoComplete="off">
        <PasswordInputGroup>
          <PasswordInputControl id="recovery-key" />
          <PasswordInputToggle aria-label="Show recovery key" />
        </PasswordInputGroup>
      </PasswordInput>
      <p className="m-0 text-xs text-muted-foreground">
        You can show it, but not change it.
      </p>
    </div>
  )
}

export { UiSdkPasswordInputReadOnly }
