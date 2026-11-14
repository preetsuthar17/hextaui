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
import { UiSdkSegmentedControlControlled } from "@/components/examples/ui-sdk-segmented-control/controlled"
import { UiSdkSegmentedControlDemo } from "@/components/examples/ui-sdk-segmented-control/demo"
import { UiSdkSegmentedControlDisabled } from "@/components/examples/ui-sdk-segmented-control/disabled"
import { UiSdkSegmentedControlForm } from "@/components/examples/ui-sdk-segmented-control/form"
import { UiSdkSegmentedControlFullWidth } from "@/components/examples/ui-sdk-segmented-control/full-width"
import { UiSdkSegmentedControlIcons } from "@/components/examples/ui-sdk-segmented-control/icons"
import { UiSdkSegmentedControlReadOnly } from "@/components/examples/ui-sdk-segmented-control/read-only"
import { UiSdkSegmentedControlRtl } from "@/components/examples/ui-sdk-segmented-control/rtl"
import { UiSdkSegmentedControlSizes } from "@/components/examples/ui-sdk-segmented-control/sizes"
import { UiSdkSegmentedControlVertical } from "@/components/examples/ui-sdk-segmented-control/vertical"
import { getDocsComponentMetadata } from "@/lib/docs-metadata"

export const metadata = getDocsComponentMetadata("ui-sdk-segmented-control")

const layerCode = `@layer ui-sdk;

@import "tailwindcss";`

const importCode = `import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/components/ui/ui-sdk-segmented-control"`

const usageCode = `<SegmentedControl aria-label="View" defaultValue="list">
  <SegmentedControlItem value="list">List</SegmentedControlItem>
  <SegmentedControlItem value="grid">Grid</SegmentedControlItem>
</SegmentedControl>`

const compositionCode = `SegmentedControl
├── SegmentedControlItem
└── SegmentedControlItem`

const renderType = "ReactElement | (props, state) => ReactElement"

export default function Page() {
  return (
    <DocsComponentPage slug="ui-sdk-segmented-control">
      <DocsExample file="ui-sdk-segmented-control/demo">
        <UiSdkSegmentedControlDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@ui-sdk/react@0.1.0-beta.2",
          "@ui-sdk/core@0.1.0-beta.2",
          "cn",
        ]}
        files={["components/ui/ui-sdk-segmented-control.tsx"]}
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
          A segmented control switches between a few views or settings. It works
          like a radio group, with one value and one tab stop, and the indicator
          behind the checked item slides to the next choice. Name it with{" "}
          <DocsCode>aria-label</DocsCode> or{" "}
          <DocsCode>aria-labelledby</DocsCode>. UI SDK marks it experimental in
          0.1.0-beta.2.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
        <DocsParagraph>
          The control draws its own indicator, so you only add items.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="ui-sdk-segmented-control/sizes"
          title="Sizes"
          description={
            <>
              <DocsCode>size</DocsCode> is <DocsCode>sm</DocsCode>,{" "}
              <DocsCode>default</DocsCode> or <DocsCode>lg</DocsCode>. Items
              grow on touch screens.
            </>
          }
        >
          <UiSdkSegmentedControlSizes />
        </DocsExample>
        <DocsExample
          file="ui-sdk-segmented-control/icons"
          title="Icons"
          description={
            <>
              An item holding only an icon turns square. Name it with{" "}
              <DocsCode>aria-label</DocsCode>.
            </>
          }
        >
          <UiSdkSegmentedControlIcons />
        </DocsExample>
        <DocsExample
          file="ui-sdk-segmented-control/full-width"
          title="Full width"
          description={
            <>
              Give the control <DocsCode>w-full</DocsCode> and the items share
              its width.
            </>
          }
        >
          <UiSdkSegmentedControlFullWidth />
        </DocsExample>
        <DocsExample
          file="ui-sdk-segmented-control/vertical"
          title="Vertical"
          description={
            <>
              <DocsCode>{'orientation="vertical"'}</DocsCode> stacks the items.
              Arrow keys on both axes still move between them.
            </>
          }
        >
          <UiSdkSegmentedControlVertical />
        </DocsExample>
        <DocsExample
          file="ui-sdk-segmented-control/disabled"
          title="Disabled"
          description={
            <>
              <DocsCode>disabled</DocsCode> on the control turns it all off and
              submits nothing. On one item, the arrow keys skip it.
            </>
          }
        >
          <UiSdkSegmentedControlDisabled />
        </DocsExample>
        <DocsExample
          file="ui-sdk-segmented-control/controlled"
          title="Controlled"
          description={
            <>
              Pass <DocsCode>value</DocsCode> and update it in{" "}
              <DocsCode>onValueChange</DocsCode>. A controller from{" "}
              <DocsCode>createSegmentedControlController()</DocsCode> checks an
              item from anywhere.
            </>
          }
        >
          <UiSdkSegmentedControlControlled />
        </DocsExample>
        <DocsExample
          file="ui-sdk-segmented-control/form"
          title="Form"
          description={
            <>
              Each item holds a hidden native radio, so{" "}
              <DocsCode>name</DocsCode> submits the checked value,{" "}
              <DocsCode>required</DocsCode> waits for a choice, and a reset
              returns to the default.
            </>
          }
        >
          <UiSdkSegmentedControlForm />
        </DocsExample>
        <DocsExample
          file="ui-sdk-segmented-control/read-only"
          title="Read-only"
          description="A read-only control keeps its value and still submits. Arrow keys move focus without checking anything."
        >
          <UiSdkSegmentedControlReadOnly />
        </DocsExample>
        <DocsExample
          file="ui-sdk-segmented-control/rtl"
          title="Right to left"
          description="The items run from the right, and the indicator follows them."
        >
          <UiSdkSegmentedControlRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Tab"],
              description:
                "Moves into the control, onto the checked item or the first enabled one.",
            },
            {
              keys: ["←", "→", "↑", "↓"],
              description:
                "Move to the next or previous item and check it, skipping disabled ones. They wrap unless loop is false.",
            },
            {
              keys: ["Space"],
              description: "Checks the focused item.",
            },
            {
              keys: ["Enter"],
              description: "Submits its form.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsParagraph>
          The control is a radio group and each item a radio, so screen readers
          announce the choice and its position. The indicator is presentational
          and skipped by screen readers.
        </DocsParagraph>
        <DocsParagraph>
          The indicator only slides once the page is interactive, so it never
          animates in on load, and it doesn’t slide at all when reduced motion
          is on. In forced colors, the checked item keeps a visible border.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Each part wraps the UI SDK part of the same name and accepts all of
          its props, including <DocsCode>render</DocsCode> and a{" "}
          <DocsCode>className</DocsCode> that can be a function of the part’s
          state.
        </DocsParagraph>
        <DocsSection title="SegmentedControl" level={3}>
          <DocsPropsTable
            props={[
              { name: "value", type: "T | null" },
              { name: "defaultValue", type: "T | null" },
              {
                name: "onValueChange",
                type: "(value: T | null, details) => void",
              },
              {
                name: "size",
                type: '"sm" | "default" | "lg"',
                default: '"default"',
              },
              {
                name: "orientation",
                type: '"horizontal" | "vertical"',
                default: '"horizontal"',
              },
              { name: "loop", type: "boolean", default: "true" },
              { name: "disabled", type: "boolean", default: "false" },
              { name: "readOnly", type: "boolean", default: "false" },
              { name: "required", type: "boolean", default: "false" },
              { name: "name", type: "string" },
              { name: "form", type: "string" },
              {
                name: "controller",
                type: "SegmentedControlController",
                description: "From createSegmentedControlController().",
              },
              { name: "render", type: renderType },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="segmented-control"',
                description: "Target the segmented control in CSS.",
              },
              {
                name: "data-size",
                description: "The size: sm, default or lg.",
              },
              {
                name: "data-orientation",
                description: "horizontal or vertical.",
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
        <DocsSection title="SegmentedControlItem" level={3}>
          <DocsPropsTable
            props={[
              { name: "value", type: "string" },
              { name: "disabled", type: "boolean", default: "false" },
              { name: "render", type: renderType },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="segmented-control-item"',
                description: "Target an item in CSS.",
              },
              {
                name: "data-checked",
                description: "Present on the checked item.",
              },
              {
                name: "data-unchecked",
                description: "Present on the other items.",
              },
              {
                name: "data-icon-only",
                description: "Present when the item holds only an icon.",
              },
              {
                name: "data-disabled",
                description: "Present when disabled.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
