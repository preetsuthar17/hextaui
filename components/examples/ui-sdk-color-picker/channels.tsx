import {
  ColorPicker,
  ColorPickerChannelInput,
  ColorPickerEyeDropper,
  ColorPickerSwatch,
  ColorPickerSwatches,
  ColorPickerSwatchItem,
} from "@/components/ui/ui-sdk-color-picker"

const presets = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#0ea5e9",
  "#6366f1",
  "#a855f7",
  "#ec4899",
]

const channels = [
  { channel: "red", label: "R" },
  { channel: "green", label: "G" },
  { channel: "blue", label: "B" },
] as const

function UiSdkColorPickerChannels() {
  return (
    <ColorPicker
      aria-label="Label color"
      space="srgb"
      format="hex"
      defaultValue="#0ea5e9"
    >
      <ColorPickerSwatches aria-label="Presets">
        {presets.map((preset) => (
          <ColorPickerSwatchItem key={preset} value={preset} />
        ))}
      </ColorPickerSwatches>
      <div className="flex items-end gap-2">
        <ColorPickerSwatch />
        {channels.map(({ channel, label }) => (
          <label
            key={channel}
            className="flex min-w-0 flex-1 flex-col gap-1 text-xs text-muted-foreground"
          >
            {label}
            <ColorPickerChannelInput channel={channel} />
          </label>
        ))}
        <ColorPickerEyeDropper aria-label="Pick a color from the screen" />
      </div>
    </ColorPicker>
  )
}

export { UiSdkColorPickerChannels }
