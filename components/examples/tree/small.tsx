import { IconHash, IconVolume } from "@tabler/icons-react"

import { Tree, TreeGroup, TreeItem, TreeItemLabel } from "@/components/ui/tree"

export function TreeSmall() {
  return (
    <Tree
      aria-label="Channels"
      size="sm"
      defaultExpandedValues={["text", "voice"]}
      defaultSelectedValues={["general"]}
      className="w-full max-w-56"
    >
      <TreeItem value="text">
        <TreeItemLabel>Text channels</TreeItemLabel>
        <TreeGroup>
          <TreeItem value="general">
            <TreeItemLabel icon={<IconHash />} meta="12">
              general
            </TreeItemLabel>
          </TreeItem>
          <TreeItem value="design">
            <TreeItemLabel icon={<IconHash />}>design</TreeItemLabel>
          </TreeItem>
          <TreeItem value="releases">
            <TreeItemLabel icon={<IconHash />} meta="3">
              releases
            </TreeItemLabel>
          </TreeItem>
        </TreeGroup>
      </TreeItem>
      <TreeItem value="voice">
        <TreeItemLabel>Voice channels</TreeItemLabel>
        <TreeGroup>
          <TreeItem value="lounge">
            <TreeItemLabel icon={<IconVolume />}>Lounge</TreeItemLabel>
          </TreeItem>
        </TreeGroup>
      </TreeItem>
    </Tree>
  )
}
