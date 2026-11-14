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
import { UiSdkNumberInputControlled } from "@/components/examples/ui-sdk-number-input/controlled"
import { UiSdkNumberInputDemo } from "@/components/examples/ui-sdk-number-input/demo"
import { UiSdkNumberInputDisabled } from "@/components/examples/ui-sdk-number-input/disabled"
import { UiSdkNumberInputForm } from "@/components/examples/ui-sdk-number-input/form"
import { UiSdkNumberInputFormat } from "@/components/examples/ui-sdk-number-input/format"
import { UiSdkNumberInputInvalid } from "@/components/examples/ui-sdk-number-input/invalid"
import { UiSdkNumberInputLocale } from "@/components/examples/ui-sdk-number-input/locale"
import { UiSdkNumberInputMinMax } from "@/components/examples/ui-sdk-number-input/min-max"
import { UiSdkNumberInputReadOnly } from "@/components/examples/ui-sdk-number-input/read-only"
import { UiSdkNumberInputRtl } from "@/components/examples/ui-sdk-number-input/rtl"
import { UiSdkNumberInputScrub } from "@/components/examples/ui-sdk-number-input/scrub"
import { UiSdkNumberInputStep } from "@/components/examples/ui-sdk-number-input/step"
import { UiSdkNumberInputWheel } from "@/components/examples/ui-sdk-number-input/wheel"
import { getDocsComponentMetadata } from "@/lib/docs-metadata"

export const metadata = getDocsComponentMetadata("ui-sdk-number-input")

const layerCode = `@layer ui-sdk;

@import "tailwindcss";`

const importCode = `import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
} from "@/components/ui/ui-sdk-number-input"`

const usageCode = `<NumberInput defaultValue={1} min={0}>
  <NumberInputGroup>
    <NumberInputDecrement />
    <NumberInputControl aria-label="Quantity" />
    <NumberInputIncrement />
  </NumberInputGroup>
</NumberInput>`

const compositionCode = `NumberInput
├── NumberInputScrubArea
│   └── NumberInputScrubAreaCursor
└── NumberInputGroup
    ├── NumberInputDecrement
    ├── NumberInputControl
    ├── NumberInputIncrement
    └── NumberInputStepper
        ├── NumberInputIncrement
        └── NumberInputDecrement`

const renderType = "ReactElement | (props, state) => ReactElement"

export default function Page() {
  return (
    <DocsComponentPage slug="ui-sdk-number-input">
      <DocsExample file="ui-sdk-number-input/demo">
        <UiSdkNumberInputDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@ui-sdk/react@0.1.0-beta.2",
          "@ui-sdk/core@0.1.0-beta.2",
          "@tabler/icons-react",
          "class-variance-authority",
          "cn",
        ]}
        files={["components/ui/ui-sdk-number-input.tsx"]}
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
          The value is a number, or <DocsCode>null</DocsCode> when the field is
          empty, while the field shows it formatted. Typing updates the value
          once the text is a valid number. Enter or leaving the field commits
          it: the text is read, kept within <DocsCode>min</DocsCode> and{" "}
          <DocsCode>max</DocsCode>, snapped to the step and formatted again.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="ui-sdk-number-input/min-max"
          title="Min and max"
          description={
            <>
              A step button turns off at its bound. A typed value outside the
              bounds is pulled back in when it’s committed.
            </>
          }
        >
          <UiSdkNumberInputMinMax />
        </DocsExample>
        <DocsExample
          file="ui-sdk-number-input/step"
          title="Step"
          description={
            <>
              <DocsCode>step</DocsCode> is the usual increment. Shift, Page Up
              and Page Down move by <DocsCode>largeStep</DocsCode>, and Alt or
              Option with an arrow key by <DocsCode>smallStep</DocsCode>. Hold
              a button to repeat.
            </>
          }
        >
          <UiSdkNumberInputStep />
        </DocsExample>
        <DocsExample
          file="ui-sdk-number-input/format"
          title="Currency, percent and units"
          description={
            <>
              <DocsCode>format</DocsCode> takes{" "}
              <DocsCode>Intl.NumberFormat</DocsCode> options. People can type in
              the same format, and a percent is a fraction, so 15% is 0.15. The{" "}
              <DocsCode>{'variant="stacked"'}</DocsCode> group puts small
              chevrons at the end.
            </>
          }
        >
          <UiSdkNumberInputFormat />
        </DocsExample>
        <DocsExample
          file="ui-sdk-number-input/locale"
          title="Locale"
          description={
            <>
              <DocsCode>locale</DocsCode> picks separators, symbols and digit
              grouping, for showing and for typing. Without it, the field follows
              the page’s language once it’s interactive, and the server renders
              English.
            </>
          }
        >
          <UiSdkNumberInputLocale />
        </DocsExample>
        <DocsExample
          file="ui-sdk-number-input/scrub"
          title="Scrub"
          description={
            <>
              Drag a <DocsCode>NumberInputScrubArea</DocsCode> sideways to
              change the value, like in a design tool. Where the browser allows
              pointer lock, the drag can go past the edge of the screen, and{" "}
              <DocsCode>NumberInputScrubAreaCursor</DocsCode> draws the cursor.
            </>
          }
        >
          <UiSdkNumberInputScrub />
        </DocsExample>
        <DocsExample
          file="ui-sdk-number-input/wheel"
          title="Mouse wheel"
          description={
            <>
              With <DocsCode>wheel</DocsCode>, scrolling over the focused field
              steps the value. It’s off by default, so a page that scrolls past
              the field never changes it.
            </>
          }
        >
          <UiSdkNumberInputWheel />
        </DocsExample>
        <DocsExample
          file="ui-sdk-number-input/controlled"
          title="Controlled"
          description={
            <>
              <DocsCode>onValueChange</DocsCode> runs on every valid change, and{" "}
              <DocsCode>onValueCommit</DocsCode> once an interaction ends, which
              is the one to save on. A controller steps or sets the value from
              any button.
            </>
          }
        >
          <UiSdkNumberInputControlled />
        </DocsExample>
        <DocsExample
          file="ui-sdk-number-input/form"
          title="Form"
          description={
            <>
              With a <DocsCode>name</DocsCode>, the number submits as is, like
              1250, never formatted. <DocsCode>required</DocsCode> blocks an
              empty field, and a form reset returns to the default.
            </>
          }
        >
          <UiSdkNumberInputForm />
        </DocsExample>
        <DocsExample
          file="ui-sdk-number-input/invalid"
          title="Invalid"
          description={
            <>
              <DocsCode>invalid</DocsCode> marks the field and sets{" "}
              <DocsCode>aria-invalid</DocsCode> on the input, for checks of your
              own like stock.
            </>
          }
        >
          <UiSdkNumberInputInvalid />
        </DocsExample>
        <DocsExample
          file="ui-sdk-number-input/disabled"
          title="Disabled"
          description="A disabled field can’t be focused or changed, and doesn’t submit."
        >
          <UiSdkNumberInputDisabled />
        </DocsExample>
        <DocsExample
          file="ui-sdk-number-input/read-only"
          title="Read-only"
          description="A read-only field can be focused and submits, but steps, scrubs and typing don’t change it."
        >
          <UiSdkNumberInputReadOnly />
        </DocsExample>
        <DocsExample
          file="ui-sdk-number-input/rtl"
          title="Right to left"
          description="The buttons swap sides, and the locale sets the digits and the currency."
        >
          <UiSdkNumberInputRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["↑", "↓"],
              description: "Steps the value by step.",
            },
            {
              keys: ["Shift", "PageUp", "PageDown"],
              description:
                "Steps by largeStep, ten steps by default. Shift works with the arrows, the buttons, the wheel and a scrub.",
            },
            {
              keys: ["Alt"],
              description:
                "With an arrow key, steps by smallStep, a tenth of a step by default.",
            },
            {
              keys: ["Home", "End"],
              description: "Goes to the minimum or the maximum, when set.",
            },
            {
              keys: ["Enter"],
              description: "Commits and formats what’s typed.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsParagraph>
          The field follows the keyboard of the WAI-ARIA spinbutton pattern on a
          native text input, so ordinary text editing keeps working. Name the
          input with a label or <DocsCode>aria-label</DocsCode>. The step
          buttons are named “Increase” and “Decrease” by default, point at the
          input, and stay out of the tab order because the arrow keys do the
          same.
        </DocsParagraph>
        <DocsParagraph>
          A field with decimals asks for a decimal keypad on phones, and the
          step buttons grow on touch screens. They only shrink on press when
          motion is allowed.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Each part wraps the UI SDK part of the same name and accepts all of
          its props, including <DocsCode>render</DocsCode> and a{" "}
          <DocsCode>className</DocsCode> that can be a function of the part’s
          state.
        </DocsParagraph>
        <DocsSection title="NumberInput" level={3}>
          <DocsPropsTable
            props={[
              { name: "value", type: "number | null" },
              { name: "defaultValue", type: "number | null" },
              {
                name: "onValueChange",
                type: "(value: number | null, details) => void",
              },
              {
                name: "onValueCommit",
                type: "(value: number | null, details) => void",
                description: "Runs once an interaction ends. For saving.",
              },
              { name: "min", type: "number" },
              { name: "max", type: "number" },
              { name: "step", type: "number", default: "1" },
              { name: "largeStep", type: "number", default: "step × 10" },
              { name: "smallStep", type: "number", default: "step ÷ 10" },
              { name: "format", type: "Intl.NumberFormatOptions" },
              {
                name: "locale",
                type: "string",
                description: "Defaults to the page’s language.",
              },
              { name: "wheel", type: "boolean", default: "false" },
              { name: "invalid", type: "boolean", default: "false" },
              { name: "disabled", type: "boolean", default: "false" },
              { name: "readOnly", type: "boolean", default: "false" },
              { name: "required", type: "boolean", default: "false" },
              { name: "name", type: "string" },
              { name: "form", type: "string" },
              {
                name: "controller",
                type: "NumberInputController",
                description: "From createNumberInputController().",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="number-input"',
                description: "Target the number input in CSS.",
              },
              {
                name: "data-scrubbing",
                description: "Present while a scrub changes the value.",
              },
              {
                name: "data-invalid",
                description: "Present when invalid.",
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
        <DocsSection title="NumberInputGroup" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "variant",
                type: '"split" | "stacked" | "plain"',
                default: '"split"',
                description:
                  "Buttons on both sides, chevrons stacked at the end, or no buttons, for a scrub handle.",
              },
              { name: "render", type: renderType },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="number-input-group"',
                description: "Target the field’s box in CSS.",
              },
              {
                name: "data-variant",
                description: "The variant: split, stacked or plain.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="NumberInputControl" level={3}>
          <DocsPropsTable
            props={[
              { name: "id", type: "string" },
              { name: "placeholder", type: "string" },
              { name: "render", type: renderType },
            ]}
          />
        </DocsSection>
        <DocsSection title="NumberInputIncrement" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "aria-label",
                type: "string",
                default: '"Increase"',
              },
              {
                name: "disabled",
                type: "boolean",
                description: "Turns off this button alone.",
              },
              {
                name: "children",
                type: "ReactNode | (state) => ReactNode",
                description:
                  "Defaults to a plus, or a chevron in the stacked variant.",
              },
              { name: "render", type: renderType },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="number-input-increment"',
                description: "Target the button in CSS.",
              },
              {
                name: "data-at-bound",
                description: "Present when the value is at max.",
              },
              {
                name: "data-disabled",
                description: "Present when the button can’t step.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="NumberInputDecrement" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "aria-label",
                type: "string",
                default: '"Decrease"',
              },
              {
                name: "disabled",
                type: "boolean",
                description: "Turns off this button alone.",
              },
              { name: "render", type: renderType },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="number-input-decrement"',
                description: "Target the button in CSS.",
              },
              {
                name: "data-at-bound",
                description: "Present when the value is at min.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="NumberInputStepper" level={3}>
          <DocsParagraph>
            Stacks the increment above the decrement at the end of a stacked
            group.
          </DocsParagraph>
        </DocsSection>
        <DocsSection title="NumberInputScrubArea" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "orientation",
                type: '"horizontal" | "vertical"',
                default: '"horizontal"',
                description: "Right and up increase the value.",
              },
              {
                name: "pixelsPerStep",
                type: "number",
                description: "How far the pointer moves for one step.",
              },
              {
                name: "controller",
                type: "NumberInputController",
                description:
                  "Connects a scrub area outside the number input, like an icon in a toolbar.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="number-input-scrub-area"',
                description: "Target the scrub area in CSS.",
              },
              {
                name: "data-orientation",
                description: "horizontal or vertical.",
              },
              {
                name: "data-scrubbing",
                description: "Present while a drag changes the value.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="NumberInputScrubAreaCursor" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "children",
                type: "ReactNode",
                description: "Defaults to a sideways arrow, centered on the pointer.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
