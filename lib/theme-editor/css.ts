import { clamp, formatOklch, parseColor, round } from "@/lib/theme-editor/color"
import { fontStack, parseFontStack } from "@/lib/theme-editor/fonts"
import {
  parseLength,
  shadowLimits,
  shadowScale,
  shadowSizes,
} from "@/lib/theme-editor/shadow"
import {
  cloneTheme,
  defaultTextBase,
  defaultTheme,
  hasCustomFonts,
  hasCustomShadow,
  maxRadius,
  maxTracking,
  minTracking,
  textScale,
  textSize,
  themeModes,
  trackingScale,
  trackingValue,
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

const fontSlots = ["sans", "serif", "mono"] as const

function hasCustomTracking(theme: Theme) {
  return Math.round(theme.tracking * 1000) !== 0
}

function hasCustomText(theme: Theme) {
  return Math.round(theme.textBase) !== defaultTextBase
}

function themeExtras(theme: Theme): Record<string, string> {
  const vars: Record<string, string> = {}
  if (hasCustomFonts(theme)) {
    for (const slot of fontSlots) {
      vars[`font-${slot}`] = fontStack(theme.fonts[slot], slot)
    }
  }
  if (hasCustomShadow(theme)) {
    const shadow = theme.shadow
    vars["shadow-color"] = formatOklch({ ...shadow.color, a: 1 })
    vars["shadow-opacity"] = String(round(shadow.opacity, 2))
    vars["shadow-blur"] = `${shadow.blur}px`
    vars["shadow-spread"] = `${shadow.spread}px`
    vars["shadow-x"] = `${shadow.x}px`
    vars["shadow-y"] = `${shadow.y}px`
    const scale = shadowScale(shadow)
    for (const size of shadowSizes) vars[`shadow-${size}`] = scale[size]
  }
  if (hasCustomTracking(theme)) {
    vars["tracking-normal"] = trackingValue(theme.tracking)
  }
  return vars
}

function themeInlineExtras(theme: Theme): Record<string, string> {
  const vars: Record<string, string> = {}
  if (hasCustomFonts(theme)) {
    for (const slot of fontSlots) vars[`font-${slot}`] = `var(--font-${slot})`
  }
  if (hasCustomShadow(theme)) {
    for (const size of shadowSizes) vars[`shadow-${size}`] = `var(--shadow-${size})`
  }
  if (hasCustomTracking(theme)) {
    vars["tracking-normal"] = "var(--tracking-normal)"
    for (const [name, offset] of trackingScale) {
      vars[`tracking-${name}`] =
        `calc(var(--tracking-normal) ${offset < 0 ? "-" : "+"} ${Math.abs(offset)}em)`
    }
  }
  if (hasCustomText(theme)) {
    for (const [name, factor] of textScale) {
      vars[`text-${name}`] = textSize(theme, factor)
    }
  }
  return vars
}

function modeLines(theme: Theme, mode: ThemeMode) {
  const extras = mode === "light" ? themeExtras(theme) : {}
  return [
    ...(mode === "light" ? [`--radius: ${theme.radius}rem;`] : []),
    ...tokenNames.map((name) => `--${name}: ${formatOklch(theme[mode][name])};`),
    ...Object.entries(extras).map(([name, value]) => `--${name}: ${value};`),
  ]
}

function themeToCss(theme: Theme) {
  const inline = themeInlineExtras(theme)
  return [
    block(":root", modeLines(theme, "light")),
    block(".dark", modeLines(theme, "dark")),
    block("@theme inline", [
      ...tokenNames.map((name) => `--color-${name}: var(--${name});`),
      ...radiusScale.map(([size, value]) => `--radius-${size}: ${value};`),
      ...Object.entries(inline).map(([name, value]) => `--${name}: ${value};`),
    ]),
    ...(hasCustomTracking(theme)
      ? [block("body", ["letter-spacing: var(--tracking-normal);"])]
      : []),
  ].join("\n\n")
}

function themeToJson(theme: Theme) {
  const vars = (mode: ThemeMode) =>
    Object.fromEntries(
      tokenNames.map((name) => [name, formatOklch(theme[mode][name])])
    )
  return JSON.stringify(
    {
      radius: `${theme.radius}rem`,
      ...(Object.keys(themeExtras(theme)).length > 0
        ? { theme: themeExtras(theme) }
        : {}),
      ...(hasCustomText(theme) ? { textBase: `${theme.textBase}px` } : {}),
      light: vars("light"),
      dark: vars("dark"),
    },
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
    const vars = (data.cssVars ?? data.styles ?? data) as Record<string, unknown>
    const toCss = (record: unknown) =>
      record && typeof record === "object"
        ? Object.entries(record as Record<string, unknown>)
            .map(([name, value]) => `--${name.replace(/^--/, "")}: ${String(value)};`)
            .join("\n")
        : ""
    const radius =
      typeof data.radius === "string" ? `--radius: ${data.radius};` : ""
    const shared = toCss(vars.theme ?? data.theme)
    return `:root {\n${radius}\n${shared}\n${toCss(vars.light)}\n}\n.dark {\n${toCss(vars.dark)}\n}`
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

  const shadowParams: Record<string, number> = {}
  let extras = 0

  for (const mode of themeModes) {
    for (const [name, value] of Object.entries(values[mode])) {
      if (mode === "light" && /^font-(sans|serif|mono)$/.test(name)) {
        const font = parseFontStack(value)
        if (font) {
          theme.fonts[name.slice(5) as "sans" | "serif" | "mono"] = font
          extras += 1
        }
        continue
      }
      if (mode === "light" && name === "tracking-normal") {
        const match = /^(-?\d*\.?\d+)(em)?$/.exec(value.trim())
        if (match) {
          theme.tracking = clamp(Number.parseFloat(match[1]), minTracking, maxTracking)
          extras += 1
        } else {
          invalid.push(`--${name}: ${value}`)
        }
        continue
      }
      if (mode === "light" && name === "shadow-color") {
        const color = parseColor(value)
        if (color) {
          theme.shadow.color = { ...color, a: 1 }
          extras += 1
        } else {
          invalid.push(`--${name}: ${value}`)
        }
        continue
      }
      if (mode === "light" && /^shadow-(opacity|blur|spread|x|y|offset-x|offset-y)$/.test(name)) {
        const number =
          name === "shadow-opacity" ? Number.parseFloat(value) : parseLength(value)
        if (number === null || !Number.isFinite(number)) {
          invalid.push(`--${name}: ${value}`)
        } else {
          shadowParams[name.replace("offset-", "").slice(7)] = number
        }
        continue
      }
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

  for (const [key, number] of Object.entries(shadowParams)) {
    const limit = shadowLimits[key as keyof typeof shadowLimits]
    if (!limit) continue
    theme.shadow[key as keyof typeof shadowLimits] =
      key === "opacity" ? clamp(number, limit[0], limit[1]) : Math.round(clamp(number, limit[0], limit[1]))
    extras += 1
  }

  if (found === 0 && extras === 0) return null

  const darkFound = tokenNames.some((name) => seen.has(`dark:${name}`))
  const missing = tokenNames.filter(
    (name) =>
      !seen.has(`light:${name}`) || (darkFound && !seen.has(`dark:${name}`))
  )

  return { theme, found, missing, invalid }
}

export {
  hasCustomText,
  hasCustomTracking,
  parseThemeCss,
  themeExtras,
  themeInlineExtras,
  themeToCss,
  themeToJson,
  type ParseResult,
}
