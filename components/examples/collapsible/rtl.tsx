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

export function CollapsibleRtl() {
  return (
    <div dir="rtl" className="flex w-full max-w-sm flex-col gap-8">
      <Collapsible className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4 ps-4">
          <h4 className="text-sm font-semibold">المستودعات المميزة</h4>
          <CollapsibleTrigger
            render={<Button variant="ghost" size="icon-sm" />}
            aria-label="إظهار المستودعات"
          >
            <CollapsibleTriggerIcon />
          </CollapsibleTrigger>
        </div>
        <div className="rounded-md border px-4 py-2 font-mono text-sm">
          <span dir="ltr">@radix-ui/primitives</span>
        </div>
        <CollapsibleContent className="flex flex-col gap-2">
          <div className="rounded-md border px-4 py-2 font-mono text-sm">
            <span dir="ltr">@base-ui/react</span>
          </div>
          <div className="rounded-md border px-4 py-2 font-mono text-sm">
            <span dir="ltr">@tabler/icons</span>
          </div>
        </CollapsibleContent>
      </Collapsible>
      <ul className="w-64">
        {tree.map((node) => (
          <TreeItem key={node.name} node={node} />
        ))}
      </ul>
    </div>
  )
}
