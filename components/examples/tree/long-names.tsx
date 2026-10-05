import { IconFile, IconFolder, IconFolderOpen } from "@tabler/icons-react"

import { Tree, TreeGroup, TreeItem, TreeItemLabel } from "@/components/ui/tree"

const longFolder = "quarterly-financial-reports-and-board-presentations"
const longFile = "2026-q3-consolidated-revenue-forecast-final-v12-approved.xlsx"
const unbroken = "averyveryverylongfilenamewithoutanyspacesoranybreaks.txt"

export function TreeLongNames() {
  return (
    <Tree
      aria-label="Reports"
      variant="lines"
      defaultExpandedValues={["reports"]}
      className="w-full max-w-56"
    >
      <TreeItem value="reports">
        <TreeItemLabel
          icon={<IconFolder />}
          expandedIcon={<IconFolderOpen />}
          title={longFolder}
        >
          {longFolder}
        </TreeItemLabel>
        <TreeGroup>
          <TreeItem value="forecast">
            <TreeItemLabel icon={<IconFile />} meta="2.4 MB" title={longFile}>
              {longFile}
            </TreeItemLabel>
          </TreeItem>
          <TreeItem value="unbroken">
            <TreeItemLabel icon={<IconFile />} title={unbroken}>
              {unbroken}
            </TreeItemLabel>
          </TreeItem>
        </TreeGroup>
      </TreeItem>
    </Tree>
  )
}
