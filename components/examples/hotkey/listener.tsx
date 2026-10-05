"use client"

import * as React from "react"

import { Kbd } from "@/components/ui/kbd"
import { matchesHotkey } from "@/lib/hotkey"

const shortcuts = [
  { hotkey: "mod+b", label: "Bold" },
  { hotkey: "mod+i", label: "Italic" },
  { hotkey: "mod+shift+x", label: "Strikethrough" },
]

export function HotkeyListener() {
  const [last, setLast] = React.useState<string>()

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const match = shortcuts.find((shortcut) =>
        matchesHotkey(event, shortcut.hotkey)
      )
      if (match) {
        event.preventDefault()
        setLast(match.label)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <ul className="flex flex-col gap-2 text-sm">
        {shortcuts.map((shortcut) => (
          <li
            key={shortcut.hotkey}
            data-active={last === shortcut.label ? "" : undefined}
            className="flex items-center justify-between rounded-md px-2 py-1 transition-colors duration-150 data-active:bg-muted"
          >
            {shortcut.label}
            <Kbd keys={shortcut.hotkey} />
          </li>
        ))}
      </ul>
      <p role="status" className="text-sm text-muted-foreground">
        {last ? `Matched ${last}` : "Press a shortcut"}
      </p>
    </div>
  )
}
