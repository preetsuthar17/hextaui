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
  DocsKeyboardTable,
  DocsPropsTable,
} from "@/components/docs/docs-props-table"
import { DatePickerControlled } from "@/components/examples/date-picker/controlled"
import { DatePickerDemo } from "@/components/examples/date-picker/demo"
import { DatePickerDisabled } from "@/components/examples/date-picker/disabled"
import { DatePickerDisabledDays } from "@/components/examples/date-picker/disabled-days"
import { DatePickerDropdowns } from "@/components/examples/date-picker/dropdowns"
import { DatePickerForm } from "@/components/examples/date-picker/form"
import { DatePickerInSheet } from "@/components/examples/date-picker/in-sheet"
import { DatePickerNarrow } from "@/components/examples/date-picker/narrow"
import { DatePickerRange } from "@/components/examples/date-picker/range"
import { DatePickerRtl } from "@/components/examples/date-picker/rtl"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("date-picker")

const importCode = `import { DatePicker, DateRangePicker } from "@/components/ui/date-picker"`

const usageCode = `const [date, setDate] = React.useState<Date | null>(null)

<DatePicker value={date} onValueChange={setDate} />`

const sharedProps = [
  { name: "open", type: "boolean" },
  { name: "defaultOpen", type: "boolean", default: "false" },
  { name: "onOpenChange", type: "(open: boolean) => void" },
  {
    name: "locale",
    type: "string",
    default: '"en-US"',
    description:
      "Formats the trigger label with Intl.DateTimeFormat. Pass a react-day-picker locale in calendarProps to translate the calendar too.",
  },
  {
    name: "clearable",
    type: "boolean",
    default: "false",
    description:
      "Adds a Clear button below the calendar once there is a value.",
  },
  { name: "clearLabel", type: "string", default: '"Clear"' },
  {
    name: "name",
    type: "string",
    description:
      "Renders a hidden input so the value is submitted with its form.",
  },
  {
    name: "calendarProps",
    type: "CalendarProps",
    description:
      "Passed to the calendar, except mode, selected, onSelect, required, numberOfMonths and autoFocus. Use it for disabled days, captionLayout, startMonth, endMonth, locale and dir.",
  },
  {
    name: "variant",
    type: "Button variant",
    default: '"outline"',
    description: "The trigger is a Button, and accepts its other props too.",
  },
  { name: "disabled", type: "boolean", default: "false" },
  {
    name: "className",
    type: "string",
    description: "Applied to the trigger, which is w-60 by default.",
  },
]

export default function Page() {
  return (
    <DocsComponentPage slug="date-picker">
      <DocsExample file="date-picker/demo">
        <DatePickerDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@base-ui/react",
          "@tabler/icons-react",
          "class-variance-authority",
          "cn",
          "react-day-picker",
        ]}
        files={[
          "components/ui/date-picker.tsx",
          "components/ui/calendar.tsx",
          "components/ui/popover.tsx",
          "components/ui/sheet.tsx",
          "components/ui/button.tsx",
          "lib/motion.ts",
        ]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          On screens narrower than 640px the calendar opens in a bottom sheet
          instead of a popover, so days stay large enough to tap.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="date-picker/controlled"
          title="Controlled"
          description={
            <>
              Pass <DocsCode>value</DocsCode> and{" "}
              <DocsCode>onValueChange</DocsCode>. Cleared values are{" "}
              <DocsCode>null</DocsCode>. The calendar always opens on the month
              of the selected date, and picking a day closes it and returns
              focus to the button.
            </>
          }
        >
          <DatePickerControlled />
        </DocsExample>
        <DocsExample
          file="date-picker/range"
          title="Range"
          description={
            <>
              <DocsCode>{"<DateRangePicker />"}</DocsCode> shows two months on
              larger screens. The first click always starts a new range, even
              when one is set, and the second click finishes it in either order
              and closes the picker.
            </>
          }
        >
          <DatePickerRange />
        </DocsExample>
        <DocsExample
          file="date-picker/disabled-days"
          title="Disabled days"
          description={
            <>
              Pass any react-day-picker matcher as{" "}
              <DocsCode>calendarProps.disabled</DocsCode>. Here only future
              weekdays can be picked.
            </>
          }
        >
          <DatePickerDisabledDays />
        </DocsExample>
        <DocsExample
          file="date-picker/dropdowns"
          title="Month and year dropdowns"
          description={
            <>
              For far-away dates like a birthday, set{" "}
              <DocsCode>{'captionLayout: "dropdown"'}</DocsCode> with a{" "}
              <DocsCode>startMonth</DocsCode> and <DocsCode>endMonth</DocsCode>.
              Label the trigger with a <DocsCode>{"<label />"}</DocsCode>{" "}
              pointing at its <DocsCode>id</DocsCode>.
            </>
          }
        >
          <DatePickerDropdowns />
        </DocsExample>
        <DocsExample
          file="date-picker/form"
          title="In a form"
          description={
            <>
              With <DocsCode>name</DocsCode>, a single date is submitted as{" "}
              <DocsCode>2026-10-14</DocsCode> and a range as{" "}
              <DocsCode>2026-10-20/2026-10-24</DocsCode>. Empty pickers submit
              an empty string.
            </>
          }
        >
          <DatePickerForm />
        </DocsExample>
        <DocsExample
          file="date-picker/disabled"
          title="Disabled"
          description="A disabled trigger can still show a value."
        >
          <DatePickerDisabled />
        </DocsExample>
        <DocsExample
          file="date-picker/narrow"
          title="Narrow container"
          description="The trigger never grows past its container. Long labels truncate instead of wrapping."
        >
          <DatePickerNarrow />
        </DocsExample>
        <DocsExample
          file="date-picker/in-sheet"
          title="Inside a sheet"
          description="The picker layers above the sheet, and Escape closes only the picker."
        >
          <DatePickerInSheet />
        </DocsExample>
        <DocsExample
          file="date-picker/rtl"
          title="Right to left"
          description={
            <>
              Pass <DocsCode>locale</DocsCode> for the trigger label and a
              react-day-picker locale with <DocsCode>{'dir: "rtl"'}</DocsCode>{" "}
              in <DocsCode>calendarProps</DocsCode> for the calendar. Arrow keys
              follow the direction.
            </>
          }
        >
          <DatePickerRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Enter", "Space"],
              description:
                "On the trigger, opens the picker and focuses the selected day, or today. On a day, selects it.",
            },
            {
              keys: ["←", "→"],
              description: "Moves to the previous or next day.",
            },
            {
              keys: ["↑", "↓"],
              description:
                "Moves to the same day in the previous or next week.",
            },
            {
              keys: ["Page Up", "Page Down"],
              description: "Moves to the previous or next month.",
            },
            {
              keys: ["Shift", "Page Up"],
              description:
                "Moves to the previous year. Shift Page Down moves to the next.",
            },
            {
              keys: ["Home", "End"],
              description: "Moves to the start or end of the week.",
            },
            {
              keys: ["Esc"],
              description:
                "Closes the picker and returns focus to the trigger.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            The popover is labelled with <DocsCode>title</DocsCode>, and the
            bottom sheet shows it as a heading. Translate it along with{" "}
            <DocsCode>placeholder</DocsCode>.
          </li>
          <li>
            The trigger has no visible label of its own. Pair it with a{" "}
            <DocsCode>{"<label />"}</DocsCode> or pass{" "}
            <DocsCode>aria-label</DocsCode>.
          </li>
          <li>
            Disabled days are skipped by the keyboard and announced as
            unavailable.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Both pickers share the props below and render a{" "}
          <DocsCode>{"<Button />"}</DocsCode> trigger with a{" "}
          <DocsCode>{"<Calendar />"}</DocsCode> in a popover or bottom sheet.
        </DocsParagraph>
        <DocsSection title="DatePicker" level={3}>
          <DocsPropsTable
            props={[
              { name: "value", type: "Date | null" },
              { name: "defaultValue", type: "Date | null", default: "null" },
              { name: "onValueChange", type: "(value: Date | null) => void" },
              {
                name: "placeholder",
                type: "string",
                default: '"Pick a date"',
              },
              {
                name: "title",
                type: "string",
                default: '"Select a date"',
                description:
                  "Accessible name of the popover, heading of the sheet.",
              },
              ...sharedProps,
            ]}
          />
        </DocsSection>
        <DocsSection title="DateRangePicker" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "value",
                type: "{ from: Date; to?: Date } | null",
              },
              {
                name: "defaultValue",
                type: "{ from: Date; to?: Date } | null",
                default: "null",
              },
              {
                name: "onValueChange",
                type: "(value: DateRange | null) => void",
                description: "Called once the second day is picked.",
              },
              {
                name: "placeholder",
                type: "string",
                default: '"Pick a date range"',
              },
              {
                name: "title",
                type: "string",
                default: '"Select dates"',
              },
              ...sharedProps,
            ]}
          />
        </DocsSection>
        <DocsSection title="Data attributes" level={3}>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="date-picker-trigger"',
                description: "The trigger button.",
              },
              {
                name: "data-empty",
                description:
                  "Present on the trigger while there is no value. Shows the placeholder in muted text.",
              },
              {
                name: "data-popup-open",
                description: "Present on the trigger while the picker is open.",
              },
              {
                name: 'data-slot="date-picker-content"',
                description: "Wraps the calendar in the popover or sheet.",
              },
              {
                name: 'data-slot="date-picker-clear"',
                description: "The Clear button.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
