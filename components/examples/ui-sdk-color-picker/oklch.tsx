import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerAreaCanvas,
  ColorPickerAreaThumb,
  ColorPickerInput,
  ColorPickerSlider,
  ColorPickerSwatch,
} from "@/components/ui/ui-sdk-color-picker"

function UiSdkColorPickerOklch() {
  return (
    <ColorPicker
      aria-label="Accent"
      space="oklch"
      defaultValue="oklch(0.62 0.19 259)"
    >
      <ColorPickerArea>
        <ColorPickerAreaCanvas />
        <ColorPickerAreaThumb />
      </ColorPickerArea>
      <ColorPickerSlider channel="hue" />
      <div className="flex items-center gap-2">
        <ColorPickerSwatch />
        <ColorPickerInput aria-label="OKLCH" />
      </div>
    </ColorPicker>
  )
}

export { UiSdkColorPickerOklch }
