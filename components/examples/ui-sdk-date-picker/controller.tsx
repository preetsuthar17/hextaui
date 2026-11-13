"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  createDatePickerController,
  DatePicker,
  DatePickerContent,
  DatePickerControl,
  DatePickerInput,
  DatePickerTrigger,
  type DatePickerValue,
} from "@/components/ui/ui-sdk-date-picker"

function UiSdkDatePickerController() {
  const [picker] = React.useState(createDatePickerController)
  const [value, setValue] = React.useState<DatePickerValue>(null)

  return (
    <div className="flex w-full max-w-56 flex-col gap-3">
      <DatePicker controller={picker} onValueChange={setValue}>
        <DatePickerControl>
          <DatePickerInput aria-label="Party date" />
          <DatePickerTrigger />
        </DatePickerControl>
        <DatePickerContent />
      </DatePicker>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => picker.setValue("2026-12-25")}
        >
          Choose Christmas
        </Button>
        <Button variant="ghost" size="sm" onClick={() => picker.open()}>
          Open
        </Button>
      </div>
      <p className="text-sm text-muted-foreground tabular-nums">
        {typeof value === "string" ? value : "No date"}
      </p>
    </div>
  )
}

export { UiSdkDatePickerController }
