import { Tree, type TreeItemData } from "@/components/ui/ui-sdk-tree"

const items: TreeItemData[] = [
  {
    value: "src",
    label: "src",
    children: [
      {
        value: "src/components",
        label: "components",
        children: [
          { value: "src/components/header.tsx", label: "header.tsx" },
          { value: "src/components/footer.tsx", label: "footer.tsx" },
        ],
      },
      { value: "src/main.tsx", label: "main.tsx" },
    ],
  },
  { value: "vite.config.ts", label: "vite.config.ts" },
]

function UiSdkTreeLines() {
  return (
    <Tree
      aria-label="Source"
      items={items}
      variant="lines"
      size="sm"
      defaultExpanded={["src", "src/components"]}
      className="max-w-xs"
    />
  )
}

export { UiSdkTreeLines }
