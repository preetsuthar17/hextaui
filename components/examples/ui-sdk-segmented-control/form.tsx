"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/components/ui/ui-sdk-segmented-control"

function UiSdkSegmentedControlForm() {
  const [saved, setSaved] = React.useState<string | null>(null)

  return (
    <form
      className="flex flex-col items-start gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        setSaved(`theme=${data.get("theme")}, density=${data.get("density")}`)
      }}
    >
      <div className="flex flex-col gap-2">
        <p id="form-theme" className="m-0 text-sm font-medium">
          Theme
        </p>
        <SegmentedControl
          aria-labelledby="form-theme"
          name="theme"
          defaultValue="system"
          required
        >
          <SegmentedControlItem value="light">Light</SegmentedControlItem>
          <SegmentedControlItem value="dark">Dark</SegmentedControlItem>
          <SegmentedControlItem value="system">System</SegmentedControlItem>
        </SegmentedControl>
      </div>
      <div className="flex flex-col gap-2">
        <p id="form-density" className="m-0 text-sm font-medium">
          Density
        </p>
        <SegmentedControl
          aria-labelledby="form-density"
          name="density"
          defaultValue="comfortable"
        >
          <SegmentedControlItem value="compact">Compact</SegmentedControlItem>
          <SegmentedControlItem value="comfortable">
            Comfortable
          </SegmentedControlItem>
        </SegmentedControl>
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" size="sm">
          Save
        </Button>
        <Button type="reset" size="sm" variant="ghost">
          Reset
        </Button>
      </div>
      <p className="m-0 text-sm text-muted-foreground">
        {saved ? `Saved ${saved}` : "Nothing saved yet."}
      </p>
    </form>
  )
}

export { UiSdkSegmentedControlForm }
