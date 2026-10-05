import { Slider } from "@/components/ui/slider"

export function SliderValueBubble() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-10 pt-8">
      <Slider
        defaultValue={0.4}
        max={1}
        step={0.01}
        format={{ style: "percent" }}
        showValue
        aria-label="Opacity"
      />
      <Slider defaultValue={[30, 70]} showValue aria-label="Range" />
    </div>
  )
}
