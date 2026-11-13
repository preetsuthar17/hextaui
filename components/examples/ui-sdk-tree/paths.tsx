"use client"

import * as React from "react"
import { IconLoader2 } from "@tabler/icons-react"

import {
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemIndicator,
  TreeItemLabel,
  treeFromPaths,
  type TreeItemData,
} from "@/components/ui/ui-sdk-tree"

const paths = [
  "src/index.ts",
  "src/lib/format.ts",
  "src/lib/parse.ts",
  "src/routes/home.tsx",
  "src/routes/about.tsx",
  "tests/",
  "package.json",
  "tsconfig.json",
]

const items = treeFromPaths(paths)
const files = new Set(paths.filter((path) => !path.endsWith("/")))

function Items({ items }: { items: TreeItemData[] }) {
  return items.map((item) => (
    <TreeItem key={item.value} value={item.value}>
      <TreeItemLabel>
        {(state) => (
          <>
            {item.children && <TreeItemIndicator />}
            <span>{item.label}</span>
            {state.pending && (
              <IconLoader2 className="ms-auto motion-safe:animate-spin" />
            )}
          </>
        )}
      </TreeItemLabel>
      {item.children && item.children.length > 0 && (
        <TreeGroup>
          <Items items={item.children} />
        </TreeGroup>
      )}
    </TreeItem>
  ))
}

function UiSdkTreePaths() {
  const [opened, setOpened] = React.useState<string | null>(null)

  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <Tree
        aria-label="Project"
        paths={paths}
        defaultExpanded={["src"]}
        defaultValue="src/index.ts"
        activation="automatic"
        onAction={async (value) => {
          if (!files.has(value)) {
            return
          }
          await new Promise((resolve) => setTimeout(resolve, 600))
          setOpened(value)
        }}
      >
        <Items items={items} />
      </Tree>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {opened ? `Opened ${opened}` : "Press Enter to open a file."}
      </p>
    </div>
  )
}

export { UiSdkTreePaths }
