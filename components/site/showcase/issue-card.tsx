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
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import {
  Field,
  FieldCounter,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"

const people = [
  "Preet Suthar",
  "shadcn",
  "Guillermo Rauch",
  "Lee Robinson",
  "Emil Kowalski",
  "Jhey Tompkins",
]

const priorities = [
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
]

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

function IssueCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Report an issue</CardTitle>
        <CardDescription>We read every one.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel>Assignee</FieldLabel>
              <Combobox items={people}>
                <ComboboxInput placeholder="Search…" />
                <ComboboxContent>
                  <ComboboxEmpty>No one found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item: string) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Field>
            <Field>
              <FieldLabel>Priority</FieldLabel>
              <Select items={priorities} defaultValue="high">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field>
            <FieldLabel>What happened?</FieldLabel>
            <Textarea
              maxLength={240}
              placeholder="Steps to reproduce, what you expected…"
            />
            <FieldCounter />
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter>
        <Button
          feedback
          className="w-full"
          onClick={async () => {
            await wait(900)
            toast("Issue filed", { description: "HEX-1482 is in triage." })
          }}
        >
          Submit
        </Button>
      </CardFooter>
    </Card>
  )
}

export { IssueCard }
