import { IconPackage } from "@tabler/icons-react"

import { Tree, TreeGroup, TreeItem, TreeItemLabel } from "@/components/ui/tree"

type Dependency = { name: string; version: string; dependencies?: Dependency[] }

const dependencies: Dependency[] = [
  {
    name: "next",
    version: "16.3.8",
    dependencies: [
      { name: "@next/env", version: "16.3.8" },
      {
        name: "postcss",
        version: "8.5.6",
        dependencies: [
          { name: "nanoid", version: "3.3.11" },
          { name: "picocolors", version: "1.1.1" },
          { name: "source-map-js", version: "1.2.1" },
        ],
      },
      { name: "styled-jsx", version: "5.1.7" },
    ],
  },
  {
    name: "react-dom",
    version: "19.3.0",
    dependencies: [{ name: "scheduler", version: "0.27.0" }],
  },
]

function renderDependencies(items: Dependency[], parent = ""): React.ReactNode {
  return items.map((item) => {
    const value = `${parent}/${item.name}`
    return (
      <TreeItem key={value} value={value}>
        <TreeItemLabel icon={<IconPackage />} meta={item.version}>
          {item.name}
        </TreeItemLabel>
        {item.dependencies ? (
          <TreeGroup>{renderDependencies(item.dependencies, value)}</TreeGroup>
        ) : null}
      </TreeItem>
    )
  })
}

export function TreeConnectors() {
  return (
    <Tree
      aria-label="Dependencies"
      variant="connectors"
      selectionMode="none"
      defaultExpandedValues={["/next", "/next/postcss", "/react-dom"]}
      className="w-full max-w-xs"
    >
      {renderDependencies(dependencies)}
    </Tree>
  )
}
