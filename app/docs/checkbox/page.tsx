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
import { CheckboxCards } from "@/components/examples/checkbox/cards"
import { CheckboxControlled } from "@/components/examples/checkbox/controlled"
import { CheckboxDemo } from "@/components/examples/checkbox/demo"
import { CheckboxForm } from "@/components/examples/checkbox/form"
import { CheckboxLongContent } from "@/components/examples/checkbox/long-content"
import { CheckboxNestedGroups } from "@/components/examples/checkbox/nested-groups"
import { CheckboxRtl } from "@/components/examples/checkbox/rtl"
import { CheckboxSelectAll } from "@/components/examples/checkbox/select-all"
import { CheckboxSiblingLabel } from "@/components/examples/checkbox/sibling-label"
import { CheckboxStates } from "@/components/examples/checkbox/states"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("checkbox")

const importCode = `import { Checkbox, CheckboxGroup } from "@/components/ui/checkbox"`

const usageCode = `<label className="flex items-center gap-3">
  <Checkbox defaultChecked />
  Remember this device
</label>`

const renderType = "ReactElement | (props, state) => ReactElement"

const compositionCode = `CheckboxGroup
└── Checkbox`

export default function Page() {
  return (
    <DocsComponentPage slug="checkbox">
      <DocsExample file="checkbox/demo">
        <CheckboxDemo />
      </DocsExample>

      <DocsInstall
        dependencies={["@base-ui/react", "@tabler/icons-react", "cn"]}
        files={["components/ui/checkbox.tsx"]}
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
          file="checkbox/states"
          title="States"
          description={
            <>
              <DocsCode>disabled</DocsCode>, <DocsCode>readOnly</DocsCode>,{" "}
              <DocsCode>indeterminate</DocsCode> and{" "}
              <DocsCode>aria-invalid</DocsCode>. A read-only box keeps its value
              and stays focusable, but ignores clicks and keys.
            </>
          }
        >
          <CheckboxStates />
        </DocsExample>
        <DocsExample
          file="checkbox/select-all"
          title="Select all"
          description={
            <>
              Inside a <DocsCode>{"<CheckboxGroup />"}</DocsCode>, a checkbox
              with <DocsCode>parent</DocsCode> ticks every value in{" "}
              <DocsCode>allValues</DocsCode>. It turns indeterminate when only
              some are ticked.
            </>
          }
        >
          <CheckboxSelectAll />
        </DocsExample>
        <DocsExample
          file="checkbox/nested-groups"
          title="Nested groups"
          description="Groups nest. Each parent reflects the state of the group directly below it, and the top parent covers everything."
        >
          <CheckboxNestedGroups />
        </DocsExample>
        <DocsExample
          file="checkbox/controlled"
          title="Controlled"
          description={
            <>
              Pass <DocsCode>checked</DocsCode> and{" "}
              <DocsCode>onCheckedChange</DocsCode> to keep the state in your own
              code.
            </>
          }
        >
          <CheckboxControlled />
        </DocsExample>
        <DocsExample
          file="checkbox/form"
          title="Form"
          description={
            <>
              A hidden input submits <DocsCode>name</DocsCode> and{" "}
              <DocsCode>value</DocsCode> like a native checkbox, and{" "}
              <DocsCode>required</DocsCode> blocks submit until it is ticked.
            </>
          }
        >
          <CheckboxForm />
        </DocsExample>
        <DocsExample
          file="checkbox/sibling-label"
          title="Sibling label"
          description={
            <>
              When the label can’t wrap the box, render the checkbox as a{" "}
              <DocsCode>{"<button>"}</DocsCode> with{" "}
              <DocsCode>nativeButton</DocsCode> and point the label at it with{" "}
              <DocsCode>htmlFor</DocsCode>.
            </>
          }
        >
          <CheckboxSiblingLabel />
        </DocsExample>
        <DocsExample
          file="checkbox/cards"
          title="Cards"
          description={
            <>
              Wrap a whole card in the label so the card is the hit area, and
              style it with <DocsCode>has-data-checked</DocsCode>.
            </>
          }
        >
          <CheckboxCards />
        </DocsExample>
        <DocsExample
          file="checkbox/long-content"
          title="Long content"
          description="The box stays on the first line while a long label and unbroken text wrap beside it."
        >
          <CheckboxLongContent />
        </DocsExample>
        <DocsExample
          file="checkbox/rtl"
          title="Right to left"
          description="The box sits on the inline start side and the label follows the reading direction."
        >
          <CheckboxRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            { keys: ["Space"], description: "Ticks or unticks the checkbox." },
            {
              keys: ["Enter"],
              description:
                "Submits the form the checkbox belongs to, like a native checkbox. It never toggles the box.",
            },
            { keys: ["Tab"], description: "Moves focus to the next checkbox." },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            Wrap the checkbox and its text in a <DocsCode>{"<label>"}</DocsCode>
            . The label names the checkbox, and hovering or pressing it gives
            the box the same feedback as hovering the box itself.
          </li>
          <li>
            Give every <DocsCode>{"<CheckboxGroup />"}</DocsCode> an{" "}
            <DocsCode>aria-label</DocsCode> or{" "}
            <DocsCode>aria-labelledby</DocsCode> so screen readers announce what
            the group is for.
          </li>
          <li>
            The hit area extends past the 16px box, and grows on touch screens.
          </li>
          <li>
            The check draws in when ticked. With reduced motion it appears
            without the stroke animation.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Built on the Base UI checkbox and checkbox group. Both accept the
          props of the primitive they wrap.
        </DocsParagraph>
        <DocsSection title="Checkbox" level={3}>
          <DocsPropsTable
            props={[
              { name: "checked", type: "boolean" },
              { name: "defaultChecked", type: "boolean", default: "false" },
              {
                name: "onCheckedChange",
                type: "(checked: boolean, details) => void",
              },
              {
                name: "indeterminate",
                type: "boolean",
                default: "false",
                description: "Shows a dash: neither ticked nor unticked.",
              },
              { name: "disabled", type: "boolean", default: "false" },
              {
                name: "readOnly",
                type: "boolean",
                default: "false",
                description: "Focusable, but the value can’t change.",
              },
              { name: "required", type: "boolean", default: "false" },
              {
                name: "name",
                type: "string",
                description: "Submitted with the form when ticked.",
              },
              {
                name: "value",
                type: "string",
                description:
                  "Identifies the box inside a group and is what the form submits. Falls back to name, then “on”.",
              },
              {
                name: "uncheckedValue",
                type: "string",
                description: "Submitted when unticked. Nothing by default.",
              },
              {
                name: "parent",
                type: "boolean",
                default: "false",
                description:
                  "Controls every value in the group’s allValues. Only inside a CheckboxGroup.",
              },
              { name: "inputRef", type: "Ref<HTMLInputElement>" },
              {
                name: "nativeButton",
                type: "boolean",
                default: "false",
                description: "Set to true when render is a <button>.",
              },
              { name: "render", type: renderType, default: "<span>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="checkbox"',
                description: "Target the box in CSS.",
              },
              { name: "data-checked", description: "Present when ticked." },
              { name: "data-unchecked", description: "Present when unticked." },
              {
                name: "data-indeterminate",
                description: "Present when indeterminate.",
              },
              { name: "data-disabled", description: "Present when disabled." },
              { name: "data-readonly", description: "Present when read-only." },
              { name: "data-required", description: "Present when required." },
              {
                name: "data-invalid",
                description: "Present when invalid inside a Base UI Field.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="CheckboxGroup" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "value",
                type: "string[]",
                description: "Values of the ticked checkboxes.",
              },
              { name: "defaultValue", type: "string[]" },
              {
                name: "onValueChange",
                type: "(value: string[], details) => void",
              },
              {
                name: "allValues",
                type: "string[]",
                description:
                  "Every value in the group. Required for a parent checkbox.",
              },
              { name: "disabled", type: "boolean", default: "false" },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="checkbox-group"',
                description: "Target the group in CSS.",
              },
              {
                name: "data-disabled",
                description: "Present when the group is disabled.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
