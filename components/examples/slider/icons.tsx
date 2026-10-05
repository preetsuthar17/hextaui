import { IconVolume, IconVolume3 } from "@tabler/icons-react"

import { Slider } from "@/components/ui/slider"

export function SliderIcons() {
  return (
    <div className="flex w-full max-w-xs items-center gap-3 text-muted-foreground">
      <IconVolume3 className="size-4 shrink-0" aria-hidden />
      <Slider defaultValue={50} aria-label="Volume" />
      <IconVolume className="size-4 shrink-0" aria-hidden />
    </div>
  )
}
