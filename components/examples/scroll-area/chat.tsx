"use client"

import * as React from "react"

import { ScrollArea } from "@/components/ui/scroll-area"

export function ScrollAreaChat() {
  const viewportRef = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    const viewport = viewportRef.current
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight
    }
  }, [])

  return (
    <ScrollArea
      viewportRef={viewportRef}
      aria-label="Messages"
      className="h-56 w-full max-w-sm rounded-lg border"
    >
      <div className="flex flex-col gap-2 p-3 text-sm">
        {Array.from({ length: 24 }, (_, index) => (
          <p
            key={index}
            className={
              index % 3 === 0
                ? "self-end rounded-lg bg-primary px-3 py-2 text-primary-foreground"
                : "self-start rounded-lg bg-muted px-3 py-2"
            }
          >
            Message {index + 1}
          </p>
        ))}
      </div>
    </ScrollArea>
  )
}
