import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/components/ui/ui-sdk-segmented-control"

const sizes = ["sm", "default", "lg"] as const

function UiSdkSegmentedControlSizes() {
  return (
    <div className="flex flex-col items-center gap-4">
      {sizes.map((size) => (
        <SegmentedControl
          key={size}
          aria-label={`Effort, ${size}`}
          size={size}
          defaultValue="balanced"
        >
          <SegmentedControlItem value="fast">Fast</SegmentedControlItem>
          <SegmentedControlItem value="balanced">Balanced</SegmentedControlItem>
          <SegmentedControlItem value="thorough">Thorough</SegmentedControlItem>
        </SegmentedControl>
      ))}
    </div>
  )
}

export { UiSdkSegmentedControlSizes }
