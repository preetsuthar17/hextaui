import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerInput,
  ColorPickerSlider,
  ColorPickerSwatch,
} from "@/components/ui/ui-sdk-color-picker"

function UiSdkColorPickerAlpha() {
  return (
    <ColorPicker
      aria-label="Overlay color"
      space="hsl"
      defaultValue="hsl(262 83% 58% / 0.6)"
    >
      <ColorPickerArea />
      <ColorPickerSlider channel="hue" />
      <ColorPickerSlider channel="alpha" />
      <div className="flex items-center gap-2">
        <ColorPickerSwatch />
        <ColorPickerInput aria-label="HSL" />
      </div>
    </ColorPicker>
  )
}

export { UiSdkColorPickerAlpha }
