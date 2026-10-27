type FontSlot = "sans" | "serif" | "mono"

type FontOption = {
  name: string
  slot: FontSlot
  weights?: string
}

const systemFont = "System"

const systemStacks: Record<FontSlot, string> = {
  sans: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  serif: 'ui-serif, Georgia, Cambria, "Times New Roman", serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
}

const fallbacks: Record<FontSlot, string> = {
  sans: "ui-sans-serif, system-ui, sans-serif",
  serif: "ui-serif, Georgia, serif",
  mono: "ui-monospace, SFMono-Regular, monospace",
}

const fontOptions: FontOption[] = [
  { name: "Inter", slot: "sans" },
  { name: "Geist", slot: "sans" },
  { name: "Roboto", slot: "sans" },
  { name: "Open Sans", slot: "sans" },
  { name: "Lato", slot: "sans", weights: "400;700" },
  { name: "Montserrat", slot: "sans" },
  { name: "Poppins", slot: "sans" },
  { name: "Nunito", slot: "sans" },
  { name: "Raleway", slot: "sans" },
  { name: "Work Sans", slot: "sans" },
  { name: "DM Sans", slot: "sans" },
  { name: "Manrope", slot: "sans" },
  { name: "Plus Jakarta Sans", slot: "sans" },
  { name: "Outfit", slot: "sans" },
  { name: "Figtree", slot: "sans" },
  { name: "Space Grotesk", slot: "sans" },
  { name: "IBM Plex Sans", slot: "sans" },
  { name: "Source Sans 3", slot: "sans" },
  { name: "Rubik", slot: "sans" },
  { name: "Mulish", slot: "sans" },
  { name: "Karla", slot: "sans" },
  { name: "Sora", slot: "sans" },
  { name: "Lexend", slot: "sans" },
  { name: "Onest", slot: "sans" },
  { name: "Instrument Sans", slot: "sans" },
  { name: "Public Sans", slot: "sans" },
  { name: "Hanken Grotesk", slot: "sans" },
  { name: "Bricolage Grotesque", slot: "sans" },
  { name: "Playfair Display", slot: "serif" },
  { name: "Merriweather", slot: "serif", weights: "400;700" },
  { name: "Lora", slot: "serif" },
  { name: "Source Serif 4", slot: "serif" },
  { name: "Libre Baskerville", slot: "serif", weights: "400;700" },
  { name: "EB Garamond", slot: "serif" },
  { name: "Crimson Pro", slot: "serif" },
  { name: "DM Serif Display", slot: "serif", weights: "400" },
  { name: "Fraunces", slot: "serif" },
  { name: "Instrument Serif", slot: "serif", weights: "400" },
  { name: "Newsreader", slot: "serif" },
  { name: "IBM Plex Serif", slot: "serif" },
  { name: "JetBrains Mono", slot: "mono" },
  { name: "Geist Mono", slot: "mono" },
  { name: "Fira Code", slot: "mono" },
  { name: "IBM Plex Mono", slot: "mono" },
  { name: "Source Code Pro", slot: "mono" },
  { name: "Roboto Mono", slot: "mono" },
  { name: "Space Mono", slot: "mono", weights: "400;700" },
  { name: "DM Mono", slot: "mono", weights: "400;500" },
  { name: "Inconsolata", slot: "mono" },
]

const fontNames = [systemFont, ...fontOptions.map((font) => font.name)]

const genericFamilies = new Set([
  "ui-sans-serif",
  "ui-serif",
  "ui-monospace",
  "system-ui",
  "-apple-system",
  "blinkmacsystemfont",
  "sans-serif",
  "serif",
  "monospace",
  "segoe ui",
])

function findFont(name: string) {
  const lower = name.toLowerCase()
  return fontOptions.find((font) => font.name.toLowerCase() === lower)
}

function isGoogleFont(name: string) {
  return findFont(name) !== undefined
}

function sanitizeFontName(name: string) {
  const clean = name.replace(/[^A-Za-z0-9 ]/g, "").replace(/\s+/g, " ").trim()
  return clean.slice(0, 40)
}

function quoteFamily(name: string) {
  return /^[A-Za-z-]+$/.test(name) ? name : `"${name}"`
}

function fontStack(name: string, slot: FontSlot) {
  if (name === systemFont || !name) return systemStacks[slot]
  return `${quoteFamily(name)}, ${fallbacks[slot]}`
}

function parseFontStack(value: string): string | null {
  const first = value.split(",")[0]?.trim().replace(/^["']|["']$/g, "")
  if (!first || first.startsWith("var(")) return null
  if (genericFamilies.has(first.toLowerCase())) return systemFont
  const known = findFont(first)
  if (known) return known.name
  const clean = sanitizeFontName(first)
  return clean ? clean : null
}

function googleFontsUrl(names: string[]) {
  const families = [...new Set(names)]
    .map((name) => findFont(name))
    .filter((font): font is FontOption => font !== undefined)
    .map(
      (font) =>
        `family=${font.name.replace(/ /g, "+")}:wght@${font.weights ?? "400;500;600;700"}`
    )
  if (families.length === 0) return null
  return `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`
}

function fontOptionsFor(slot: FontSlot) {
  const own = fontOptions.filter((font) => font.slot === slot)
  const rest = fontOptions.filter((font) => font.slot !== slot)
  return { own, rest }
}

export {
  fontNames,
  fontOptions,
  fontOptionsFor,
  fontStack,
  googleFontsUrl,
  isGoogleFont,
  parseFontStack,
  sanitizeFontName,
  systemFont,
  systemStacks,
  type FontOption,
  type FontSlot,
}
