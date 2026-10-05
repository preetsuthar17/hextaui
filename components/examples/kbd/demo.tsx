import { Kbd, KbdGroup } from "@/components/ui/kbd"

export function KbdDemo() {
  return (
    <div className="flex flex-col items-center gap-6 text-sm text-muted-foreground">
      <KbdGroup keys="mod+shift+p" size="lg" listen />
      <p>
        Press <Kbd keys="mod+k" listen /> to search, or hold{" "}
        <Kbd keys="shift" listen /> and watch the keys.
      </p>
    </div>
  )
}
