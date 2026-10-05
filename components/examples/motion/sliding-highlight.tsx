"use client"

import * as React from "react"

import { useSlidingHighlight } from "@/lib/motion"

const views = ["Overview", "Activity", "Settings", "Billing"]

export function MotionSlidingHighlight() {
  const [view, setView] = React.useState(views[0])
  const barRef = React.useRef<HTMLDivElement>(null)
  const highlightRef = React.useRef<HTMLSpanElement>(null)
  useSlidingHighlight(barRef, highlightRef, "[data-active]", "data-active")

  return (
    <div
      ref={barRef}
      role="tablist"
      aria-label="Views"
      className="relative isolate flex rounded-lg bg-muted p-1"
    >
      <span
        ref={highlightRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 -z-1 rounded-md bg-background opacity-0 transition-all duration-300 ease-out-quint data-instant:transition-opacity data-visible:opacity-100 motion-reduce:transition-opacity"
      />
      {views.map((item) => (
        <button
          key={item}
          type="button"
          role="tab"
          aria-selected={item === view}
          data-active={item === view ? "" : undefined}
          onClick={() => setView(item)}
          className="h-8 rounded-md px-3 text-sm text-muted-foreground transition-colors duration-150 outline-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden data-active:text-foreground"
        >
          {item}
        </button>
      ))}
    </div>
  )
}
