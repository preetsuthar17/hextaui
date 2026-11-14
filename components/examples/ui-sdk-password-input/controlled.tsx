"use client"

import * as React from "react"

import { Label } from "@/components/ui/label"
import {
  PasswordInput,
  PasswordInputControl,
  PasswordInputGroup,
  PasswordInputToggle,
} from "@/components/ui/ui-sdk-password-input"

function UiSdkPasswordInputControlled() {
  const [visible, setVisible] = React.useState(false)
  const [reason, setReason] = React.useState<string | null>(null)

  return (
    <div className="flex w-full max-w-64 flex-col gap-2">
      <Label htmlFor="controlled-password">Password</Label>
      <PasswordInput
        visible={visible}
        onVisibleChange={(next, details) => {
          setVisible(next)
          setReason(details.reason)
        }}
      >
        <PasswordInputGroup>
          <PasswordInputControl id="controlled-password" />
          <PasswordInputToggle />
        </PasswordInputGroup>
      </PasswordInput>
      <p className="m-0 text-xs text-muted-foreground">
        {reason
          ? `${visible ? "Shown" : "Hidden"} by ${reason}.`
          : "Hidden. Press the eye to show it."}
      </p>
    </div>
  )
}

export { UiSdkPasswordInputControlled }
