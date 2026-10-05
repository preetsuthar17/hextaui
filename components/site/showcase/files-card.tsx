"use client"

import {
  IconBrandTypescript,
  IconFileText,
  IconFolder,
  IconFolderOpen,
  IconPhoto,
} from "@tabler/icons-react"

import { Card, CardContent } from "@/components/ui/card"
import { Tree, TreeGroup, TreeItem, TreeItemLabel } from "@/components/ui/tree"

function Folder({
  value,
  name,
  children,
}: {
  value: string
  name: string
  children: React.ReactNode
}) {
  return (
    <TreeItem value={value}>
      <TreeItemLabel icon={<IconFolder />} expandedIcon={<IconFolderOpen />}>
        {name}
      </TreeItemLabel>
      <TreeGroup>{children}</TreeGroup>
    </TreeItem>
  )
}

function File({
  value,
  name,
  icon = <IconBrandTypescript />,
  status,
}: {
  value: string
  name: string
  icon?: React.ReactNode
  status?: "M" | "U"
}) {
  return (
    <TreeItem value={value}>
      <TreeItemLabel
        icon={icon}
        meta={
          status ? (
            <span
              className={status === "M" ? "text-warning" : "text-success"}
              aria-label={status === "M" ? "Modified" : "Untracked"}
            >
              {status}
            </span>
          ) : null
        }
      >
        {name}
      </TreeItemLabel>
    </TreeItem>
  )
}

function FilesCard() {
  return (
    <Card size="sm">
      <CardContent>
        <Tree
          aria-label="Project files"
          defaultExpandedValues={["app", "components", "ui"]}
          defaultSelectedValues={["button"]}
        >
          <Folder value="app" name="app">
            <File value="layout" name="layout.tsx" />
            <File value="page" name="page.tsx" status="M" />
            <File value="globals" name="globals.css" icon={<IconFileText />} />
          </Folder>
          <Folder value="components" name="components">
            <Folder value="ui" name="ui">
              <File value="button" name="button.tsx" status="M" />
              <File value="number-flow" name="number-flow.tsx" />
              <File value="tree" name="tree.tsx" status="U" />
            </Folder>
          </Folder>
          <Folder value="public" name="public">
            <File value="og" name="og.png" icon={<IconPhoto />} />
          </Folder>
          <File value="readme" name="README.md" icon={<IconFileText />} />
        </Tree>
      </CardContent>
    </Card>
  )
}

export { FilesCard }
