import type { WallAccent } from "@/lib/testimonial-wall/model"

const frameBackgrounds = [
  "none",
  "solid",
  "mist",
  "aurora",
  "graphite",
  "accent",
] as const
const framePaddings = ["sm", "md", "lg"] as const

type FrameBackground = (typeof frameBackgrounds)[number]
type FramePadding = (typeof framePaddings)[number]

type WallFrame = {
  background: FrameBackground
  padding: FramePadding
  heading: boolean
  title: string
}

const frameLimits = { title: 80 } as const

const defaultWallFrame: WallFrame = {
  background: "mist",
  padding: "md",
  heading: true,
  title: "Loved by builders",
}

const frameBackgroundLabels: Record<FrameBackground, string> = {
  none: "None",
  solid: "Solid",
  mist: "Mist",
  aurora: "Aurora",
  graphite: "Graphite",
  accent: "Accent",
}

const framePaddingLabels: Record<FramePadding, string> = {
  sm: "S",
  md: "M",
  lg: "L",
}

const accentVars: Record<WallAccent, string> = {
  neutral: "var(--foreground)",
  primary: "var(--primary)",
  info: "var(--info)",
  success: "var(--success)",
  warning: "var(--warning)",
}

const backgroundStyles: Record<
  Exclude<FrameBackground, "none" | "accent">,
  { light: string; dark: string }
> = {
  solid: {
    light: "linear-gradient(oklch(0.967 0.001 286), oklch(0.967 0.001 286))",
    dark: "linear-gradient(oklch(0.21 0.003 286), oklch(0.21 0.003 286))",
  },
  mist: {
    light:
      "radial-gradient(120% 80% at 0% 0%, oklch(0.95 0.025 250) 0%, transparent 60%), radial-gradient(100% 90% at 100% 100%, oklch(0.94 0.02 300) 0%, transparent 55%), linear-gradient(oklch(0.975 0.006 270), oklch(0.975 0.006 270))",
    dark: "radial-gradient(120% 80% at 0% 0%, oklch(0.27 0.035 255) 0%, transparent 60%), radial-gradient(100% 90% at 100% 100%, oklch(0.25 0.035 300) 0%, transparent 55%), linear-gradient(oklch(0.19 0.01 270), oklch(0.19 0.01 270))",
  },
  aurora: {
    light:
      "radial-gradient(90% 70% at 10% 0%, oklch(0.9 0.07 200) 0%, transparent 60%), radial-gradient(80% 70% at 90% 10%, oklch(0.9 0.07 310) 0%, transparent 60%), radial-gradient(90% 80% at 50% 110%, oklch(0.92 0.06 60) 0%, transparent 60%), linear-gradient(oklch(0.97 0.01 280), oklch(0.97 0.01 280))",
    dark: "radial-gradient(90% 70% at 10% 0%, oklch(0.33 0.08 200) 0%, transparent 60%), radial-gradient(80% 70% at 90% 10%, oklch(0.32 0.09 310) 0%, transparent 60%), radial-gradient(90% 80% at 50% 110%, oklch(0.3 0.07 50) 0%, transparent 60%), linear-gradient(oklch(0.18 0.015 280), oklch(0.18 0.015 280))",
  },
  graphite: {
    light:
      "radial-gradient(120% 90% at 50% 0%, oklch(0.34 0.006 286) 0%, oklch(0.2 0.004 286) 70%)",
    dark: "radial-gradient(120% 90% at 50% 0%, oklch(0.3 0.006 286) 0%, oklch(0.16 0.004 286) 70%)",
  },
}

function frameBackgroundStyle(
  background: FrameBackground,
  accent: WallAccent,
  dark: boolean
) {
  if (background === "none") return "none"
  if (background === "accent") {
    const color = accentVars[accent]
    return `radial-gradient(120% 90% at 50% 0%, color-mix(in oklab, ${color} ${dark ? 30 : 22}%, var(--background)) 0%, color-mix(in oklab, ${color} ${dark ? 8 : 6}%, var(--background)) 75%)`
  }
  return backgroundStyles[background][dark ? "dark" : "light"]
}

function frameIsDark(background: FrameBackground) {
  return background === "graphite"
}

function normalizeFrame(input: unknown): WallFrame {
  const value =
    input && typeof input === "object"
      ? (input as Partial<Record<keyof WallFrame, unknown>>)
      : {}
  const title =
    typeof value.title === "string"
      ? [...value.title.replace(/\s+/g, " ").trim()]
          .slice(0, frameLimits.title)
          .join("")
      : defaultWallFrame.title
  return {
    background: frameBackgrounds.includes(value.background as FrameBackground)
      ? (value.background as FrameBackground)
      : defaultWallFrame.background,
    padding: framePaddings.includes(value.padding as FramePadding)
      ? (value.padding as FramePadding)
      : defaultWallFrame.padding,
    heading:
      typeof value.heading === "boolean"
        ? value.heading
        : defaultWallFrame.heading,
    title,
  }
}

export {
  defaultWallFrame,
  frameBackgroundLabels,
  frameBackgroundStyle,
  frameBackgrounds,
  frameIsDark,
  frameLimits,
  framePaddingLabels,
  framePaddings,
  normalizeFrame,
  type FrameBackground,
  type FramePadding,
  type WallFrame,
}
