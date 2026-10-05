import { IconFile, IconFolder, IconLock } from "@tabler/icons-react"

import { Tree, TreeGroup, TreeItem, TreeItemLabel } from "@/components/ui/tree"

export function TreeDisabled() {
  return (
    <Tree
      aria-label="Shared drive"
      defaultExpandedValues={["team"]}
      className="w-full max-w-xs"
    >
      <TreeItem value="team">
        <TreeItemLabel icon={<IconFolder />}>Team</TreeItemLabel>
        <TreeGroup>
          <TreeItem value="roadmap">
            <TreeItemLabel icon={<IconFile />}>roadmap.md</TreeItemLabel>
          </TreeItem>
          <TreeItem value="salaries" disabled>
            <TreeItemLabel icon={<IconLock />}>salaries.xlsx</TreeItemLabel>
          </TreeItem>
          <TreeItem value="notes">
            <TreeItemLabel icon={<IconFile />}>notes.md</TreeItemLabel>
          </TreeItem>
        </TreeGroup>
      </TreeItem>
      <TreeItem value="archive" disabled>
        <TreeItemLabel icon={<IconLock />}>Archive</TreeItemLabel>
        <TreeGroup>
          <TreeItem value="2024">
            <TreeItemLabel icon={<IconFile />}>2024.zip</TreeItemLabel>
          </TreeItem>
        </TreeGroup>
      </TreeItem>
    </Tree>
  )
}
