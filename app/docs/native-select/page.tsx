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
import { NativeSelectControlled } from "@/components/examples/native-select/controlled"
import { NativeSelectDemo } from "@/components/examples/native-select/demo"
import { NativeSelectDisabled } from "@/components/examples/native-select/disabled"
import { NativeSelectField } from "@/components/examples/native-select/field"
import { NativeSelectGroups } from "@/components/examples/native-select/groups"
import { NativeSelectInvalid } from "@/components/examples/native-select/invalid"
import { NativeSelectLongContent } from "@/components/examples/native-select/long-content"
import { NativeSelectRtl } from "@/components/examples/native-select/rtl"
import { NativeSelectSizes } from "@/components/examples/native-select/sizes"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("native-select")

const importCode = `import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select"`

const usageCode = `<NativeSelect>
  <NativeSelectOption value="">Select a fruit</NativeSelectOption>
  <NativeSelectOption value="apple">Apple</NativeSelectOption>
  <NativeSelectOption value="banana">Banana</NativeSelectOption>
</NativeSelect>`

const compositionCode = `NativeSelect
├── NativeSelectOption
└── NativeSelectOptGroup
    └── NativeSelectOption`

export default function Page() {
  return (
    <DocsComponentPage slug="native-select">
      <DocsExample file="native-select/demo">
        <NativeSelectDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@base-ui/react",
          "@tabler/icons-react",
          "class-variance-authority",
          "cn",
        ]}
        files={[
          "components/ui/native-select.tsx",
          "components/ui/input.tsx",
          "components/ui/number-flow.tsx",
          "lib/motion.ts",
        ]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          An option with an empty <DocsCode>value</DocsCode> acts as the
          placeholder: it shows in muted text until something is chosen. Put{" "}
          <DocsCode>className</DocsCode> on the select to size its wrapper, for
          example <DocsCode>w-full</DocsCode>.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="native-select/groups"
          title="Groups"
          description={
            <>
              <DocsCode>{"<NativeSelectOptGroup />"}</DocsCode> organizes
              options under headings in the OS picker.
            </>
          }
        >
          <NativeSelectGroups />
        </DocsExample>
        <DocsExample
          file="native-select/sizes"
          title="Sizes"
          description="Sizes, borders, focus rings and invalid styles match Input exactly, so the two line up in a row."
        >
          <NativeSelectSizes />
        </DocsExample>
        <DocsExample
          file="native-select/field"
          title="Field"
          description={
            <>
              Inside a <DocsCode>{"<Field />"}</DocsCode>, the label and
              description connect on their own and errors show as the value
              changes. Submit without a plan and the select turns red, shakes
              once, and the browser points to it.
            </>
          }
        >
          <NativeSelectField />
        </DocsExample>
        <DocsExample
          file="native-select/invalid"
          title="Invalid"
          description={
            <>
              Set <DocsCode>aria-invalid</DocsCode> and link the message with{" "}
              <DocsCode>aria-describedby</DocsCode>.
            </>
          }
        >
          <NativeSelectInvalid />
        </DocsExample>
        <DocsExample
          file="native-select/disabled"
          title="Disabled"
          description="Disable the whole select, or single options that aren't available."
        >
          <NativeSelectDisabled />
        </DocsExample>
        <DocsExample
          file="native-select/controlled"
          title="Controlled"
          description={
            <>
              Pass <DocsCode>value</DocsCode> and <DocsCode>onChange</DocsCode>{" "}
              like a regular select.
            </>
          }
        >
          <NativeSelectControlled />
        </DocsExample>
        <DocsExample
          file="native-select/long-content"
          title="Long content"
          description="Long selected labels end with an ellipsis instead of running under the chevron."
        >
          <NativeSelectLongContent />
        </DocsExample>
        <DocsExample
          file="native-select/rtl"
          title="Right to left"
          description="The chevron and padding move to the other side."
        >
          <NativeSelectRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Native select or Select?">
        <DocsList>
          <li>
            Use Native select for simple lists, especially on phones, where the
            OS picker is the fastest and most familiar way to choose.
          </li>
          <li>
            Use Combobox when people need to search, or when options need icons,
            descriptions or custom layouts.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            { keys: ["Tab"], description: "Focuses the select." },
            {
              keys: ["Space", "Enter"],
              description: "Opens the OS picker.",
            },
            {
              keys: ["↑", "↓"],
              description:
                "Changes the selection, or moves in the open picker.",
            },
            {
              keys: ["A–Z"],
              description:
                "Jumps to the option that starts with the typed text.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          <DocsCode>{"<NativeSelect />"}</DocsCode> accepts every select
          attribute. The option parts accept their element&apos;s attributes.
        </DocsParagraph>
        <DocsSection title="NativeSelect" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "size",
                type: '"sm" | "default" | "lg"',
                default: '"default"',
              },
              {
                name: "htmlSize",
                type: "number",
                description:
                  "The native size attribute, renamed because size is the variant.",
              },
              {
                name: "shake",
                type: "boolean",
                default: "true",
                description: "Shake once when a form submit finds it invalid.",
              },
              {
                name: "className",
                type: "string",
                description:
                  "Applied to the wrapper, so it sizes the whole control.",
              },
              { name: "value", type: "string" },
              { name: "defaultValue", type: "string" },
              { name: "disabled", type: "boolean", default: "false" },
              { name: "required", type: "boolean", default: "false" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="native-select-wrapper"',
                description: "The wrapper, with data-size.",
              },
              {
                name: 'data-slot="native-select"',
                description: "The select element.",
              },
              {
                name: 'data-slot="native-select-icon"',
                description: "The chevron. Darkens on hover and focus.",
              },
              {
                name: "data-invalid",
                description: "Present when a surrounding Field is invalid.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection
          title="NativeSelectOption and NativeSelectOptGroup"
          level={3}
        >
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="native-select-option"',
                description: "An option.",
              },
              {
                name: 'data-slot="native-select-optgroup"',
                description: "A labelled group of options.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
