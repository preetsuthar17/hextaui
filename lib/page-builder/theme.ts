import { themeToCss } from "@/lib/theme-editor/css"
import { decodeTheme, encodeTheme } from "@/lib/theme-editor/encode"
import { themePresets } from "@/lib/theme-editor/presets"
import {
  defaultTheme,
  themeVars,
  type Theme,
  type ThemeMode,
} from "@/lib/theme-editor/theme"

type ThemeVars = Record<string, string>

const themeIdPattern = /^[A-Za-z0-9_-]+$/

const defaultThemeId = encodeTheme(defaultTheme)

function normalizeThemeId(id: string | null | undefined) {
  if (!id || !themeIdPattern.test(id)) return null
  const theme = decodeTheme(id)
  return theme ? encodeTheme(theme) : null
}

const presetThemes = themePresets.map((preset) => ({
  preset,
  id:
    preset.slug === "hextaui"
      ? null
      : normalizeThemeId(encodeTheme(preset.theme)),
}))

const presetIds = new Map(
  presetThemes.flatMap(({ preset, id }) => (id ? [[id, preset] as const] : []))
)

function parseThemeInput(input: string) {
  const value = input.trim()
  if (!value) return null
  const fromHash = /[#&?]t=([A-Za-z0-9_-]+)/.exec(value)
  if (fromHash) return normalizeThemeId(fromHash[1])
  const fromRegistry = /\/r\/themes\/([A-Za-z0-9_-]+)(?:\.json)?/.exec(value)
  if (fromRegistry) return normalizeThemeId(fromRegistry[1])
  return normalizeThemeId(value)
}

function themeFromId(id: string | null | undefined): Theme {
  return (id ? decodeTheme(id) : null) ?? defaultTheme
}

function themeName(id: string | null | undefined) {
  if (!id || id === defaultThemeId) return "HextaUI"
  return presetIds.get(id)?.name ?? "Custom"
}

function presetSlug(id: string | null | undefined) {
  if (!id || id === defaultThemeId) return "hextaui"
  return presetIds.get(id)?.slug ?? null
}

function canvasVars(theme: Theme, mode: ThemeMode): ThemeVars {
  const vars: ThemeVars = {}
  for (const [name, value] of Object.entries(themeVars(theme, mode))) {
    vars[name] = value
    if (name !== "--radius") vars[`--color-${name.slice(2)}`] = value
  }
  return vars
}

function themeCssFile(id: string) {
  return `${themeToCss(themeFromId(id))}\n`
}

function applyTheme(vars: ThemeVars, el: HTMLElement) {
  const previous = (el.dataset.pbThemeVars ?? "").split(",").filter(Boolean)
  for (const name of previous) el.style.removeProperty(name)
  const names = Object.keys(vars)
  for (const name of names) el.style.setProperty(name, vars[name])
  el.dataset.pbThemeVars = names.join(",")
}

export {
  applyTheme,
  canvasVars,
  defaultThemeId,
  normalizeThemeId,
  parseThemeInput,
  presetThemes,
  presetSlug,
  themeCssFile,
  themeFromId,
  themeName,
  type ThemeVars,
}
