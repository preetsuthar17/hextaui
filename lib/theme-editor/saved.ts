import { decodeTheme } from "@/lib/theme-editor/encode"

type SavedTheme = { id: string; name: string; code: string; savedAt: number }

const savedThemesKey = "hextaui:theme-editor:saved"
const maxSavedThemes = 50
const maxNameLength = 40

function cleanName(name: string, fallback: string) {
  const trimmed = name.replace(/\s+/g, " ").trim().slice(0, maxNameLength)
  return trimmed || fallback
}

function parseSavedThemes(raw: string | null): SavedTheme[] {
  if (!raw) return []
  try {
    const data = JSON.parse(raw) as unknown
    if (!Array.isArray(data)) return []
    return data
      .filter(
        (item): item is SavedTheme =>
          typeof item === "object" &&
          item !== null &&
          typeof item.id === "string" &&
          typeof item.name === "string" &&
          typeof item.code === "string" &&
          typeof item.savedAt === "number" &&
          decodeTheme(item.code) !== null
      )
      .slice(0, maxSavedThemes)
  } catch {
    return []
  }
}

function nextThemeName(themes: SavedTheme[]) {
  const taken = new Set(themes.map((theme) => theme.name))
  let index = themes.length + 1
  while (taken.has(`My theme ${index}`)) index += 1
  return `My theme ${index}`
}

function saveTheme(
  themes: SavedTheme[],
  code: string,
  name: string,
  now: number,
  id = `${now.toString(36)}${Math.random().toString(36).slice(2, 6)}`
) {
  const entry = { id, name: cleanName(name, nextThemeName(themes)), code, savedAt: now }
  return [entry, ...themes].slice(0, maxSavedThemes)
}

function updateTheme(
  themes: SavedTheme[],
  id: string,
  patch: Partial<Pick<SavedTheme, "name" | "code">>,
  now: number
) {
  return themes.map((theme) =>
    theme.id === id
      ? {
          ...theme,
          ...(patch.name !== undefined
            ? { name: cleanName(patch.name, theme.name) }
            : {}),
          ...(patch.code !== undefined ? { code: patch.code, savedAt: now } : {}),
        }
      : theme
  )
}

function removeTheme(themes: SavedTheme[], id: string) {
  return themes.filter((theme) => theme.id !== id)
}

export {
  maxNameLength,
  nextThemeName,
  parseSavedThemes,
  removeTheme,
  saveTheme,
  savedThemesKey,
  updateTheme,
  type SavedTheme,
}
