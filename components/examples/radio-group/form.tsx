"use client"

import * as React from "react"
import { Form } from "@base-ui/react/form"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldItem,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function RadioGroupForm() {
  const [submitted, setSubmitted] = React.useState<string>()

  return (
    <Form
      className="flex w-full max-w-xs flex-col items-start gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitted(String(new FormData(event.currentTarget).get("shipping")))
      }}
    >
      <Field name="shipping">
        <FieldSet render={<RadioGroup required />}>
          <FieldLegend variant="label">Shipping</FieldLegend>
          {["Standard", "Express", "Overnight"].map((option) => (
            <FieldItem key={option}>
              <RadioGroupItem value={option.toLowerCase()} />
              <FieldLabel>{option}</FieldLabel>
            </FieldItem>
          ))}
        </FieldSet>
        <FieldError match="valueMissing">Choose a shipping speed.</FieldError>
      </Field>
      <Button type="submit" size="sm">
        Continue
      </Button>
      <output className="text-sm text-muted-foreground">
        {submitted ? `shipping=${submitted}` : "Nothing submitted yet."}
      </output>
    </Form>
  )
}
