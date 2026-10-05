"use client"

import { Form } from "@base-ui/react/form"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const roles = [
  { value: "viewer", label: "Viewer" },
  { value: "editor", label: "Editor" },
  { value: "admin", label: "Admin" },
]

export function SelectField() {
  return (
    <Form
      className="flex w-full max-w-xs flex-col items-start gap-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <Field name="role">
        <FieldLabel>Role</FieldLabel>
        <Select items={roles} required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldDescription>Admins can invite people.</FieldDescription>
        <FieldError match="valueMissing">Choose a role to continue.</FieldError>
      </Field>
      <Button type="submit" size="sm">
        Invite
      </Button>
    </Form>
  )
}
