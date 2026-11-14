import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/components/ui/ui-sdk-segmented-control"

function UiSdkSegmentedControlReadOnly() {
  return (
    <SegmentedControl aria-label="Plan" defaultValue="team" readOnly>
      <SegmentedControlItem value="solo">Solo</SegmentedControlItem>
      <SegmentedControlItem value="team">Team</SegmentedControlItem>
    </SegmentedControl>
  )
}

export { UiSdkSegmentedControlReadOnly }
