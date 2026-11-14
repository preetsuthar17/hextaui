"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  SegmentedControl,
  SegmentedControlItem,
  createSegmentedControlController,
} from "@/components/ui/ui-sdk-segmented-control"

type Range = "day" | "week" | "month"

function UiSdkSegmentedControlControlled() {
  const [controller] = React.useState(() =>
    createSegmentedControlController<Range>()
  )
  const [range, setRange] = React.useState<Range | null>("week")

  return (
    <div className="flex flex-col items-center gap-3">
      <SegmentedControl<Range>
        aria-label="Range"
        value={range}
        onValueChange={(value) => setRange(value)}
        controller={controller}
      >
        <SegmentedControlItem value="day">Day</SegmentedControlItem>
        <SegmentedControlItem value="week">Week</SegmentedControlItem>
        <SegmentedControlItem value="month">Month</SegmentedControlItem>
      </SegmentedControl>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => controller.setValue("month")}
        >
          Show month
        </Button>
        <p className="m-0 text-xs text-muted-foreground">
          {`Showing ${range ?? "nothing"}`}
        </p>
      </div>
    </div>
  )
}

export { UiSdkSegmentedControlControlled }
