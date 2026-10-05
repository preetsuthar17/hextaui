import { KbdGroup } from "@/components/ui/kbd"

export function KbdVariants() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <KbdGroup keys="mod+c" />
      <KbdGroup keys="mod+c" variant="flat" />
    </div>
  )
}
