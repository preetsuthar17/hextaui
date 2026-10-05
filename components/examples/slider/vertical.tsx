import { Slider } from "@/components/ui/slider"

const bands = [
  { label: "60 Hz", value: 70 },
  { label: "250 Hz", value: 45 },
  { label: "1 kHz", value: 55 },
  { label: "4 kHz", value: 80 },
  { label: "16 kHz", value: 35 },
]

export function SliderVertical() {
  return (
    <div className="flex h-48 gap-6">
      {bands.map((band) => (
        <div key={band.label} className="flex flex-col items-center gap-3">
          <Slider
            orientation="vertical"
            defaultValue={band.value}
            aria-label={band.label}
          />
          <span className="text-xs text-muted-foreground tabular-nums">
            {band.label}
          </span>
        </div>
      ))}
    </div>
  )
}
