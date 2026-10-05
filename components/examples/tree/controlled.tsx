"use client"

import * as React from "react"
import { IconFile, IconFolder, IconFolderOpen } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Tree, TreeGroup, TreeItem, TreeItemLabel } from "@/components/ui/tree"

type Node = { id: string; name: string; children?: Node[] }

const nodes: Node[] = [
  {
    id: "src",
    name: "src",
    children: [
      {
        id: "hooks",
        name: "hooks",
        children: [
          { id: "use-media", name: "use-media.ts" },
          { id: "use-copy", name: "use-copy.ts" },
        ],
      },
      { id: "main", name: "main.tsx" },
    ],
  },
  {
    id: "tests",
    name: "tests",
    children: [{ id: "smoke", name: "smoke.test.ts" }],
  },
]

function branchIds(items: Node[]): string[] {
  return items.flatMap((item) =>
    item.children ? [item.id, ...branchIds(item.children)] : []
  )
}

function renderNodes(items: Node[]): React.ReactNode {
  return items.map((item) =>
    item.children ? (
      <TreeItem key={item.id} value={item.id}>
        <TreeItemLabel icon={<IconFolder />} expandedIcon={<IconFolderOpen />}>
          {item.name}
        </TreeItemLabel>
        <TreeGroup>{renderNodes(item.children)}</TreeGroup>
      </TreeItem>
    ) : (
      <TreeItem key={item.id} value={item.id}>
        <TreeItemLabel icon={<IconFile />}>{item.name}</TreeItemLabel>
      </TreeItem>
    )
  )
}

export function TreeControlled() {
  const [expanded, setExpanded] = React.useState<string[]>(["src"])
  const [selected, setSelected] = React.useState<string[]>([])

  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExpanded(branchIds(nodes))}
        >
          Expand all
        </Button>
        <Button variant="outline" size="sm" onClick={() => setExpanded([])}>
          Collapse all
        </Button>
      </div>
      <Tree
        aria-label="Source"
        expandedValues={expanded}
        onExpandedValuesChange={setExpanded}
        selectedValues={selected}
        onSelectedValuesChange={setSelected}
      >
        {renderNodes(nodes)}
      </Tree>
      <p className="text-sm text-muted-foreground">
        Selected: {selected[0] ?? "none"}
      </p>
    </div>
  )
}
