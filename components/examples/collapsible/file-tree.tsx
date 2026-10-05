import { IconChevronRight, IconFile, IconFolder } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  CollapsibleTriggerIcon,
} from "@/components/ui/collapsible"

type TreeNode = { name: string; children?: TreeNode[] }

const tree: TreeNode[] = [
  {
    name: "components",
    children: [
      {
        name: "ui",
        children: [
          { name: "button.tsx" },
          { name: "collapsible.tsx" },
          { name: "card.tsx" },
        ],
      },
      { name: "theme-provider.tsx" },
    ],
  },
  { name: "app", children: [{ name: "layout.tsx" }, { name: "page.tsx" }] },
  { name: "package.json" },
]

function TreeItem({ node }: { node: TreeNode }) {
  if (!node.children) {
    return (
      <li className="flex h-8 items-center gap-2 ps-8 text-sm">
        <IconFile className="size-4 text-muted-foreground" />
        {node.name}
      </li>
    )
  }

  return (
    <li>
      <Collapsible defaultOpen={node.name === "components"}>
        <CollapsibleTrigger
          render={<Button variant="ghost" size="sm" />}
          className="w-full justify-start"
        >
          <CollapsibleTriggerIcon>
            <IconChevronRight className="transition-transform duration-200 ease-out-cubic group-data-panel-open/collapsible-trigger:rotate-90 motion-reduce:transition-none rtl:-scale-x-100 rtl:group-data-panel-open/collapsible-trigger:-rotate-90" />
          </CollapsibleTriggerIcon>
          <IconFolder className="text-muted-foreground" />
          {node.name}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ul className="ms-4 border-s ps-1">
            {node.children.map((child) => (
              <TreeItem key={child.name} node={child} />
            ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </li>
  )
}

export function CollapsibleFileTree() {
  return (
    <ul className="w-64">
      {tree.map((node) => (
        <TreeItem key={node.name} node={node} />
      ))}
    </ul>
  )
}
