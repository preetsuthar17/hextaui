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
import { ToggleGroupControlled } from "@/components/examples/toggle-group/controlled"
import { ToggleGroupDemo } from "@/components/examples/toggle-group/demo"
import { ToggleGroupDisabled } from "@/components/examples/toggle-group/disabled"
import { ToggleGroupIcons } from "@/components/examples/toggle-group/icons"
import { ToggleGroupMultiple } from "@/components/examples/toggle-group/multiple"
import { ToggleGroupOutline } from "@/components/examples/toggle-group/outline"
import { ToggleGroupRtl } from "@/components/examples/toggle-group/rtl"
import { ToggleGroupSizes } from "@/components/examples/toggle-group/sizes"
import { ToggleGroupSpacing } from "@/components/examples/toggle-group/spacing"
import { ToggleGroupVertical } from "@/components/examples/toggle-group/vertical"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("toggle-group")

const importCode = `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"`

const usageCode = `<ToggleGroup aria-label="Date range" defaultValue={["week"]}>
  <ToggleGroupItem value="day">Day</ToggleGroupItem>
  <ToggleGroupItem value="week">Week</ToggleGroupItem>
  <ToggleGroupItem value="month">Month</ToggleGroupItem>
</ToggleGroup>`

const renderType = "ReactElement | (props, state) => ReactElement"

const compositionCode = `ToggleGroup
└── ToggleGroupItem`

export default function Page() {
  return (
    <DocsComponentPage slug="toggle-group">
      <DocsExample file="toggle-group/demo">
        <ToggleGroupDemo />
      </DocsExample>

      <DocsInstall
        dependencies={["@base-ui/react", "class-variance-authority", "cn"]}
        files={[
          "components/ui/toggle-group.tsx",
          "components/ui/toggle.tsx",
          "lib/motion.ts",
        ]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          When one item can be on at a time, a single fill slides to the picked
          item and takes its shape, so the group reads as one control. With{" "}
          <DocsCode>multiple</DocsCode>, each item fills on its own. The fill is
          placed before the first paint, so it never slides in on load.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="toggle-group/outline"
          title="Outline"
          description={
            <>
              <DocsCode>{'variant="outline"'}</DocsCode> joins the items into
              one bordered control.
            </>
          }
        >
          <ToggleGroupOutline />
        </DocsExample>
        <DocsExample
          file="toggle-group/multiple"
          title="Multiple"
          description={
            <>
              <DocsCode>multiple</DocsCode> lets any number of items be on, like
              text formatting.
            </>
          }
        >
          <ToggleGroupMultiple />
        </DocsExample>
        <DocsExample
          file="toggle-group/sizes"
          title="Sizes"
          description={
            <>
              <DocsCode>size</DocsCode> on the group sets every item:{" "}
              <DocsCode>sm</DocsCode>, <DocsCode>default</DocsCode> or{" "}
              <DocsCode>lg</DocsCode>.
            </>
          }
        >
          <ToggleGroupSizes />
        </DocsExample>
        <DocsExample
          file="toggle-group/spacing"
          title="Spacing"
          description={
            <>
              <DocsCode>spacing</DocsCode> puts a gap between items on the
              spacing scale. Outline items with a gap keep their own borders and
              fills.
            </>
          }
        >
          <ToggleGroupSpacing />
        </DocsExample>
        <DocsExample
          file="toggle-group/icons"
          title="Icons and labels"
          description="Put an icon before the label. Icon-only items need an aria-label."
        >
          <ToggleGroupIcons />
        </DocsExample>
        <DocsExample
          file="toggle-group/vertical"
          title="Vertical"
          description={
            <>
              <DocsCode>{'orientation="vertical"'}</DocsCode> stacks the items
              and moves focus with ↑ and ↓.
            </>
          }
        >
          <ToggleGroupVertical />
        </DocsExample>
        <DocsExample
          file="toggle-group/disabled"
          title="Disabled"
          description={
            <>
              Disable one item, or the whole group with{" "}
              <DocsCode>disabled</DocsCode>. Disabled items are skipped by the
              keyboard.
            </>
          }
        >
          <ToggleGroupDisabled />
        </DocsExample>
        <DocsExample
          file="toggle-group/controlled"
          title="Controlled"
          description={
            <>
              Pass <DocsCode>value</DocsCode> and{" "}
              <DocsCode>onValueChange</DocsCode>. Ignoring the empty value keeps
              one item on, so pressing the picked item again does nothing.
            </>
          }
        >
          <ToggleGroupControlled />
        </DocsExample>
        <DocsExample
          file="toggle-group/rtl"
          title="Right to left"
          description="Item order, joined corners, the sliding fill and arrow keys follow the reading direction."
        >
          <ToggleGroupRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Tab"],
              description:
                "Moves into the group on the last focused item, then out of it.",
            },
            {
              keys: ["←", "→"],
              description:
                "Moves between items, wrapping at the ends. ↑ and ↓ when vertical.",
            },
            {
              keys: ["Home", "End"],
              description: "Moves to the first or last item.",
            },
            {
              keys: ["Enter", "Space"],
              description: "Turns the focused item on or off.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            The group has the <DocsCode>group</DocsCode> role; give it an{" "}
            <DocsCode>aria-label</DocsCode>. Each item is a button with{" "}
            <DocsCode>aria-pressed</DocsCode>.
          </li>
          <li>
            Only one item is in the tab order, so the group is a single Tab stop
            and arrow keys move inside it.
          </li>
          <li>
            Without <DocsCode>multiple</DocsCode>, pressing the picked item
            turns it off. Control the value to keep one item on.
          </li>
          <li>With reduced motion, the fill fades instead of sliding.</li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsSection title="ToggleGroup" level={3}>
          <DocsPropsTable
            props={[
              { name: "value", type: "string[]" },
              { name: "defaultValue", type: "string[]" },
              {
                name: "onValueChange",
                type: "(value: string[], details) => void",
              },
              { name: "multiple", type: "boolean", default: "false" },
              {
                name: "variant",
                type: '"default" | "outline"',
                default: '"default"',
                description: "Sets every item's variant.",
              },
              {
                name: "size",
                type: '"default" | "sm" | "lg"',
                default: '"default"',
                description: "Sets every item's size.",
              },
              {
                name: "spacing",
                type: "0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 4 | 5 | 6 | 8",
                default: "0",
                description:
                  "Gap between items on the spacing scale. 0 joins outline items.",
              },
              {
                name: "orientation",
                type: '"horizontal" | "vertical"',
                default: '"horizontal"',
              },
              { name: "loopFocus", type: "boolean", default: "true" },
              { name: "disabled", type: "boolean", default: "false" },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              { name: 'data-slot="toggle-group"', description: "The root." },
              {
                name: 'data-slot="toggle-group-indicator"',
                description:
                  "The sliding fill, rendered without multiple. data-visible when an item is on.",
              },
              {
                name: "data-variant / data-size / data-spacing",
                description: "The group's variant, size and spacing.",
              },
              {
                name: "data-orientation",
                description: '"horizontal" or "vertical".',
              },
              {
                name: "data-multiple",
                description: "Present when many items can be on.",
              },
              {
                name: "data-disabled",
                description: "Present when the group is disabled.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ToggleGroupItem" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "value",
                type: "string",
                description: "Identifies the item in the group's value.",
              },
              { name: "disabled", type: "boolean", default: "false" },
              {
                name: "variant",
                type: '"default" | "outline"',
                description: "Used when the group sets none.",
              },
              {
                name: "size",
                type: '"default" | "sm" | "lg"',
                description: "Used when the group sets none.",
              },
              { name: "nativeButton", type: "boolean", default: "true" },
              { name: "render", type: renderType, default: "<button>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="toggle-group-item"',
                description: "Each item.",
              },
              { name: "data-pressed", description: "The item is on." },
              { name: "data-disabled", description: "The item is disabled." },
              {
                name: "data-variant / data-size",
                description: "The item's resolved variant and size.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
