import { Tree, type TreeItemData } from "@/components/ui/ui-sdk-tree"

const items: TreeItemData[] = [
  {
    value: "fruit",
    label: "Fruit",
    children: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
      { value: "cherry", label: "Cherry" },
    ],
  },
  {
    value: "vegetables",
    label: "Vegetables",
    children: [
      { value: "carrot", label: "Carrot" },
      { value: "leek", label: "Leek" },
    ],
  },
  { value: "bread", label: "Bread" },
]

function UiSdkTreeData() {
  return (
    <Tree
      aria-label="Groceries"
      items={items}
      defaultExpanded={["fruit"]}
      className="max-w-xs"
    />
  )
}

export { UiSdkTreeData }
