"use client"

import * as React from "react"
import { IconCheck } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Timeline,
  TimelineConnector,
  TimelineDescription,
  TimelineItem,
  TimelineMarker,
  TimelineTime,
  TimelineTitle,
  createTimelineController,
  type TimelineStatus,
} from "@/components/ui/ui-sdk-timeline"

const steps: {
  value: string
  title: string
  dateTime: string
  time: string
  description: string
  status: TimelineStatus
}[] = [
  {
    value: "placed",
    title: "Order placed",
    dateTime: "2026-11-01",
    time: "Nov 1",
    description: "We received your order.",
    status: "complete",
  },
  {
    value: "packed",
    title: "Packed",
    dateTime: "2026-11-02",
    time: "Nov 2",
    description: "Your items left the shelf.",
    status: "complete",
  },
  {
    value: "shipped",
    title: "Shipped, in transit",
    dateTime: "2026-11-03",
    time: "Nov 3",
    description: "On its way with the carrier.",
    status: "current",
  },
  {
    value: "delivered",
    title: "Delivered",
    dateTime: "2026-11-05",
    time: "Expected Nov 5",
    description: "Expected by Thursday.",
    status: "upcoming",
  },
]

function UiSdkTimelineStatus() {
  const [controller] = React.useState(createTimelineController)

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Button
        size="sm"
        variant="outline"
        className="self-start"
        onClick={() => controller.focus("shipped")}
      >
        Go to current step
      </Button>
      <Timeline aria-label="Order status" controller={controller}>
        {steps.map((step) => (
          <TimelineItem
            key={step.value}
            value={step.value}
            status={step.status}
          >
            <TimelineMarker>
              {step.status === "complete" && <IconCheck aria-hidden="true" />}
            </TimelineMarker>
            <TimelineConnector />
            <TimelineTitle>{step.title}</TimelineTitle>
            <TimelineTime dateTime={step.dateTime}>{step.time}</TimelineTime>
            <TimelineDescription>{step.description}</TimelineDescription>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  )
}

export { UiSdkTimelineStatus }
