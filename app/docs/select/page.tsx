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
import { SelectDemo } from "@/components/examples/select/demo"
import { SelectDropdown } from "@/components/examples/select/dropdown"
import { SelectField } from "@/components/examples/select/field"
import { SelectGroups } from "@/components/examples/select/groups"
import { SelectIcons } from "@/components/examples/select/icons"
import { SelectMultiple } from "@/components/examples/select/multiple"
import { SelectRtl } from "@/components/examples/select/rtl"
import { SelectSizes } from "@/components/examples/select/sizes"
import { SelectStates } from "@/components/examples/select/states"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("select")

const importCode = `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"`

const usageCode = `<Select items={fonts} defaultValue="geist">
  <SelectTrigger aria-label="Font">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    {fonts.map((font) => (
      <SelectItem key={font.value} value={font.value}>
        {font.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>`

const renderType = "ReactElement | (props, state) => ReactElement"

const compositionCode = `Select
├── SelectTrigger
│   └── SelectValue
└── SelectContent
    ├── SelectGroup
    │   ├── SelectLabel
    │   └── SelectItem
    └── SelectSeparator`

export default function Page() {
  return (
    <DocsComponentPage slug="select">
      <DocsExample file="select/demo">
        <SelectDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@base-ui/react",
          "@tabler/icons-react",
          "class-variance-authority",
          "cn",
        ]}
        files={["components/ui/select.tsx", "lib/motion.ts"]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          The list opens right over the trigger with the current option lined up
          on top of the value, so your eye never loses its place. Pass{" "}
          <DocsCode>items</DocsCode> so <DocsCode>SelectValue</DocsCode> shows
          labels instead of raw values. For long lists that need searching, use
          Combobox.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="select/sizes"
          title="Sizes"
          description={
            <>
              <DocsCode>size</DocsCode> on <DocsCode>SelectTrigger</DocsCode>{" "}
              matches Input and Button heights.
            </>
          }
        >
          <SelectSizes />
        </DocsExample>
        <DocsExample
          file="select/groups"
          title="Groups and long lists"
          description={
            <>
              Group options with <DocsCode>SelectGroup</DocsCode> and{" "}
              <DocsCode>SelectLabel</DocsCode>. Long lists fit the screen and
              show scroll arrows that scroll when you hover them.
            </>
          }
        >
          <SelectGroups />
        </DocsExample>
        <DocsExample
          file="select/icons"
          title="With icons"
          description={
            <>
              Put icons in items, and pass a function to{" "}
              <DocsCode>SelectValue</DocsCode> to show the same icon in the
              trigger.
            </>
          }
        >
          <SelectIcons />
        </DocsExample>
        <DocsExample
          file="select/multiple"
          title="Multiple"
          description={
            <>
              With <DocsCode>multiple</DocsCode>, the list stays open while you
              pick, and the value can summarise long selections.
            </>
          }
        >
          <SelectMultiple />
        </DocsExample>
        <DocsExample
          file="select/field"
          title="In a form"
          description={
            <>
              Inside <DocsCode>Field</DocsCode>, the trigger gets its label,
              description and required validation.
            </>
          }
        >
          <SelectField />
        </DocsExample>
        <DocsExample
          file="select/states"
          title="Disabled and invalid"
          description="Disable the whole select or single options, and mark it invalid with aria-invalid."
        >
          <SelectStates />
        </DocsExample>
        <DocsExample
          file="select/dropdown"
          title="Below the trigger"
          description={
            <>
              <DocsCode>{"alignItemWithTrigger={false}"}</DocsCode> opens the
              list under the trigger like a menu. Touch input does this
              automatically.
            </>
          }
        >
          <SelectDropdown />
        </DocsExample>
        <DocsExample
          file="select/rtl"
          title="Right to left"
          description="The trigger, list and check follow the reading direction."
        >
          <SelectRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Space", "Enter", "↓", "↑"],
              description: "Opens the list from the trigger.",
            },
            {
              keys: ["↓", "↑"],
              description: "Moves between options.",
            },
            {
              keys: ["Home", "End"],
              description: "Moves to the first or last option.",
            },
            {
              keys: ["A–Z"],
              description:
                "Jumps to the next option that starts with the typed text.",
            },
            {
              keys: ["Enter", "Space"],
              description: "Picks the highlighted option.",
            },
            {
              keys: ["Esc"],
              description: "Closes the list and returns focus to the trigger.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            Label the trigger with <DocsCode>FieldLabel</DocsCode> or{" "}
            <DocsCode>aria-label</DocsCode>.
          </li>
          <li>
            On touch, the list opens below the trigger instead of over it, so
            your finger doesn&apos;t land on an option.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsSection title="Select" level={3}>
          <DocsPropsTable
            props={[
              { name: "value", type: "Value | Value[] | null" },
              { name: "defaultValue", type: "Value | Value[] | null" },
              { name: "onValueChange", type: "(value, details) => void" },
              {
                name: "items",
                type: "Record<string, ReactNode> | { value, label }[]",
                description: "Lets SelectValue show labels.",
              },
              { name: "multiple", type: "boolean", default: "false" },
              { name: "name", type: "string" },
              { name: "required", type: "boolean", default: "false" },
              { name: "disabled", type: "boolean", default: "false" },
              { name: "readOnly", type: "boolean", default: "false" },
              { name: "open", type: "boolean" },
              { name: "onOpenChange", type: "(open, details) => void" },
            ]}
          />
        </DocsSection>
        <DocsSection title="SelectTrigger" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "size",
                type: '"sm" | "default" | "lg"',
                default: '"default"',
              },
              { name: "render", type: renderType, default: "<button>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="select-trigger"',
                description: "The trigger, with data-size.",
              },
              {
                name: "data-popup-open",
                description: "Present while the list is open.",
              },
              {
                name: "data-placeholder",
                description: "Present while nothing is picked.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="SelectValue" level={3}>
          <DocsPropsTable
            props={[
              { name: "placeholder", type: "ReactNode" },
              {
                name: "children",
                type: "ReactNode | (value) => ReactNode",
                description: "Format the shown value.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="SelectContent" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "alignItemWithTrigger",
                type: "boolean",
                default: "true",
                description:
                  "Open over the trigger with the current option lined up.",
              },
              {
                name: "side",
                type: '"top" | "bottom" | …',
                default: '"bottom"',
                description: "When not aligned with the trigger.",
              },
              {
                name: "align",
                type: '"start" | "center" | "end"',
                default: '"start"',
              },
              { name: "sideOffset", type: "number", default: "6" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="select-content"',
                description: "The popup.",
              },
              {
                name: 'data-side="none"',
                description: "Present while aligned over the trigger.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="SelectItem" level={3}>
          <DocsPropsTable
            props={[
              { name: "value", type: "Value" },
              { name: "disabled", type: "boolean", default: "false" },
              {
                name: "label",
                type: "string",
                description: "Text for typeahead.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              { name: "data-selected", description: "The picked option." },
              { name: "data-highlighted", description: "The focused option." },
              { name: "data-disabled", description: "The option is disabled." },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
