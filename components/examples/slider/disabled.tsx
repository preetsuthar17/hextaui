import { Slider, SliderLabel, SliderValue } from "@/components/ui/slider"

export function SliderDisabled() {
  return (
    <Slider defaultValue={30} disabled className="max-w-xs">
      <SliderLabel>Bass boost</SliderLabel>
      <SliderValue />
    </Slider>
  )
}
