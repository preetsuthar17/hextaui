"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { toast } from "@/components/ui/toast"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const methods = [
  { value: "card", label: "Card" },
  { value: "paypal", label: "PayPal" },
  { value: "apple", label: "Apple Pay" },
]

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

function PaymentCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment method</CardTitle>
        <CardDescription>Add a new way to pay.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <ToggleGroup
            variant="outline"
            aria-label="Payment method"
            defaultValue={["card"]}
            className="w-full"
          >
            {methods.map((method) => (
              <ToggleGroupItem
                key={method.value}
                value={method.value}
                className="flex-1"
              >
                {method.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <Field>
            <FieldLabel>Name on card</FieldLabel>
            <Input autoComplete="cc-name" defaultValue="Preet Suthar" />
          </Field>
          <Field>
            <FieldLabel>Card number</FieldLabel>
            <Input
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="4242 4242 4242 4242"
            />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field>
              <FieldLabel>Month</FieldLabel>
              <NativeSelect defaultValue="10" className="w-full">
                {Array.from({ length: 12 }, (_, index) => {
                  const month = String(index + 1).padStart(2, "0")
                  return (
                    <NativeSelectOption key={month} value={month}>
                      {month}
                    </NativeSelectOption>
                  )
                })}
              </NativeSelect>
            </Field>
            <Field>
              <FieldLabel>Year</FieldLabel>
              <NativeSelect defaultValue="2028" className="w-full">
                {[2026, 2027, 2028, 2029, 2030].map((year) => (
                  <NativeSelectOption key={year} value={String(year)}>
                    {year}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
            <Field>
              <FieldLabel>CVC</FieldLabel>
              <Input
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="123"
              />
            </Field>
          </div>
        </FieldGroup>
      </CardContent>
      <CardFooter>
        <Button
          feedback
          className="w-full"
          onClick={async () => {
            await wait(1000)
            toast("Card added", { description: "Ending in 4242." })
          }}
        >
          Save card
        </Button>
      </CardFooter>
    </Card>
  )
}

export { PaymentCard }
