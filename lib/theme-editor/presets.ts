import { parseColor } from "@/lib/theme-editor/color"
import { generateTheme } from "@/lib/theme-editor/generate"
import { defaultTheme, type Theme } from "@/lib/theme-editor/theme"

type ThemePreset = {
  slug: string
  name: string
  brand: string
  theme: Theme
}

function preset(
  slug: string,
  name: string,
  brand: string,
  tint: number,
  radius: number
): ThemePreset {
  const color = parseColor(brand)
  if (!color) throw new Error(`Invalid preset color: ${brand}`)
  return { slug, name, brand, theme: generateTheme(color, { tint, radius }) }
}

const themePresets: ThemePreset[] = [
  {
    slug: "hextaui",
    name: "HextaUI",
    brand: "oklch(0.205 0 0)",
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
]

function getPreset(slug: string) {
  return themePresets.find((item) => item.slug === slug)
}

export { getPreset, themePresets, type ThemePreset }
