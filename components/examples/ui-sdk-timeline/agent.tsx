import {
  IconCheck,
  IconFileText,
  IconGitPullRequest,
  IconWorld,
} from "@tabler/icons-react"

import { Spinner } from "@/components/ui/spinner"
import {
  Timeline,
  TimelineConnector,
  TimelineDescription,
  TimelineItem,
  TimelineMarker,
  TimelineTime,
  TimelineTitle,
} from "@/components/ui/ui-sdk-timeline"

function UiSdkTimelineAgent() {
  return (
    <Timeline aria-label="Agent run" className="w-full max-w-sm">
      <TimelineItem status="complete">
        <TimelineMarker>
          <IconFileText aria-hidden="true" />
        </TimelineMarker>
        <TimelineConnector />
        <TimelineTitle>Read 4 files</TimelineTitle>
        <TimelineTime dateTime="PT2S">2s</TimelineTime>
        <TimelineDescription>
          search.ts, cache.ts, cache.test.ts and README.md
        </TimelineDescription>
      </TimelineItem>
      <TimelineItem status="complete">
        <TimelineMarker>
          <IconWorld aria-hidden="true" />
        </TimelineMarker>
        <TimelineConnector />
        <TimelineTitle>Searched the web</TimelineTitle>
        <TimelineTime dateTime="PT5S">5s</TimelineTime>
        <TimelineDescription>
          3 results for “LRU cache eviction in edge runtimes”
        </TimelineDescription>
      </TimelineItem>
      <TimelineItem status="current">
        <TimelineMarker>
          <Spinner size="sm" aria-hidden="true" />
        </TimelineMarker>
        <TimelineConnector />
        <TimelineTitle>Writing the fix, in progress</TimelineTitle>
        <TimelineDescription>
          Evicting the oldest entry once the cache holds 500 results.
        </TimelineDescription>
      </TimelineItem>
      <TimelineItem status="upcoming">
        <TimelineMarker>
          <IconGitPullRequest aria-hidden="true" />
        </TimelineMarker>
        <TimelineConnector />
        <TimelineTitle>Open a pull request</TimelineTitle>
      </TimelineItem>
      <TimelineItem status="upcoming">
        <TimelineMarker>
          <IconCheck aria-hidden="true" />
        </TimelineMarker>
        <TimelineConnector />
        <TimelineTitle>Run the checks</TimelineTitle>
      </TimelineItem>
    </Timeline>
  )
}

export { UiSdkTimelineAgent }
