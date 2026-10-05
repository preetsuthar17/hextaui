"use client"

import * as React from "react"

import { Input } from "@/components/ui/input"
import { Kbd } from "@/components/ui/kbd"
import {
  formatHotkey,
  matchesHotkey,
  parseHotkey,
  spokenKey,
  useIsApple,
} from "@/lib/hotkey"

export function HotkeyDemo() {
  const [hotkey, setHotkey] = React.useState("mod+shift+k")
  const [pressed, setPressed] = React.useState(0)
  const apple = useIsApple()
  const chord = parseHotkey(hotkey)[0] ?? []

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        !matchesHotkey(event, hotkey)
      ) {
        return
      }
      event.preventDefault()
      setPressed((count) => count + 1)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [hotkey])

  const rows = [
    ["Apple", formatHotkey(hotkey, true)],
    ["Windows and Linux", formatHotkey(hotkey, false)],
    ["Screen readers", chord.map((key) => spokenKey(key, apple)).join(" ")],
    ["parseHotkey", JSON.stringify(parseHotkey(hotkey))],
  ]

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Input
        aria-label="Hotkey"
        value={hotkey}
        onChange={(event) => setHotkey(event.target.value)}
        spellCheck={false}
        autoCapitalize="off"
      />
      <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-2 text-sm">
        {rows.map(([label, value]) => (
          <React.Fragment key={label}>
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="truncate font-mono">{value}</dd>
          </React.Fragment>
        ))}
      </dl>
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        Click outside the field and press <Kbd keys={hotkey} />
        <span className="ms-auto font-mono tabular-nums">
          matched {pressed}×
        </span>
      </p>
    </div>
  )
}
