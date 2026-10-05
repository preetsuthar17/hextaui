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
import { InputControlled } from "@/components/examples/input/controlled"
import { InputDemo } from "@/components/examples/input/demo"
import { InputDescription } from "@/components/examples/input/description"
import { InputDisabled } from "@/components/examples/input/disabled"
import { InputFile } from "@/components/examples/input/file"
import { InputGrid } from "@/components/examples/input/grid"
import { InputInvalid } from "@/components/examples/input/invalid"
import { InputLongContent } from "@/components/examples/input/long-content"
import { InputNativeValidation } from "@/components/examples/input/native-validation"
import { InputReadOnly } from "@/components/examples/input/read-only"
import { InputRtl } from "@/components/examples/input/rtl"
import { InputSizes } from "@/components/examples/input/sizes"
import { InputTypes } from "@/components/examples/input/types"
import { InputWithButton } from "@/components/examples/input/with-button"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("input")

const importCode = `import { Input } from "@/components/ui/input"`

const usageCode = `<label htmlFor="email">Email</label>
<Input id="email" type="email" placeholder="you@example.com" />`

const renderType = "ReactElement | (props, state) => ReactElement"

export default function Page() {
  return (
    <DocsComponentPage slug="input">
      <DocsExample file="input/demo">
        <InputDemo />
      </DocsExample>

      <DocsInstall
        dependencies={["@base-ui/react", "class-variance-authority", "cn"]}
        files={[
          "components/ui/input.tsx",
          "components/ui/number-flow.tsx",
          "lib/motion.ts",
        ]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="input/sizes"
          title="Sizes"
          description={
            <>
              <DocsCode>sm</DocsCode>, <DocsCode>default</DocsCode> and{" "}
              <DocsCode>lg</DocsCode> match the button heights, so an input and
              a button of the same size line up in a row.
            </>
          }
        >
          <InputSizes />
        </DocsExample>
        <DocsExample
          file="input/description"
          title="With a description"
          description={
            <>
              Point <DocsCode>aria-describedby</DocsCode> at the helper text so
              screen readers read it after the label.
            </>
          }
        >
          <InputDescription />
        </DocsExample>
        <DocsExample
          file="input/invalid"
          title="Invalid"
          description={
            <>
              <DocsCode>aria-invalid</DocsCode> turns the edge and the focus
              ring red. Link the message with{" "}
              <DocsCode>aria-describedby</DocsCode> so it is announced, not just
              colored.
            </>
          }
        >
          <InputInvalid />
        </DocsExample>
        <DocsExample
          file="input/native-validation"
          title="Native validation"
          description={
            <>
              Fields with <DocsCode>required</DocsCode>,{" "}
              <DocsCode>type=&quot;email&quot;</DocsCode> or{" "}
              <DocsCode>pattern</DocsCode> only turn red after someone has typed
              in them or tried to submit, never on first render. A submit that
              finds a field invalid shakes it once, so the eye lands on what
              needs fixing. It never shakes while you type or tab around. Submit
              the empty form to see it.
            </>
          }
        >
          <InputNativeValidation />
        </DocsExample>
        <DocsExample
          file="input/disabled"
          title="Disabled"
          description="A disabled input can’t be focused, edited or submitted with the form."
        >
          <InputDisabled />
        </DocsExample>
        <DocsExample
          file="input/read-only"
          title="Read only"
          description={
            <>
              <DocsCode>readOnly</DocsCode> keeps the value focusable,
              selectable and submitted, with a muted surface so it doesn’t look
              editable. Prefer it over <DocsCode>disabled</DocsCode> for values
              people need to copy.
            </>
          }
        >
          <InputReadOnly />
        </DocsExample>
        <DocsExample
          file="input/file"
          title="File"
          description={
            <>
              <DocsCode>type=&quot;file&quot;</DocsCode> gets the same frame,
              with the browser’s button restyled as plain text.
            </>
          }
        >
          <InputFile />
        </DocsExample>
        <DocsExample
          file="input/types"
          title="Input types"
          description="Password, number, search, date and time share one height and frame. In dark mode, the browser’s pickers and spinners switch to dark too."
        >
          <InputTypes />
        </DocsExample>
        <DocsExample
          file="input/controlled"
          title="Controlled"
          description={
            <>
              <DocsCode>onValueChange</DocsCode> hands you the string directly,
              so there’s no <DocsCode>event.target.value</DocsCode> to unwrap.{" "}
              <DocsCode>onChange</DocsCode> still works too.
            </>
          }
        >
          <InputControlled />
        </DocsExample>
        <DocsExample
          file="input/with-button"
          title="With a button"
          description={
            <>
              Side by side with a gap, or joined into one control inside a{" "}
              <DocsCode>{"<ButtonGroup />"}</DocsCode>, where the input takes
              the remaining width.
            </>
          }
        >
          <InputWithButton />
        </DocsExample>
        <DocsExample
          file="input/grid"
          title="Grid"
          description={
            <>
              Inputs fill their container, so place them in a grid. Give grid
              cells <DocsCode>min-w-0</DocsCode> so long values can’t stretch a
              column.
            </>
          }
        >
          <InputGrid />
        </DocsExample>
        <DocsExample
          file="input/long-content"
          title="Long content"
          description="Long values scroll inside the field and long placeholders are cut off, without widening the layout."
        >
          <InputLongContent />
        </DocsExample>
        <DocsExample
          file="input/rtl"
          title="Right to left"
          description={
            <>
              Text, caret and padding follow the direction. Use{" "}
              <DocsCode>dir=&quot;auto&quot;</DocsCode> on fields that hold
              left-to-right values, like an email address in an Arabic form.
            </>
          }
        >
          <InputRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            Every input needs a name. Use a <DocsCode>{"<label>"}</DocsCode>{" "}
            with <DocsCode>htmlFor</DocsCode>, or{" "}
            <DocsCode>aria-label</DocsCode> when there’s no visible label. A
            placeholder is not a label.
          </li>
          <li>
            Connect helper and error text with{" "}
            <DocsCode>aria-describedby</DocsCode>, and set{" "}
            <DocsCode>aria-invalid</DocsCode> only once there is an error to
            show.
          </li>
          <li>
            On touch screens the text is at least 16px, so iOS Safari doesn’t
            zoom the page when the input is focused.
          </li>
          <li>
            Inside a Base UI <DocsCode>Field</DocsCode>, the label, description,
            error and validity are wired up for you.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Built on the Base UI input. It accepts every native input attribute.
        </DocsParagraph>
        <DocsSection title="Input" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "size",
                type: '"sm" | "default" | "lg"',
                default: '"default"',
                description: "Height and padding, matched to the buttons.",
              },
              {
                name: "htmlSize",
                type: "number",
                description:
                  "The native size attribute, renamed because size is the variant.",
              },
              { name: "value", type: "string | number | string[]" },
              { name: "defaultValue", type: "string | number | string[]" },
              {
                name: "onValueChange",
                type: "(value: string, details) => void",
                description: "Called with the new value on every change.",
              },
              { name: "type", type: "string", default: '"text"' },
              { name: "disabled", type: "boolean", default: "false" },
              { name: "readOnly", type: "boolean", default: "false" },
              {
                name: "aria-invalid",
                type: "boolean",
                description: "Shows the invalid edge and focus ring.",
              },
              {
                name: "className",
                type: "string | (state) => string",
              },
              {
                name: "shake",
                type: "boolean",
                default: "true",
                description:
                  "Shake once when a form submit finds this input invalid. Works with native validation, Base UI Field and libraries that set aria-invalid. Skipped under reduced motion.",
              },
              { name: "render", type: renderType, default: "<input>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="input"',
                description: "Target the input in CSS.",
              },
              { name: "data-size", description: "The current size." },
              {
                name: "data-shake",
                description:
                  "Present while the input shakes after a failed submit.",
              },
              {
                name: "data-disabled",
                description: "Present when the input is disabled.",
              },
              {
                name: "data-invalid",
                description:
                  "Present when the surrounding Field is invalid. Styled like aria-invalid.",
              },
              {
                name: "data-valid",
                description: "Present when the surrounding Field is valid.",
              },
              {
                name: "data-touched",
                description:
                  "Present after the input lost focus once, inside a Field.",
              },
              {
                name: "data-dirty",
                description: "Present once the value changed, inside a Field.",
              },
              {
                name: "data-filled",
                description:
                  "Present when the input has a value, inside a Field.",
              },
              {
                name: "data-focused",
                description: "Present while focused, inside a Field.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="inputVariants" level={3}>
          <DocsParagraph>
            The class names behind the input, for styling another element to
            match, such as a native <DocsCode>{"<select>"}</DocsCode> or{" "}
            <DocsCode>{"<textarea>"}</DocsCode>. Call it with{" "}
            <DocsCode>{"{ size }"}</DocsCode>.
          </DocsParagraph>
        </DocsSection>
        <DocsSection title="InputCount" level={3}>
          <DocsParagraph>
            The character count behind{" "}
            <DocsCode>{"<InputGroupCount />"}</DocsCode> and{" "}
            <DocsCode>{"<FieldCounter />"}</DocsCode>. Use those parts, which
            read the field for you. Reach for this one only when you track the
            length yourself.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              { name: "length", type: "number", description: "Required." },
              { name: "maxLength", type: "number | null" },
              {
                name: "threshold",
                type: "number",
                default: "10% of maxLength, at most 20",
              },
              {
                name: "announcement",
                type: "(remaining: number) => string",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="input-count"',
                description: "Target the count in CSS.",
              },
              {
                name: 'data-state="near" | "limit"',
                description: "Present within the threshold, and at the limit.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
