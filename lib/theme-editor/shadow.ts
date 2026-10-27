import { clamp, formatOklch, round, type Oklch } from "@/lib/theme-editor/color"

type ThemeShadow = {
  color: Oklch
  opacity: number
  blur: number
  spread: number
  x: number
  y: number
}

const shadowSizes = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl"] as const

type ShadowSize = (typeof shadowSizes)[number]

type Layer = { y: number; blur: number; spread: number; alpha: number }

const shadowLayers: Record<ShadowSize, Layer[]> = {
  "2xs": [{ y: 1, blur: 0, spread: 0, alpha: 0.5 }],
  xs: [{ y: 1, blur: 2 / 3, spread: 0, alpha: 0.5 }],
  sm: [
    { y: 1, blur: 1, spread: 0, alpha: 1 },
    { y: 1, blur: 2 / 3, spread: -1, alpha: 1 },
  ],
  md: [
    { y: 4, blur: 2, spread: -1, alpha: 1 },
    { y: 2, blur: 4 / 3, spread: -2, alpha: 1 },
  ],
  lg: [
    { y: 10, blur: 5, spread: -3, alpha: 1 },
    { y: 4, blur: 2, spread: -4, alpha: 1 },
  ],
  xl: [
    { y: 20, blur: 25 / 3, spread: -5, alpha: 1 },
    { y: 8, blur: 10 / 3, spread: -6, alpha: 1 },
  ],
  "2xl": [{ y: 25, blur: 50 / 3, spread: -12, alpha: 2.5 }],
}

const defaultShadow: ThemeShadow = {
  color: { l: 0, c: 0, h: 0, a: 1 },
  opacity: 0.1,
  blur: 3,
  spread: 0,
  x: 0,
  y: 1,
}

const shadowLimits = {
  opacity: [0, 1],
  blur: [0, 24],
  spread: [-12, 12],
  x: [-12, 12],
  y: [-12, 12],
} as const

function px(value: number) {
  const rounded = round(value, 2)
  return rounded === 0 ? "0" : `${rounded}px`
}

function shadowParts(shadow: ThemeShadow, size: ShadowSize) {
  return shadowLayers[size].map((layer) => ({
    x: round(shadow.x * layer.y, 2),
    y: round(shadow.y * layer.y, 2),
    blur: round(shadow.blur * layer.blur, 2),
    spread: round(shadow.spread + layer.spread, 2),
    alpha: round(clamp(shadow.opacity * layer.alpha, 0, 1), 3),
  }))
}

function shadowValue(shadow: ThemeShadow, size: ShadowSize) {
  const color = formatOklch({ ...shadow.color, a: 1 })
  return shadowParts(shadow, size)
    .map((part) =>
      [
        px(part.x),
        px(part.y),
        px(part.blur),
        px(part.spread),
        color.replace(/\)$/, ` / ${part.alpha})`),
      ].join(" ")
    )
    .join(", ")
}

function shadowScale(shadow: ThemeShadow) {
  return Object.fromEntries(
    shadowSizes.map((size) => [size, shadowValue(shadow, size)])
  ) as Record<ShadowSize, string>
}

function sameShadow(a: ThemeShadow, b: ThemeShadow) {
  return (
    formatOklch(a.color) === formatOklch(b.color) &&
    round(a.opacity, 2) === round(b.opacity, 2) &&
    a.blur === b.blur &&
    a.spread === b.spread &&
    a.x === b.x &&
    a.y === b.y
  )
}

function parseLength(value: string) {
  const match = /^(-?\d*\.?\d+)(px|rem)?$/.exec(value.trim())
  if (!match) return null
  const number = Number.parseFloat(match[1])
  return match[2] === "rem" ? number * 16 : number
}

export {
  defaultShadow,
  parseLength,
  sameShadow,
  shadowLimits,
  shadowParts,
  shadowScale,
  shadowSizes,
  shadowValue,
  type ShadowSize,
  type ThemeShadow,
}
