"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  createTreeController,
  Tree,
  type TreeItemData,
} from "@/components/ui/ui-sdk-tree"

const items: TreeItemData[] = [
  {
    value: "design",
    label: "Design",
    children: [
      { value: "tokens", label: "Tokens" },
      {
        value: "icons",
        label: "Icons",
        children: [
          { value: "outline", label: "Outline" },
          { value: "filled", label: "Filled" },
        ],
      },
    ],
  },
  {
    value: "engineering",
    label: "Engineering",
    children: [
      { value: "api", label: "API" },
      { value: "web", label: "Web" },
    ],
  },
]

function UiSdkTreeController() {
  const [tree] = React.useState(createTreeController)

  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => tree.expandAll()}>
          Expand all
        </Button>
        <Button variant="outline" size="sm" onClick={() => tree.collapseAll()}>
          Collapse all
        </Button>
        <Button variant="ghost" size="sm" onClick={() => tree.reveal("filled")}>
          Reveal Filled
        </Button>
      </div>
      <Tree aria-label="Teams" items={items} controller={tree} />
    </div>
  )
}

export { UiSdkTreeController }
