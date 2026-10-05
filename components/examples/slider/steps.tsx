import { Slider, SliderLabel, SliderValue } from "@/components/ui/slider"

export function SliderSteps() {
  return (
    <Slider
      defaultValue={1}
      min={0.5}
      max={2}
      step={0.25}
      largeStep={0.5}
      format={{ minimumFractionDigits: 2 }}
      className="max-w-xs"
    >
      <SliderLabel>Playback speed</SliderLabel>
      <SliderValue />
    </Slider>
  )
}
