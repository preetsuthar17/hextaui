import {
  clamp,
  contrastRatio,
  normalizeHue,
  toGamut,
  type Oklch,
} from "@/lib/theme-editor/color"
import {
  defaultTheme,
  type Theme,
  type ThemeColors,
} from "@/lib/theme-editor/theme"

type GenerateOptions = {
  tint?: number
  radius?: number
}

const minimumContrast = 4.5

function color(l: number, c: number, h: number, a = 1): Oklch {
  return toGamut({ l: clamp(l, 0, 1), c: Math.max(0, c), h: normalizeHue(h), a })
}

function meetsContrast(fg: Oklch, bg: Oklch, backdrop: Oklch) {
  return contrastRatio(fg, bg, backdrop) >= minimumContrast
}

function ensureContrast(fg: Oklch, bg: Oklch, backdrop: Oklch) {
  if (meetsContrast(fg, bg, backdrop)) return fg
  const direction = bg.l > 0.6 ? -1 : 1
  for (const sign of [direction, -direction]) {
    let candidate = fg
    for (let step = 0; step < 200; step += 1) {
      candidate = color(candidate.l + sign * 0.005, candidate.c, candidate.h)
      if (meetsContrast(candidate, bg, backdrop)) return candidate
      if (candidate.l <= 0 || candidate.l >= 1) break
    }
  }
  return bg.l > 0.6 ? color(0, 0, 0) : color(1, 0, 0)
}

function fitSurface(bg: Oklch, fg: Oklch, backdrop: Oklch) {
  let candidate = bg
  const sign = fg.l > 0.5 ? -1 : 1
  for (let step = 0; step < 200; step += 1) {
    if (meetsContrast(fg, candidate, backdrop)) return candidate
    candidate = color(candidate.l + sign * 0.005, candidate.c, candidate.h)
  }
  return candidate
}

function onColor(bg: Oklch, light: Oklch, dark: Oklch, backdrop: Oklch) {
  const pick =
    contrastRatio(light, bg, backdrop) >= contrastRatio(dark, bg, backdrop)
      ? light
      : dark
  return { surface: fitSurface(bg, pick, backdrop), foreground: pick }
}

function chartColors(brand: Oklch, dark: boolean) {
  if (brand.c < 0.02) {
    const source = dark ? defaultTheme.dark : defaultTheme.light
    return [
      source["chart-1"],
      source["chart-2"],
      source["chart-3"],
      source["chart-4"],
      source["chart-5"],
    ]
  }
  const offsets = [0, 150, 75, 225, 300]
  const lightness = dark
    ? [0.66, 0.66, 0.74, 0.6, 0.68]
    : [0.58, 0.62, 0.7, 0.48, 0.64]
  const chroma = [0.16, 0.13, 0.14, 0.15, 0.17]
  return offsets.map((offset, index) =>
    color(lightness[index], Math.max(chroma[index], brand.c * 0.8), brand.h + offset)
  )
}

function generateTheme(input: Oklch, options: GenerateOptions = {}): Theme {
  const brand = toGamut({ ...input, a: 1 })
  const neutral = brand.c < 0.02
  const tint = neutral ? 0 : clamp(options.tint ?? 0.5, 0, 1)
  const hue = brand.h
  const n = (l: number, c: number) => color(l, c * tint, hue)

  const lightBackground = tint > 0 ? n(0.995, 0.004) : color(1, 0, 0)
  const lightForeground = n(0.145, 0.012)
  const lightOnDark = n(0.985, 0.004)
  const lightOnLight = n(0.205, 0.012)

  const lightPrimary = neutral
    ? onColor(n(0.205, 0), lightOnDark, lightOnLight, lightBackground)
    : onColor(
        color(Math.min(brand.l, 0.8), brand.c, hue),
        color(0.985, 0.006, hue),
        color(0.2, Math.min(brand.c, 0.06), hue),
        lightBackground
      )

  const lightSecondary = n(0.967, 0.012)
  const lightAccent = neutral
    ? lightSecondary
    : color(0.962, Math.min(brand.c * 0.18, 0.035), hue)
  const lightBorder = n(0.922, 0.01)
  const lightRing = neutral ? n(0.708, 0) : color(0.708, brand.c * 0.6, hue)

  const lightSidebar = n(0.985, 0.006)
  const lightCharts = chartColors(brand, false)

  const light: ThemeColors = {
    ...defaultTheme.light,
    background: lightBackground,
    foreground: lightForeground,
    card: lightBackground,
    "card-foreground": lightForeground,
    popover: lightBackground,
    "popover-foreground": lightForeground,
    primary: lightPrimary.surface,
    "primary-foreground": lightPrimary.foreground,
    secondary: lightSecondary,
    "secondary-foreground": ensureContrast(lightOnLight, lightSecondary, lightBackground),
    muted: lightSecondary,
    "muted-foreground": ensureContrast(n(0.535, 0.02), lightSecondary, lightBackground),
    accent: lightAccent,
    "accent-foreground": ensureContrast(
      neutral ? lightOnLight : color(0.32, Math.min(brand.c * 0.6, 0.12), hue),
      lightAccent,
      lightBackground
    ),
    border: lightBorder,
    input: lightBorder,
    ring: lightRing,
    "chart-1": lightCharts[0],
    "chart-2": lightCharts[1],
    "chart-3": lightCharts[2],
    "chart-4": lightCharts[3],
    "chart-5": lightCharts[4],
    sidebar: lightSidebar,
    "sidebar-foreground": lightForeground,
    "sidebar-primary": lightPrimary.surface,
    "sidebar-primary-foreground": lightPrimary.foreground,
    "sidebar-accent": lightSecondary,
    "sidebar-accent-foreground": ensureContrast(lightOnLight, lightSecondary, lightBackground),
    "sidebar-border": lightBorder,
    "sidebar-ring": lightRing,
  }

  const darkBackground = n(0.145, 0.012)
  const darkSurface = n(0.205, 0.014)
  const darkForeground = n(0.985, 0.004)
  const darkOnLight = n(0.205, 0.012)

  const darkPrimary = neutral
    ? onColor(n(0.922, 0), darkForeground, darkOnLight, darkBackground)
    : onColor(
        color(clamp(brand.l + 0.04, 0.6, 0.86), brand.c, hue),
        color(0.985, 0.006, hue),
        color(0.18, Math.min(brand.c, 0.06), hue),
        darkBackground
      )

  const darkSecondary = n(0.269, 0.014)
  const darkAccent = neutral
    ? darkSecondary
    : color(0.29, Math.min(brand.c * 0.3, 0.06), hue)
  const darkRing = neutral ? n(0.556, 0) : color(0.556, brand.c * 0.5, hue)
  const darkCharts = chartColors(brand, true)

  const dark: ThemeColors = {
    ...defaultTheme.dark,
    background: darkBackground,
    foreground: darkForeground,
    card: darkSurface,
    "card-foreground": darkForeground,
    popover: darkSurface,
    "popover-foreground": darkForeground,
    primary: darkPrimary.surface,
    "primary-foreground": darkPrimary.foreground,
    secondary: darkSecondary,
    "secondary-foreground": ensureContrast(darkForeground, darkSecondary, darkBackground),
    muted: darkSecondary,
    "muted-foreground": ensureContrast(n(0.72, 0.016), darkSecondary, darkBackground),
    accent: darkAccent,
    "accent-foreground": ensureContrast(darkForeground, darkAccent, darkBackground),
    border: color(1, 0, 0, 0.1),
    input: color(1, 0, 0, 0.15),
    ring: darkRing,
    "chart-1": darkCharts[0],
    "chart-2": darkCharts[1],
    "chart-3": darkCharts[2],
    "chart-4": darkCharts[3],
    "chart-5": darkCharts[4],
    sidebar: darkSurface,
    "sidebar-foreground": darkForeground,
    "sidebar-primary": darkPrimary.surface,
    "sidebar-primary-foreground": darkPrimary.foreground,
    "sidebar-accent": darkSecondary,
    "sidebar-accent-foreground": ensureContrast(darkForeground, darkSecondary, darkBackground),
    "sidebar-border": color(1, 0, 0, 0.1),
    "sidebar-ring": darkRing,
  }

  return { light, dark, radius: options.radius ?? defaultTheme.radius }
}

export { ensureContrast, generateTheme, minimumContrast, type GenerateOptions }
