import { IconCheck } from "@tabler/icons-react"

import {
  Timeline,
  TimelineConnector,
  TimelineItem,
  TimelineMarker,
  TimelineTime,
  TimelineTitle,
  type TimelineStatus,
} from "@/components/ui/ui-sdk-timeline"

const milestones: {
  title: string
  dateTime: string
  time: string
  status: TimelineStatus
}[] = [
  {
    title: "Kickoff",
    dateTime: "2026-01",
    time: "January",
    status: "complete",
  },
  {
    title: "Design review",
    dateTime: "2026-03",
    time: "March",
    status: "complete",
  },
  { title: "Beta", dateTime: "2026-06", time: "June", status: "current" },
  {
    title: "Launch",
    dateTime: "2026-09",
    time: "September",
    status: "upcoming",
  },
]

function UiSdkTimelineHorizontal() {
  return (
    <Timeline
      orientation="horizontal"
      loop={false}
      aria-label="Roadmap"
      className="w-full max-w-xl"
    >
      {milestones.map((milestone) => (
        <TimelineItem key={milestone.title} status={milestone.status}>
          <TimelineMarker>
            {milestone.status === "complete" && (
              <IconCheck aria-hidden="true" />
            )}
          </TimelineMarker>
          <TimelineConnector />
          <TimelineTitle>{milestone.title}</TimelineTitle>
          <TimelineTime dateTime={milestone.dateTime}>
            {milestone.time}
          </TimelineTime>
        </TimelineItem>
      ))}
    </Timeline>
  )
}

export { UiSdkTimelineHorizontal }
