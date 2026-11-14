"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Timeline,
  TimelineConnector,
  TimelineDescription,
  TimelineItem,
  TimelineMarker,
  TimelineTime,
  TimelineTitle,
} from "@/components/ui/ui-sdk-timeline"

const updates = [
  {
    id: 1,
    author: "Ada",
    date: "2026-11-10",
    time: "Nov 10",
    text: "Shipped the new onboarding flow.",
  },
  {
    id: 2,
    author: "Grace",
    date: "2026-11-10",
    time: "Nov 10",
    text: "Fixed the flaky upload test.",
  },
  {
    id: 3,
    author: "Linus",
    date: "2026-11-09",
    time: "Nov 9",
    text: "Moved the docs to the new theme.",
  },
  {
    id: 4,
    author: "Margaret",
    date: "2026-11-09",
    time: "Nov 9",
    text: "Wrote the launch checklist.",
  },
  {
    id: 5,
    author: "Ada",
    date: "2026-11-08",
    time: "Nov 8",
    text: "Cut search latency in half.",
  },
  {
    id: 6,
    author: "Grace",
    date: "2026-11-07",
    time: "Nov 7",
    text: "Added keyboard shortcuts to the editor.",
  },
  {
    id: 7,
    author: "Linus",
    date: "2026-11-06",
    time: "Nov 6",
    text: "Cleaned up the old billing code.",
  },
  {
    id: 8,
    author: "Margaret",
    date: "2026-11-05",
    time: "Nov 5",
    text: "Ran the accessibility review.",
  },
  {
    id: 9,
    author: "Ada",
    date: "2026-11-04",
    time: "Nov 4",
    text: "Started the mobile layout.",
  },
]

const pageSize = 3

function UiSdkTimelineFeed() {
  const [count, setCount] = React.useState(pageSize)
  const [busy, setBusy] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  React.useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Timeline feed busy={busy} aria-label="Team updates">
        {updates.slice(0, count).map((update) => (
          <TimelineItem key={update.id}>
            <TimelineMarker />
            <TimelineConnector />
            <TimelineTitle>{update.author}</TimelineTitle>
            <TimelineTime dateTime={update.date}>{update.time}</TimelineTime>
            <TimelineDescription>{update.text}</TimelineDescription>
          </TimelineItem>
        ))}
      </Timeline>
      <Button
        size="sm"
        variant="outline"
        className="self-start"
        disabled={busy || count >= updates.length}
        onClick={() => {
          setBusy(true)
          timer.current = setTimeout(() => {
            setCount((current) => current + pageSize)
            setBusy(false)
          }, 600)
        }}
      >
        {busy
          ? "Loading…"
          : count >= updates.length
            ? "All caught up"
            : "Load more"}
      </Button>
    </div>
  )
}

export { UiSdkTimelineFeed }
