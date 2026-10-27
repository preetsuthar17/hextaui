import {
  apcaContrast,
  contrastRatio,
  formatOklch,
  parseColor,
  type Oklch,
} from "@/lib/theme-editor/color"
import {
  contrastPairs,
  tokenNames,
  type ContrastPair,
  type TokenName,
} from "@/lib/theme-editor/tokens"

type ThemeMode = "light" | "dark"

type ThemeColors = Record<TokenName, Oklch>

type Theme = { light: ThemeColors; dark: ThemeColors; radius: number }

const themeModes: ThemeMode[] = ["light", "dark"]

const minRadius = 0
const maxRadius = 2

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

type ContrastResult = ContrastPair & {
  mode: ThemeMode
  ratio: number
  apca: number
  passes: boolean
}

function checkContrast(theme: Theme, mode: ThemeMode): ContrastResult[] {
  const palette = theme[mode]
  return contrastPairs.map((pair) => {
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
    radius: theme.radius,
    light: { ...theme.light },
    dark: { ...theme.dark },
  }
}

export {
  checkContrast,
  cloneTheme,
  defaultTheme,
  maxRadius,
  minRadius,
  themeModes,
  themeVars,
  type ContrastResult,
  type Theme,
  type ThemeColors,
  type ThemeMode,
}
