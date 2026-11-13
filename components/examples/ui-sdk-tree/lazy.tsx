"use client"

import * as React from "react"

import {
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemIndicator,
  TreeItemLabel,
} from "@/components/ui/ui-sdk-tree"

type Row = { value: string; label: string; branch?: boolean }

const top: Row[] = [
  { value: "users", label: "users", branch: true },
  { value: "orders", label: "orders", branch: true },
  { value: "archive", label: "archive", branch: true },
]

async function fetchRows(value: string, signal: AbortSignal, fail: boolean) {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, 800)
    signal.addEventListener("abort", () => {
      clearTimeout(timer)
      reject(signal.reason)
    })
  })
  if (fail) {
    throw new Error("Network error")
  }
  return Array.from({ length: 3 }, (_, index) => ({
    value: `${value}/${index + 1}`,
    label: `${value}_${index + 1}.json`,
  }))
}

function Items({
  items,
  loaded,
}: {
  items: Row[]
  loaded: Record<string, Row[]>
}) {
  return items.map((item) => (
    <TreeItem key={item.value} value={item.value} branch={item.branch}>
      <TreeItemLabel>
        {item.branch && <TreeItemIndicator />}
        <span>{item.label}</span>
      </TreeItemLabel>
      {loaded[item.value] && (
        <TreeGroup>
          <Items items={loaded[item.value]} loaded={loaded} />
        </TreeGroup>
      )}
    </TreeItem>
  ))
}

function UiSdkTreeLazy() {
  const [loaded, setLoaded] = React.useState<Record<string, Row[]>>({})
  const failed = React.useRef(false)

  return (
    <Tree
      aria-label="Database"
      loadChildren={async (value, { signal }) => {
        const fail = value === "archive" && !failed.current
        failed.current ||= fail
        const rows = await fetchRows(value, signal, fail)
        setLoaded((current) => ({ ...current, [value]: rows }))
      }}
      className="max-w-xs"
    >
      <Items items={top} loaded={loaded} />
    </Tree>
  )
}

export { UiSdkTreeLazy }
