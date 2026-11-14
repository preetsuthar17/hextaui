"use client"

import { IconCheck, IconCircleDashed } from "@tabler/icons-react"

import { Label } from "@/components/ui/label"
import {
  PasswordInput,
  PasswordInputCapsLock,
  PasswordInputControl,
  PasswordInputGroup,
  PasswordInputStrength,
  PasswordInputToggle,
  usePasswordInputValue,
} from "@/components/ui/ui-sdk-password-input"

const rules = [
  {
    label: "At least 12 characters",
    test: (password: string) => password.length >= 12,
  },
  { label: "A number", test: (password: string) => /\d/.test(password) },
  {
    label: "An uppercase and a lowercase letter",
    test: (password: string) =>
      /[a-z]/.test(password) && /[A-Z]/.test(password),
  },
]

function Requirements() {
  const password = usePasswordInputValue()
  return (
    <ul
      aria-label="Password requirements"
      className="m-0 flex list-none flex-col gap-1 p-0 pt-3 text-xs"
    >
      {rules.map((rule) => {
        const done = rule.test(password)
        return (
          <li
            key={rule.label}
            className={
              done
                ? "flex items-center gap-1.5 text-foreground"
                : "flex items-center gap-1.5 text-muted-foreground"
            }
          >
            {done ? (
              <IconCheck aria-hidden="true" className="size-3.5 text-success" />
            ) : (
              <IconCircleDashed aria-hidden="true" className="size-3.5" />
            )}
            <span className="sr-only">{done ? "Done:" : "To do:"}</span>
            {rule.label}
          </li>
        )
      })}
    </ul>
  )
}

function UiSdkPasswordInputNewPassword() {
  return (
    <div className="flex w-full max-w-64 flex-col gap-2">
      <Label htmlFor="create-password">Create a password</Label>
      <PasswordInput autoComplete="new-password">
        <PasswordInputGroup>
          <PasswordInputControl id="create-password" />
          <PasswordInputToggle />
        </PasswordInputGroup>
        <PasswordInputCapsLock />
        <PasswordInputStrength />
        <Requirements />
      </PasswordInput>
    </div>
  )
}

export { UiSdkPasswordInputNewPassword }
