"use client"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const taken = ["admin", "ada", "hexta"]

async function checkUsername(value: unknown) {
  const name = String(value ?? "")
    .trim()
    .toLowerCase()
  if (name.length === 0) {
    return null
  }
  if (!/^[a-z0-9_]+$/.test(name)) {
    return "Use letters, numbers and underscores only."
  }
  await new Promise((resolve) => setTimeout(resolve, 400))
  return taken.includes(name) ? `“${name}” is taken.` : null
}

export function FieldCustomValidation() {
  return (
    <Field
      validationMode="onChange"
      validationDebounceTime={300}
      validate={checkUsername}
      className="max-w-sm"
    >
      <FieldLabel>Username</FieldLabel>
      <Input placeholder="Try “ada”" autoComplete="off" />
      <FieldDescription>Checked as you type.</FieldDescription>
      <FieldError />
    </Field>
  )
}
