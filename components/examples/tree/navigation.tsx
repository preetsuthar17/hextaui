import Link from "next/link"

import { Tree, TreeGroup, TreeItem, TreeItemLabel } from "@/components/ui/tree"

const sections = [
  {
    value: "getting-started",
    title: "Getting started",
    pages: [{ value: "installation", title: "Installation" }],
  },
  {
    value: "components",
    title: "Components",
    pages: [
      { value: "accordion", title: "Accordion" },
      { value: "collapsible", title: "Collapsible" },
      { value: "tabs", title: "Tabs" },
      { value: "tree", title: "Tree" },
    ],
  },
]

const current = "tree"

export function TreeNavigation() {
  return (
    <nav aria-label="Docs" className="w-full max-w-60">
      <Tree
        aria-label="Docs pages"
        size="sm"
        selectedValues={[current]}
        defaultExpandedValues={["components"]}
      >
        {sections.map((section) => (
          <TreeItem key={section.value} value={section.value}>
            <TreeItemLabel>{section.title}</TreeItemLabel>
            <TreeGroup>
              {section.pages.map((page) => (
                <TreeItem key={page.value} value={page.value}>
                  <TreeItemLabel
                    render={<Link href={`/docs/${page.value}`} />}
                    aria-current={page.value === current ? "page" : undefined}
                  >
                    {page.title}
                  </TreeItemLabel>
                </TreeItem>
              ))}
            </TreeGroup>
          </TreeItem>
        ))}
      </Tree>
    </nav>
  )
}
