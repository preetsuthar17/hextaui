"use client"

import * as React from "react"
import { IconMicrophone, IconMicrophoneOff } from "@tabler/icons-react"

import { Toggle } from "@/components/ui/toggle"

export function ToggleControlled() {
  const [muted, setMuted] = React.useState(false)

  return (
    <div className="flex items-center gap-3 text-sm">
      <Toggle
        variant="outline"
        aria-label="Mute microphone"
        pressed={muted}
        onPressedChange={setMuted}
      >
        {muted ? <IconMicrophoneOff /> : <IconMicrophone />}
      </Toggle>
      <span className="text-muted-foreground">
        Microphone is {muted ? "muted" : "on"}
      </span>
    </div>
  )
}
