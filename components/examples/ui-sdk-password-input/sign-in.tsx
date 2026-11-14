"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  PasswordInput,
  PasswordInputCapsLock,
  PasswordInputControl,
  PasswordInputGroup,
  PasswordInputToggle,
} from "@/components/ui/ui-sdk-password-input"

function UiSdkPasswordInputSignIn() {
  const [message, setMessage] = React.useState<string | null>(null)

  return (
    <form
      className="flex w-full max-w-64 flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const length = String(data.get("password")).length
        setMessage(
          `Signed in as ${data.get("email")}, with a password of ${length} characters.`
        )
      }}
      onReset={() => setMessage(null)}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="sign-in-email">Email</Label>
        <Input
          id="sign-in-email"
          name="email"
          type="email"
          autoComplete="username"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="sign-in-password">Password</Label>
        <PasswordInput name="password" required>
          <PasswordInputGroup>
            <PasswordInputControl id="sign-in-password" />
            <PasswordInputToggle />
          </PasswordInputGroup>
          <PasswordInputCapsLock />
        </PasswordInput>
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" size="sm">
          Sign in
        </Button>
        <Button type="reset" size="sm" variant="ghost">
          Reset
        </Button>
      </div>
      <p className="m-0 text-sm text-muted-foreground">
        {message ?? "Press Enter in the password to submit."}
      </p>
    </form>
  )
}

export { UiSdkPasswordInputSignIn }
