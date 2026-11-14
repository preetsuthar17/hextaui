"use client"

import * as React from "react"
import { IconSparkles } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  PasswordInput,
  PasswordInputControl,
  PasswordInputGroup,
  PasswordInputStrength,
  PasswordInputToggle,
  createPasswordInputController,
} from "@/components/ui/ui-sdk-password-input"

const alphabet =
  "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789-_!?"

function generatePassword(length = 20) {
  const bytes = crypto.getRandomValues(new Uint32Array(length))
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("")
}

function UiSdkPasswordInputController() {
  const [password] = React.useState(createPasswordInputController)

  return (
    <div className="flex w-full max-w-72 flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor="generated-password">New password</Label>
        <Button
          size="xs"
          variant="ghost"
          onClick={() => {
            password.setValue(generatePassword())
            password.setVisible(true)
            password.focus()
          }}
        >
          <IconSparkles aria-hidden="true" />
          Suggest
        </Button>
      </div>
      <PasswordInput controller={password} autoComplete="new-password">
        <PasswordInputGroup>
          <PasswordInputControl id="generated-password" />
          <PasswordInputToggle />
        </PasswordInputGroup>
        <PasswordInputStrength />
      </PasswordInput>
      <div className="flex gap-2 pt-1">
        <Button
          size="sm"
          variant="outline"
          onClick={() => password.toggleVisible()}
        >
          Toggle
        </Button>
        <Button size="sm" variant="ghost" onClick={() => password.clear()}>
          Clear
        </Button>
      </div>
    </div>
  )
}

export { UiSdkPasswordInputController }
