import { Slider } from "@/components/ui/slider"

export function SliderSizes() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-8">
      <Slider size="sm" defaultValue={25} aria-label="Small" />
      <Slider defaultValue={50} aria-label="Default" />
      <Slider size="lg" defaultValue={75} aria-label="Large" />
    </div>
  )
}
