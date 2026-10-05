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
import { ResizableCollapsible } from "@/components/examples/resizable/collapsible"
import { ResizableDemo } from "@/components/examples/resizable/demo"
import { ResizableWithHandle } from "@/components/examples/resizable/handle"
import { ResizablePersist } from "@/components/examples/resizable/persist"
import { ResizableRtl } from "@/components/examples/resizable/rtl"
import { ResizableSize } from "@/components/examples/resizable/size"
import { ResizableVertical } from "@/components/examples/resizable/vertical"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("resizable")

const importCode = `import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"`

const usageCode = `<ResizablePanelGroup>
  <ResizablePanel defaultSize="30%" minSize="20%">Sidebar</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel>Content</ResizablePanel>
</ResizablePanelGroup>`

const compositionCode = `ResizablePanelGroup
├── ResizablePanel
├── ResizableHandle
└── ResizablePanel`

export default function Page() {
  return (
    <DocsComponentPage slug="resizable">
      <DocsExample file="resizable/demo">
        <ResizableDemo />
      </DocsExample>

      <DocsInstall
        dependencies={["react-resizable-panels", "cn"]}
        files={["components/ui/resizable.tsx"]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          Numbers are pixels and strings are percentages, so{" "}
          <DocsCode>{'defaultSize="30%"'}</DocsCode> and{" "}
          <DocsCode>{"minSize={240}"}</DocsCode> both work. The divider stays a
          hairline until you reach for it. While you drag, panels follow the
          pointer exactly; every other change glides, including double-click
          resets, keyboard steps and collapsing from code.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="resizable/collapsible"
          title="Collapsible"
          description={
            <>
              A <DocsCode>collapsible</DocsCode> panel snaps shut when dragged
              below its <DocsCode>minSize</DocsCode>. Toggle it from a button
              with <DocsCode>usePanelRef</DocsCode>; the collapse animates.
            </>
          }
        >
          <ResizableCollapsible />
        </DocsExample>
        <DocsExample
          file="resizable/size"
          title="Size readout"
          description={
            <>
              <DocsCode>showSize</DocsCode> shows the panel before the divider
              while you drag or use the keyboard, in{" "}
              <DocsCode>{'"percent"'}</DocsCode> or{" "}
              <DocsCode>{'"pixels"'}</DocsCode>.
            </>
          }
        >
          <ResizableSize />
        </DocsExample>
        <DocsExample
          file="resizable/persist"
          title="Remember the layout"
          description={
            <>
              <DocsCode>useDefaultLayout</DocsCode> saves sizes to{" "}
              <DocsCode>localStorage</DocsCode> and restores them on the next
              visit without animating in. Give each panel an{" "}
              <DocsCode>id</DocsCode>.
            </>
          }
        >
          <ResizablePersist />
        </DocsExample>
        <DocsExample
          file="resizable/vertical"
          title="Vertical"
          description={
            <>
              <DocsCode>{'orientation="vertical"'}</DocsCode> stacks panels.
              Groups nest, as in the demo above.
            </>
          }
        >
          <ResizableVertical />
        </DocsExample>
        <DocsExample
          file="resizable/handle"
          title="Visible grip"
          description={
            <>
              <DocsCode>withHandle</DocsCode> keeps the grip showing instead of
              revealing it on hover.
            </>
          }
        >
          <ResizableWithHandle />
        </DocsExample>
        <DocsExample
          file="resizable/rtl"
          title="Right to left"
          description="Panels and arrow keys follow the reading direction."
        >
          <ResizableRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["←", "→", "↑", "↓"],
              description:
                "Moves the focused divider by 5% along its group's direction.",
            },
            {
              keys: ["Home", "End"],
              description: "Moves the divider as far as the panels allow.",
            },
            {
              keys: ["Enter"],
              description: "Collapses or expands a collapsible panel.",
            },
            {
              keys: ["F6"],
              description:
                "Moves to the next divider in the group; Shift goes back.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            Each divider is a focusable <DocsCode>separator</DocsCode> that
            reports the size of the panel before it.
          </li>
          <li>
            The size readout is decorative; screen readers get the
            separator&apos;s own value.
          </li>
          <li>
            With reduced motion, sizes change instantly and the divider
            doesn&apos;t animate.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsSection title="ResizablePanelGroup" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "orientation",
                type: '"horizontal" | "vertical"',
                default: '"horizontal"',
              },
              { name: "defaultLayout", type: "Layout" },
              {
                name: "onLayoutChange",
                type: "(layout) => void",
                description: "Every change, including while dragging.",
              },
              {
                name: "onLayoutChanged",
                type: "(layout, meta) => void",
                description: "Once a change settles.",
              },
              { name: "disabled", type: "boolean", default: "false" },
              { name: "groupRef", type: "Ref<GroupImperativeHandle>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="resizable-panel-group"',
                description: "The group.",
              },
              {
                name: "data-ready",
                description: "Set after mount; sizes animate from then on.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ResizablePanel" level={3}>
          <DocsPropsTable
            props={[
              { name: "defaultSize", type: "number | string" },
              { name: "minSize", type: "number | string" },
              { name: "maxSize", type: "number | string" },
              { name: "collapsible", type: "boolean", default: "false" },
              { name: "collapsedSize", type: "number | string", default: "0" },
              {
                name: "onResize",
                type: "(size, id, previous) => void",
              },
              { name: "panelRef", type: "Ref<PanelImperativeHandle>" },
              {
                name: "id",
                type: "string",
                description: "Needed to remember layouts.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ResizableHandle" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "withHandle",
                type: "boolean",
                default: "false",
                description: "Always show the grip.",
              },
              {
                name: "showSize",
                type: 'boolean | "percent" | "pixels"',
                default: "false",
              },
              {
                name: "disableDoubleClick",
                type: "boolean",
                default: "false",
                description: "Stop double-click from resetting the panels.",
              },
              { name: "disabled", type: "boolean", default: "false" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="resizable-handle"',
                description: "The divider.",
              },
              {
                name: "data-separator",
                description:
                  '"inactive", "hover", "active", "focus" or "disabled".',
              },
              {
                name: 'data-slot="resizable-handle-grip"',
                description: "The grip pill.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="Hooks" level={3}>
          <DocsParagraph>
            <DocsCode>usePanelRef</DocsCode> and{" "}
            <DocsCode>useGroupRef</DocsCode> give you{" "}
            <DocsCode>collapse</DocsCode>, <DocsCode>expand</DocsCode>,{" "}
            <DocsCode>resize</DocsCode> and <DocsCode>setLayout</DocsCode>.{" "}
            <DocsCode>useDefaultLayout</DocsCode> persists a group&apos;s
            layout.
          </DocsParagraph>
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
