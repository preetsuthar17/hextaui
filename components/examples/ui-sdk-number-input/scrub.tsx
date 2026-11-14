import {
  NumberInput,
  NumberInputControl,
  NumberInputGroup,
  NumberInputScrubArea,
  NumberInputScrubAreaCursor,
} from "@/components/ui/ui-sdk-number-input"

const fields = [
  { label: "X position", handle: "X", defaultValue: 120 },
  { label: "Y position", handle: "Y", defaultValue: 48 },
  { label: "Width", handle: "W", defaultValue: 320, min: 0 },
  { label: "Height", handle: "H", defaultValue: 240, min: 0 },
]

function UiSdkNumberInputScrub() {
  return (
    <div
      role="group"
      aria-labelledby="scrub-frame"
      className="flex w-full max-w-64 flex-col gap-2"
    >
      <p id="scrub-frame" className="m-0 text-xs font-medium">
        Frame
      </p>
      <div className="grid grid-cols-2 gap-2">
        {fields.map(({ label, handle, ...options }) => (
          <NumberInput key={label} {...options}>
            <NumberInputGroup variant="plain">
              <NumberInputScrubArea pixelsPerStep={1}>
                <span aria-hidden="true">{handle}</span>
                <NumberInputScrubAreaCursor />
              </NumberInputScrubArea>
              <NumberInputControl aria-label={label} />
            </NumberInputGroup>
          </NumberInput>
        ))}
      </div>
    </div>
  )
}

export { UiSdkNumberInputScrub }
