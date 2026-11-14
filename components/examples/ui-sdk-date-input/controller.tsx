"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  DateInput,
  createDateInputController,
} from "@/components/ui/ui-sdk-date-input"

function UiSdkDateInputController() {
  const [controller] = React.useState(createDateInputController)

  return (
    <div className="flex w-full max-w-60 flex-col gap-2">
      <Label id="publish-on">Publish on</Label>
      <DateInput aria-labelledby="publish-on" controller={controller} />
      <div className="flex items-center gap-2 pt-1">
        <Button
          size="sm"
          variant="outline"
          onClick={() => controller.setValue("2026-12-25")}
        >
          Christmas
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => controller.focus("year")}
        >
          Edit year
        </Button>
        <Button size="sm" variant="ghost" onClick={() => controller.clear()}>
          Clear
        </Button>
      </div>
    </div>
  )
}

export { UiSdkDateInputController }
