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
import { FieldCheckbox } from "@/components/examples/field/checkbox"
import { FieldChoiceCard } from "@/components/examples/field/choice-card"
import { FieldCounterDemo } from "@/components/examples/field/counter"
import { FieldCustomValidation } from "@/components/examples/field/custom-validation"
import { FieldDemo } from "@/components/examples/field/demo"
import { FieldDisabled } from "@/components/examples/field/disabled"
import { FieldErrors } from "@/components/examples/field/errors"
import { FieldFieldset } from "@/components/examples/field/fieldset"
import { FieldIndicatorDemo } from "@/components/examples/field/indicator"
import { FieldInput } from "@/components/examples/field/input"
import { FieldLongContent } from "@/components/examples/field/long-content"
import { FieldResponsive } from "@/components/examples/field/responsive"
import { FieldRtl } from "@/components/examples/field/rtl"
import { FieldStatusDemo } from "@/components/examples/field/status"
import { FieldValidation } from "@/components/examples/field/validation"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("field")

const importCode = `import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"`

const usageCode = `<FieldGroup indicator="optional">
  <Field>
    <FieldLabel>Email</FieldLabel>
    <Input type="email" required />
    <FieldDescription>We’ll never share it.</FieldDescription>
    <FieldError />
  </Field>
</FieldGroup>`

const renderType = "ReactElement | (props, state) => ReactElement"

const stateAttributes = [
  { name: "data-disabled", description: "Present when the field is disabled." },
  { name: "data-valid", description: "Present when the field is valid." },
  { name: "data-invalid", description: "Present when the field is invalid." },
  {
    name: "data-dirty",
    description: "Present once the value has changed from its initial value.",
  },
  {
    name: "data-touched",
    description: "Present once the control has been focused and left.",
  },
  { name: "data-filled", description: "Present when the control has a value." },
  {
    name: "data-focused",
    description: "Present while the control has focus.",
  },
]

const fieldCompositionCode = `Field
├── FieldLabel
├── Input / Textarea / Select / …
├── FieldDescription
├── FieldError
├── FieldCounter
└── FieldStatus`

const horizontalFieldCompositionCode = `Field
├── Switch / Checkbox
└── FieldContent
    ├── FieldLabel
    └── FieldDescription`

const choiceCardCompositionCode = `FieldLabel
└── Field
    ├── Checkbox / RadioGroupItem
    └── FieldContent
        ├── FieldTitle
        └── FieldDescription`

const fieldGroupCompositionCode = `FieldGroup
├── Field
├── FieldSeparator
└── Field`

const fieldSetCompositionCode = `FieldSet
├── FieldLegend
├── FieldDescription
└── FieldGroup
    └── Field

FieldSet
├── FieldLegend
└── FieldItem
    ├── RadioGroupItem / Checkbox
    └── FieldLabel`

export default function Page() {
  return (
    <DocsComponentPage slug="field">
      <DocsExample file="field/demo">
        <FieldDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@base-ui/react",
          "@tabler/icons-react",
          "class-variance-authority",
          "cn",
        ]}
        files={[
          "components/ui/field.tsx",
          "components/ui/input.tsx",
          "components/ui/number-flow.tsx",
          "components/ui/separator.tsx",
          "lib/motion.ts",
        ]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          Put any HextaUI control inside a <DocsCode>{"<Field />"}</DocsCode>{" "}
          and it’s labelled, described and validated automatically. There’s no
          need to wire up <DocsCode>id</DocsCode>, <DocsCode>htmlFor</DocsCode>{" "}
          or <DocsCode>aria-describedby</DocsCode> by hand.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsSection title="Single field" level={3}>
          <DocsParagraph>
            One control with its label, help text and validation.
          </DocsParagraph>
          <DocsCodeBlock code={fieldCompositionCode} lang="text" />
        </DocsSection>
        <DocsSection title="Horizontal field" level={3}>
          <DocsParagraph>
            A switch or checkbox with its text beside it.
          </DocsParagraph>
          <DocsCodeBlock code={horizontalFieldCompositionCode} lang="text" />
        </DocsSection>
        <DocsSection title="Choice card" level={3}>
          <DocsParagraph>
            A label that wraps a whole field, so the card is the click target.
          </DocsParagraph>
          <DocsCodeBlock code={choiceCardCompositionCode} lang="text" />
        </DocsSection>
        <DocsSection title="Grouped fields" level={3}>
          <DocsParagraph>Related fields, spaced evenly.</DocsParagraph>
          <DocsCodeBlock code={fieldGroupCompositionCode} lang="text" />
        </DocsSection>
        <DocsSection title="Fieldsets" level={3}>
          <DocsParagraph>
            A titled group of fields, or a radio or checkbox group with an item
            per option.
          </DocsParagraph>
          <DocsCodeBlock code={fieldSetCompositionCode} lang="text" />
        </DocsSection>
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="field/input"
          title="Input"
          description={
            <>
              A label, a control and a description. Clicking the label focuses
              the input, and screen readers read the description after the
              label.
            </>
          }
        >
          <FieldInput />
        </DocsExample>
        <DocsExample
          file="field/validation"
          title="Validation"
          description={
            <>
              Native constraints like <DocsCode>required</DocsCode> and{" "}
              <DocsCode>minLength</DocsCode> are checked on blur. Give each{" "}
              <DocsCode>{"<FieldError />"}</DocsCode> a{" "}
              <DocsCode>match</DocsCode> to word the message per problem. An
              empty required field is only flagged after it has been edited, so
              tabbing past it doesn’t shout.
            </>
          }
        >
          <FieldValidation />
        </DocsExample>
        <DocsExample
          file="field/custom-validation"
          title="Custom validation"
          description={
            <>
              Pass <DocsCode>validate</DocsCode> to check anything, including
              async lookups. Return a message to fail or nothing to pass. With{" "}
              <DocsCode>{'validationMode="onChange"'}</DocsCode> and{" "}
              <DocsCode>validationDebounceTime</DocsCode>, it runs while typing
              without firing on every key. Try “ada”.
            </>
          }
        >
          <FieldCustomValidation />
        </DocsExample>
        <DocsExample
          file="field/indicator"
          title="Required and optional"
          description={
            <>
              Set <DocsCode>indicator</DocsCode> on a{" "}
              <DocsCode>FieldGroup</DocsCode>, <DocsCode>FieldSet</DocsCode> or{" "}
              <DocsCode>Field</DocsCode> and every label inside marks itself
              from its control&apos;s <DocsCode>required</DocsCode> attribute.{" "}
              <DocsCode>{'"optional"'}</DocsCode> tags the fields people can
              skip, which reads calmer when most fields are required.{" "}
              <DocsCode>{'"required"'}</DocsCode> adds an asterisk. The mark is
              hidden from screen readers because the control already announces
              it.
            </>
          }
        >
          <FieldIndicatorDemo />
        </DocsExample>
        <DocsExample
          file="field/status"
          title="Status"
          description={
            <>
              <DocsCode>{"<FieldStatus />"}</DocsCode> draws a check once an
              edited field passes validation, and shows an alert icon while it
              fails. It follows the field&apos;s{" "}
              <DocsCode>validationMode</DocsCode>, so it never judges a field
              before validation has run.
            </>
          }
        >
          <FieldStatusDemo />
        </DocsExample>
        <DocsExample
          file="field/counter"
          title="Character count"
          description={
            <>
              <DocsCode>{"<FieldCounter />"}</DocsCode> finds the text control
              in its field and counts against its <DocsCode>maxLength</DocsCode>
              . It only listens, so typing is never slowed or changed.
            </>
          }
        >
          <FieldCounterDemo />
        </DocsExample>
        <DocsExample
          file="field/errors"
          title="Errors from a form library or server"
          description={
            <>
              Pass <DocsCode>invalid</DocsCode> to the field and an{" "}
              <DocsCode>errors</DocsCode> array to{" "}
              <DocsCode>{"<FieldError />"}</DocsCode>. It takes the{" "}
              <DocsCode>{"{ message }"}</DocsCode> shape React Hook Form and
              most schema libraries return. Duplicates are dropped, and several
              messages become a list. When the messages change, the new ones
              fade in and the height eases to fit, so nothing below jumps.
              Submit empty, then fix one rule at a time.
            </>
          }
        >
          <FieldErrors />
        </DocsExample>
        <DocsExample
          file="field/checkbox"
          title="Checkboxes"
          description={
            <>
              Use <DocsCode>{'orientation="horizontal"'}</DocsCode> to put the
              checkbox beside its label. Inside a{" "}
              <DocsCode>{"<FieldSet />"}</DocsCode>, the legend names the whole
              group.
            </>
          }
        >
          <FieldCheckbox />
        </DocsExample>
        <DocsExample
          file="field/choice-card"
          title="Choice cards"
          description={
            <>
              Wrap a whole field in <DocsCode>{"<FieldLabel />"}</DocsCode> to
              make the card the click target. Use{" "}
              <DocsCode>{"<FieldTitle />"}</DocsCode> inside, since labels can’t
              nest. The card tints when checked and shows the focus ring when
              its checkbox is focused.
            </>
          }
        >
          <FieldChoiceCard />
        </DocsExample>
        <DocsExample
          file="field/fieldset"
          title="Fieldset"
          description={
            <>
              <DocsCode>{"<FieldSet />"}</DocsCode> groups related fields under
              a <DocsCode>{"<FieldLegend />"}</DocsCode>, which becomes the
              group’s accessible name. Lay fields out side by side with a plain
              grid.
            </>
          }
        >
          <FieldFieldset />
        </DocsExample>
        <DocsExample
          file="field/responsive"
          title="Responsive"
          description={
            <>
              <DocsCode>{'orientation="responsive"'}</DocsCode> stacks the label
              and control in narrow spaces and puts them side by side once the
              surrounding <DocsCode>{"<FieldGroup />"}</DocsCode> is wide
              enough. It responds to the group’s width, not the window’s.
            </>
          }
        >
          <FieldResponsive />
        </DocsExample>
        <DocsExample
          file="field/disabled"
          title="Disabled"
          description={
            <>
              Disabling a <DocsCode>{"<FieldSet />"}</DocsCode> disables every
              field and control inside it. Pass <DocsCode>disabled</DocsCode> to
              a single <DocsCode>{"<Field />"}</DocsCode> to disable just that
              one.
            </>
          }
        >
          <FieldDisabled />
        </DocsExample>
        <DocsExample
          file="field/long-content"
          title="Long content"
          description="Labels, descriptions and errors wrap inside narrow forms, including unbroken strings, and never push the layout wider."
        >
          <FieldLongContent />
        </DocsExample>
        <DocsExample
          file="field/rtl"
          title="Right to left"
          description="Text, checkbox placement and error lists follow the reading direction."
        >
          <FieldRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            The label, description and visible errors are linked to the control
            for you, so screen readers announce all three when it’s focused.
          </li>
          <li>
            Invalid controls get <DocsCode>aria-invalid</DocsCode>, which also
            draws their error ring.
          </li>
          <li>
            Errors are not live regions. They’re read when the control is
            focused, so validating on change doesn’t interrupt typing. On
            submit, move focus to the first invalid field.
          </li>
          <li>
            Errors grow and fade in place instead of pushing content down. With
            reduced motion on, they appear without animating.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Built on the Base UI field and fieldset. Every part accepts the props
          of the element or primitive it renders.
        </DocsParagraph>
        <DocsSection title="Field" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "orientation",
                type: '"vertical" | "horizontal" | "responsive"',
                default: '"vertical"',
              },
              {
                name: "indicator",
                type: '"required" | "optional" | null',
                description:
                  "Mark the label from the control's required attribute. Inherited from FieldGroup or FieldSet.",
              },
              {
                name: "name",
                type: "string",
                description: "Identifies the field when the form is submitted.",
              },
              {
                name: "validate",
                type: "(value, formValues) => string | string[] | null | Promise<…>",
                description:
                  "Return one or more messages to fail, or nothing to pass. Async is supported.",
              },
              {
                name: "validationMode",
                type: '"onSubmit" | "onBlur" | "onChange"',
                default: '"onSubmit"',
              },
              {
                name: "validationDebounceTime",
                type: "number",
                default: "0",
                description:
                  "Milliseconds to wait between onChange validations.",
              },
              {
                name: "invalid",
                type: "boolean",
                description: "Set it from a form library or server response.",
              },
              { name: "disabled", type: "boolean", default: "false" },
              { name: "dirty", type: "boolean" },
              { name: "touched", type: "boolean" },
              {
                name: "actionsRef",
                type: "RefObject<{ validate: () => void }>",
                description: "Validate the field imperatively.",
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="field"',
                description: "Target fields in CSS.",
              },
              {
                name: "data-orientation",
                description: "The current orientation.",
              },
              ...stateAttributes,
            ]}
          />
        </DocsSection>
        <DocsSection title="FieldLabel" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "nativeLabel",
                type: "boolean",
                default: "true",
                description:
                  "Set false when render swaps the label for a non-label element.",
              },
              {
                name: "optionalText",
                type: "ReactNode",
                default: '"Optional"',
                description: 'Text shown with indicator="optional".',
              },
              { name: "render", type: renderType, default: "<label>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="field-label"',
                description:
                  "Target labels in CSS. Outside a field it renders a plain label, which is how choice cards work.",
              },
              ...stateAttributes,
            ]}
          />
        </DocsSection>
        <DocsSection title="FieldStatus" level={3}>
          <DocsParagraph>
            An icon that reflects the field&apos;s validity. It&apos;s
            decorative, since the error message carries the meaning.
          </DocsParagraph>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="field-status"',
                description: "Target the status icon in CSS.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="FieldCounter" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "threshold",
                type: "number",
                default: "10% of maxLength, at most 20",
              },
              {
                name: "announcement",
                type: "(remaining: number) => string",
                description:
                  "Message for screen readers when the count crosses the threshold or hits the limit.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="field-counter"',
                description: "Target the counter in CSS.",
              },
              {
                name: 'data-state="near" | "limit"',
                description: "Present within the threshold, and at the limit.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="FieldDescription" level={3}>
          <DocsPropsTable
            props={[{ name: "render", type: renderType, default: "<p>" }]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="field-description"',
                description: "Target descriptions in CSS.",
              },
              ...stateAttributes,
            ]}
          />
        </DocsSection>
        <DocsSection title="FieldError" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "match",
                type: 'boolean | "valueMissing" | "typeMismatch" | "tooShort" | "tooLong" | "patternMismatch" | "rangeOverflow" | "rangeUnderflow" | "stepMismatch" | "badInput" | "customError" | "valid"',
                description:
                  "Show only for this validity problem. true always shows it.",
              },
              {
                name: "errors",
                type: "Array<{ message?: string } | undefined>",
                description:
                  "Errors from a form library or server. Shown when the list has a message.",
              },
              {
                name: "children",
                type: "ReactNode",
                description: "Defaults to the validation message.",
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="field-error"',
                description: "Target errors in CSS.",
              },
              {
                name: "data-starting-style",
                description: "Present while the error grows in.",
              },
              {
                name: "data-ending-style",
                description: "Present while the error collapses.",
              },
              ...stateAttributes,
            ]}
          />
        </DocsSection>
        <DocsSection title="FieldContent" level={3}>
          <DocsParagraph>
            Stacks a label, description and error beside a control in a
            horizontal field.
          </DocsParagraph>
          <DocsPropsTable
            props={[{ name: "render", type: renderType, default: "<div>" }]}
          />
        </DocsSection>
        <DocsSection title="FieldTitle" level={3}>
          <DocsParagraph>
            A label-styled title for content inside a{" "}
            <DocsCode>{"<FieldLabel />"}</DocsCode>, such as choice cards.
          </DocsParagraph>
          <DocsPropsTable
            props={[{ name: "render", type: renderType, default: "<div>" }]}
          />
        </DocsSection>
        <DocsSection title="FieldGroup" level={3}>
          <DocsParagraph>
            Spaces fields apart and is the container that responsive fields
            measure.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              {
                name: "indicator",
                type: '"required" | "optional" | null',
                description: "Applies to every field inside.",
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
        </DocsSection>
        <DocsSection title="FieldSet" id="field-set" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "indicator",
                type: '"required" | "optional" | null',
                description: "Applies to every field inside.",
              },
              {
                name: "disabled",
                type: "boolean",
                default: "false",
                description: "Disables every field inside.",
              },
              { name: "render", type: renderType, default: "<fieldset>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="field-set"',
                description: "Target fieldsets in CSS.",
              },
              {
                name: "data-disabled",
                description: "Present when the fieldset is disabled.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="FieldLegend" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "variant",
                type: '"legend" | "label"',
                default: '"legend"',
                description: "label matches the size of a field label.",
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="field-legend"',
                description: "Target legends in CSS.",
              },
              { name: "data-variant", description: "The current variant." },
            ]}
          />
        </DocsSection>
        <DocsSection title="FieldSeparator" level={3}>
          <DocsParagraph>
            A <DocsCode>{"<Separator />"}</DocsCode> spaced for forms, and
            accepts all of its props.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              {
                name: "children",
                type: "ReactNode",
                description: "Optional text shown in the middle of the line.",
              },
              {
                name: "align",
                type: '"start" | "center" | "end"',
                default: '"center"',
                description: "Where the text sits along the line.",
              },
              {
                name: "decorative",
                type: "boolean",
                default: "false",
                description:
                  "Hide a plain line from screen readers when it is only visual.",
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="field-separator"',
                description: "Target field separators in CSS.",
              },
              {
                name: "data-content",
                description: "Present when the separator has text.",
              },
              {
                name: 'data-slot="separator-label"',
                description: "The element that wraps the text.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="FieldItem" level={3}>
          <DocsParagraph>
            Wraps one checkbox or radio and its label inside a group, so each
            item can be disabled on its own.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              { name: "disabled", type: "boolean", default: "false" },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
        </DocsSection>
        <DocsSection title="FieldValidity" level={3}>
          <DocsParagraph>
            Renders anything from the field’s validity state, for example a
            strength meter or a character counter.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              {
                name: "children",
                type: "(state: { validity, errors, error, value }) => ReactNode",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
