import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerSlider,
} from "@/components/ui/ui-sdk-color-picker"

function UiSdkColorPickerVertical() {
  return (
    <ColorPicker aria-label="Highlight" space="hsl" defaultValue="#f97316">
      <div className="flex gap-3">
        <div className="min-w-0 flex-1">
          <ColorPickerArea />
        </div>
        <ColorPickerSlider channel="hue" orientation="vertical" />
        <ColorPickerSlider channel="alpha" orientation="vertical" />
      </div>
    </ColorPicker>
  )
}

export { UiSdkColorPickerVertical }
