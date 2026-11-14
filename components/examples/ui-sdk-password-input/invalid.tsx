"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  PasswordInput,
  PasswordInputControl,
  PasswordInputGroup,
  PasswordInputToggle,
} from "@/components/ui/ui-sdk-password-input"

function UiSdkPasswordInputInvalid() {
  const [invalid, setInvalid] = React.useState(true)

  return (
    <form
      className="flex w-full max-w-64 flex-col gap-2"
      onSubmit={(event) => {
        event.preventDefault()
        const password = new FormData(event.currentTarget).get("password")
        setInvalid(password !== "correct-horse")
      }}
    >
      <Label htmlFor="checked-password">Password</Label>
      <PasswordInput
        name="password"
        invalid={invalid}
        onValueChange={() => setInvalid(false)}
      >
        <PasswordInputGroup>
          <PasswordInputControl
            id="checked-password"
            aria-describedby={invalid ? "checked-password-error" : undefined}
          />
          <PasswordInputToggle />
        </PasswordInputGroup>
      </PasswordInput>
      {invalid ? (
        <p
          id="checked-password-error"
          className="m-0 text-xs text-destructive"
        >
          That password isn’t right. Try “correct-horse”.
        </p>
      ) : null}
      <Button type="submit" size="sm" className="mt-1 self-start">
        Unlock
      </Button>
    </form>
  )
}

export { UiSdkPasswordInputInvalid }
