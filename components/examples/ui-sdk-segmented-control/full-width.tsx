import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/components/ui/ui-sdk-segmented-control"

function UiSdkSegmentedControlFullWidth() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <p id="billing-period" className="m-0 text-sm font-medium">
        Billing period
      </p>
      <SegmentedControl
        aria-labelledby="billing-period"
        defaultValue="yearly"
        className="w-full"
      >
        <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
        <SegmentedControlItem value="yearly">Yearly</SegmentedControlItem>
      </SegmentedControl>
    </div>
  )
}

export { UiSdkSegmentedControlFullWidth }
