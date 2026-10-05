import { KbdGroup } from "@/components/ui/kbd"

const sizes = ["sm", "default", "lg"] as const

export function KbdSizes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      {sizes.map((size) => (
        <KbdGroup key={size} keys="mod+shift+z" size={size} />
      ))}
    </div>
  )
}
