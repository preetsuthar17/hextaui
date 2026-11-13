import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerInput,
  ColorPickerSlider,
  ColorPickerSwatch,
} from "@/components/ui/ui-sdk-color-picker"

function UiSdkColorPickerRtl() {
  return (
    <div dir="rtl" className="flex w-full justify-center">
      <ColorPicker aria-label="لون العلامة" defaultValue="#ec4899">
        <ColorPickerArea />
        <ColorPickerSlider channel="hue" />
        <div className="flex items-center gap-2">
          <ColorPickerSwatch />
          <ColorPickerInput aria-label="سداسي عشري" />
        </div>
      </ColorPicker>
    </div>
  )
}

export { UiSdkColorPickerRtl }
