"use client"

import * as React from "react"

import { Tree, type TreeItemData } from "@/components/ui/ui-sdk-tree"

const items: TreeItemData[] = [
  {
    value: "inbox",
    label: "Inbox",
    children: [
      { value: "updates", label: "Updates" },
      { value: "forums", label: "Forums" },
      { value: "promotions", label: "Promotions" },
    ],
  },
  {
    value: "projects",
    label: "Projects",
    children: [
      { value: "website", label: "Website" },
      { value: "mobile", label: "Mobile app" },
    ],
  },
  { value: "archive", label: "Archive" },
  { value: "trash", label: "Trash" },
]

function UiSdkTreeMultiple() {
  const [value, setValue] = React.useState(["updates", "website"])

  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <Tree
        aria-label="Folders"
        items={items}
        mode="multiple"
        value={value}
        onValueChange={setValue}
        expandOnPress={false}
        defaultExpanded={["inbox", "projects"]}
      />
      <p className="text-sm text-muted-foreground">{value.length} selected</p>
    </div>
  )
}

export { UiSdkTreeMultiple }
