import {
  IconLayoutAlignBottom,
  IconLayoutAlignMiddle,
  IconLayoutAlignTop,
} from "@tabler/icons-react"

import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/components/ui/ui-sdk-segmented-control"

function UiSdkSegmentedControlVertical() {
  return (
    <SegmentedControl
      aria-label="Vertical alignment"
      orientation="vertical"
      defaultValue="middle"
    >
      <SegmentedControlItem value="top">
        <IconLayoutAlignTop aria-hidden="true" />
        Top
      </SegmentedControlItem>
      <SegmentedControlItem value="middle">
        <IconLayoutAlignMiddle aria-hidden="true" />
        Middle
      </SegmentedControlItem>
      <SegmentedControlItem value="bottom">
        <IconLayoutAlignBottom aria-hidden="true" />
        Bottom
      </SegmentedControlItem>
    </SegmentedControl>
  )
}

export { UiSdkSegmentedControlVertical }
