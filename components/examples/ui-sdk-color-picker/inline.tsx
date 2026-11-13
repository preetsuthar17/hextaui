import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerInput,
  ColorPickerSlider,
  ColorPickerSwatch,
} from "@/components/ui/ui-sdk-color-picker"

function UiSdkColorPickerInline() {
  return (
    <ColorPicker aria-label="Brand color" defaultValue="#0ea5e9">
      <ColorPickerArea />
      <ColorPickerSlider channel="hue" />
      <div className="flex items-center gap-2">
        <ColorPickerSwatch />
        <ColorPickerInput aria-label="Hex" />
      </div>
    </ColorPicker>
  )
}

export { UiSdkColorPickerInline }
