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
import { RadioGroupCards } from "@/components/examples/radio-group/cards"
import { RadioGroupControlled } from "@/components/examples/radio-group/controlled"
import { RadioGroupDemo } from "@/components/examples/radio-group/demo"
import { RadioGroupForm } from "@/components/examples/radio-group/form"
import { RadioGroupHorizontal } from "@/components/examples/radio-group/horizontal"
import { RadioGroupRtl } from "@/components/examples/radio-group/rtl"
import { RadioGroupStates } from "@/components/examples/radio-group/states"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("radio-group")

const importCode = `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"`

const usageCode = `<RadioGroup aria-label="Notify me about" defaultValue="mentions">
  <label className="flex items-center gap-3">
    <RadioGroupItem value="all" />
    All new messages
  </label>
  <label className="flex items-center gap-3">
    <RadioGroupItem value="mentions" />
    Direct messages and mentions
  </label>
</RadioGroup>`

const renderType = "ReactElement | (props, state) => ReactElement"

const compositionCode = `RadioGroup
├── RadioGroupItem
└── RadioGroupCard
    ├── RadioGroupCardTitle
    └── RadioGroupCardDescription`

export default function Page() {
  return (
    <DocsComponentPage slug="radio-group">
      <DocsExample file="radio-group/demo">
        <RadioGroupDemo />
      </DocsExample>

      <DocsInstall
        dependencies={["@base-ui/react", "cn"]}
        files={["components/ui/radio-group.tsx", "lib/motion.ts"]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          When the choice changes, the old dot shrinks away as the new one
          springs in, so the eye follows the pick instead of two things blinking
          at once. Wrap each item in a <DocsCode>{"<label>"}</DocsCode> so the
          whole row is clickable.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="radio-group/cards"
          title="Cards"
          description={
            <>
              With <DocsCode>{'variant="card"'}</DocsCode>, use{" "}
              <DocsCode>RadioGroupCard</DocsCode> for options with more to say.
              The selection ring slides to the new card while its surface fades
              in.
            </>
          }
        >
          <RadioGroupCards />
        </DocsExample>
        <DocsExample
          file="radio-group/horizontal"
          title="Horizontal"
          description="Cards can sit in a row or any grid. The ring follows them wherever they are."
        >
          <RadioGroupHorizontal />
        </DocsExample>
        <DocsExample
          file="radio-group/form"
          title="Form"
          description={
            <>
              Inside <DocsCode>Field</DocsCode> and{" "}
              <DocsCode>FieldSet</DocsCode>, the group gets a legend, required
              validation and an error message.
            </>
          }
        >
          <RadioGroupForm />
        </DocsExample>
        <DocsExample
          file="radio-group/states"
          title="Disabled and read-only"
          description={
            <>
              Disable a single option, or make the whole group{" "}
              <DocsCode>readOnly</DocsCode> to show a value that can&apos;t
              change.
            </>
          }
        >
          <RadioGroupStates />
        </DocsExample>
        <DocsExample
          file="radio-group/controlled"
          title="Controlled"
          description={
            <>
              Pass <DocsCode>value</DocsCode> and{" "}
              <DocsCode>onValueChange</DocsCode>. Outside changes animate the
              same way as clicks.
            </>
          }
        >
          <RadioGroupControlled />
        </DocsExample>
        <DocsExample
          file="radio-group/rtl"
          title="Right to left"
          description="Radios and cards follow the reading direction."
        >
          <RadioGroupRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Tab"],
              description:
                "Moves focus into the group, onto the picked option or the first one.",
            },
            {
              keys: ["↑", "↓", "←", "→"],
              description:
                "Moves to the previous or next option and picks it, wrapping at the ends.",
            },
            {
              keys: ["Space"],
              description: "Picks the focused option.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            Name the group with <DocsCode>aria-label</DocsCode>,{" "}
            <DocsCode>aria-labelledby</DocsCode> or a{" "}
            <DocsCode>FieldLegend</DocsCode>.
          </li>
          <li>
            Each radio has a 36px hit area, and 44px on touch screens, while
            staying 16px on screen.
          </li>
          <li>The dot and card ring don&apos;t move with reduced motion.</li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsSection title="RadioGroup" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "variant",
                type: '"default" | "card"',
                default: '"default"',
                description: "card adds the sliding selection ring.",
              },
              { name: "value", type: "Value" },
              { name: "defaultValue", type: "Value" },
              {
                name: "onValueChange",
                type: "(value, details) => void",
              },
              { name: "name", type: "string" },
              { name: "required", type: "boolean", default: "false" },
              { name: "disabled", type: "boolean", default: "false" },
              { name: "readOnly", type: "boolean", default: "false" },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="radio-group"',
                description: "The group, with data-variant.",
              },
              {
                name: 'data-slot="radio-group-highlight"',
                description: "The ring that slides between cards.",
              },
              { name: "data-disabled", description: "The group is disabled." },
            ]}
          />
        </DocsSection>
        <DocsSection title="RadioGroupItem" level={3}>
          <DocsPropsTable
            props={[
              { name: "value", type: "Value" },
              { name: "disabled", type: "boolean", default: "false" },
              { name: "render", type: renderType, default: "<span>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="radio-group-item"',
                description: "The radio.",
              },
              {
                name: "data-checked / data-unchecked",
                description: "Whether it's the picked option.",
              },
              {
                name: "data-disabled / data-readonly",
                description: "Present when it can't be changed.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="RadioGroupCard" level={3}>
          <DocsPropsTable
            props={[
              { name: "value", type: "Value" },
              { name: "disabled", type: "boolean", default: "false" },
              {
                name: "radioClassName",
                type: "string",
                description: "Classes for the radio inside the card.",
              },
            ]}
          />
          <DocsParagraph>
            A <DocsCode>{"<label>"}</DocsCode> with the radio built in. Put{" "}
            <DocsCode>RadioGroupCardTitle</DocsCode> and{" "}
            <DocsCode>RadioGroupCardDescription</DocsCode>, or anything else,
            inside.
          </DocsParagraph>
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
