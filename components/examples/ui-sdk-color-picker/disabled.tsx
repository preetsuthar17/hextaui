import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerInput,
  ColorPickerSlider,
} from "@/components/ui/ui-sdk-color-picker"

function UiSdkColorPickerDisabled() {
  return (
    <ColorPicker aria-label="Brand color" defaultValue="#0ea5e9" disabled>
      <ColorPickerArea />
      <ColorPickerSlider channel="hue" />
      <ColorPickerInput aria-label="Hex" />
    </ColorPicker>
  )
}

export { UiSdkColorPickerDisabled }
