"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { useMergedRef } from "@/hooks/use-merged-ref"

function MeasuredBox({
  ref,
  onWidth,
  ...props
}: React.ComponentProps<"div"> & { onWidth: (width: number) => void }) {
  const measureRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) {
        return
      }
      const observer = new ResizeObserver(([entry]) =>
        onWidth(Math.round(entry.contentRect.width))
      )
      observer.observe(node)
      return () => observer.disconnect()
    },
    [onWidth]
  )
  const setRef = useMergedRef(ref, measureRef)

  return <div ref={setRef} {...props} />
}

export function UseMergedRefDemo() {
  const ref = React.useRef<HTMLDivElement>(null)
  const [width, setWidth] = React.useState(0)
  const [wide, setWide] = React.useState(false)

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <MeasuredBox
        ref={ref}
        onWidth={setWidth}
        data-wide={wide ? "" : undefined}
        className="flex h-16 w-1/2 items-center justify-center rounded-lg bg-muted font-mono text-sm tabular-nums transition-all duration-300 ease-out-quint data-wide:w-full motion-reduce:transition-none"
      >
        {width}px
      </MeasuredBox>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => setWide((v) => !v)}>
          Resize
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            ref.current?.animate(
              [{ scale: 1 }, { scale: 0.96 }, { scale: 1 }],
              { duration: 240, easing: "ease-out" }
            )
          }
        >
          Nudge via parent ref
        </Button>
      </div>
    </div>
  )
}
