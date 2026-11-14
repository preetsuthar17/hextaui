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
import { UiSdkTimeInputClock } from "@/components/examples/ui-sdk-time-input/clock"
import { UiSdkTimeInputController } from "@/components/examples/ui-sdk-time-input/controller"
import { UiSdkTimeInputDemo } from "@/components/examples/ui-sdk-time-input/demo"
import { UiSdkTimeInputDisabled } from "@/components/examples/ui-sdk-time-input/disabled"
import { UiSdkTimeInputForm } from "@/components/examples/ui-sdk-time-input/form"
import { UiSdkTimeInputLocale } from "@/components/examples/ui-sdk-time-input/locale"
import { UiSdkTimeInputMinMax } from "@/components/examples/ui-sdk-time-input/min-max"
import { UiSdkTimeInputRange } from "@/components/examples/ui-sdk-time-input/range"
import { UiSdkTimeInputReadOnly } from "@/components/examples/ui-sdk-time-input/read-only"
import { UiSdkTimeInputRtl } from "@/components/examples/ui-sdk-time-input/rtl"
import { getDocsComponentMetadata } from "@/lib/docs-metadata"

export const metadata = getDocsComponentMetadata("ui-sdk-time-input")

const layerCode = `@layer ui-sdk;

@import "tailwindcss";`

const importCode = `import { TimeInput } from "@/components/ui/ui-sdk-time-input"`

const usageCode = `<Label id="meeting-time">Meeting time</Label>
<TimeInput aria-labelledby="meeting-time" defaultValue="09:30" />`

const compositionCode = `TimeInput
└── TimeInputSegments
    └── TimeInputSegment`

const renderType = "ReactElement | (props, state) => ReactElement"

export default function Page() {
  return (
    <DocsComponentPage slug="ui-sdk-time-input">
      <DocsExample file="ui-sdk-time-input/demo">
        <UiSdkTimeInputDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@ui-sdk/react@0.1.0-beta.2",
          "@ui-sdk/core@0.1.0-beta.2",
          "cn",
        ]}
        files={["components/ui/ui-sdk-time-input.tsx"]}
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
          The value is a 24-hour time like{" "}
          <DocsCode>&quot;14:30&quot;</DocsCode>, the same as a native time
          input’s, whatever clock the field shows. It stays{" "}
          <DocsCode>null</DocsCode> until every part holds something. Each part
          is its own small input: type digits and it moves on, or press A or P
          for the half of the day.
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
          <DocsCode>TimeInput</DocsCode> renders its parts on its own. Add{" "}
          <DocsCode>TimeInputSegments</DocsCode> yourself to put an icon or
          other content beside them.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="ui-sdk-time-input/clock"
          title="Clock and seconds"
          description={
            <>
              The field shows the locale’s clock. <DocsCode>hourCycle</DocsCode>{" "}
              picks 12 or 24 hours, and <DocsCode>granularity</DocsCode> adds
              seconds or shows the hour alone. All of them submit 24-hour
              values.
            </>
          }
        >
          <UiSdkTimeInputClock />
        </DocsExample>
        <DocsExample
          file="ui-sdk-time-input/min-max"
          title="Min and max"
          description={
            <>
              A time before <DocsCode>min</DocsCode> or after{" "}
              <DocsCode>max</DocsCode> marks the field invalid, and its form
              won’t submit.
            </>
          }
        >
          <UiSdkTimeInputMinMax />
        </DocsExample>
        <DocsExample
          file="ui-sdk-time-input/range"
          title="Invalid"
          description={
            <>
              <DocsCode>invalid</DocsCode> marks the field for checks of your
              own, like an end time before the start.
            </>
          }
        >
          <UiSdkTimeInputRange />
        </DocsExample>
        <DocsExample
          file="ui-sdk-time-input/locale"
          title="Locale"
          description={
            <>
              <DocsCode>locale</DocsCode> sets the order, the separators and the
              names for the half of the day. Without it, the field follows the
              page’s language once it’s interactive.
            </>
          }
        >
          <UiSdkTimeInputLocale />
        </DocsExample>
        <DocsExample
          file="ui-sdk-time-input/form"
          title="Form"
          description={
            <>
              A hidden input submits the time under <DocsCode>name</DocsCode>.{" "}
              <DocsCode>required</DocsCode> stops an empty or half-typed time,
              and a reset brings back the default.
            </>
          }
        >
          <UiSdkTimeInputForm />
        </DocsExample>
        <DocsExample
          file="ui-sdk-time-input/controller"
          title="Controller"
          description={
            <>
              <DocsCode>createTimeInputController()</DocsCode> sets, clears or
              focuses the field from anywhere. Focus a part by its unit, like{" "}
              <DocsCode>&quot;minute&quot;</DocsCode>.
            </>
          }
        >
          <UiSdkTimeInputController />
        </DocsExample>
        <DocsExample
          file="ui-sdk-time-input/disabled"
          title="Disabled"
          description="A disabled field is skipped by focus and doesn’t submit."
        >
          <UiSdkTimeInputDisabled />
        </DocsExample>
        <DocsExample
          file="ui-sdk-time-input/read-only"
          title="Read-only"
          description="A read-only field takes focus and submits, but keys and typing don’t change it."
        >
          <UiSdkTimeInputReadOnly />
        </DocsExample>
        <DocsExample
          file="ui-sdk-time-input/rtl"
          title="Right to left"
          description="The parts keep the locale’s order, and the arrow keys follow them on screen."
        >
          <UiSdkTimeInputRtl />
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
              keys: ["↑", "↓"],
              description:
                "Steps the part by one, wrapping around. An empty part starts at the current time.",
            },
            {
              keys: ["PageUp", "PageDown"],
              description: "Steps by more, like 15 minutes.",
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
              keys: ["A", "P"],
              description: "Chooses AM or PM on a 12-hour clock.",
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
          “hour”, with its value and range, and an empty part reads as “Empty”.
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
        <DocsSection title="TimeInput" level={3}>
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
                name: "hourCycle",
                type: "12 | 24",
                description: "Defaults to the locale’s clock.",
              },
              {
                name: "granularity",
                type: '"hour" | "minute" | "second"',
                default: '"minute"',
              },
              { name: "min", type: "string" },
              { name: "max", type: "string" },
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
                type: "TimeInputController",
                description: "From createTimeInputController().",
              },
              {
                name: "children",
                type: "ReactNode | (state) => ReactNode",
                description: "Defaults to TimeInputSegments.",
              },
              { name: "render", type: renderType },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="time-input"',
                description: "Target the time input in CSS.",
              },
              {
                name: "data-invalid",
                description:
                  "Present when the time is outside min and max, or invalid is set.",
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
        <DocsSection title="TimeInputSegments" level={3}>
          <DocsParagraph>
            Renders a TimeInputSegment for each part, in the locale’s order,
            with the text between them.
          </DocsParagraph>
        </DocsSection>
        <DocsSection title="TimeInputSegment" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "segment",
                type: "TimeInputSegmentData",
                description: "One of the root state’s segments.",
              },
              { name: "render", type: renderType },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="time-input-segment"',
                description: "Target a part in CSS.",
              },
              {
                name: "data-type",
                description:
                  "hour, minute, second, dayPeriod, or literal for the text between parts.",
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
