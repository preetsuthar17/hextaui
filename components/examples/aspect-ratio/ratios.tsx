import {
  AspectRatio,
  type AspectRatioValue,
} from "@/components/ui/aspect-ratio"

const ratios: { label: string; ratio: AspectRatioValue }[] = [
  { label: "16 / 9", ratio: 16 / 9 },
  { label: "1", ratio: 1 },
  { label: '"4/3"', ratio: "4/3" },
  { label: '"21:9"', ratio: "21:9" },
]

export function AspectRatioRatios() {
  return (
    <div className="grid w-full max-w-md grid-cols-2 gap-3">
      {ratios.map(({ label, ratio }) => (
        <div key={label} className="flex flex-col gap-1.5">
          <AspectRatio ratio={ratio} className="rounded-lg">
            <img src="/preview/landscape.svg" alt="Sunset over mountains" />
          </AspectRatio>
          <span className="font-mono text-xs text-muted-foreground">
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
