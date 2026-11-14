import {
  Timeline,
  TimelineConnector,
  TimelineDescription,
  TimelineItem,
  TimelineMarker,
  TimelineTime,
  TimelineTitle,
} from "@/components/ui/ui-sdk-timeline"

const events = [
  {
    title: "Deployed to production",
    dateTime: "2026-11-10T14:32",
    time: "Today, 2:32 PM",
    description: "Version 2.4.1 is live in every region.",
  },
  {
    title: "Checks passed",
    dateTime: "2026-11-10T14:20",
    time: "Today, 2:20 PM",
    description: "312 tests and the bundle size budget.",
  },
  {
    title: "Pull request merged",
    dateTime: "2026-11-10T13:58",
    time: "Today, 1:58 PM",
    description: "Ada merged Cache search results into main.",
  },
  {
    title: "Review requested",
    dateTime: "2026-11-09T17:05",
    time: "Yesterday, 5:05 PM",
    description: "Grace and Linus were asked to review.",
  },
]

function UiSdkTimelineDemo() {
  return (
    <Timeline aria-label="Activity" className="w-full max-w-sm">
      {events.map((event) => (
        <TimelineItem key={event.title}>
          <TimelineMarker />
          <TimelineConnector />
          <TimelineTitle>{event.title}</TimelineTitle>
          <TimelineTime dateTime={event.dateTime}>{event.time}</TimelineTime>
          <TimelineDescription>{event.description}</TimelineDescription>
        </TimelineItem>
      ))}
    </Timeline>
  )
}

export { UiSdkTimelineDemo }
