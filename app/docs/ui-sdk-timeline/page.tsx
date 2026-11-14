import { DocsCodeBlock } from "@/components/docs/docs-code-block"
import { DocsComponentPage } from "@/components/docs/docs-component-page"
import {
  DocsCode,
  DocsParagraph,
  DocsSection,
} from "@/components/docs/docs-content"
import { DocsExample } from "@/components/docs/docs-example"
import { DocsInstall } from "@/components/docs/docs-install"
import {
  DocsAttributesTable,
  DocsKeyboardTable,
  DocsPropsTable,
} from "@/components/docs/docs-props-table"
import { UiSdkTimelineAgent } from "@/components/examples/ui-sdk-timeline/agent"
import { UiSdkTimelineDemo } from "@/components/examples/ui-sdk-timeline/demo"
import { UiSdkTimelineDetails } from "@/components/examples/ui-sdk-timeline/details"
import { UiSdkTimelineFeed } from "@/components/examples/ui-sdk-timeline/feed"
import { UiSdkTimelineHorizontal } from "@/components/examples/ui-sdk-timeline/horizontal"
import { UiSdkTimelineMarkers } from "@/components/examples/ui-sdk-timeline/markers"
import { UiSdkTimelineRtl } from "@/components/examples/ui-sdk-timeline/rtl"
import { UiSdkTimelineStatus } from "@/components/examples/ui-sdk-timeline/status"
import { getDocsComponentMetadata } from "@/lib/docs-metadata"

export const metadata = getDocsComponentMetadata("ui-sdk-timeline")

const layerCode = `@layer ui-sdk;

@import "tailwindcss";`

const importCode = `import {
  Timeline,
  TimelineConnector,
  TimelineDescription,
  TimelineItem,
  TimelineMarker,
  TimelineTime,
  TimelineTitle,
} from "@/components/ui/ui-sdk-timeline"`

const usageCode = `<Timeline aria-label="Activity">
  <TimelineItem>
    <TimelineMarker />
    <TimelineConnector />
    <TimelineTitle>Deployed to production</TimelineTitle>
    <TimelineTime dateTime="2026-11-10T14:32">2:32 PM</TimelineTime>
    <TimelineDescription>Version 2.4.1 is live.</TimelineDescription>
  </TimelineItem>
</Timeline>`

const compositionCode = `Timeline
├── TimelineItem
│   ├── TimelineMarker
│   ├── TimelineConnector
│   ├── TimelineTitle
│   ├── TimelineTime
│   └── TimelineDescription
└── TimelineItem`

const renderType = "ReactElement | (props, state) => ReactElement"

const statusAttributes = [
  {
    name: "data-complete",
    description: "Present when the event’s status is complete.",
  },
  {
    name: "data-current",
    description: "Present when the event’s status is current.",
  },
  {
    name: "data-upcoming",
    description: "Present when the event’s status is upcoming.",
  },
]

export default function Page() {
  return (
    <DocsComponentPage slug="ui-sdk-timeline">
      <DocsExample file="ui-sdk-timeline/demo">
        <UiSdkTimelineDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@ui-sdk/react@0.1.0-beta.2",
          "@ui-sdk/core@0.1.0-beta.2",
          "class-variance-authority",
          "cn",
        ]}
        files={["components/ui/ui-sdk-timeline.tsx"]}
      />

      <DocsSection title="Usage">
        <DocsParagraph>
          UI SDK adds a little CSS of its own in a cascade layer named{" "}
          <DocsCode>ui-sdk</DocsCode>. Declare that layer at the top of your
          global stylesheet, above the Tailwind import, so your classes win over
          it.
        </DocsParagraph>
        <DocsCodeBlock code={layerCode} lang="css" />
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          A timeline lists things that happened, or will, like an activity feed,
          an order’s progress or an agent’s steps. It’s a list for screen
          readers with one tab stop, and the arrow keys move between events.
          Pass <DocsCode>dateTime</DocsCode> to{" "}
          <DocsCode>TimelineTime</DocsCode> so the date is machine readable
          while the text stays friendly. UI SDK marks it experimental in
          0.1.0-beta.2.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
        <DocsParagraph>
          Every part inside an item is optional. The marker sits in its own
          column and the connector runs from it to the next event, hidden after
          the last one. Anything else you put in an item, like a button or a
          collapsible, lines up with the title.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="ui-sdk-timeline/status"
          title="Status"
          description={
            <>
              Give each item a <DocsCode>status</DocsCode> of{" "}
              <DocsCode>complete</DocsCode>, <DocsCode>current</DocsCode> or{" "}
              <DocsCode>upcoming</DocsCode>. The current event gets{" "}
              <DocsCode>{'aria-current="step"'}</DocsCode> and the tab stop, and
              a controller focuses an event by its <DocsCode>value</DocsCode>.
              Say the status in the title too, since the marker only shows it.
            </>
          }
        >
          <UiSdkTimelineStatus />
        </DocsExample>
        <DocsExample
          file="ui-sdk-timeline/agent"
          title="Agent steps"
          description={
            <>
              An icon in <DocsCode>TimelineMarker</DocsCode> turns it into a
              small circle. Put a spinner in the current step while an agent
              works, and a duration like <DocsCode>PT5S</DocsCode> in{" "}
              <DocsCode>dateTime</DocsCode>.
            </>
          }
        >
          <UiSdkTimelineAgent />
        </DocsExample>
        <DocsExample
          file="ui-sdk-timeline/markers"
          title="Custom markers"
          description={
            <>
              The marker’s <DocsCode>variant</DocsCode> is{" "}
              <DocsCode>success</DocsCode>, <DocsCode>warning</DocsCode>,{" "}
              <DocsCode>destructive</DocsCode> or <DocsCode>info</DocsCode>, for
              an empty dot or an icon.
            </>
          }
        >
          <UiSdkTimelineMarkers />
        </DocsExample>
        <DocsExample
          file="ui-sdk-timeline/horizontal"
          title="Horizontal"
          description={
            <>
              <DocsCode>{'orientation="horizontal"'}</DocsCode> lays the events
              in a row, like a roadmap. Left and Right move between them, and{" "}
              <DocsCode>{"loop={false}"}</DocsCode> stops at the ends.
            </>
          }
        >
          <UiSdkTimelineHorizontal />
        </DocsExample>
        <DocsExample
          file="ui-sdk-timeline/details"
          title="Details"
          description="Links and buttons inside an event stay in the tab order. Tab moves from the event to them, and the arrow keys still move between events."
        >
          <UiSdkTimelineDetails />
        </DocsExample>
        <DocsExample
          file="ui-sdk-timeline/feed"
          title="Feed"
          description={
            <>
              <DocsCode>feed</DocsCode> turns the list into a feed of articles
              for timelines that grow, and Page Down and Page Up move between
              them. Set <DocsCode>busy</DocsCode> while more load.
            </>
          }
        >
          <UiSdkTimelineFeed />
        </DocsExample>
        <DocsExample
          file="ui-sdk-timeline/rtl"
          title="Right to left"
          description="The markers and the line move to the right side."
        >
          <UiSdkTimelineRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["↓", "↑"],
              description: "Move between events in a vertical timeline.",
            },
            {
              keys: ["→", "←"],
              description:
                "Move between events in a horizontal timeline. They swap in right-to-left text.",
            },
            {
              keys: ["Home", "End"],
              description: "Focus the first or last event.",
            },
            {
              keys: ["PageDown", "PageUp"],
              description:
                "In a feed, focus the next or previous article, from anywhere inside one.",
            },
            {
              keys: ["Tab"],
              description:
                "Enters on the current event, else the first, then moves to the links and buttons inside it.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsParagraph>
          A timeline is a list named with <DocsCode>aria-label</DocsCode>, or a
          feed of articles with their positions. Each event is named by its
          title and described by its time and description, and the markers and
          connectors are hidden from screen readers.
        </DocsParagraph>
        <DocsParagraph>
          The focused event shows a ring with room around it. Marker colors fade
          between statuses only when motion is allowed, and in forced colors the
          dots and lines draw in the text color.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Each part wraps the UI SDK part of the same name and accepts all of
          its props, including <DocsCode>render</DocsCode> and a{" "}
          <DocsCode>className</DocsCode> that can be a function of the part’s
          state.
        </DocsParagraph>
        <DocsSection title="Timeline" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "orientation",
                type: '"vertical" | "horizontal"',
                default: '"vertical"',
              },
              { name: "loop", type: "boolean", default: "true" },
              { name: "feed", type: "boolean", default: "false" },
              {
                name: "busy",
                type: "boolean",
                default: "false",
                description: "Sets aria-busy on a feed while it loads.",
              },
              {
                name: "controller",
                type: "TimelineController",
                description: "From createTimelineController().",
              },
              { name: "render", type: renderType },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="timeline"',
                description: "Target the timeline in CSS.",
              },
              {
                name: "data-orientation",
                description: "vertical or horizontal.",
              },
              {
                name: "data-busy",
                description: "Present while a feed is busy.",
              },
              {
                name: "--timeline-count",
                description: "How many events are in the page.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="TimelineItem" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "value",
                type: "string",
                description: "Names the event for the controller’s focus().",
              },
              {
                name: "status",
                type: '"complete" | "current" | "upcoming"',
              },
              { name: "render", type: renderType },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="timeline-item"',
                description: "Target an event in CSS.",
              },
              ...statusAttributes,
              {
                name: "data-first",
                description:
                  "Present on the first event once it’s in the page.",
              },
              {
                name: "data-last",
                description: "Present on the last event once it’s in the page.",
              },
              {
                name: "--timeline-index",
                description: "The event’s place from 0.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="TimelineMarker" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "variant",
                type: '"default" | "success" | "warning" | "destructive" | "info"',
                default: '"default"',
              },
              {
                name: "children",
                type: "ReactNode",
                description: "An icon or image. Empty draws a dot.",
              },
              { name: "render", type: renderType },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="timeline-marker"',
                description: "Target the marker in CSS.",
              },
              {
                name: "data-variant",
                description: "The marker’s variant.",
              },
              ...statusAttributes,
            ]}
          />
        </DocsSection>
        <DocsSection title="TimelineConnector" level={3}>
          <DocsParagraph>
            The line from the marker to the next event. It’s solid under a
            complete event and hidden after the last.
          </DocsParagraph>
        </DocsSection>
        <DocsSection title="TimelineTitle" level={3}>
          <DocsParagraph>
            Names its event. Render it as a heading with{" "}
            <DocsCode>{"render={<h3 />}"}</DocsCode> so people can move between
            events by heading.
          </DocsParagraph>
        </DocsSection>
        <DocsSection title="TimelineTime" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "dateTime",
                type: "string",
                description:
                  "A machine-readable date, time or duration. It describes the event.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="TimelineDescription" level={3}>
          <DocsParagraph>
            More about its event. It describes the event.
          </DocsParagraph>
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
