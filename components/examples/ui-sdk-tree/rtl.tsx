import { Tree, type TreeItemData } from "@/components/ui/ui-sdk-tree"

const items: TreeItemData[] = [
  {
    value: "documents",
    label: "المستندات",
    children: [
      { value: "reports", label: "التقارير" },
      { value: "invoices", label: "الفواتير" },
    ],
  },
  {
    value: "photos",
    label: "الصور",
    children: [{ value: "trips", label: "الرحلات" }],
  },
  { value: "notes", label: "ملاحظات" },
]

function UiSdkTreeRtl() {
  return (
    <div dir="rtl" className="w-full max-w-xs">
      <Tree
        aria-label="الملفات"
        items={items}
        defaultExpanded={["documents"]}
        defaultValue="reports"
      />
    </div>
  )
}

export { UiSdkTreeRtl }
