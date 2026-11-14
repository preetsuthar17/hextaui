import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  CollapsibleTriggerIcon,
} from "@/components/ui/collapsible"
import {
  Timeline,
  TimelineConnector,
  TimelineDescription,
  TimelineItem,
  TimelineMarker,
  TimelineTime,
  TimelineTitle,
} from "@/components/ui/ui-sdk-timeline"

const releases = [
  {
    title: "Version 2.4",
    dateTime: "2026-10-28",
    time: "October 28",
    description: "Faster search and resumable uploads.",
    changes: [
      "Search now matches file contents, not only names.",
      "Uploads resume after the connection drops.",
    ],
  },
  {
    title: "Version 2.3",
    dateTime: "2026-09-30",
    time: "September 30",
    description: "Shared links and a new sidebar.",
    changes: [
      "Shared links remember the folder they were opened from.",
      "The sidebar collapses to icons on narrow screens.",
    ],
  },
  {
    title: "Version 2.2",
    dateTime: "2026-08-26",
    time: "August 26",
    description: "Dark mode follows your system.",
    changes: ["Dark mode follows the system setting.", "Avatars are sharper."],
  },
]

function UiSdkTimelineDetails() {
  return (
    <Timeline aria-label="Changelog" className="w-full max-w-sm">
      {releases.map((release) => (
        <TimelineItem key={release.title}>
          <TimelineMarker />
          <TimelineConnector />
          <TimelineTitle>{release.title}</TimelineTitle>
          <TimelineTime dateTime={release.dateTime}>
            {release.time}
          </TimelineTime>
          <TimelineDescription>{release.description}</TimelineDescription>
          <Collapsible className="flex flex-col items-start gap-1 pt-1">
            <CollapsibleTrigger
              render={<Button variant="ghost" size="sm" />}
              className="-ms-2"
            >
              What changed
              <CollapsibleTriggerIcon data-icon="inline-end" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul className="m-0 flex list-disc flex-col gap-1 ps-4 text-sm text-muted-foreground">
                {release.changes.map((change) => (
                  <li key={change}>{change}</li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </TimelineItem>
      ))}
    </Timeline>
  )
}

export { UiSdkTimelineDetails }
