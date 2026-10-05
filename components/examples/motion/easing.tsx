"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  duration,
  easeInOut,
  easeOut,
  easeSpring,
  prefersReducedMotion,
} from "@/lib/motion"

const curves = [
  { name: "easeOut", easing: easeOut },
  { name: "easeInOut", easing: easeInOut },
  { name: "easeSpring", easing: easeSpring },
]

export function MotionEasing() {
  const dots = React.useRef<(HTMLSpanElement | null)[]>([])
  const [forward, setForward] = React.useState(true)

  const play = () => {
    dots.current.forEach((dot) => {
      if (!dot) {
        return
      }
      const track = dot.parentElement?.clientWidth ?? 0
      const distance = track - dot.offsetWidth
      dot.animate(
        [
          { translate: `${forward ? 0 : distance}px 0` },
          { translate: `${forward ? distance : 0}px 0` },
        ],
        {
          duration: prefersReducedMotion() ? 0 : duration.morph * 2,
          easing: curves[dots.current.indexOf(dot)].easing,
          fill: "forwards",
        }
      )
    })
    setForward((value) => !value)
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      {curves.map((curve, index) => (
        <div key={curve.name} className="flex flex-col gap-1.5">
          <span className="font-mono text-xs text-muted-foreground">
            {curve.name}
          </span>
          <div dir="ltr" className="h-3 rounded-full bg-muted">
            <span
              ref={(node) => {
                dots.current[index] = node
              }}
              className="block size-3 rounded-full bg-foreground"
            />
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={play}>
        Play at {duration.morph * 2}ms
      </Button>
    </div>
  )
}
