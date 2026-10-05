import { AspectRatio } from "@/components/ui/aspect-ratio"

export function AspectRatioRtl() {
  return (
    <div dir="rtl" className="w-full max-w-md">
      <AspectRatio ratio={16 / 9} className="rounded-lg">
        <img src="/preview/landscape.svg" alt="غروب الشمس فوق الجبال" />
        <span className="absolute start-3 top-3 rounded-md bg-background/80 px-2 py-1 text-xs">
          جديد
        </span>
      </AspectRatio>
    </div>
  )
}
