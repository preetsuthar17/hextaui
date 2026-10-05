import { Kbd, KbdGroup } from "@/components/ui/kbd"

const shortcuts = [
  { label: "Command palette", keys: "mod+k" },
  { label: "Move line up", keys: "alt+up" },
  { label: "Close", keys: "escape" },
  { label: "Go to dashboard", keys: "g d" },
]

export function KbdShortcuts() {
  return (
    <dl className="grid w-full max-w-xs grid-cols-[1fr_auto] items-center gap-x-6 gap-y-3 text-sm">
      {shortcuts.map((shortcut) => (
        <div key={shortcut.keys} className="contents">
          <dt className="text-muted-foreground">{shortcut.label}</dt>
          <dd>
            <KbdGroup keys={shortcut.keys} />
          </dd>
        </div>
      ))}
      <dt className="text-muted-foreground">Save, as one cap</dt>
      <dd>
        <Kbd keys="mod+s" />
      </dd>
    </dl>
  )
}
