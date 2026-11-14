import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/components/ui/ui-sdk-segmented-control"

function UiSdkSegmentedControlRtl() {
  return (
    <div dir="rtl" lang="ar">
      <SegmentedControl aria-label="العرض" defaultValue="list">
        <SegmentedControlItem value="list">قائمة</SegmentedControlItem>
        <SegmentedControlItem value="grid">شبكة</SegmentedControlItem>
        <SegmentedControlItem value="board">لوحة</SegmentedControlItem>
      </SegmentedControl>
    </div>
  )
}

export { UiSdkSegmentedControlRtl }
