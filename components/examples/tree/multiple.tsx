"use client"

import * as React from "react"
import { IconFile, IconFolder, IconFolderOpen } from "@tabler/icons-react"

import { Tree, TreeGroup, TreeItem, TreeItemLabel } from "@/components/ui/tree"

const photos = ["beach.jpg", "city.jpg", "forest.jpg", "mountains.jpg"]
const documents = ["invoice.pdf", "notes.md", "resume.pdf"]

export function TreeMultiple() {
  const [selected, setSelected] = React.useState<string[]>(["city.jpg"])

  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <Tree
        aria-label="Library"
        selectionMode="multiple"
        selectedValues={selected}
        onSelectedValuesChange={setSelected}
        defaultExpandedValues={["photos", "documents"]}
      >
        <TreeItem value="photos">
          <TreeItemLabel
            icon={<IconFolder />}
            expandedIcon={<IconFolderOpen />}
          >
            Photos
          </TreeItemLabel>
          <TreeGroup>
            {photos.map((name) => (
              <TreeItem key={name} value={name}>
                <TreeItemLabel icon={<IconFile />}>{name}</TreeItemLabel>
              </TreeItem>
            ))}
          </TreeGroup>
        </TreeItem>
        <TreeItem value="documents">
          <TreeItemLabel
            icon={<IconFolder />}
            expandedIcon={<IconFolderOpen />}
          >
            Documents
          </TreeItemLabel>
          <TreeGroup>
            {documents.map((name) => (
              <TreeItem key={name} value={name}>
                <TreeItemLabel icon={<IconFile />}>{name}</TreeItemLabel>
              </TreeItem>
            ))}
          </TreeGroup>
        </TreeItem>
      </Tree>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {selected.length === 0
          ? "Nothing selected"
          : `${selected.length} selected`}
      </p>
    </div>
  )
}
