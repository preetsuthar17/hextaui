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
import { LabelCheckbox } from "@/components/examples/label/checkbox"
import { LabelDemo } from "@/components/examples/label/demo"
import { LabelIcon } from "@/components/examples/label/icon"
import { LabelIndicator } from "@/components/examples/label/indicator"
import { LabelLongContent } from "@/components/examples/label/long-content"
import { LabelRtl } from "@/components/examples/label/rtl"
import { LabelStates } from "@/components/examples/label/states"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("label")

const importCode = `import { Label } from "@/components/ui/label"`

const usageCode = `<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />`

const renderType = "ReactElement | (props, state) => ReactElement"

export default function Page() {
  return (
    <DocsComponentPage slug="label">
      <DocsExample file="label/demo">
        <LabelDemo />
      </DocsExample>

      <DocsInstall
        dependencies={["@base-ui/react", "cn"]}
        files={["components/ui/label.tsx"]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          Point <DocsCode>htmlFor</DocsCode> at a control&apos;s{" "}
          <DocsCode>id</DocsCode>, or wrap the control. Either way the label
          finds it and follows its state. Inside a{" "}
          <DocsCode>{"<Field />"}</DocsCode>, use{" "}
          <DocsCode>{"<FieldLabel />"}</DocsCode>, which wires up the id for
          you.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="label/states"
          title="Follows its control"
          description={
            <>
              The label dims and shows a not-allowed cursor while its control is
              disabled, and exposes <DocsCode>data-required</DocsCode>,{" "}
              <DocsCode>data-invalid</DocsCode> and{" "}
              <DocsCode>data-readonly</DocsCode> for your own styles. It keeps
              up when the control changes.
            </>
          }
        >
          <LabelStates />
        </DocsExample>
        <DocsExample
          file="label/indicator"
          title="Required and optional"
          description={
            <>
              <DocsCode>{'indicator="optional"'}</DocsCode> tags controls
              without <DocsCode>required</DocsCode>, and{" "}
              <DocsCode>{'indicator="required"'}</DocsCode> adds an asterisk to
              controls with it. The mark is hidden from screen readers, which
              already announce required fields.
            </>
          }
        >
          <LabelIndicator />
        </DocsExample>
        <DocsExample
          file="label/checkbox"
          title="Checkbox"
          description="Wrap a checkbox so the whole label toggles it, or place the label beside it with htmlFor. A disabled checkbox dims its label either way."
        >
          <LabelCheckbox />
        </DocsExample>
        <DocsExample
          file="label/icon"
          title="Icon"
          description="Icons inside a label are sized and muted to sit next to the text."
        >
          <LabelIcon />
        </DocsExample>
        <DocsExample
          file="label/long-content"
          title="Long content"
          description="Long labels wrap, and unbroken strings break instead of widening the layout."
        >
          <LabelLongContent />
        </DocsExample>
        <DocsExample
          file="label/rtl"
          title="Right to left"
          description="Gaps and the indicator follow the reading direction."
        >
          <LabelRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            Clicking the label focuses or toggles its control, so it&apos;s a
            bigger target than the control alone.
          </li>
          <li>
            Double-clicking the label text doesn&apos;t select it. Double-clicks
            on a control inside the label work as usual.
          </li>
          <li>
            Every control needs a name. When there&apos;s no visible label, use{" "}
            <DocsCode>aria-label</DocsCode> on the control instead.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Renders a <DocsCode>{"<label>"}</DocsCode> and accepts its attributes.
        </DocsParagraph>
        <DocsSection title="Label" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "htmlFor",
                type: "string",
                description:
                  "The id of the control. Leave it out when the label wraps the control.",
              },
              {
                name: "indicator",
                type: '"required" | "optional"',
                description:
                  "Mark the label from the control's required state. Off by default.",
              },
              {
                name: "optionalText",
                type: "ReactNode",
                default: '"Optional"',
              },
              { name: "render", type: renderType, default: "<label>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="label"',
                description: "Target labels in CSS.",
              },
              {
                name: "data-disabled",
                description: "Present while the control is disabled.",
              },
              {
                name: "data-required",
                description: "Present while the control is required.",
              },
              {
                name: "data-invalid",
                description:
                  "Present while the control is invalid, after the user has interacted or when aria-invalid is set.",
              },
              {
                name: "data-readonly",
                description: "Present while the control is read-only.",
              },
              {
                name: 'data-slot="label-indicator"',
                description: "The required or optional mark.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
