import { Kbd, KbdGroup } from "@/components/ui/kbd"

const rows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"]

export function KbdListen() {
  return (
    <KbdGroup listen size="lg" className="flex-col">
      {rows.map((row) => (
        <span key={row} className="flex gap-1">
          {row.split("").map((key) => (
            <Kbd key={key}>{key.toUpperCase()}</Kbd>
          ))}
        </span>
      ))}
      <span className="flex gap-1">
        <Kbd keys="shift" />
        <Kbd keys="space" className="min-w-40" />
        <Kbd keys="enter" />
      </span>
    </KbdGroup>
  )
}
