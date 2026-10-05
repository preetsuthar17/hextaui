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
import { AccordionControlled } from "@/components/examples/accordion/controlled"
import { AccordionCustomIcon } from "@/components/examples/accordion/custom-icon"
import { AccordionDemo } from "@/components/examples/accordion/demo"
import { AccordionDisabled } from "@/components/examples/accordion/disabled"
import { AccordionGhost } from "@/components/examples/accordion/ghost"
import { AccordionLeadingIcons } from "@/components/examples/accordion/leading-icons"
import { AccordionLongContent } from "@/components/examples/accordion/long-content"
import { AccordionMultiple } from "@/components/examples/accordion/multiple"
import { AccordionNested } from "@/components/examples/accordion/nested"
import { AccordionOutline } from "@/components/examples/accordion/outline"
import { AccordionRtl } from "@/components/examples/accordion/rtl"
import { AccordionSeparated } from "@/components/examples/accordion/separated"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("accordion")

const importCode = `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"`

const usageCode = `<Accordion defaultValue={["item-1"]}>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes. It follows the WAI-ARIA accordion pattern.
    </AccordionContent>
  </AccordionItem>
</Accordion>`

const renderType = "ReactElement | (props, state) => ReactElement"

const compositionCode = `Accordion
└── AccordionItem
    ├── AccordionTrigger
    └── AccordionContent`

export default function Page() {
  return (
    <DocsComponentPage slug="accordion">
      <DocsExample file="accordion/demo">
        <AccordionDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@base-ui/react",
          "@tabler/icons-react",
          "class-variance-authority",
          "cn",
        ]}
        files={["components/ui/accordion.tsx"]}
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
          file="accordion/outline"
          title="Outline"
          description="Items share one bordered surface, with the outer corners rounded."
        >
          <AccordionOutline />
        </DocsExample>
        <DocsExample
          file="accordion/separated"
          title="Separated"
          description="Each item is its own card."
        >
          <AccordionSeparated />
        </DocsExample>
        <DocsExample
          file="accordion/ghost"
          title="Ghost"
          description="No borders. Triggers get a soft fill on hover and when open."
        >
          <AccordionGhost />
        </DocsExample>
        <DocsExample
          file="accordion/multiple"
          title="Multiple"
          description={
            <>
              Set <DocsCode>multiple</DocsCode> to let more than one item stay
              open.
            </>
          }
        >
          <AccordionMultiple />
        </DocsExample>
        <DocsExample
          file="accordion/disabled"
          title="Disabled"
          description={
            <>
              Disable a single item with <DocsCode>disabled</DocsCode> on{" "}
              <DocsCode>{"<AccordionItem />"}</DocsCode>, or the whole accordion
              on the root.
            </>
          }
        >
          <AccordionDisabled />
        </DocsExample>
        <DocsExample
          file="accordion/controlled"
          title="Controlled"
          description={
            <>
              Pass <DocsCode>value</DocsCode> and{" "}
              <DocsCode>onValueChange</DocsCode> to keep the open items in your
              own state.
            </>
          }
        >
          <AccordionControlled />
        </DocsExample>
        <DocsExample
          file="accordion/custom-icon"
          title="Custom icon"
          description={
            <>
              Pass any element to <DocsCode>icon</DocsCode>. Style its open
              state with{" "}
              <DocsCode>group-data-panel-open/accordion-trigger</DocsCode>.
            </>
          }
        >
          <AccordionCustomIcon />
        </DocsExample>
        <DocsExample
          file="accordion/leading-icons"
          title="Leading icons"
          description={
            <>
              Icons before the label are sized and aligned for you.{" "}
              <DocsCode>{"icon={null}"}</DocsCode> removes the chevron.
            </>
          }
        >
          <AccordionLeadingIcons />
        </DocsExample>
        <DocsExample
          file="accordion/long-content"
          title="Long content"
          description="Long titles wrap while the icon stays on the first line. Closed panels stay searchable, so Cmd/Ctrl+F for “retention” opens this one."
        >
          <AccordionLongContent />
        </DocsExample>
        <DocsExample
          file="accordion/nested"
          title="Nested"
          description="An inner accordion keeps its own variant, focus styles and arrow-key navigation."
        >
          <AccordionNested />
        </DocsExample>
        <DocsExample
          file="accordion/rtl"
          title="Right to left"
          description="Content, icons and the open motion follow the reading direction."
        >
          <AccordionRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Enter", "Space"],
              description: "Opens or closes the focused item.",
            },
            { keys: ["↓"], description: "Moves focus to the next trigger." },
            {
              keys: ["↑"],
              description: "Moves focus to the previous trigger.",
            },
            {
              keys: ["Home"],
              description: "Moves focus to the first trigger.",
            },
            { keys: ["End"], description: "Moves focus to the last trigger." },
            {
              keys: ["Tab"],
              description:
                "Moves focus into the open panel, then on to the next trigger.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Built on the Base UI accordion. Every part accepts the props of the
          primitive it wraps.
        </DocsParagraph>
        <DocsSection title="Accordion" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "variant",
                type: '"default" | "outline" | "separated" | "ghost"',
                default: '"default"',
              },
              {
                name: "multiple",
                type: "boolean",
                default: "false",
                description: "Allow more than one item to be open.",
              },
              { name: "value", type: "Value[]" },
              { name: "defaultValue", type: "Value[]" },
              {
                name: "onValueChange",
                type: "(value: Value[], details) => void",
              },
              { name: "disabled", type: "boolean", default: "false" },
              {
                name: "hiddenUntilFound",
                type: "boolean",
                default: "true",
                description:
                  "Keep closed panels findable with the browser’s page search.",
              },
              {
                name: "keepMounted",
                type: "boolean",
                default: "false",
                description: "Ignored while hiddenUntilFound is on.",
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="accordion"',
                description: "Target the root in CSS.",
              },
              {
                name: "data-variant",
                description: "The current variant.",
              },
              {
                name: "data-disabled",
                description: "Present when the accordion is disabled.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="AccordionItem" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "value",
                type: "Value",
                description: "Generated automatically when omitted.",
              },
              { name: "disabled", type: "boolean", default: "false" },
              {
                name: "onOpenChange",
                type: "(open: boolean, details) => void",
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="accordion-item"',
                description: "Target items in CSS.",
              },
              {
                name: "data-open",
                description: "Present when the item is open.",
              },
              {
                name: "data-disabled",
                description: "Present when the item is disabled.",
              },
              {
                name: "data-index",
                description: "The item’s position, starting at 0.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="AccordionTrigger" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "icon",
                type: "ReactNode | null",
                default: "<IconChevronDown />",
                description: "null removes the icon.",
              },
              { name: "render", type: renderType, default: "<button>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="accordion-trigger"',
                description: "Target triggers in CSS.",
              },
              {
                name: "data-panel-open",
                description:
                  "Present when its panel is open. Style the icon with group-data-panel-open/accordion-trigger.",
              },
              {
                name: "data-disabled",
                description: "Present when the item is disabled.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="AccordionContent" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "className",
                type: "string",
                description:
                  "Applied to the inner wrapper, so padding never fights the height animation.",
              },
              { name: "keepMounted", type: "boolean", default: "false" },
              { name: "hiddenUntilFound", type: "boolean" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="accordion-content"',
                description: "Target panels in CSS.",
              },
              {
                name: "data-open",
                description: "Present when the panel is open.",
              },
              {
                name: "data-starting-style",
                description: "Present while the panel animates in.",
              },
              {
                name: "data-ending-style",
                description: "Present while the panel animates out.",
              },
              {
                name: "data-settled",
                description:
                  "Present once the panel is fully open. It stops clipping then, so focus rings inside a nested accordion show in full.",
              },
              {
                name: "--accordion-panel-height",
                description:
                  "The panel’s measured height, used for the height animation.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
