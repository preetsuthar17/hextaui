import {
  clamp,
  formatOklch,
  normalizeHue,
  round,
  toGamut,
  type Oklch,
} from "@/lib/theme-editor/color"
import { ensureContrast, generateTheme } from "@/lib/theme-editor/generate"
import {
  checkContrast,
  cloneTheme,
  themeModes,
  type Theme,
  type ThemeMode,
} from "@/lib/theme-editor/theme"
import {
  contrastPairs,
  tokenNames,
  type TokenName,
} from "@/lib/theme-editor/tokens"

const scaleSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

const scaleLightness = [0.97, 0.932, 0.882, 0.809, 0.707, 0.623, 0.546, 0.488, 0.424, 0.379, 0.282]
const scaleChroma = [0.14, 0.24, 0.42, 0.66, 0.9, 1, 1, 0.92, 0.8, 0.66, 0.5]

const scaleFamilies: TokenName[] = [
  "primary",
  "secondary",
  "accent",
  "muted",
  "destructive",
  "success",
  "info",
  "warning",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
]

function colorScale(base: Oklch) {
  const peak = Math.max(base.c, 0.004)
  return scaleSteps.map((step, index) => ({
    step,
    color: toGamut({
      l: scaleLightness[index],
      c: base.c < 0.004 ? 0 : peak * scaleChroma[index],
      h: base.h,
      a: 1,
    }),
  }))
}

function scaleToCss(families: { name: string; base: Oklch }[]) {
  const lines = families.flatMap(({ name, base }) =>
    colorScale(base).map(
      ({ step, color }) => `  --color-${name}-${step}: ${formatOklch(color)};`
    )
  )
  return `@theme {\n${lines.join("\n")}\n}`
}

type HarmonyKind = "complementary" | "analogous" | "triadic" | "split"

const harmonies: { kind: HarmonyKind; label: string; offsets: number[] }[] = [
  { kind: "complementary", label: "Complementary", offsets: [0, 180] },
  { kind: "analogous", label: "Analogous", offsets: [-30, 0, 30] },
  { kind: "triadic", label: "Triadic", offsets: [0, 120, 240] },
  { kind: "split", label: "Split complementary", offsets: [0, 150, 210] },
]

function harmonyColors(brand: Oklch, kind: HarmonyKind) {
  const harmony = harmonies.find((item) => item.kind === kind) ?? harmonies[0]
  const chroma = Math.max(brand.c, 0.12)
  return harmony.offsets.map((offset) =>
    toGamut({ l: brand.l, c: chroma, h: normalizeHue(brand.h + offset), a: 1 })
  )
}

const chartTokens = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"] as const

function applyHarmony(
  theme: Theme,
  brand: Oklch,
  kind: HarmonyKind,
  locked: ReadonlySet<TokenName> = new Set()
) {
  const colors = harmonyColors(brand, kind)
  const hues = [...colors.map((color) => color.h)]
  while (hues.length < chartTokens.length) {
    hues.push(normalizeHue(hues[hues.length % colors.length] + 18))
  }
  const next = cloneTheme(theme)
  for (const mode of themeModes) {
    chartTokens.forEach((token, index) => {
      if (locked.has(token)) return
      const current = theme[mode][token]
      next[mode][token] = toGamut({
        ...current,
        c: Math.max(current.c, 0.12),
        h: hues[index],
      })
    })
    if (!locked.has("accent") && colors.length > 1) {
      const accent = theme[mode].accent
      const tone = { ...accent, h: colors[1].h, c: Math.max(accent.c, 0.02) }
      next[mode].accent = toGamut(tone)
      if (!locked.has("accent-foreground")) {
        next[mode]["accent-foreground"] = ensureContrast(
          toGamut({ ...theme[mode]["accent-foreground"], h: colors[1].h }),
          next[mode].accent,
          next[mode].background
        )
      }
    }
  }
  return next
}

type Adjustment = { hue: number; saturation: number; lightness: number }

const neutralAdjustment: Adjustment = { hue: 0, saturation: 1, lightness: 0 }

function adjustTheme(
  theme: Theme,
  { hue, saturation, lightness }: Adjustment,
  locked: ReadonlySet<TokenName> = new Set()
) {
  const next = cloneTheme(theme)
  if (hue === 0 && saturation === 1 && lightness === 0) return next
  for (const mode of themeModes) {
    for (const name of tokenNames) {
      if (locked.has(name)) continue
      const color = theme[mode][name]
      next[mode][name] = toGamut({
        l: clamp(color.l + lightness, 0, 1),
        c: clamp(color.c * saturation, 0, 0.37),
        h: color.c < 0.002 ? color.h : normalizeHue(color.h + hue),
        a: color.a,
      })
    }
  }
  return next
}

function randomBrand(random: () => number = Math.random): Oklch {
  const neutral = random() < 0.12
  return toGamut({
    l: 0.45 + random() * 0.3,
    c: neutral ? 0 : 0.08 + random() * 0.16,
    h: random() * 360,
    a: 1,
  })
}

function shuffleTheme(
  theme: Theme,
  locked: ReadonlySet<TokenName>,
  random: () => number = Math.random
) {
  const brand = randomBrand(random)
  const generated = generateTheme(brand, {
    tint: round(random() * 0.8, 2),
    radius: theme.radius,
  })
  const next = cloneTheme(theme)
  for (const mode of themeModes) {
    for (const name of tokenNames) {
      if (!locked.has(name)) next[mode][name] = generated[mode][name]
    }
  }
  return { theme: repairContrast(next, locked), brand }
}

function repairContrast(theme: Theme, locked: ReadonlySet<TokenName>) {
  const next = cloneTheme(theme)
  for (const mode of themeModes) {
    for (const result of checkContrast(next, mode, contrastPairs)) {
      if (result.passes || locked.has(result.foreground)) continue
      next[mode][result.foreground] = ensureContrast(
        next[mode][result.foreground],
        next[mode][result.background],
        next[mode].background
      )
    }
  }
  return next
}

const otherMode: Record<ThemeMode, ThemeMode> = { light: "dark", dark: "light" }

function deriveLinked(
  theme: Theme,
  mode: ThemeMode,
  name: TokenName,
  color: Oklch
) {
  const before = theme[mode][name]
  const target = otherMode[mode]
  const counterpart = theme[target][name]
  const ratio = before.c > 0.004 ? color.c / before.c : 1
  const hue = color.c > 0.004 ? color.h : counterpart.h
  return toGamut({
    l: clamp(counterpart.l + (color.l - before.l), 0, 1),
    c: before.c > 0.004 ? clamp(counterpart.c * ratio, 0, 0.37) : color.c,
    h: hue,
    a: counterpart.a,
  })
}

type CvdMode = "none" | "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia"

const cvdModes: { value: CvdMode; label: string; description: string }[] = [
  { value: "none", label: "Normal vision", description: "No simulation" },
  { value: "protanopia", label: "Protanopia", description: "No red cones, about 1% of men" },
  { value: "deuteranopia", label: "Deuteranopia", description: "No green cones, the most common" },
  { value: "tritanopia", label: "Tritanopia", description: "No blue cones, rare" },
  { value: "achromatopsia", label: "Achromatopsia", description: "No color at all" },
]

const cvdMatrices: Record<Exclude<CvdMode, "none">, number[]> = {
  protanopia: [
    0.152286, 1.052583, -0.204868, 0.114503, 0.786281, 0.099216, -0.003882, -0.048116, 1.051998,
  ],
  deuteranopia: [
    0.367322, 0.860646, -0.227968, 0.280085, 0.672501, 0.047413, -0.01182, 0.04294, 0.968881,
  ],
  tritanopia: [
    1.255528, -0.076749, -0.178779, -0.078411, 0.930809, 0.147602, 0.004733, 0.691367, 0.3039,
  ],
  achromatopsia: [
    0.2126, 0.7152, 0.0722, 0.2126, 0.7152, 0.0722, 0.2126, 0.7152, 0.0722,
  ],
}

function cvdFilterValues(mode: Exclude<CvdMode, "none">) {
  const m = cvdMatrices[mode]
  return [
    m[0], m[1], m[2], 0, 0,
    m[3], m[4], m[5], 0, 0,
    m[6], m[7], m[8], 0, 0,
    0, 0, 0, 1, 0,
  ].join(" ")
}

export {
  adjustTheme,
  applyHarmony,
  colorScale,
  cvdFilterValues,
  cvdModes,
  deriveLinked,
  harmonies,
  harmonyColors,
  neutralAdjustment,
  randomBrand,
  repairContrast,
  scaleFamilies,
  scaleSteps,
  scaleToCss,
  shuffleTheme,
  type Adjustment,
  type CvdMode,
  type HarmonyKind,
}
