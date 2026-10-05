"use client"

import * as React from "react"
import { IconMinus, IconPlus } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"

export function ButtonGroupVertical() {
  const [zoom, setZoom] = React.useState(100)

  return (
    <div className="flex flex-wrap items-start justify-center gap-8">
      <div className="flex items-center gap-4">
        <ButtonGroup orientation="vertical" aria-label="Zoom">
          <Button
            variant="outline"
            size="icon"
            aria-label="Zoom in"
            disabled={zoom >= 200}
            onClick={() => setZoom((value) => Math.min(200, value + 25))}
          >
            <IconPlus />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Zoom out"
            disabled={zoom <= 25}
            onClick={() => setZoom((value) => Math.max(25, value - 25))}
          >
            <IconMinus />
          </Button>
        </ButtonGroup>
        <p className="text-sm text-muted-foreground tabular-nums">{zoom}%</p>
      </div>
      <ButtonGroup orientation="vertical" aria-label="Sort">
        <Button variant="outline">Newest first</Button>
        <Button variant="outline">Oldest first</Button>
        <Button variant="outline">Most discussed</Button>
      </ButtonGroup>
      <ButtonGroup orientation="vertical" aria-label="Position">
        <Button variant="secondary">Top</Button>
        <ButtonGroupSeparator />
        <Button variant="secondary">Bottom</Button>
      </ButtonGroup>
    </div>
  )
}
