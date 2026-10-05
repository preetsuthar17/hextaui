"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { KbdGroup } from "@/components/ui/kbd"

const shortcuts = [
  { label: "Search", keys: "mod+k" },
  { label: "New file", keys: "mod+n" },
  { label: "Toggle sidebar", keys: "mod+b" },
  { label: "Command palette", keys: "mod+shift+p" },
  { label: "Select all", keys: "mod+a" },
]

function ShortcutsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shortcuts</CardTitle>
        <CardDescription>Press them. The keys light up.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-3">
          {shortcuts.map((shortcut) => (
            <li
              key={shortcut.keys}
              className="flex items-center justify-between gap-4"
            >
              <span className="text-muted-foreground">{shortcut.label}</span>
              <KbdGroup keys={shortcut.keys} listen />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export { ShortcutsCard }
