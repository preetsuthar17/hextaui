import {
  IconAlignCenter,
  IconAlignJustified,
  IconAlignLeft,
  IconAlignRight,
} from "@tabler/icons-react"

import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/components/ui/ui-sdk-segmented-control"

function UiSdkSegmentedControlIcons() {
  return (
    <SegmentedControl aria-label="Text alignment" defaultValue="left">
      <SegmentedControlItem value="left" aria-label="Align left">
        <IconAlignLeft aria-hidden="true" />
      </SegmentedControlItem>
      <SegmentedControlItem value="center" aria-label="Align center">
        <IconAlignCenter aria-hidden="true" />
      </SegmentedControlItem>
      <SegmentedControlItem value="right" aria-label="Align right">
        <IconAlignRight aria-hidden="true" />
      </SegmentedControlItem>
      <SegmentedControlItem value="justify" aria-label="Justify">
        <IconAlignJustified aria-hidden="true" />
      </SegmentedControlItem>
    </SegmentedControl>
  )
}

export { UiSdkSegmentedControlIcons }
