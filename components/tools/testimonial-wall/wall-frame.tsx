import * as React from "react"
import { cn } from "cn"

import {
  frameBackgroundStyle,
  frameIsDark,
  type FramePadding,
  type WallFrame as WallFrameState,
} from "@/lib/testimonial-wall/frame"
import type { WallAccent, WallOptions } from "@/lib/testimonial-wall/model"

const paddingClasses: Record<FramePadding, string> = {
  sm: "p-4 sm:p-8",
  md: "p-5 sm:p-12",
  lg: "p-6 sm:p-20",
}

function frameWidth(options: WallOptions) {
  if (options.layout === "featured") return "max-w-3xl"
  if (options.layout === "marquee") return "max-w-5xl"
  if (options.columns === 1) return "max-w-xl"
  if (options.columns === 2) return "max-w-4xl"
  return "max-w-6xl"
}

function WallFrame({
  ref,
  frame,
  options,
  accent,
  dark,
  children,
}: {
  ref?: React.Ref<HTMLDivElement>
  frame: WallFrameState
  options: WallOptions
  accent: WallAccent
  dark: boolean
  children: React.ReactNode
}) {
  const title = frame.heading ? frame.title.trim() : ""

  return (
    <div
      ref={ref}
      data-slot="testimonial-wall-frame"
      data-background={frame.background}
      className={cn(
        "w-full rounded-2xl bg-(image:--frame-background) text-foreground",
        paddingClasses[frame.padding],
        frameWidth(options),
        frameIsDark(frame.background) && "dark"
      )}
      style={
        {
          "--frame-background": frameBackgroundStyle(
            frame.background,
            accent,
            dark || frameIsDark(frame.background)
          ),
        } as React.CSSProperties
      }
    >
      {title ? (
        <h2 className="mb-6 text-center text-2xl font-semibold tracking-tight text-balance text-foreground sm:mb-8 sm:text-3xl">
          {title}
        </h2>
      ) : null}
      {children}
    </div>
  )
}

export { WallFrame }
