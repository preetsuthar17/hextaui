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
import { UiSdkDatePickerController } from "@/components/examples/ui-sdk-date-picker/controller"
import { UiSdkDatePickerDemo } from "@/components/examples/ui-sdk-date-picker/demo"
import { UiSdkDatePickerDisabled } from "@/components/examples/ui-sdk-date-picker/disabled"
import { UiSdkDatePickerForm } from "@/components/examples/ui-sdk-date-picker/form"
import { UiSdkDatePickerLimits } from "@/components/examples/ui-sdk-date-picker/limits"
import { UiSdkDatePickerLocale } from "@/components/examples/ui-sdk-date-picker/locale"
import { UiSdkDatePickerPresets } from "@/components/examples/ui-sdk-date-picker/presets"
import { UiSdkDatePickerRange } from "@/components/examples/ui-sdk-date-picker/range"
import { UiSdkDatePickerRtl } from "@/components/examples/ui-sdk-date-picker/rtl"
import { getDocsComponentMetadata } from "@/lib/docs-metadata"

export const metadata = getDocsComponentMetadata("ui-sdk-date-picker")

const layerCode = `@layer ui-sdk;

@import "tailwindcss";`

const importCode = `import {
  DatePicker,
  DatePickerContent,
  DatePickerControl,
  DatePickerHint,
  DatePickerInput,
  DatePickerTrigger,
} from "@/components/ui/ui-sdk-date-picker"`

const usageCode = `<DatePicker defaultValue="2026-11-20">
  <DatePickerControl>
    <DatePickerInput aria-label="Due date" />
    <DatePickerTrigger />
  </DatePickerControl>
  <DatePickerHint />
  <DatePickerContent />
</DatePicker>`

const compositionCode = `DatePicker
├── DatePickerControl
│   ├── DatePickerInput
│   ├── DatePickerSeparator
│   ├── DatePickerClear
│   └── DatePickerTrigger
├── DatePickerHint
└── DatePickerContent
    ├── DatePickerPreset
    └── DatePickerCalendar
        ├── CalendarPrevious
        ├── CalendarHeading
        ├── CalendarNext
        └── CalendarGrid
            ├── CalendarWeekdays
            │   └── CalendarWeekday
            └── CalendarWeeks
                └── CalendarDay`

const renderType = "ReactElement | (props, state) => ReactElement"

export default function Page() {
  return (
    <DocsComponentPage slug="ui-sdk-date-picker">
      <DocsExample file="ui-sdk-date-picker/demo">
        <UiSdkDatePickerDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@ui-sdk/react@0.1.0-beta.2",
          "@ui-sdk/core@0.1.0-beta.2",
          "@tabler/icons-react",
          "cn",
        ]}
        files={[
          "components/ui/ui-sdk-date-picker.tsx",
          "components/ui/button.tsx",
        ]}
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
          Values are ISO date strings like <DocsCode>2026-11-20</DocsCode>, with
          no time or time zone, so you don’t need a date library. People type in
          their own date order, like 11/20/2026 or 20.11.2026, and the field
          formats the date when they press Enter or leave it.{" "}
          <DocsCode>DatePickerContent</DocsCode> with no children renders a
          styled calendar.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="ui-sdk-date-picker/range"
          title="Range"
          description={
            <>
              With <DocsCode>{'mode="range"'}</DocsCode>, add a second input
              with <DocsCode>end</DocsCode>. The calendar stays open after the
              first date and closes after the second.{" "}
              <DocsCode>{"months={2}"}</DocsCode> shows two months side by side,
              stacked on small screens.
            </>
          }
        >
          <UiSdkDatePickerRange />
        </DocsExample>
        <DocsExample
          file="ui-sdk-date-picker/presets"
          title="Presets"
          description={
            <>
              A <DocsCode>DatePickerPreset</DocsCode> picks its{" "}
              <DocsCode>value</DocsCode> and closes the popup. It shows as
              pressed while its value is selected.
            </>
          }
        >
          <UiSdkDatePickerPresets />
        </DocsExample>
        <DocsExample
          file="ui-sdk-date-picker/limits"
          title="Min, max and unavailable dates"
          description={
            <>
              <DocsCode>min</DocsCode>, <DocsCode>max</DocsCode> and{" "}
              <DocsCode>unavailable</DocsCode> apply to typing and picking. Here
              weekends and two holidays can’t be picked, and a typed one is
              marked invalid.
            </>
          }
        >
          <UiSdkDatePickerLimits />
        </DocsExample>
        <DocsExample
          file="ui-sdk-date-picker/locale"
          title="Language"
          description={
            <>
              <DocsCode>locale</DocsCode> sets the typed format, the hint and
              the calendar’s names. Without it, the picker reads the page’s{" "}
              <DocsCode>lang</DocsCode>. The buttons have English names, so pass{" "}
              <DocsCode>aria-label</DocsCode> to translate them.
            </>
          }
        >
          <UiSdkDatePickerLocale />
        </DocsExample>
        <DocsExample
          file="ui-sdk-date-picker/form"
          title="Form"
          description={
            <>
              With a <DocsCode>name</DocsCode>, the date submits as an ISO
              string. <DocsCode>required</DocsCode> blocks an empty submit, text
              that isn’t a date blocks one too, and reset goes back to{" "}
              <DocsCode>defaultValue</DocsCode>.
            </>
          }
        >
          <UiSdkDatePickerForm />
        </DocsExample>
        <DocsExample
          file="ui-sdk-date-picker/controller"
          title="Controller"
          description={
            <>
              A controller from{" "}
              <DocsCode>createDatePickerController()</DocsCode> sets the date or
              opens the calendar from anywhere, and{" "}
              <DocsCode>onValueChange</DocsCode> reports each change. Leave{" "}
              <DocsCode>value</DocsCode> unset here, so the calendar can move to
              the month the controller picks.
            </>
          }
        >
          <UiSdkDatePickerController />
        </DocsExample>
        <DocsExample
          file="ui-sdk-date-picker/disabled"
          title="Disabled and read-only"
          description={
            <>
              <DocsCode>disabled</DocsCode> stops typing and opening.{" "}
              <DocsCode>readOnly</DocsCode> still opens the calendar so people
              can look, but nothing can change.
            </>
          }
        >
          <UiSdkDatePickerDisabled />
        </DocsExample>
        <DocsExample
          file="ui-sdk-date-picker/rtl"
          title="Right to left"
          description="With an Arabic locale inside dir=rtl, the field, the arrows and the calendar all run from the right."
        >
          <UiSdkDatePickerRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Enter"],
              description:
                "In the input, reads the typed date. On a day, picks it.",
            },
            {
              keys: ["←", "→", "↑", "↓"],
              description: "Moves between days, or by a week up and down.",
            },
            {
              keys: ["Page Up", "Page Down"],
              description: "Moves a month back or forward.",
            },
            {
              keys: ["Home", "End"],
              description: "Moves to the start or end of the week.",
            },
            {
              keys: ["Esc"],
              description:
                "Cancels an unfinished range, or else closes the calendar.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsParagraph>
          The calendar opens as a dialog with a grid of days, each named in
          full, like “Friday, November 20, 2026”. The hint describes the input,
          so screen readers hear the format to type. Text that isn’t a date sets{" "}
          <DocsCode>aria-invalid</DocsCode> and keeps the old value, and
          unavailable days stay focusable so keyboard users still hear them.
        </DocsParagraph>
        <DocsParagraph>
          The trigger, popup and arrows have English names. Pass{" "}
          <DocsCode>aria-label</DocsCode> to each to translate them. Inputs use
          a 16px font on touch screens so iOS doesn’t zoom, and the popup only
          scales in when motion is allowed.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Each part wraps the UI SDK part of the same name and accepts all of
          its props, including <DocsCode>render</DocsCode> and a{" "}
          <DocsCode>className</DocsCode> that can be a function of the part’s
          state. <DocsCode>DatePickerControl</DocsCode>,{" "}
          <DocsCode>DatePickerSeparator</DocsCode> and{" "}
          <DocsCode>DatePickerCalendar</DocsCode> are HextaUI layout parts.
        </DocsParagraph>
        <DocsSection title="DatePicker" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "mode",
                type: '"single" | "range"',
                default: '"single"',
              },
              {
                name: "value",
                type: "string | [string, string] | null",
              },
              {
                name: "defaultValue",
                type: "string | [string, string] | null",
              },
              { name: "onValueChange", type: "(value, details) => void" },
              { name: "min", type: "string" },
              { name: "max", type: "string" },
              {
                name: "unavailable",
                type: "DateMatchers",
                description:
                  "ISO dates, { from, to }, { weekday }, { before }, { after } or a function.",
              },
              { name: "months", type: "number", default: "1" },
              {
                name: "pageBy",
                type: '"month" | "page"',
                default: '"month"',
              },
              { name: "locale", type: "string" },
              { name: "weekStartsOn", type: "number" },
              { name: "minDays", type: "number" },
              { name: "maxDays", type: "number" },
              { name: "closeOnSelect", type: "boolean", default: "true" },
              { name: "disabled", type: "boolean", default: "false" },
              { name: "readOnly", type: "boolean", default: "false" },
              { name: "name", type: "string" },
              { name: "startName", type: "string" },
              { name: "endName", type: "string" },
              { name: "required", type: "boolean", default: "false" },
              { name: "open", type: "boolean" },
              { name: "onOpenChange", type: "(open, details) => void" },
              {
                name: "controller",
                type: "DatePickerController",
                description: "From createDatePickerController().",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="date-picker"',
                description: "Target the date picker in CSS.",
              },
              { name: "data-open", description: "Present while open." },
              {
                name: "data-invalid",
                description:
                  "Present while an input holds text that isn’t a date.",
              },
              {
                name: "data-disabled",
                description: "Present when disabled.",
              },
              {
                name: "data-readonly",
                description: "Present when read-only.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="DatePickerInput" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "end",
                type: "boolean",
                default: "false",
                description: "Makes it a range’s end.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="DatePickerTrigger" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "children",
                type: "ReactNode",
                description: "Defaults to a calendar icon.",
              },
              { name: "aria-label", type: "string", default: '"Choose date"' },
            ]}
          />
        </DocsSection>
        <DocsSection title="DatePickerClear" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "children",
                type: "ReactNode",
                description:
                  "Defaults to an X icon named Clear. It hides while there’s nothing to clear.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="DatePickerContent" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "children",
                type: "ReactNode",
                description: "Defaults to a DatePickerCalendar.",
              },
              { name: "align", type: "Align", default: '"start"' },
              { name: "sideOffset", type: "number", default: "6" },
              { name: "collisionPadding", type: "number", default: "8" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="date-picker-content"',
                description: "Target the popup in CSS.",
              },
              {
                name: "--cell-size",
                description: "The size of each day, larger on touch screens.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="DatePickerCalendar" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "months",
                type: "number",
                default: "1",
                description: "How many grids to render, side by side.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="DatePickerPreset" level={3}>
          <DocsPropsTable
            props={[
              { name: "value", type: "string | [string, string]" },
              { name: "render", type: renderType },
            ]}
          />
        </DocsSection>
        <DocsSection title="CalendarDay" level={3}>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="calendar-day"',
                description: "Target a day in CSS.",
              },
              { name: "data-today", description: "Present on today." },
              {
                name: "data-range-start",
                description: "Present where a range starts.",
              },
              {
                name: "data-range-end",
                description: "Present where a range ends.",
              },
              {
                name: "data-unavailable",
                description: "Present on a day that can’t be picked.",
              },
              {
                name: "data-outside",
                description: "Present on a day of the next or previous month.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
