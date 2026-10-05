import { Slider, SliderLabel, SliderValue } from "@/components/ui/slider"

export function SliderDemo() {
  return (
    <Slider defaultValue={60} className="max-w-xs">
      <SliderLabel>Volume</SliderLabel>
      <SliderValue />
    </Slider>
  )
}
