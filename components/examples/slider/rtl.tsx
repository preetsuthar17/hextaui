import { Slider, SliderLabel, SliderValue } from "@/components/ui/slider"

export function SliderRtl() {
  return (
    <div dir="rtl" className="flex w-full max-w-xs flex-col gap-8">
      <Slider defaultValue={65} locale="ar-EG">
        <SliderLabel>مستوى الصوت</SliderLabel>
        <SliderValue />
      </Slider>
      <Slider defaultValue={[20, 70]} locale="ar-EG" draggableRange>
        <SliderLabel>النطاق</SliderLabel>
        <SliderValue />
      </Slider>
    </div>
  )
}
