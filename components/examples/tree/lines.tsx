import { IconFile, IconFolder, IconFolderOpen } from "@tabler/icons-react"

import { Tree, TreeGroup, TreeItem, TreeItemLabel } from "@/components/ui/tree"

type Node = { name: string; children?: Node[] }

const files: Node[] = [
  {
    name: "packages",
    children: [
      {
        name: "core",
        children: [
          {
            name: "src",
            children: [
              { name: "index.ts" },
              { name: "store.ts" },
              {
                name: "utils",
                children: [{ name: "clamp.ts" }, { name: "debounce.ts" }],
              },
            ],
          },
          { name: "package.json" },
        ],
      },
      {
        name: "react",
        children: [{ name: "index.tsx" }, { name: "package.json" }],
      },
    ],
  },
  { name: "turbo.json" },
]

function renderNodes(nodes: Node[], parent = ""): React.ReactNode {
  return nodes.map((node) => {
    const value = `${parent}/${node.name}`
    return node.children ? (
      <TreeItem key={value} value={value}>
        <TreeItemLabel icon={<IconFolder />} expandedIcon={<IconFolderOpen />}>
          {node.name}
        </TreeItemLabel>
        <TreeGroup>{renderNodes(node.children, value)}</TreeGroup>
      </TreeItem>
    ) : (
      <TreeItem key={value} value={value}>
        <TreeItemLabel icon={<IconFile />}>{node.name}</TreeItemLabel>
      </TreeItem>
    )
  })
}

export function TreeLines() {
  return (
    <Tree
      aria-label="Monorepo"
      variant="lines"
      defaultExpandedValues={[
        "/packages",
        "/packages/core",
        "/packages/core/src",
        "/packages/core/src/utils",
      ]}
      defaultSelectedValues={["/packages/core/src/utils/clamp.ts"]}
      className="w-full max-w-xs"
    >
      {renderNodes(files)}
    </Tree>
  )
}
