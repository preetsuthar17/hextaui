import {
  IconBrandTypescript,
  IconFileText,
  IconFolder,
  IconFolderOpen,
} from "@tabler/icons-react"

import {
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemIndicator,
  TreeItemLabel,
  type TreeItemData,
} from "@/components/ui/ui-sdk-tree"

const files: TreeItemData[] = [
  {
    value: "app",
    label: "app",
    children: [
      { value: "app/layout.tsx", label: "layout.tsx" },
      { value: "app/page.tsx", label: "page.tsx" },
      { value: "app/globals.css", label: "globals.css" },
    ],
  },
  {
    value: "components",
    label: "components",
    children: [
      {
        value: "components/ui",
        label: "ui",
        children: [
          { value: "components/ui/button.tsx", label: "button.tsx" },
          { value: "components/ui/tree.tsx", label: "tree.tsx" },
        ],
      },
      { value: "components/theme.tsx", label: "theme.tsx" },
    ],
  },
  { value: "package.json", label: "package.json" },
  { value: "README.md", label: "README.md" },
]

function Items({ items }: { items: TreeItemData[] }) {
  return items.map((item) => (
    <TreeItem key={item.value} value={item.value}>
      <TreeItemLabel>
        {item.children ? (
          <>
            <TreeItemIndicator />
            <IconFolder className="group-data-expanded/tree-label:hidden" />
            <IconFolderOpen className="not-group-data-expanded/tree-label:hidden" />
          </>
        ) : item.label.endsWith(".tsx") ? (
          <IconBrandTypescript />
        ) : (
          <IconFileText />
        )}
        <span>{item.label}</span>
      </TreeItemLabel>
      {item.children && (
        <TreeGroup>
          <Items items={item.children} />
        </TreeGroup>
      )}
    </TreeItem>
  ))
}

function UiSdkTreeDemo() {
  return (
    <Tree
      aria-label="Project files"
      items={files}
      defaultExpanded={["components", "components/ui"]}
      defaultValue="components/ui/tree.tsx"
      className="max-w-xs"
    >
      <Items items={files} />
    </Tree>
  )
}

export { UiSdkTreeDemo }
