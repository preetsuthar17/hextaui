import { IconFile, IconFolder, IconFolderOpen } from "@tabler/icons-react"

import { Tree, TreeGroup, TreeItem, TreeItemLabel } from "@/components/ui/tree"

export function TreeRtl() {
  return (
    <div dir="rtl" className="w-full max-w-xs">
      <Tree
        aria-label="المستندات"
        variant="connectors"
        defaultExpandedValues={["docs", "invoices"]}
        defaultSelectedValues={["march"]}
      >
        <TreeItem value="docs">
          <TreeItemLabel
            icon={<IconFolder />}
            expandedIcon={<IconFolderOpen />}
          >
            المستندات
          </TreeItemLabel>
          <TreeGroup>
            <TreeItem value="invoices">
              <TreeItemLabel
                icon={<IconFolder />}
                expandedIcon={<IconFolderOpen />}
              >
                الفواتير
              </TreeItemLabel>
              <TreeGroup>
                <TreeItem value="march">
                  <TreeItemLabel icon={<IconFile />} meta="١٢٠ ك.ب">
                    مارس.pdf
                  </TreeItemLabel>
                </TreeItem>
                <TreeItem value="april">
                  <TreeItemLabel icon={<IconFile />}>أبريل.pdf</TreeItemLabel>
                </TreeItem>
              </TreeGroup>
            </TreeItem>
            <TreeItem value="contract">
              <TreeItemLabel icon={<IconFile />}>العقد.docx</TreeItemLabel>
            </TreeItem>
          </TreeGroup>
        </TreeItem>
        <TreeItem value="notes">
          <TreeItemLabel icon={<IconFile />}>ملاحظات.txt</TreeItemLabel>
        </TreeItem>
      </Tree>
    </div>
  )
}
