import { parseColor } from "@/lib/theme-editor/color"
import { generateTheme } from "@/lib/theme-editor/generate"
import { defaultShadow } from "@/lib/theme-editor/shadow"
import { defaultTheme, type Theme } from "@/lib/theme-editor/theme"

type PresetGroup = "hextaui" | "inspired"

type ThemePreset = {
  slug: string
  name: string
  brand: string
  group: PresetGroup
  theme: Theme
}

function preset(
  slug: string,
  name: string,
  brand: string,
  tint: number,
  radius: number,
  extras: Partial<Pick<Theme, "fonts" | "tracking" | "shadow">> = {},
  group: PresetGroup = "hextaui"
): ThemePreset {
  const color = parseColor(brand)
  if (!color) throw new Error(`Invalid preset color: ${brand}`)
  const theme = generateTheme(color, { tint, radius })
  return {
    slug,
    name,
    brand,
    group,
    theme: {
      ...theme,
      ...extras,
      fonts: { ...theme.fonts, ...extras.fonts },
    },
  }
}

function inspired(
  slug: string,
  source: string,
  brand: string,
  tint: number,
  radius: number,
  extras: Partial<Pick<Theme, "fonts" | "tracking" | "shadow">> = {}
) {
  return preset(slug, `Inspired by ${source}`, brand, tint, radius, extras, "inspired")
}

const system = "System"

const themePresets: ThemePreset[] = [
  {
    slug: "hextaui",
    name: "HextaUI",
    brand: "oklch(0.205 0 0)",
    group: "hextaui",
    theme: defaultTheme,
  },
  preset("graphite", "Graphite", "oklch(0.3 0 0)", 0, 0.5),
  preset("ocean", "Ocean", "oklch(0.55 0.19 255)", 0.5, 0.75),
  preset("violet", "Violet", "oklch(0.54 0.23 292)", 0.6, 0.9),
  preset("forest", "Forest", "oklch(0.52 0.13 155)", 0.5, 0.6),
  preset("ember", "Ember", "oklch(0.64 0.2 41)", 0.6, 0.75),
  preset("rose", "Rose", "oklch(0.6 0.21 12)", 0.5, 1),
  preset("amber", "Amber", "oklch(0.78 0.16 75)", 0.7, 0.5),
  preset("teal", "Teal", "oklch(0.6 0.11 190)", 0.4, 0.65),
  preset("indigo", "Indigo", "oklch(0.47 0.2 275)", 0.6, 0.4),
  preset("stone", "Stone", "oklch(0.55 0.06 70)", 1, 0.3),
  inspired("linear", "Linear", "oklch(0.58 0.16 277)", 0.6, 0.5, {
    fonts: { sans: "Inter", serif: system, mono: "JetBrains Mono" },
    tracking: -0.01,
  }),
  inspired("vercel", "Vercel", "oklch(0.15 0 0)", 0, 0.5, {
    fonts: { sans: "Geist", serif: system, mono: "Geist Mono" },
  }),
  inspired("supabase", "Supabase", "oklch(0.72 0.16 158)", 0.3, 0.4, {
    fonts: { sans: "Inter", serif: system, mono: "Source Code Pro" },
  }),
  inspired("claude", "Claude", "oklch(0.64 0.14 40)", 1, 0.6, {
    fonts: { sans: system, serif: "Source Serif 4", mono: system },
  }),
  inspired("stripe", "Stripe", "oklch(0.56 0.24 280)", 0.3, 0.4, {
    fonts: { sans: "Inter", serif: system, mono: "Source Code Pro" },
    shadow: {
      ...defaultShadow,
      color: { l: 0.3, c: 0.06, h: 265, a: 1 },
      opacity: 0.14,
      blur: 4,
      y: 2,
    },
  }),
  inspired("github", "GitHub", "oklch(0.55 0.15 147)", 0.15, 0.4),
  inspired("notion", "Notion", "oklch(0.6 0.15 252)", 0.25, 0.3, {
    fonts: { sans: system, serif: "Lora", mono: system },
  }),
  inspired("spotify", "Spotify", "oklch(0.7 0.19 150)", 0.2, 1.6, {
    fonts: { sans: "Figtree", serif: system, mono: system },
  }),
]

function getPreset(slug: string) {
  return themePresets.find((item) => item.slug === slug)
}

export { getPreset, themePresets, type PresetGroup, type ThemePreset }
