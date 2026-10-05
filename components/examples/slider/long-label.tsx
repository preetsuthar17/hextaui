import { Slider, SliderLabel, SliderValue } from "@/components/ui/slider"

export function SliderLongLabel() {
  return (
    <Slider
      defaultValue={[1200, 48000]}
      min={0}
      max={50000}
      step={100}
      format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
      className="max-w-xs"
    >
      <SliderLabel>
        Annual household income before taxes, including side projects
      </SliderLabel>
      <SliderValue />
    </Slider>
  )
}
