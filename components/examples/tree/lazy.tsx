"use client"

import * as React from "react"
import { IconFile, IconFolder, IconFolderOpen } from "@tabler/icons-react"

import { Spinner } from "@/components/ui/spinner"
import { Tree, TreeGroup, TreeItem, TreeItemLabel } from "@/components/ui/tree"

function listFiles(folder: string) {
  return new Promise<string[]>((resolve) =>
    setTimeout(
      () => resolve([`${folder}-1.log`, `${folder}-2.log`, `${folder}-3.log`]),
      900
    )
  )
}

function RemoteFolder({ name }: { name: string }) {
  const [files, setFiles] = React.useState<string[] | null>(null)
  const loading = React.useRef(false)

  return (
    <TreeItem
      value={name}
      onExpandedChange={(expanded) => {
        if (expanded && files === null && !loading.current) {
          loading.current = true
          listFiles(name).then(setFiles)
        }
      }}
    >
      <TreeItemLabel icon={<IconFolder />} expandedIcon={<IconFolderOpen />}>
        {name}
      </TreeItemLabel>
      <TreeGroup aria-busy={files === null}>
        {files === null ? (
          <TreeItem value={`${name}/loading`} disabled>
            <TreeItemLabel icon={<Spinner size="sm" label="Loading files" />}>
              Loading…
            </TreeItemLabel>
          </TreeItem>
        ) : (
          files.map((file) => (
            <TreeItem key={file} value={`${name}/${file}`}>
              <TreeItemLabel icon={<IconFile />}>{file}</TreeItemLabel>
            </TreeItem>
          ))
        )}
      </TreeGroup>
    </TreeItem>
  )
}

export function TreeLazy() {
  return (
    <Tree aria-label="Server logs" className="w-full max-w-xs">
      <RemoteFolder name="api" />
      <RemoteFolder name="worker" />
      <RemoteFolder name="cron" />
    </Tree>
  )
}
