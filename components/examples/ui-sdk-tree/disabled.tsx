import { Tree, type TreeItemData } from "@/components/ui/ui-sdk-tree"

const items: TreeItemData[] = [
  {
    value: "workspace",
    label: "Workspace",
    children: [
      { value: "general", label: "General" },
      { value: "billing", label: "Billing", disabled: true },
      { value: "members", label: "Members" },
    ],
  },
  { value: "danger", label: "Danger zone", disabled: true },
]

function UiSdkTreeDisabled() {
  return (
    <Tree
      aria-label="Settings"
      items={items}
      defaultExpanded={["workspace"]}
      defaultValue="general"
      className="max-w-xs"
    />
  )
}

export { UiSdkTreeDisabled }
