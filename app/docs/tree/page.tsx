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
import { TreeCheckboxes } from "@/components/examples/tree/checkboxes"
import { TreeConnectors } from "@/components/examples/tree/connectors"
import { TreeControlled } from "@/components/examples/tree/controlled"
import { TreeDemo } from "@/components/examples/tree/demo"
import { TreeDisabled } from "@/components/examples/tree/disabled"
import { TreeLazy } from "@/components/examples/tree/lazy"
import { TreeLines } from "@/components/examples/tree/lines"
import { TreeLongNames } from "@/components/examples/tree/long-names"
import { TreeMultiple } from "@/components/examples/tree/multiple"
import { TreeNavigation } from "@/components/examples/tree/navigation"
import { TreeRtl } from "@/components/examples/tree/rtl"
import { TreeSmall } from "@/components/examples/tree/small"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("tree")

const importCode = `import {
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemLabel,
} from "@/components/ui/tree"`

const usageCode = `<Tree aria-label="Files" defaultExpandedValues={["src"]}>
  <TreeItem value="src">
    <TreeItemLabel icon={<IconFolder />}>src</TreeItemLabel>
    <TreeGroup>
      <TreeItem value="index">
        <TreeItemLabel icon={<IconFile />}>index.ts</TreeItemLabel>
      </TreeItem>
    </TreeGroup>
  </TreeItem>
</Tree>`

const renderType = "ReactElement | (props, state) => ReactElement"

const compositionCode = `Tree
└── TreeItem
    ├── TreeItemLabel
    └── TreeGroup
        └── TreeItem
            └── TreeItemLabel`

export default function Page() {
  return (
    <DocsComponentPage slug="tree">
      <DocsExample file="tree/demo">
        <TreeDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@base-ui/react",
          "@tabler/icons-react",
          "class-variance-authority",
          "cn",
        ]}
        files={["components/ui/tree.tsx", "components/ui/checkbox.tsx"]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          An item with a <DocsCode>{"<TreeGroup />"}</DocsCode> is a branch: it
          gets a chevron, opens and closes, and answers to the arrow keys. Every
          item needs a <DocsCode>value</DocsCode> that is unique within the
          tree.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="tree/lines"
          title="Indent guides"
          description={
            <>
              <DocsCode>{'variant="lines"'}</DocsCode> draws a guide for each
              level. The guide of the branch that holds the selected or focused
              row gets darker, so you can see where you are in deep trees.
            </>
          }
        >
          <TreeLines />
        </DocsExample>
        <DocsExample
          file="tree/connectors"
          title="Connectors"
          description={
            <>
              <DocsCode>{'variant="connectors"'}</DocsCode> joins each item to
              its parent with an elbow, like a terminal tree listing. Use{" "}
              <DocsCode>meta</DocsCode> for versions, sizes or counts.
            </>
          }
        >
          <TreeConnectors />
        </DocsExample>
        <DocsExample
          file="tree/checkboxes"
          title="Checkboxes"
          description={
            <>
              With <DocsCode>checkboxes</DocsCode>, checking a branch checks
              every enabled item inside it, and a partly checked branch shows a
              dash. Checking a branch also counts as checking children you load
              later. Clicking a row checks it, and the chevron opens it.
            </>
          }
        >
          <TreeCheckboxes />
        </DocsExample>
        <DocsExample
          file="tree/navigation"
          title="Navigation"
          description={
            <>
              Render rows as links with <DocsCode>render</DocsCode>. Pass the
              current page to <DocsCode>selectedValues</DocsCode>, open its
              section, and set <DocsCode>aria-current</DocsCode> on its row.
            </>
          }
        >
          <TreeNavigation />
        </DocsExample>
        <DocsExample
          file="tree/multiple"
          title="Multiple selection"
          description={
            <>
              <DocsCode>{'selectionMode="multiple"'}</DocsCode> works like a
              file manager: click to select one row, Cmd/Ctrl+click to add or
              remove one, Shift+click to select a range. On touch screens a tap
              adds or removes the row.
            </>
          }
        >
          <TreeMultiple />
        </DocsExample>
        <DocsExample
          file="tree/controlled"
          title="Controlled"
          description={
            <>
              Keep open branches in your own state with{" "}
              <DocsCode>expandedValues</DocsCode> and{" "}
              <DocsCode>onExpandedValuesChange</DocsCode>. This example also
              builds the tree from data with a recursive function.
            </>
          }
        >
          <TreeControlled />
        </DocsExample>
        <DocsExample
          file="tree/lazy"
          title="Lazy loading"
          description={
            <>
              Fetch children in <DocsCode>onExpandedChange</DocsCode> on{" "}
              <DocsCode>{"<TreeItem />"}</DocsCode>. Render a disabled loading
              row until they arrive, so the branch keeps its chevron.
            </>
          }
        >
          <TreeLazy />
        </DocsExample>
        <DocsExample
          file="tree/small"
          title="Small"
          description={
            <>
              <DocsCode>{'size="sm"'}</DocsCode> uses shorter rows and tighter
              indents, for sidebars. Rows grow on touch screens in both sizes.
            </>
          }
        >
          <TreeSmall />
        </DocsExample>
        <DocsExample
          file="tree/disabled"
          title="Disabled"
          description="A disabled item can’t be selected, checked or opened, and the arrow keys skip it. Items inside a disabled branch are disabled too."
        >
          <TreeDisabled />
        </DocsExample>
        <DocsExample
          file="tree/long-names"
          title="Long names"
          description={
            <>
              Names cut off with an ellipsis and <DocsCode>meta</DocsCode> stays
              visible. Pass <DocsCode>title</DocsCode> to show the full name on
              hover.
            </>
          }
        >
          <TreeLongNames />
        </DocsExample>
        <DocsExample
          file="tree/rtl"
          title="Right to left"
          description="Indents, connectors and chevrons mirror, and the left and right arrow keys swap."
        >
          <TreeRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["↓"],
              description: "Moves focus to the next visible row.",
            },
            {
              keys: ["↑"],
              description: "Moves focus to the previous visible row.",
            },
            {
              keys: ["→"],
              description:
                "Opens a closed branch. On an open branch, moves focus to its first child.",
            },
            {
              keys: ["←"],
              description:
                "Closes an open branch. Otherwise moves focus to the parent.",
            },
            { keys: ["Home"], description: "Moves focus to the first row." },
            {
              keys: ["End"],
              description: "Moves focus to the last visible row.",
            },
            {
              keys: ["Enter"],
              description:
                "Selects the row and opens or closes it if it is a branch. Follows the link on link rows.",
            },
            {
              keys: ["Space"],
              description:
                "Selects the row, adds or removes it in multiple mode, or checks it with checkboxes.",
            },
            {
              keys: ["Shift + ↑", "Shift + ↓"],
              description: "Extends the selection in multiple mode.",
            },
            {
              keys: ["Cmd/Ctrl + A"],
              description: "Selects every visible row in multiple mode.",
            },
            {
              keys: ["*"],
              description: "Opens every branch at the focused row’s level.",
            },
            {
              keys: ["a–z"],
              description:
                "Moves focus to the next row whose name starts with the typed letters.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsParagraph>
          The tree follows the WAI-ARIA tree view pattern. Each row is the{" "}
          <DocsCode>treeitem</DocsCode> and owns its group through{" "}
          <DocsCode>aria-owns</DocsCode>, so a row’s name is only its own label
          and link rows work as real links. Only one row is in the tab order at
          a time. When a branch closes around the focused row, focus moves to
          that branch instead of getting lost.
        </DocsParagraph>
        <DocsParagraph>
          Closed groups stay in the page, so the browser’s find-in-page opens
          the folders around a match, and checking a branch sees every item
          inside it. Give the tree an <DocsCode>aria-label</DocsCode>.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Branches open and close with the Base UI collapsible.{" "}
          <DocsCode>{"<TreeItem />"}</DocsCode> and{" "}
          <DocsCode>{"<TreeGroup />"}</DocsCode> accept the props of the parts
          they wrap.
        </DocsParagraph>
        <DocsSection title="Tree" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "variant",
                type: '"default" | "lines" | "connectors"',
                default: '"default"',
              },
              { name: "size", type: '"default" | "sm"', default: '"default"' },
              {
                name: "selectionMode",
                type: '"none" | "single" | "multiple"',
                default: '"single"',
              },
              { name: "selectedValues", type: "string[]" },
              { name: "defaultSelectedValues", type: "string[]" },
              {
                name: "onSelectedValuesChange",
                type: "(values: string[]) => void",
              },
              { name: "expandedValues", type: "string[]" },
              { name: "defaultExpandedValues", type: "string[]" },
              {
                name: "onExpandedValuesChange",
                type: "(values: string[]) => void",
              },
              {
                name: "checkboxes",
                type: "boolean",
                default: "false",
                description:
                  "Show cascading checkboxes. Rows are checked instead of selected.",
              },
              {
                name: "checkedValues",
                type: "string[]",
                description:
                  "Checked items. A branch in the list counts as checking its children.",
              },
              { name: "defaultCheckedValues", type: "string[]" },
              {
                name: "onCheckedValuesChange",
                type: "(values: string[]) => void",
                description:
                  "Called with every checked leaf and every fully checked branch.",
              },
              { name: "disabled", type: "boolean", default: "false" },
              {
                name: "hiddenUntilFound",
                type: "boolean",
                default: "true",
                description:
                  "Let find-in-page open closed branches around a match.",
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="tree"',
                description: "Target the root in CSS.",
              },
              { name: "data-variant", description: "The current variant." },
              { name: "data-size", description: "The current size." },
              {
                name: "--tree-row-height",
                description: "Row height. Larger on touch screens.",
              },
              {
                name: "--tree-indent",
                description: "How far each level is indented.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="TreeItem" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "value",
                type: "string",
                description: "Required. Unique within the tree.",
              },
              { name: "disabled", type: "boolean", default: "false" },
              {
                name: "onExpandedChange",
                type: "(expanded: boolean) => void",
                description: "Called when this item opens or closes.",
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="tree-item"',
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
            ]}
          />
        </DocsSection>
        <DocsSection title="TreeItemLabel" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "icon",
                type: "ReactNode",
                description: "Shown before the label.",
              },
              {
                name: "expandedIcon",
                type: "ReactNode",
                description: "Crossfades in for icon while the branch is open.",
              },
              {
                name: "meta",
                type: "ReactNode",
                description:
                  "Shown at the end of the row, such as a size, count or status.",
              },
              {
                name: "className",
                type: "string",
              },
              { name: "render", type: renderType, default: "<div>" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="tree-item-label"',
                description: "Target rows in CSS.",
              },
              { name: "data-value", description: "The item’s value." },
              {
                name: "data-expanded",
                description: "Present when the branch is open.",
              },
              {
                name: "data-selected",
                description: "Present when the row is selected.",
              },
              {
                name: "data-checked",
                description: "Present when the row is checked.",
              },
              {
                name: "data-indeterminate",
                description: "Present when only some children are checked.",
              },
              {
                name: "data-disabled",
                description: "Present when the item is disabled.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="TreeGroup" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "className",
                type: "string",
                description:
                  "Applied to the inner wrapper, so padding never fights the height animation.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="tree-group"',
                description: "Target groups in CSS.",
              },
              {
                name: "data-open",
                description: "Present when the group is open.",
              },
              {
                name: "data-starting-style",
                description: "Present while the group animates in.",
              },
              {
                name: "data-ending-style",
                description: "Present while the group animates out.",
              },
              {
                name: "--collapsible-panel-height",
                description:
                  "The group’s measured height, used for the height animation.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
