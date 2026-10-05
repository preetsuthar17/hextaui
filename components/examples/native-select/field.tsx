"use client"

import { Form } from "@base-ui/react/form"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"

export function NativeSelectField() {
  return (
    <Form
      className="flex w-full max-w-sm flex-col gap-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <Field validationMode="onChange">
        <FieldLabel>Plan</FieldLabel>
        <NativeSelect name="plan" required className="w-full">
          <NativeSelectOption value="">Choose a plan</NativeSelectOption>
          <NativeSelectOption value="hobby">Hobby</NativeSelectOption>
          <NativeSelectOption value="pro">Pro</NativeSelectOption>
          <NativeSelectOption value="team">Team</NativeSelectOption>
        </NativeSelect>
        <FieldDescription>You can change this later.</FieldDescription>
        <FieldError match="valueMissing">Choose a plan to continue.</FieldError>
      </Field>
      <Button type="submit" className="self-start">
        Continue
      </Button>
    </Form>
  )
}
