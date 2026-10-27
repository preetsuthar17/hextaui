import { formatOklch, parseColor } from "@/lib/theme-editor/color"
import {
  cloneTheme,
  defaultTheme,
  maxRadius,
  themeModes,
  type Theme,
  type ThemeMode,
} from "@/lib/theme-editor/theme"
import { tokenNames, type TokenName } from "@/lib/theme-editor/tokens"

const radiusScale = [
  ["sm", "calc(var(--radius) * 0.6)"],
  ["md", "calc(var(--radius) * 0.8)"],
  ["lg", "var(--radius)"],
  ["xl", "calc(var(--radius) * 1.4)"],
] as const

function block(selector: string, lines: string[]) {
  return `${selector} {\n${lines.map((line) => `  ${line}`).join("\n")}\n}`
}

function modeLines(theme: Theme, mode: ThemeMode) {
  return [
    ...(mode === "light" ? [`--radius: ${theme.radius}rem;`] : []),
    ...tokenNames.map((name) => `--${name}: ${formatOklch(theme[mode][name])};`),
  ]
}

function themeToCss(theme: Theme) {
  return [
    block(":root", modeLines(theme, "light")),
    block(".dark", modeLines(theme, "dark")),
    block("@theme inline", [
      ...tokenNames.map((name) => `--color-${name}: var(--${name});`),
      ...radiusScale.map(([size, value]) => `--radius-${size}: ${value};`),
    ]),
  ].join("\n\n")
}

function themeToJson(theme: Theme) {
  const vars = (mode: ThemeMode) =>
    Object.fromEntries(
      tokenNames.map((name) => [name, formatOklch(theme[mode][name])])
    )
  return JSON.stringify(
    { radius: `${theme.radius}rem`, light: vars("light"), dark: vars("dark") },
    null,
    2
  )
}

type ParseResult = {
  theme: Theme
  found: number
  missing: TokenName[]
  invalid: string[]
}

const lightSelector = /(^|[\s,])(:root|html|\.light|\[data-theme=["']?light["']?\])(?=[\s,{:]|$)/
const darkSelector = /\.dark\b|\[data-theme=["']?dark["']?\]|prefers-color-scheme:\s*dark/

function declarations(body: string) {
  const result: Record<string, string> = {}
  const pattern = /--([a-z0-9-]+)\s*:\s*([^;{}]+?)\s*(?:;|$)/gim
  for (const match of body.matchAll(pattern)) {
    result[match[1].toLowerCase()] = match[2].trim()
  }
  return result
}

function blocks(css: string) {
  const found: { selector: string; body: string }[] = []
  const stack: string[] = []
  let buffer = ""
  for (const char of css.replace(/\/\*[\s\S]*?\*\//g, "")) {
    if (char === "{") {
      stack.push(buffer.slice(buffer.lastIndexOf(";") + 1).trim())
      buffer = ""
    } else if (char === "}") {
      if (buffer.includes(":")) {
        found.push({ selector: stack.join(" "), body: buffer })
      }
      stack.pop()
      buffer = ""
    } else {
      buffer += char
    }
  }
  return found
}

function tokenFor(name: string): TokenName | null {
  const bare = name.replace(/^color-/, "")
  return (tokenNames as readonly string[]).includes(bare)
    ? (bare as TokenName)
    : null
}

function parseRadius(value: string) {
  const match = /^(-?\d*\.?\d+)(rem|px|em)?$/.exec(value.trim())
  if (!match) return null
  const number = Number.parseFloat(match[1])
  const rem = match[2] === "px" ? number / 16 : number
  return Number.isFinite(rem) && rem >= 0 && rem <= maxRadius ? rem : null
}

function parseJsonTheme(input: string) {
  try {
    const data = JSON.parse(input) as Record<string, unknown>
    const vars = (data.cssVars ?? data) as Record<string, unknown>
    const toCss = (record: unknown) =>
      record && typeof record === "object"
        ? Object.entries(record as Record<string, unknown>)
            .map(([name, value]) => `--${name.replace(/^--/, "")}: ${String(value)};`)
            .join("\n")
        : ""
    const radius =
      typeof data.radius === "string" ? `--radius: ${data.radius};` : ""
    return `:root {\n${radius}\n${toCss(vars.light)}\n}\n.dark {\n${toCss(vars.dark)}\n}`
  } catch {
    return null
  }
}

function parseThemeCss(input: string, base: Theme = defaultTheme): ParseResult | null {
  const trimmed = input.trim()
  const css = trimmed.startsWith("{") ? parseJsonTheme(trimmed) : trimmed
  if (!css) return null

  const values: Record<ThemeMode, Record<string, string>> = { light: {}, dark: {} }
  const parsed = blocks(css)
  const sources = parsed.length > 0 ? parsed : [{ selector: ":root", body: css }]
  for (const { selector, body } of sources) {
    if (/@theme\b/.test(selector)) continue
    const mode = darkSelector.test(selector)
      ? "dark"
      : lightSelector.test(` ${selector}`)
        ? "light"
        : null
    if (!mode) continue
    Object.assign(values[mode], declarations(body))
  }

  const theme = cloneTheme(base)
  const invalid: string[] = []
  const seen = new Set<string>()
  let found = 0

  for (const mode of themeModes) {
    for (const [name, value] of Object.entries(values[mode])) {
      if (name === "radius") {
        const radius = parseRadius(value)
        if (radius === null) invalid.push(`--radius: ${value}`)
        else theme.radius = radius
        continue
      }
      const token = tokenFor(name)
      if (!token) continue
      const color = parseColor(value)
      if (!color) {
        invalid.push(`--${name}: ${value}`)
        continue
      }
      theme[mode][token] = color
      seen.add(`${mode}:${token}`)
      found += 1
    }
  }

  if (found === 0) return null

  const darkFound = tokenNames.some((name) => seen.has(`dark:${name}`))
  const missing = tokenNames.filter(
    (name) =>
      !seen.has(`light:${name}`) || (darkFound && !seen.has(`dark:${name}`))
  )

  return { theme, found, missing, invalid }
}

export { parseThemeCss, themeToCss, themeToJson, type ParseResult }
