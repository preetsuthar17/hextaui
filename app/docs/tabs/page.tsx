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
import { TabsControlled } from "@/components/examples/tabs/controlled"
import { TabsDemo } from "@/components/examples/tabs/demo"
import { TabsDisabled } from "@/components/examples/tabs/disabled"
import { TabsIcons } from "@/components/examples/tabs/icons"
import { TabsLine } from "@/components/examples/tabs/line"
import { TabsOverflow } from "@/components/examples/tabs/overflow"
import { TabsOverflowSegmented } from "@/components/examples/tabs/overflow-segmented"
import { TabsRtl } from "@/components/examples/tabs/rtl"
import { TabsVertical } from "@/components/examples/tabs/vertical"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("tabs")

const importCode = `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"`

const usageCode = `<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">…</TabsContent>
  <TabsContent value="analytics">…</TabsContent>
</Tabs>`

const renderType = "ReactElement | (props, state) => ReactElement"

const compositionCode = `Tabs
├── TabsList
│   └── TabsTrigger
└── TabsContent`

export default function Page() {
  return (
    <DocsComponentPage slug="tabs">
      <DocsExample file="tabs/demo">
        <TabsDemo />
      </DocsExample>

      <DocsInstall
        dependencies={["@base-ui/react", "class-variance-authority", "cn"]}
        files={["components/ui/tabs.tsx"]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          One indicator slides to the active tab and resizes to fit it, while
          the content switches instantly so frequent switching never waits on an
          animation. The indicator is placed before the page hydrates, so it
          never jumps in on load.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="tabs/line"
          title="Underline"
          description={
            <>
              <DocsCode>{'variant="line"'}</DocsCode> on{" "}
              <DocsCode>TabsList</DocsCode> slides an underline instead of a
              pill.
            </>
          }
        >
          <TabsLine />
        </DocsExample>
        <DocsExample
          file="tabs/overflow"
          title="Many tabs"
          description="When tabs don't fit, the list scrolls sideways, fades the edges with more to see, and scrolls the active or focused tab into view."
        >
          <TabsOverflow />
        </DocsExample>
        <DocsExample
          file="tabs/overflow-segmented"
          title="Many tabs, segmented"
          description="The pill style scrolls the same way, keeping its track while the picked tab stays in view."
        >
          <TabsOverflowSegmented />
        </DocsExample>
        <DocsExample
          file="tabs/icons"
          title="Icons and counts"
          description="Put icons and badges inside triggers."
        >
          <TabsIcons />
        </DocsExample>
        <DocsExample
          file="tabs/vertical"
          title="Vertical"
          description={
            <>
              <DocsCode>{'orientation="vertical"'}</DocsCode> stacks the tabs;
              the underline moves to the side.
            </>
          }
        >
          <TabsVertical />
        </DocsExample>
        <DocsExample
          file="tabs/disabled"
          title="Disabled"
          description="Disabled tabs are skipped by the keyboard."
        >
          <TabsDisabled />
        </DocsExample>
        <DocsExample
          file="tabs/controlled"
          title="Controlled"
          description={
            <>
              Pass <DocsCode>value</DocsCode> and{" "}
              <DocsCode>onValueChange</DocsCode>. Changes from outside slide the
              indicator too.
            </>
          }
        >
          <TabsControlled />
        </DocsExample>
        <DocsExample
          file="tabs/rtl"
          title="Right to left"
          description="Tabs, arrow keys and the indicator follow the reading direction."
        >
          <TabsRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Tab"],
              description:
                "Moves into the list on the active tab, then into the panel.",
            },
            {
              keys: ["←", "→"],
              description:
                "Moves between tabs, wrapping at the ends. ↑ and ↓ when vertical.",
            },
            {
              keys: ["Home", "End"],
              description: "Moves to the first or last tab.",
            },
            {
              keys: ["Enter", "Space"],
              description:
                "Opens the focused tab. Set activateOnFocus on TabsList to open tabs as focus moves.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            The list is a <DocsCode>tablist</DocsCode>; each trigger is a{" "}
            <DocsCode>tab</DocsCode> that controls its{" "}
            <DocsCode>tabpanel</DocsCode>.
          </li>
          <li>
            Panels are focusable, so keyboard users can reach content that has
            no links or buttons.
          </li>
          <li>With reduced motion, the indicator jumps instead of sliding.</li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsSection title="Tabs" level={3}>
          <DocsPropsTable
            props={[
              { name: "value", type: "any" },
              { name: "defaultValue", type: "any", default: "0" },
              { name: "onValueChange", type: "(value, details) => void" },
              {
                name: "orientation",
                type: '"horizontal" | "vertical"',
                default: '"horizontal"',
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: "data-activation-direction",
                description:
                  '"left", "right", "up" or "down": where the new tab is relative to the old one.',
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="TabsList" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "variant",
                type: '"default" | "line"',
                default: '"default"',
              },
              {
                name: "activateOnFocus",
                type: "boolean",
                default: "false",
              },
              { name: "loopFocus", type: "boolean", default: "true" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="tabs-indicator"',
                description: "The sliding pill or underline.",
              },
              {
                name: "data-scrolled-start / data-scrolled-end",
                description: "Present when the list can scroll that way.",
              },
              {
                name: "--active-tab-left / --active-tab-width",
                description:
                  "Position and size of the active tab, also -top and -height.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="TabsTrigger" level={3}>
          <DocsPropsTable
            props={[
              { name: "value", type: "any" },
              { name: "disabled", type: "boolean", default: "false" },
              { name: "render", type: renderType, default: "<button>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              { name: "data-active", description: "The open tab." },
              { name: "data-disabled", description: "The tab is disabled." },
            ]}
          />
        </DocsSection>
        <DocsSection title="TabsContent" level={3}>
          <DocsPropsTable
            props={[
              { name: "value", type: "any" },
              {
                name: "keepMounted",
                type: "boolean",
                default: "false",
                description: "Keep the panel in the DOM while hidden.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
