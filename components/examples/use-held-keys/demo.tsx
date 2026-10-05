"use client"

import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { useHeldKeys } from "@/hooks/use-held-keys"

export function UseHeldKeysDemo() {
  const held = useHeldKeys(true)

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex h-8 items-center">
        {held.size > 0 ? (
          <KbdGroup>
            {[...held].map((key) => (
              <Kbd key={key} keys={key} size="lg" />
            ))}
          </KbdGroup>
        ) : (
          <span className="text-sm text-muted-foreground">
            Hold down any keys
          </span>
        )}
      </div>
      <code className="font-mono text-xs text-muted-foreground">
        {JSON.stringify([...held])}
      </code>
    </div>
  )
}
