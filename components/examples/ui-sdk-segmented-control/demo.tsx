import { IconLayoutGrid, IconLayoutKanban, IconList } from "@tabler/icons-react"

import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/components/ui/ui-sdk-segmented-control"

function UiSdkSegmentedControlDemo() {
  return (
    <SegmentedControl aria-label="View" defaultValue="list">
      <SegmentedControlItem value="list">
        <IconList aria-hidden="true" />
        List
      </SegmentedControlItem>
      <SegmentedControlItem value="grid">
        <IconLayoutGrid aria-hidden="true" />
        Grid
      </SegmentedControlItem>
      <SegmentedControlItem value="board">
        <IconLayoutKanban aria-hidden="true" />
        Board
      </SegmentedControlItem>
    </SegmentedControl>
  )
}

export { UiSdkSegmentedControlDemo }
