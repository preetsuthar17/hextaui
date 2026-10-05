"use client"

import * as React from "react"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"

export function AspectRatioSlowLoad() {
  const [src, setSrc] = React.useState<string | undefined>(undefined)
  const [attempt, setAttempt] = React.useState(0)

  React.useEffect(() => {
    const timer = setTimeout(
      () => setSrc(`/preview/landscape.svg?v=${attempt}`),
      1500
    )
    return () => clearTimeout(timer)
  }, [attempt])

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <AspectRatio ratio={16 / 9} className="rounded-xl">
        <img src={src} alt="Sunset over mountains" />
      </AspectRatio>
      <Button
        variant="outline"
        size="sm"
        className="self-start"
        onClick={() => {
          setSrc(undefined)
          setAttempt(attempt + 1)
        }}
      >
        Reload
      </Button>
    </div>
  )
}
