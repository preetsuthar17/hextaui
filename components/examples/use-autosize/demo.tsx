"use client"

import * as React from "react"

import { useAutosize } from "@/hooks/use-autosize"

export function UseAutosizeDemo() {
  const ref = React.useRef<HTMLTextAreaElement>(null)
  useAutosize(ref, true, undefined)

  return (
    <textarea
      ref={ref}
      rows={1}
      aria-label="Note"
      placeholder="Write a note. It grows up to six lines."
      className="max-h-[calc(6lh+1rem)] min-h-[calc(1lh+1rem)] w-full max-w-sm resize-none rounded-lg bg-muted px-3 py-2 text-sm/6 outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden pointer-coarse:text-touch"
    />
  )
}
