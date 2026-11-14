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
import { UiSdkDateInputController } from "@/components/examples/ui-sdk-date-input/controller"
import { UiSdkDateInputDateTime } from "@/components/examples/ui-sdk-date-input/date-time"
import { UiSdkDateInputDemo } from "@/components/examples/ui-sdk-date-input/demo"
import { UiSdkDateInputDisabled } from "@/components/examples/ui-sdk-date-input/disabled"
import { UiSdkDateInputForm } from "@/components/examples/ui-sdk-date-input/form"
import { UiSdkDateInputLocale } from "@/components/examples/ui-sdk-date-input/locale"
import { UiSdkDateInputMinMax } from "@/components/examples/ui-sdk-date-input/min-max"
import { UiSdkDateInputReadOnly } from "@/components/examples/ui-sdk-date-input/read-only"
import { UiSdkDateInputRtl } from "@/components/examples/ui-sdk-date-input/rtl"
import { UiSdkDateInputUnavailable } from "@/components/examples/ui-sdk-date-input/unavailable"
import { getDocsComponentMetadata } from "@/lib/docs-metadata"

export const metadata = getDocsComponentMetadata("ui-sdk-date-input")

const layerCode = `@layer ui-sdk;

@import "tailwindcss";`

const importCode = `import { DateInput } from "@/components/ui/ui-sdk-date-input"`

const usageCode = `<Label id="start-date">Start date</Label>
<DateInput aria-labelledby="start-date" defaultValue="2026-11-02" />`

const compositionCode = `DateInput
└── DateInputSegments
    └── DateInputSegment`

const renderType = "ReactElement | (props, state) => ReactElement"

export default function Page() {
  return (
    <DocsComponentPage slug="ui-sdk-date-input">
      <DocsExample file="ui-sdk-date-input/demo">
        <UiSdkDateInputDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@ui-sdk/react@0.1.0-beta.2",
          "@ui-sdk/core@0.1.0-beta.2",
          "cn",
        ]}
        files={["components/ui/ui-sdk-date-input.tsx"]}
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
          Use a date input for dates people know by heart, like a birthday. The
          value is an ISO date like <DocsCode>&quot;2026-11-02&quot;</DocsCode>,
          and it stays <DocsCode>null</DocsCode> until every part holds
          something. Each part fills as you type and moves on, the day is kept
          within its month, and a whole date can be pasted into any part. For
          picking from a calendar, use the Date Picker.
        </DocsParagraph>
        <DocsParagraph>
          The field is a group, so name it with{" "}
          <DocsCode>aria-labelledby</DocsCode> or{" "}
          <DocsCode>aria-label</DocsCode>. Clicking anywhere in the box focuses
          the nearest part.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
        <DocsParagraph>
          <DocsCode>DateInput</DocsCode> renders its parts on its own. Add{" "}
          <DocsCode>DateInputSegments</DocsCode> yourself to put an icon or
          other content beside them.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="ui-sdk-date-input/date-time"
          title="Date and time"
          description={
            <>
              <DocsCode>granularity</DocsCode> set to{" "}
              <DocsCode>&quot;hour&quot;</DocsCode>,{" "}
              <DocsCode>&quot;minute&quot;</DocsCode> or{" "}
              <DocsCode>&quot;second&quot;</DocsCode> adds the time, and the
              value becomes a local date and time like{" "}
              <DocsCode>&quot;2026-11-02T14:30&quot;</DocsCode>.
            </>
          }
        >
          <UiSdkDateInputDateTime />
        </DocsExample>
        <DocsExample
          file="ui-sdk-date-input/min-max"
          title="Min and max"
          description={
            <>
              A date before <DocsCode>min</DocsCode> or after{" "}
              <DocsCode>max</DocsCode> marks the field invalid, and its form
              won’t submit.
            </>
          }
        >
          <UiSdkDateInputMinMax />
        </DocsExample>
        <DocsExample
          file="ui-sdk-date-input/unavailable"
          title="Unavailable dates"
          description={
            <>
              <DocsCode>unavailable</DocsCode> takes ISO dates,{" "}
              <DocsCode>{"{ from, to }"}</DocsCode> ranges, weekdays or a
              function, and a date on one is invalid.
            </>
          }
        >
          <UiSdkDateInputUnavailable />
        </DocsExample>
        <DocsExample
          file="ui-sdk-date-input/locale"
          title="Locale"
          description={
            <>
              <DocsCode>locale</DocsCode> sets the order and the separators. The
              digits are always 0 to 9 and the calendar is always Gregorian, so
              the value means the same date everywhere.
            </>
          }
        >
          <UiSdkDateInputLocale />
        </DocsExample>
        <DocsExample
          file="ui-sdk-date-input/form"
          title="Form"
          description={
            <>
              A hidden input submits the ISO date under{" "}
              <DocsCode>name</DocsCode>, here beside a Time Input.{" "}
              <DocsCode>required</DocsCode> stops an empty or half-typed date,
              and a reset brings back the default.
            </>
          }
        >
          <UiSdkDateInputForm />
        </DocsExample>
        <DocsExample
          file="ui-sdk-date-input/controller"
          title="Controller"
          description={
            <>
              <DocsCode>createDateInputController()</DocsCode> sets, clears or
              focuses the field from anywhere. Focus a part by its unit, like{" "}
              <DocsCode>&quot;year&quot;</DocsCode>.
            </>
          }
        >
          <UiSdkDateInputController />
        </DocsExample>
        <DocsExample
          file="ui-sdk-date-input/disabled"
          title="Disabled"
          description="A disabled field is skipped by focus and doesn’t submit."
        >
          <UiSdkDateInputDisabled />
        </DocsExample>
        <DocsExample
          file="ui-sdk-date-input/read-only"
          title="Read-only"
          description="A read-only field takes focus and submits, but keys and typing don’t change it."
        >
          <UiSdkDateInputReadOnly />
        </DocsExample>
        <DocsExample
          file="ui-sdk-date-input/rtl"
          title="Right to left"
          description="The parts keep the locale’s order, and the arrow keys follow them on screen."
        >
          <UiSdkDateInputRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["0–9"],
              description: "Fills the part, then moves to the next one.",
            },
            {
              keys: ["/", "."],
              description: "Moves to the next part.",
            },
            {
              keys: ["↑", "↓"],
              description:
                "Steps the part by one, wrapping around. An empty part starts at today.",
            },
            {
              keys: ["PageUp", "PageDown"],
              description:
                "Steps by more: a year by 5, a month by 3, a day by 7.",
            },
            {
              keys: ["Home", "End"],
              description: "Goes to the part’s first or last value.",
            },
            {
              keys: ["←", "→"],
              description: "Moves to the part before or after.",
            },
            {
              keys: ["Backspace"],
              description:
                "Removes the last digit, then empties the part, then moves back.",
            },
            {
              keys: ["Enter"],
              description: "Submits the form with what’s typed.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsParagraph>
          The root is a group. Each part is a spinbutton named by its unit, like
          “month”, with its value and range, and an empty part reads as “Empty”.
          The text between parts is hidden from screen readers.
        </DocsParagraph>
        <DocsParagraph>
          Parts are real inputs, so phones show a number pad and typing works
          before the page’s script runs. They grow to 16px on touch screens so
          phones don’t zoom in, and the focused part is highlighted rather than
          showing a caret.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Each part wraps the UI SDK part of the same name and accepts all of
          its props, including <DocsCode>render</DocsCode> and a{" "}
          <DocsCode>className</DocsCode> that can be a function of the part’s
          state.
        </DocsParagraph>
        <DocsSection title="DateInput" level={3}>
          <DocsPropsTable
            props={[
              { name: "value", type: "string | null" },
              { name: "defaultValue", type: "string | null" },
              {
                name: "onValueChange",
                type: "(value: string | null, details) => void",
                description:
                  "Runs once every part holds something, and with null when one is emptied.",
              },
              {
                name: "granularity",
                type: '"day" | "hour" | "minute" | "second"',
                default: '"day"',
              },
              {
                name: "hourCycle",
                type: "12 | 24",
                description: "Defaults to the locale’s clock.",
              },
              { name: "min", type: "string" },
              { name: "max", type: "string" },
              {
                name: "unavailable",
                type: "DateMatchers",
                description:
                  "ISO dates, { from, to } ranges, { weekday } or a function.",
              },
              {
                name: "locale",
                type: "string",
                description: "Defaults to the page’s language.",
              },
              { name: "invalid", type: "boolean", default: "false" },
              { name: "disabled", type: "boolean", default: "false" },
              { name: "readOnly", type: "boolean", default: "false" },
              { name: "required", type: "boolean", default: "false" },
              { name: "name", type: "string" },
              { name: "form", type: "string" },
              {
                name: "controller",
                type: "DateInputController",
                description: "From createDateInputController().",
              },
              {
                name: "children",
                type: "ReactNode | (state) => ReactNode",
                description: "Defaults to DateInputSegments.",
              },
              { name: "render", type: renderType },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="date-input"',
                description: "Target the date input in CSS.",
              },
              {
                name: "data-invalid",
                description:
                  "Present when the date is outside min and max, unavailable, or invalid is set.",
              },
              {
                name: "data-empty",
                description: "Present while every part is empty.",
              },
              {
                name: "data-disabled",
                description: "Present when disabled.",
              },
              {
                name: "data-readonly",
                description: "Present when read-only.",
              },
              {
                name: "data-required",
                description: "Present when required.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="DateInputSegments" level={3}>
          <DocsParagraph>
            Renders a DateInputSegment for each part, in the locale’s order,
            with the text between them.
          </DocsParagraph>
        </DocsSection>
        <DocsSection title="DateInputSegment" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "segment",
                type: "DateInputSegmentData",
                description: "One of the root state’s segments.",
              },
              { name: "render", type: renderType },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="date-input-segment"',
                description: "Target a part in CSS.",
              },
              {
                name: "data-type",
                description:
                  "year, month, day, hour, minute, second, dayPeriod, or literal for the text between parts.",
              },
              {
                name: "data-empty",
                description: "Present while the part is empty.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
