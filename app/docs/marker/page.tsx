import { DocsCodeBlock } from "@/components/docs/docs-code-block"
import { DocsComponentPage } from "@/components/docs/docs-component-page"
import {
  DocsCode,
  DocsList,
  DocsParagraph,
  DocsSection,
} from "@/components/docs/docs-content"
import { DocsExample } from "@/components/docs/docs-example"
import { DocsInstall } from "@/components/docs/docs-install"
import {
  DocsAttributesTable,
  DocsPropsTable,
} from "@/components/docs/docs-props-table"
import { MarkerDemo } from "@/components/examples/marker/demo"
import { MarkerEvents } from "@/components/examples/marker/events"
import { MarkerLongContent } from "@/components/examples/marker/long-content"
import { MarkerRtl } from "@/components/examples/marker/rtl"
import { MarkerSticky } from "@/components/examples/marker/sticky"
import { MarkerTimeDemo } from "@/components/examples/marker/time"
import { MarkerVariants } from "@/components/examples/marker/variants"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("marker")

const importCode = `import {
  Marker,
  MarkerContent,
  MarkerIcon,
  MarkerTime,
} from "@/components/ui/marker"`

const usageCode = `<Marker variant="separator" sticky>
  <MarkerContent>
    <MarkerTime date={message.sentAt} />
  </MarkerContent>
</Marker>`

const renderType = "ReactElement | (props, state) => ReactElement"

const compositionCode = `Marker
├── MarkerIcon
└── MarkerContent
    └── MarkerTime`

export default function Page() {
  return (
    <DocsComponentPage slug="marker">
      <DocsExample file="marker/demo">
        <MarkerDemo />
      </DocsExample>

      <DocsInstall
        dependencies={["@base-ui/react", "class-variance-authority", "cn"]}
        files={["components/ui/marker.tsx"]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="marker/variants"
          title="Variants"
          description={
            <>
              <DocsCode>default</DocsCode> is a quiet note,{" "}
              <DocsCode>separator</DocsCode> centers it between two hairlines,
              and <DocsCode>border</DocsCode> underlines it like a section
              heading.
            </>
          }
        >
          <MarkerVariants />
        </DocsExample>
        <DocsExample
          file="marker/sticky"
          title="Sticky dates"
          description={
            <>
              With <DocsCode>sticky</DocsCode>, a marker stays at the top of its
              scroll area. Once it sticks, its lines fade and the label turns
              into a floating pill so it stays readable over messages. Put each
              day in its own section so the next date pushes the previous one
              away.
            </>
          }
        >
          <MarkerSticky />
        </DocsExample>
        <DocsExample
          file="marker/time"
          title="Relative dates"
          description={
            <>
              <DocsCode>{"<MarkerTime />"}</DocsCode> renders a{" "}
              <DocsCode>{"<time>"}</DocsCode> that reads Today, Yesterday, a
              weekday within the last week, then a short date. It updates itself
              at midnight. Pass <DocsCode>format</DocsCode> for your own
              wording.
            </>
          }
        >
          <MarkerTimeDemo />
        </DocsExample>
        <DocsExample
          file="marker/events"
          title="Activity"
          description={
            <>
              Render markers as list items for an activity log. Links inside are
              underlined until hovered.
            </>
          }
        >
          <MarkerEvents />
        </DocsExample>
        <DocsExample
          file="marker/long-content"
          title="Long content"
          description="Notes wrap and unbroken strings break instead of widening the layout. Separator lines keep a minimum length on both sides."
        >
          <MarkerLongContent />
        </DocsExample>
        <DocsExample
          file="marker/rtl"
          title="Right to left"
          description="Icons and text follow the reading direction."
        >
          <MarkerRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            Markers are plain text, so screen readers read them in place. Icons
            are hidden from them.
          </li>
          <li>
            <DocsCode>{"<MarkerTime />"}</DocsCode> keeps the exact moment in{" "}
            <DocsCode>dateTime</DocsCode> while showing a friendly label.
          </li>
          <li>
            The sticky pill appears without motion when reduced motion is on.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsSection title="Marker" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "variant",
                type: '"default" | "separator" | "border"',
                default: '"default"',
              },
              {
                name: "sticky",
                type: "boolean",
                default: "false",
                description:
                  "Stick to the top of the scroll area and become a pill while stuck.",
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="marker"',
                description: "Target markers in CSS.",
              },
              { name: "data-variant", description: "The current variant." },
              {
                name: "data-sticky",
                description: "Present when sticky is on.",
              },
              {
                name: "data-stuck",
                description: "Present while the marker is stuck to the top.",
              },
              {
                name: "--marker-sticky-top",
                description:
                  "Distance from the top while stuck. Defaults to 0.5rem.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="MarkerContent" level={3}>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="marker-content"',
                description: "The text. Becomes the pill while stuck.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="MarkerIcon" level={3}>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="marker-icon"',
                description: "A 16px icon box, hidden from screen readers.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="MarkerTime" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "date",
                type: "Date | string | number",
                description: "Required. Anything new Date() accepts.",
              },
              {
                name: "locale",
                type: "Intl.LocalesArgument",
                default: '"en-US"',
                description:
                  "Fixed by default so the server and browser agree.",
              },
              {
                name: "format",
                type: "(date: Date) => ReactNode",
                description: "Replace the relative label with your own.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="marker-time"',
                description: "The time element, with an ISO dateTime.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
