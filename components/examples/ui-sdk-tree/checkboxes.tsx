"use client"

import * as React from "react"

import {
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemCheckbox,
  TreeItemIndicator,
  TreeItemLabel,
  type TreeItemData,
} from "@/components/ui/ui-sdk-tree"

const items: TreeItemData[] = [
  {
    value: "frontend",
    label: "Frontend",
    children: [
      { value: "react", label: "React" },
      { value: "vue", label: "Vue" },
      { value: "svelte", label: "Svelte" },
    ],
  },
  {
    value: "backend",
    label: "Backend",
    children: [
      { value: "node", label: "Node" },
      {
        value: "databases",
        label: "Databases",
        children: [
          { value: "postgres", label: "Postgres" },
          { value: "sqlite", label: "SQLite" },
        ],
      },
    ],
  },
]

function Items({ items }: { items: TreeItemData[] }) {
  return items.map((item) => (
    <TreeItem key={item.value} value={item.value}>
      <TreeItemLabel>
        {item.children && <TreeItemIndicator />}
        <TreeItemCheckbox />
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

function UiSdkTreeCheckboxes() {
  const [checked, setChecked] = React.useState(["react", "postgres"])

  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <Tree
        aria-label="Stack"
        items={items}
        mode="none"
        checkable
        checked={checked}
        onCheckedChange={setChecked}
        defaultExpanded={["frontend", "backend", "databases"]}
      >
        <Items items={items} />
      </Tree>
      <p className="text-sm text-muted-foreground">
        {checked.length > 0 ? checked.join(", ") : "Nothing checked"}
      </p>
    </div>
  )
}

export { UiSdkTreeCheckboxes }
