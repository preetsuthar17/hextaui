"use client"

import * as React from "react"
import {
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerSkipBack,
  IconPlayerSkipForward,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"

export function ButtonGroupPlayer() {
  const [playing, setPlaying] = React.useState(false)

  return (
    <ButtonGroup aria-label="Playback">
      <Button variant="secondary" size="icon" aria-label="Previous track">
        <IconPlayerSkipBack />
      </Button>
      <ButtonGroupSeparator />
      <Button
        variant="secondary"
        size="icon"
        aria-label={playing ? "Pause" : "Play"}
        aria-pressed={playing}
        onClick={() => setPlaying(!playing)}
      >
        {playing ? <IconPlayerPause /> : <IconPlayerPlay />}
      </Button>
      <ButtonGroupSeparator />
      <Button variant="secondary" size="icon" aria-label="Next track">
        <IconPlayerSkipForward />
      </Button>
    </ButtonGroup>
  )
}
