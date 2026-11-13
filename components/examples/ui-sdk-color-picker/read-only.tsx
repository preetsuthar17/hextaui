import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerInput,
  ColorPickerSlider,
  ColorPickerSwatch,
} from "@/components/ui/ui-sdk-color-picker"

function UiSdkColorPickerReadOnly() {
  return (
    <ColorPicker aria-label="Theme color" defaultValue="#22c55e" readOnly>
      <ColorPickerArea />
      <ColorPickerSlider channel="hue" />
      <div className="flex items-center gap-2">
        <ColorPickerSwatch />
        <ColorPickerInput aria-label="Hex" />
      </div>
    </ColorPicker>
  )
}

export { UiSdkColorPickerReadOnly }
