"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type Errors = {
  email?: { message: string }[]
  password?: { message: string }[]
}

export function FieldErrors() {
  const [errors, setErrors] = React.useState<Errors>({})

  return (
    <form
      className="w-full max-w-sm"
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const password = String(data.get("password") ?? "")
        const next: Errors = {}
        if (!String(data.get("email") ?? "").includes("@")) {
          next.email = [{ message: "Enter a valid email." }]
        }
        const problems = []
        if (password.length < 8) {
          problems.push({ message: "Use at least 8 characters." })
        }
        if (!/\d/.test(password)) {
          problems.push({ message: "Include a number." })
        }
        if (problems.length > 0) {
          next.password = problems
        }
        setErrors(next)
      }}
    >
      <FieldGroup>
        <Field invalid={Boolean(errors.email)}>
          <FieldLabel>Email</FieldLabel>
          <Input name="email" autoComplete="email" />
          <FieldError errors={errors.email ?? []} />
        </Field>
        <Field invalid={Boolean(errors.password)}>
          <FieldLabel>Password</FieldLabel>
          <Input name="password" type="password" autoComplete="new-password" />
          <FieldError errors={errors.password ?? []} />
        </Field>
        <Button type="submit">Sign up</Button>
      </FieldGroup>
    </form>
  )
}
