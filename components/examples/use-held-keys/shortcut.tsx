"use client"

import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { useHeldKeys } from "@/hooks/use-held-keys"
import { useIsApple } from "@/lib/hotkey"

export function UseHeldKeysShortcut() {
  const held = useHeldKeys(true)
  const apple = useIsApple()
  const modifier = apple ? "meta" : "ctrl"
  const ready = held.has(modifier) && held.has("shift")

  return (
    <div className="flex flex-col items-center gap-3 text-sm">
      <KbdGroup>
        <Kbd keys="mod" listen />
        <Kbd keys="shift" listen />
        <Kbd keys="p" listen />
      </KbdGroup>
      <p className="text-muted-foreground">
        {ready ? "Now press P" : "Hold the modifiers to see the hint"}
      </p>
    </div>
  )
}
