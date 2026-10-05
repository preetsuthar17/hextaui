"use client"

import * as React from "react"
import {
  IconArrowsShuffle,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconPlayerSkipBackFilled,
  IconPlayerSkipForwardFilled,
  IconRepeat,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Toggle } from "@/components/ui/toggle"
import { TooltipGroup, TooltipTrigger } from "@/components/ui/tooltip"

const length = 214

function clock(seconds: number) {
  const whole = Math.round(seconds)
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`
}

function PlayerCard() {
  const [playing, setPlaying] = React.useState(false)
  const [position, setPosition] = React.useState(72)

  React.useEffect(() => {
    if (!playing) {
      return
    }
    const timer = setInterval(
      () => setPosition((current) => (current >= length ? 0 : current + 1)),
      1000
    )
    return () => clearInterval(timer)
  }, [playing])

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-medium">Midnight Commit</span>
              <span className="truncate text-muted-foreground">
                The Refactors
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {playing ? "Now playing" : "Paused"}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <Slider
              value={position}
              onValueChange={setPosition}
              max={length}
              aria-label="Seek"
              getAriaValueText={(_, value) => clock(value)}
            />
            <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
              <span>{clock(position)}</span>
              <span>-{clock(length - position)}</span>
            </div>
          </div>
          <TooltipGroup>
            <div className="flex items-center justify-between">
              <TooltipTrigger
                content="Shuffle"
                render={<Toggle aria-label="Shuffle" size="sm" />}
              >
                <IconArrowsShuffle />
              </TooltipTrigger>
              <div className="flex items-center gap-1">
                <TooltipTrigger
                  content="Previous"
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Previous"
                      onClick={() => setPosition(0)}
                    />
                  }
                >
                  <IconPlayerSkipBackFilled />
                </TooltipTrigger>
                <Button
                  size="icon-lg"
                  aria-label={playing ? "Pause" : "Play"}
                  onClick={() => setPlaying(!playing)}
                >
                  {playing ? (
                    <IconPlayerPauseFilled />
                  ) : (
                    <IconPlayerPlayFilled />
                  )}
                </Button>
                <TooltipTrigger
                  content="Next"
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Next"
                      onClick={() => setPosition(0)}
                    />
                  }
                >
                  <IconPlayerSkipForwardFilled />
                </TooltipTrigger>
              </div>
              <TooltipTrigger
                content="Repeat"
                render={<Toggle aria-label="Repeat" size="sm" defaultPressed />}
              >
                <IconRepeat />
              </TooltipTrigger>
            </div>
          </TooltipGroup>
        </div>
      </CardContent>
    </Card>
  )
}

export { PlayerCard }
