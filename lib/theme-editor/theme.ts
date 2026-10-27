import {
  apcaContrast,
  contrastRatio,
  formatOklch,
  parseColor,
  type Oklch,
} from "@/lib/theme-editor/color"
import { fontStack, systemFont } from "@/lib/theme-editor/fonts"
import {
  defaultShadow,
  sameShadow,
  shadowScale,
  type ThemeShadow,
} from "@/lib/theme-editor/shadow"
import {
  contrastPairs,
  tokenNames,
  type ContrastPair,
  type TokenName,
} from "@/lib/theme-editor/tokens"

type ThemeMode = "light" | "dark"

type ThemeColors = Record<TokenName, Oklch>

type ThemeFonts = { sans: string; serif: string; mono: string }

type Theme = {
  light: ThemeColors
  dark: ThemeColors
  radius: number
  fonts: ThemeFonts
  tracking: number
  textBase: number
  shadow: ThemeShadow
}

const themeModes: ThemeMode[] = ["light", "dark"]

const minRadius = 0
const maxRadius = 2

const defaultFonts: ThemeFonts = {
  sans: systemFont,
  serif: systemFont,
  mono: systemFont,
}

const defaultTracking = 0
const minTracking = -0.05
const maxTracking = 0.1

const defaultTextBase = 16
const minTextBase = 12
const maxTextBase = 20

const textScale = [
  ["xs", 0.75],
  ["sm", 0.875],
  ["base", 1],
  ["lg", 1.125],
  ["xl", 1.25],
  ["2xl", 1.5],
  ["3xl", 1.875],
  ["4xl", 2.25],
] as const

const trackingScale = [
  ["tighter", -0.05],
  ["tight", -0.025],
  ["wide", 0.025],
  ["wider", 0.05],
  ["widest", 0.1],
] as const

function colors(values: Record<TokenName, string>): ThemeColors {
  return Object.fromEntries(
    tokenNames.map((name) => {
      const color = parseColor(values[name])
      if (!color) throw new Error(`Invalid color for ${name}: ${values[name]}`)
      return [name, color]
    })
  ) as ThemeColors
}

const defaultTheme: Theme = {
  radius: 0.8,
  fonts: defaultFonts,
  tracking: defaultTracking,
  textBase: defaultTextBase,
  shadow: defaultShadow,
  light: colors({
    background: "oklch(1 0 0)",
    foreground: "oklch(0.145 0 0)",
    card: "oklch(1 0 0)",
    "card-foreground": "oklch(0.145 0 0)",
    popover: "oklch(1 0 0)",
    "popover-foreground": "oklch(0.145 0 0)",
    primary: "oklch(0.205 0 0)",
    "primary-foreground": "oklch(0.985 0 0)",
    secondary: "oklch(0.97 0 0)",
    "secondary-foreground": "oklch(0.205 0 0)",
    muted: "oklch(0.97 0 0)",
    "muted-foreground": "oklch(0.535 0 0)",
    accent: "oklch(0.97 0 0)",
    "accent-foreground": "oklch(0.205 0 0)",
    destructive: "oklch(0.53 0.22 27.325)",
    "destructive-foreground": "oklch(0.985 0 0)",
    success: "oklch(0.527 0.154 150)",
    "success-foreground": "oklch(0.985 0 0)",
    info: "oklch(0.546 0.215 262)",
    "info-foreground": "oklch(0.985 0 0)",
    warning: "oklch(0.555 0.163 49)",
    "warning-foreground": "oklch(0.985 0 0)",
    border: "oklch(0.922 0 0)",
    input: "oklch(0.922 0 0)",
    ring: "oklch(0.708 0 0)",
    "chart-1": "oklch(0.575 0.163 255.5)",
    "chart-2": "oklch(0.621 0.128 163.1)",
    "chart-3": "oklch(0.67 0.143 73.2)",
    "chart-4": "oklch(0.433 0.167 283.6)",
    "chart-5": "oklch(0.622 0.171 0.8)",
    sidebar: "oklch(0.985 0 0)",
    "sidebar-foreground": "oklch(0.145 0 0)",
    "sidebar-primary": "oklch(0.205 0 0)",
    "sidebar-primary-foreground": "oklch(0.985 0 0)",
    "sidebar-accent": "oklch(0.97 0 0)",
    "sidebar-accent-foreground": "oklch(0.205 0 0)",
    "sidebar-border": "oklch(0.922 0 0)",
    "sidebar-ring": "oklch(0.708 0 0)",
  }),
  dark: colors({
    background: "oklch(0.145 0 0)",
    foreground: "oklch(0.985 0 0)",
    card: "oklch(0.205 0 0)",
    "card-foreground": "oklch(0.985 0 0)",
    popover: "oklch(0.205 0 0)",
    "popover-foreground": "oklch(0.985 0 0)",
    primary: "oklch(0.922 0 0)",
    "primary-foreground": "oklch(0.205 0 0)",
    secondary: "oklch(0.269 0 0)",
    "secondary-foreground": "oklch(0.985 0 0)",
    muted: "oklch(0.269 0 0)",
    "muted-foreground": "oklch(0.708 0 0)",
    accent: "oklch(0.269 0 0)",
    "accent-foreground": "oklch(0.985 0 0)",
    destructive: "oklch(0.704 0.191 22.216)",
    "destructive-foreground": "oklch(0.205 0 0)",
    success: "oklch(0.792 0.209 151.7)",
    "success-foreground": "oklch(0.205 0 0)",
    info: "oklch(0.707 0.165 254.6)",
    "info-foreground": "oklch(0.205 0 0)",
    warning: "oklch(0.828 0.189 84.4)",
    "warning-foreground": "oklch(0.205 0 0)",
    border: "oklch(1 0 0 / 10%)",
    input: "oklch(1 0 0 / 15%)",
    ring: "oklch(0.556 0 0)",
    "chart-1": "oklch(0.622 0.161 255.1)",
    "chart-2": "oklch(0.621 0.128 163.1)",
    "chart-3": "oklch(0.67 0.143 73.2)",
    "chart-4": "oklch(0.67 0.145 286.8)",
    "chart-5": "oklch(0.622 0.171 0.8)",
    sidebar: "oklch(0.205 0 0)",
    "sidebar-foreground": "oklch(0.985 0 0)",
    "sidebar-primary": "oklch(0.488 0.243 264.376)",
    "sidebar-primary-foreground": "oklch(0.985 0 0)",
    "sidebar-accent": "oklch(0.269 0 0)",
    "sidebar-accent-foreground": "oklch(0.985 0 0)",
    "sidebar-border": "oklch(1 0 0 / 10%)",
    "sidebar-ring": "oklch(0.556 0 0)",
  }),
}

function themeVars(theme: Theme, mode: ThemeMode) {
  const vars: Record<string, string> = { "--radius": `${theme.radius}rem` }
  for (const name of tokenNames) {
    vars[`--${name}`] = formatOklch(theme[mode][name])
  }
  return vars
}

function hasCustomFonts(theme: Theme) {
  return (
    theme.fonts.sans !== systemFont ||
    theme.fonts.serif !== systemFont ||
    theme.fonts.mono !== systemFont
  )
}

function hasCustomShadow(theme: Theme) {
  return !sameShadow(theme.shadow, defaultShadow)
}

function trackingValue(value: number) {
  return `${Math.round(value * 1000) / 1000}em`
}

function textSize(theme: Theme, factor: number) {
  return `${Math.round((theme.textBase * factor) / 16 * 10000) / 10000}rem`
}

function previewVars(theme: Theme, mode: ThemeMode) {
  const vars: Record<string, string> = { "--radius": `${theme.radius}rem` }
  for (const name of tokenNames) {
    const value = formatOklch(theme[mode][name])
    vars[`--${name}`] = value
    vars[`--color-${name}`] = value
  }
  vars["--font-sans"] = fontStack(theme.fonts.sans, "sans")
  vars["--font-serif"] = fontStack(theme.fonts.serif, "serif")
  vars["--font-mono"] = fontStack(theme.fonts.mono, "mono")
  vars["--tracking-normal"] = trackingValue(theme.tracking)
  for (const [name, offset] of trackingScale) {
    vars[`--tracking-${name}`] = trackingValue(theme.tracking + offset)
  }
  for (const [name, factor] of textScale) {
    vars[`--text-${name}`] = textSize(theme, factor)
  }
  for (const [size, value] of Object.entries(shadowScale(theme.shadow))) {
    vars[`--shadow-${size}`] = value
  }
  return vars
}

type ContrastResult = ContrastPair & {
  mode: ThemeMode
  ratio: number
  apca: number
  passes: boolean
}

function checkContrast(
  theme: Theme,
  mode: ThemeMode,
  pairs: ContrastPair[] = contrastPairs
): ContrastResult[] {
  const palette = theme[mode]
  return pairs.map((pair) => {
    const ratio = contrastRatio(
      palette[pair.foreground],
      palette[pair.background],
      palette.background
    )
    return {
      ...pair,
      mode,
      ratio,
      apca: apcaContrast(
        palette[pair.foreground],
        palette[pair.background],
        palette.background
      ),
      passes: ratio >= pair.minimum,
    }
  })
}

function cloneTheme(theme: Theme): Theme {
  return {
    ...theme,
    light: { ...theme.light },
    dark: { ...theme.dark },
    fonts: { ...theme.fonts },
    shadow: { ...theme.shadow, color: { ...theme.shadow.color } },
  }
}

export {
  checkContrast,
  cloneTheme,
  defaultFonts,
  defaultTextBase,
  defaultTheme,
  defaultTracking,
  hasCustomFonts,
  hasCustomShadow,
  maxRadius,
  maxTextBase,
  maxTracking,
  minRadius,
  minTextBase,
  minTracking,
  previewVars,
  textScale,
  textSize,
  themeModes,
  themeVars,
  trackingScale,
  trackingValue,
  type ContrastResult,
  type Theme,
  type ThemeColors,
  type ThemeFonts,
  type ThemeMode,
}
