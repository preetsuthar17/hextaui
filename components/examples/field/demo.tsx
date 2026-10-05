"use client"

import { Form } from "@base-ui/react/form"
import { IconAt } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldCounter,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldStatus,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group"

export function FieldDemo() {
  return (
    <Form
      className="w-full max-w-sm"
      onSubmit={(event) => event.preventDefault()}
    >
      <FieldGroup indicator="optional">
        <Field validationMode="onBlur">
          <FieldLabel>Display name</FieldLabel>
          <Input name="name" autoComplete="name" required />
          <FieldError match="valueMissing">
            Add the name people will see.
          </FieldError>
        </Field>
        <Field validationMode="onChange">
          <FieldLabel>Handle</FieldLabel>
          <InputGroup>
            <InputGroupInput
              name="handle"
              autoComplete="username"
              pattern="[a-z0-9_]{3,15}"
              maxLength={15}
              required
            />
            <InputGroupAddon>
              <IconAt />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <FieldStatus />
            </InputGroupAddon>
          </InputGroup>
          <FieldError match="valueMissing">Pick a handle.</FieldError>
          <FieldError match="patternMismatch">
            Use 3–15 lowercase letters, numbers or underscores.
          </FieldError>
        </Field>
        <Field>
          <FieldLabel>Bio</FieldLabel>
          <InputGroup>
            <InputGroupTextarea name="bio" maxLength={160} />
          </InputGroup>
          <div className="flex items-baseline justify-between gap-3">
            <FieldDescription>Shown on your profile.</FieldDescription>
            <FieldCounter />
          </div>
        </Field>
        <Button type="submit">Save profile</Button>
      </FieldGroup>
    </Form>
  )
}
