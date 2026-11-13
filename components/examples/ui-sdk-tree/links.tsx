"use client"

import * as React from "react"

import { Tree, type TreeItemData } from "@/components/ui/ui-sdk-tree"

const pages: TreeItemData[] = [
  {
    value: "getting-started",
    label: "Getting started",
    children: [
      { value: "introduction", label: "Introduction", href: "#introduction" },
      { value: "installation", label: "Installation", href: "#installation" },
    ],
  },
  {
    value: "components",
    label: "Components",
    children: [
      { value: "accordion", label: "Accordion", href: "#accordion" },
      { value: "dialog", label: "Dialog", href: "#dialog" },
      { value: "tree", label: "Tree", href: "#tree" },
    ],
  },
  { value: "changelog", label: "Changelog", href: "#changelog" },
]

function UiSdkTreeLinks() {
  const [current, setCurrent] = React.useState("tree")

  return (
    <Tree
      aria-label="Docs"
      items={pages}
      mode="none"
      current={current}
      onAction={(value, { event }) => {
        if (value === "getting-started" || value === "components") {
          return
        }
        event?.preventDefault()
        setCurrent(value)
      }}
      className="max-w-xs"
    />
  )
}

export { UiSdkTreeLinks }
