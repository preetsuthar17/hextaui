import {
  IconAlertTriangle,
  IconCheck,
  IconInfoCircle,
  IconRocket,
  IconX,
} from "@tabler/icons-react"

import {
  Timeline,
  TimelineConnector,
  TimelineDescription,
  TimelineItem,
  TimelineMarker,
  TimelineTime,
  TimelineTitle,
} from "@/components/ui/ui-sdk-timeline"

function UiSdkTimelineMarkers() {
  return (
    <Timeline aria-label="Deploy history" className="w-full max-w-sm">
      <TimelineItem>
        <TimelineMarker variant="success">
          <IconCheck aria-hidden="true" />
        </TimelineMarker>
        <TimelineConnector />
        <TimelineTitle>Deploy succeeded</TimelineTitle>
        <TimelineTime dateTime="2026-11-12T09:41">Nov 12, 9:41 AM</TimelineTime>
      </TimelineItem>
      <TimelineItem>
        <TimelineMarker variant="warning">
          <IconAlertTriangle aria-hidden="true" />
        </TimelineMarker>
        <TimelineConnector />
        <TimelineTitle>Slow build warning</TimelineTitle>
        <TimelineTime dateTime="2026-11-12T09:37">Nov 12, 9:37 AM</TimelineTime>
        <TimelineDescription>
          The build took 6 minutes, 2 over budget.
        </TimelineDescription>
      </TimelineItem>
      <TimelineItem>
        <TimelineMarker variant="destructive">
          <IconX aria-hidden="true" />
        </TimelineMarker>
        <TimelineConnector />
        <TimelineTitle>Deploy failed</TimelineTitle>
        <TimelineTime dateTime="2026-11-11T18:02">Nov 11, 6:02 PM</TimelineTime>
        <TimelineDescription>
          A migration timed out and was rolled back.
        </TimelineDescription>
      </TimelineItem>
      <TimelineItem>
        <TimelineMarker variant="info">
          <IconInfoCircle aria-hidden="true" />
        </TimelineMarker>
        <TimelineConnector />
        <TimelineTitle>Maintenance window set</TimelineTitle>
        <TimelineTime dateTime="2026-11-11T12:00">
          Nov 11, 12:00 PM
        </TimelineTime>
      </TimelineItem>
      <TimelineItem>
        <TimelineMarker>
          <IconRocket aria-hidden="true" />
        </TimelineMarker>
        <TimelineConnector />
        <TimelineTitle>Project created</TimelineTitle>
        <TimelineTime dateTime="2026-11-01T10:15">Nov 1, 10:15 AM</TimelineTime>
      </TimelineItem>
    </Timeline>
  )
}

export { UiSdkTimelineMarkers }
