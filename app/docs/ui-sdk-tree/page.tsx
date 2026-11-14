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
import { UiSdkTreeCheckboxes } from "@/components/examples/ui-sdk-tree/checkboxes"
import { UiSdkTreeController } from "@/components/examples/ui-sdk-tree/controller"
import { UiSdkTreeData } from "@/components/examples/ui-sdk-tree/data"
import { UiSdkTreeDemo } from "@/components/examples/ui-sdk-tree/demo"
import { UiSdkTreeDisabled } from "@/components/examples/ui-sdk-tree/disabled"
import { UiSdkTreeFindInPage } from "@/components/examples/ui-sdk-tree/find-in-page"
import { UiSdkTreeLazy } from "@/components/examples/ui-sdk-tree/lazy"
import { UiSdkTreeLines } from "@/components/examples/ui-sdk-tree/lines"
import { UiSdkTreeLinks } from "@/components/examples/ui-sdk-tree/links"
import { UiSdkTreeMultiple } from "@/components/examples/ui-sdk-tree/multiple"
import { UiSdkTreePaths } from "@/components/examples/ui-sdk-tree/paths"
import { UiSdkTreeRtl } from "@/components/examples/ui-sdk-tree/rtl"
import { getDocsComponentMetadata } from "@/lib/docs-metadata"

export const metadata = getDocsComponentMetadata("ui-sdk-tree")

const layerCode = `@layer ui-sdk;

@import "tailwindcss";`

const importCode = `import {
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemIndicator,
  TreeItemLabel,
} from "@/components/ui/ui-sdk-tree"`

const usageCode = `<Tree aria-label="Project files">
  <TreeItem value="src">
    <TreeItemLabel>
      <TreeItemIndicator />
      <span>src</span>
    </TreeItemLabel>
    <TreeGroup>
      <TreeItem value="src/index.ts">
        <TreeItemLabel>
          <span>index.ts</span>
        </TreeItemLabel>
      </TreeItem>
    </TreeGroup>
  </TreeItem>
</Tree>`

const compositionCode = `Tree
└── TreeItem
    ├── TreeItemLabel
    │   ├── TreeItemIndicator
    │   └── TreeItemCheckbox
    └── TreeGroup
        └── TreeItem`

const renderType = "ReactElement | (props, state) => ReactElement"

export default function Page() {
  return (
    <DocsComponentPage slug="ui-sdk-tree">
      <DocsExample file="ui-sdk-tree/demo">
        <UiSdkTreeDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@ui-sdk/react@0.1.0-beta.2",
          "@ui-sdk/core@0.1.0-beta.2",
          "@tabler/icons-react",
          "class-variance-authority",
          "cn",
        ]}
        files={["components/ui/ui-sdk-tree.tsx"]}
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
          An item with a <DocsCode>TreeGroup</DocsCode> inside it is a branch.
          Give every item a unique <DocsCode>value</DocsCode> and the tree an
          accessible name. Focus stays on the item, and its label is the row you
          see, so selected, current and focused styles all land on the label.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="ui-sdk-tree/data"
          title="Items as data"
          description={
            <>
              Pass <DocsCode>items</DocsCode> and no children, and the tree
              renders styled rows with chevrons for you. Each item has a{" "}
              <DocsCode>value</DocsCode>, a <DocsCode>label</DocsCode> and
              optional <DocsCode>children</DocsCode>.
            </>
          }
        >
          <UiSdkTreeData />
        </DocsExample>
        <DocsExample
          file="ui-sdk-tree/paths"
          title="File paths"
          description={
            <>
              Pass <DocsCode>paths</DocsCode> for a file explorer, with folders
              first. With <DocsCode>{'activation="automatic"'}</DocsCode> the
              arrow keys select, and an <DocsCode>onAction</DocsCode> that
              returns a promise marks the row pending until it settles.
            </>
          }
        >
          <UiSdkTreePaths />
        </DocsExample>
        <DocsExample
          file="ui-sdk-tree/multiple"
          title="Multiple selection"
          description={
            <>
              With <DocsCode>{'mode="multiple"'}</DocsCode>, Cmd or Ctrl-click
              toggles an item and Shift extends a range.{" "}
              <DocsCode>{"expandOnPress={false}"}</DocsCode> leaves expanding to
              the chevron and the arrow keys.
            </>
          }
        >
          <UiSdkTreeMultiple />
        </DocsExample>
        <DocsExample
          file="ui-sdk-tree/checkboxes"
          title="Checkboxes"
          description={
            <>
              Add <DocsCode>checkable</DocsCode> and a{" "}
              <DocsCode>TreeItemCheckbox</DocsCode> in each label. Checking a
              branch checks everything in it, and a partly checked branch shows
              a dash.
            </>
          }
        >
          <UiSdkTreeCheckboxes />
        </DocsExample>
        <DocsExample
          file="ui-sdk-tree/links"
          title="Navigation"
          description={
            <>
              Items with an <DocsCode>href</DocsCode> render as links. With{" "}
              <DocsCode>{'mode="none"'}</DocsCode> and{" "}
              <DocsCode>current</DocsCode>, the current page gets{" "}
              <DocsCode>aria-current</DocsCode>, its parents open and it takes
              the tab stop.
            </>
          }
        >
          <UiSdkTreeLinks />
        </DocsExample>
        <DocsExample
          file="ui-sdk-tree/lazy"
          title="Loading children"
          description={
            <>
              Mark an item <DocsCode>branch</DocsCode> before its children
              exist, and <DocsCode>loadChildren</DocsCode> runs the first time
              it opens. The chevron turns into a spinner while it loads, and
              into a retry icon if it fails. Archive fails once.
            </>
          }
        >
          <UiSdkTreeLazy />
        </DocsExample>
        <DocsExample
          file="ui-sdk-tree/lines"
          title="Lines and small size"
          description={
            <>
              <DocsCode>{'variant="lines"'}</DocsCode> draws an indent guide for
              each open group, and <DocsCode>{'size="sm"'}</DocsCode> makes the
              rows shorter.
            </>
          }
        >
          <UiSdkTreeLines />
        </DocsExample>
        <DocsExample
          file="ui-sdk-tree/controller"
          title="Controller"
          description={
            <>
              A controller from <DocsCode>createTreeController()</DocsCode>{" "}
              expands, collapses, selects and reveals items from anywhere.
            </>
          }
        >
          <UiSdkTreeController />
        </DocsExample>
        <DocsExample
          file="ui-sdk-tree/find-in-page"
          title="Find in page"
          description={
            <>
              With <DocsCode>hiddenUntilFound</DocsCode>, closed groups stay in
              the page, so the browser’s Find in Page can match Phobos and open
              Mars to show it.
            </>
          }
        >
          <UiSdkTreeFindInPage />
        </DocsExample>
        <DocsExample
          file="ui-sdk-tree/disabled"
          title="Disabled"
          description="A disabled item can still take focus, so screen readers find it, but it can’t be selected, checked or opened."
        >
          <UiSdkTreeDisabled />
        </DocsExample>
        <DocsExample
          file="ui-sdk-tree/rtl"
          title="Right to left"
          description="Rows indent from the right, the chevron points left, and the Left and Right arrow keys swap."
        >
          <UiSdkTreeRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["↓", "↑"],
              description: "Moves to the next or previous visible item.",
            },
            {
              keys: ["→"],
              description: "Opens a branch, or moves to its first child.",
            },
            {
              keys: ["←"],
              description: "Closes a branch, or moves to its parent.",
            },
            {
              keys: ["Home", "End"],
              description: "Moves to the first or last visible item.",
            },
            {
              keys: ["Alt", "→"],
              description: "Opens a branch and everything inside it.",
            },
            {
              keys: ["*"],
              description: "Opens every branch beside the focused one.",
            },
            {
              keys: ["Enter"],
              description:
                "Selects the item and runs its action, or follows its link.",
            },
            {
              keys: ["Space"],
              description:
                "Checks the item when the tree is checkable, otherwise selects it.",
            },
            {
              keys: ["Shift", "↓"],
              description: "Extends a multiple selection.",
            },
            {
              keys: ["⌘", "A"],
              description: "Selects every visible item in multiple mode.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsParagraph>
          The tree follows the WAI-ARIA tree view pattern with one tab stop. Tab
          lands on the current page, the selected item or the first item. Typing
          a letter moves to the next item that starts with it. While a slow{" "}
          <DocsCode>onAction</DocsCode> runs, screen readers hear{" "}
          <DocsCode>pendingAnnouncement</DocsCode> after a second, so set it in
          your page’s language.
        </DocsParagraph>
        <DocsParagraph>
          Groups open and close by height only when motion is allowed. On touch
          screens rows are taller, and in forced colors mode the selected and
          current rows get an outline.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Each part wraps the UI SDK part of the same name and accepts all of
          its props, including <DocsCode>render</DocsCode> and a{" "}
          <DocsCode>className</DocsCode> that can be a function of the part’s
          state.
        </DocsParagraph>
        <DocsSection title="Tree" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "items",
                type: "TreeItemData[]",
                description:
                  "The whole hierarchy. Without children, the tree renders styled rows from it.",
              },
              {
                name: "paths",
                type: "string[]",
                description:
                  "File paths. Folders become branches; a path ending in / is an empty folder.",
              },
              {
                name: "mode",
                type: '"single" | "multiple" | "none"',
                default: '"single"',
              },
              { name: "value", type: "string | string[] | null" },
              { name: "defaultValue", type: "string | string[] | null" },
              {
                name: "onValueChange",
                type: "(value, details) => void",
              },
              {
                name: "activation",
                type: '"automatic" | "manual"',
                default: '"manual"',
              },
              { name: "expanded", type: "string[]" },
              { name: "defaultExpanded", type: "string[]" },
              { name: "onExpandedChange", type: "(expanded, details) => void" },
              { name: "expandOnPress", type: "boolean", default: "true" },
              { name: "checkable", type: "boolean", default: "false" },
              { name: "checked", type: "string[]" },
              { name: "defaultChecked", type: "string[]" },
              { name: "onCheckedChange", type: "(checked, details) => void" },
              {
                name: "checkStrategy",
                type: '"leaf" | "trunk" | "branch" | "independent"',
                default: '"leaf"',
              },
              {
                name: "onAction",
                type: "(value, details) => unknown",
                description:
                  "Runs on press or Enter. Return a promise to mark the item pending.",
              },
              { name: "pendingAnnouncement", type: "string" },
              {
                name: "loadChildren",
                type: "(value, { signal }) => Promise<unknown>",
              },
              { name: "current", type: "string | null" },
              { name: "disabled", type: "boolean", default: "false" },
              { name: "hiddenUntilFound", type: "boolean", default: "false" },
              { name: "keepMounted", type: "boolean", default: "false" },
              {
                name: "variant",
                type: '"default" | "lines"',
                default: '"default"',
              },
              { name: "size", type: '"default" | "sm"', default: '"default"' },
              {
                name: "controller",
                type: "TreeController",
                description: "From createTreeController().",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="tree"',
                description: "Target the tree in CSS.",
              },
              {
                name: "data-variant",
                description: "The variant: default or lines.",
              },
              { name: "data-size", description: "The size: default or sm." },
              {
                name: "--tree-row-height",
                description: "The height of each row, set by size.",
              },
              {
                name: "--tree-indent",
                description: "How far each level indents.",
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
                description: "Unique in the tree.",
              },
              {
                name: "branch",
                type: "boolean",
                description: "Set it for a branch whose children load later.",
              },
              { name: "disabled", type: "boolean", default: "false" },
              {
                name: "label",
                type: "string",
                description:
                  "The text typeahead matches, when the label isn’t plain text.",
              },
              { name: "render", type: renderType },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="tree-item"',
                description: "Target an item in CSS. It holds focus.",
              },
              { name: "data-level", description: "The depth, from 1." },
              { name: "data-branch", description: "Present on a branch." },
              {
                name: "data-expanded",
                description: "Present while a branch is open.",
              },
              {
                name: "--tree-level",
                description: "The depth, for indenting a flat list.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="TreeItemLabel" level={3}>
          <DocsPropsTable props={[{ name: "render", type: renderType }]} />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="tree-label"',
                description: "Target a row in CSS.",
              },
              {
                name: "data-selected",
                description: "Present while the item is selected.",
              },
              {
                name: "data-current",
                description: "Present on the current page’s item.",
              },
              {
                name: "data-expanded",
                description: "Present while a branch is open.",
              },
              {
                name: "data-pending",
                description: "Present while the item’s onAction runs.",
              },
              {
                name: "data-disabled",
                description: "Present when the item is disabled.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="TreeItemIndicator" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "children",
                type: "ReactNode | (state) => ReactNode",
                description:
                  "Defaults to a chevron, a spinner while loading and a retry icon after a failure.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="tree-indicator"',
                description: "Target the chevron in CSS.",
              },
              {
                name: "data-loading",
                description: "Present while children load.",
              },
              {
                name: "data-failed",
                description: "Present after children failed to load.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="TreeItemCheckbox" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "children",
                type: "ReactNode | (state) => ReactNode",
                description: "Defaults to a check, or a dash when mixed.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="tree-checkbox"',
                description: "Target the checkbox in CSS.",
              },
              { name: "data-checked", description: "Present while checked." },
              {
                name: "data-indeterminate",
                description: "Present while a branch is partly checked.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="TreeGroup" level={3}>
          <DocsPropsTable
            props={[
              { name: "keepMounted", type: "boolean" },
              { name: "hiddenUntilFound", type: "boolean" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="tree-group"',
                description: "Target a group in CSS.",
              },
              { name: "data-open", description: "Present while open." },
              {
                name: "--tree-group-height",
                description: "The group’s height while it animates.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
