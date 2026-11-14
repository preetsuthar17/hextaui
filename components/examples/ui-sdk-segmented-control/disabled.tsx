import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/components/ui/ui-sdk-segmented-control"

function UiSdkSegmentedControlDisabled() {
  return (
    <div className="flex flex-col items-center gap-4">
      <SegmentedControl aria-label="Theme" defaultValue="system" disabled>
        <SegmentedControlItem value="light">Light</SegmentedControlItem>
        <SegmentedControlItem value="dark">Dark</SegmentedControlItem>
        <SegmentedControlItem value="system">System</SegmentedControlItem>
      </SegmentedControl>
      <SegmentedControl aria-label="Model" defaultValue="mini">
        <SegmentedControlItem value="mini">Mini</SegmentedControlItem>
        <SegmentedControlItem value="standard">Standard</SegmentedControlItem>
        <SegmentedControlItem value="pro" disabled>
          Pro
        </SegmentedControlItem>
      </SegmentedControl>
    </div>
  )
}

export { UiSdkSegmentedControlDisabled }
