import { fromBase64Url, toBase64Url } from "@/lib/base64url"
import { clamp, type Oklch } from "@/lib/theme-editor/color"
import { fontNames, sanitizeFontName } from "@/lib/theme-editor/fonts"
import { defaultShadow, type ThemeShadow } from "@/lib/theme-editor/shadow"
import {
  defaultFonts,
  defaultTextBase,
  defaultTheme,
  defaultTracking,
  hasCustomFonts,
  hasCustomShadow,
  maxRadius,
  maxTextBase,
  maxTracking,
  minTextBase,
  minTracking,
  themeModes,
  type Theme,
  type ThemeColors,
  type ThemeFonts,
} from "@/lib/theme-editor/theme"
import { tokenNames } from "@/lib/theme-editor/tokens"

const legacyVersion = 1
const formatVersion = 2
const maxEncodedLength = 1200

const tagColor = 0x80
const tagColorAlpha = 0x81
const tagGray = 0x82
const tagGrayAlpha = 0x83

type Quantized = { l: number; c: number; h: number; a: number }

function quantize(color: Oklch): Quantized {
  const c = clamp(Math.round(color.c * 1000), 0, 1023)
  return {
    l: clamp(Math.round(color.l * 1000), 0, 1000),
    c,
    h: c === 0 ? 0 : Math.round(color.h * 10) % 3600,
    a: clamp(Math.round(color.a * 100), 0, 100),
  }
}

function dequantize({ l, c, h, a }: Quantized): Oklch {
  return { l: l / 1000, c: c / 1000, h: h / 10, a: a / 100 }
}

function key({ l, c, h, a }: Quantized) {
  return `${l}.${c}.${h}.${a}`
}

const flagFonts = 1
const flagTracking = 2
const flagTextBase = 4
const flagShadow = 8
const tagCustomFont = 0xff

function signed(value: number) {
  return value < 0 ? value + 256 : value
}

function unsigned(value: number) {
  return value > 127 ? value - 256 : value
}

function packColor(color: Quantized) {
  return ((color.l << 22) | (color.c << 12) | color.h) >>> 0
}

function pushPacked(bytes: number[], packed: number) {
  bytes.push(
    (packed >>> 24) & 0xff,
    (packed >>> 16) & 0xff,
    (packed >>> 8) & 0xff,
    packed & 0xff
  )
}

function encodeFont(bytes: number[], name: string) {
  const index = fontNames.indexOf(name)
  if (index !== -1 && index < tagCustomFont) {
    bytes.push(index)
    return
  }
  const clean = sanitizeFontName(name)
  bytes.push(tagCustomFont, clean.length)
  for (const char of clean) bytes.push(char.charCodeAt(0))
}

function encodeExtras(bytes: number[], theme: Theme) {
  const fonts = hasCustomFonts(theme)
  const tracking = Math.round(theme.tracking * 1000) !== 0
  const textBase = Math.round(theme.textBase) !== defaultTextBase
  const shadow = hasCustomShadow(theme)
  bytes.push(
    (fonts ? flagFonts : 0) |
      (tracking ? flagTracking : 0) |
      (textBase ? flagTextBase : 0) |
      (shadow ? flagShadow : 0)
  )
  if (fonts) {
    encodeFont(bytes, theme.fonts.sans)
    encodeFont(bytes, theme.fonts.serif)
    encodeFont(bytes, theme.fonts.mono)
  }
  if (tracking) {
    bytes.push(
      signed(
        clamp(Math.round(theme.tracking * 1000), minTracking * 1000, maxTracking * 1000)
      )
    )
  }
  if (textBase) {
    bytes.push(clamp(Math.round(theme.textBase), minTextBase, maxTextBase))
  }
  if (shadow) {
    const value = theme.shadow
    pushPacked(bytes, packColor(quantize({ ...value.color, a: 1 })))
    bytes.push(
      clamp(Math.round(value.opacity * 100), 0, 100),
      clamp(Math.round(value.blur), 0, 127),
      signed(clamp(Math.round(value.spread), -64, 64)),
      signed(clamp(Math.round(value.x), -64, 64)),
      signed(clamp(Math.round(value.y), -64, 64))
    )
  }
}

function encodeTheme(theme: Theme) {
  const bytes: number[] = [
    formatVersion,
    clamp(Math.round(theme.radius * 100), 0, maxRadius * 100),
  ]
  const palette: string[] = []

  for (const mode of themeModes) {
    for (const name of tokenNames) {
      const color = quantize(theme[mode][name])
      const id = key(color)
      const index = palette.indexOf(id)
      if (index !== -1 && index < 0x80) {
        bytes.push(index)
        continue
      }
      palette.push(id)
      const alpha = color.a < 100
      if (color.c === 0) {
        bytes.push(alpha ? tagGrayAlpha : tagGray, color.l >> 8, color.l & 0xff)
      } else {
        bytes.push(alpha ? tagColorAlpha : tagColor)
        pushPacked(bytes, packColor(color))
      }
      if (alpha) bytes.push(color.a)
    }
  }

  encodeExtras(bytes, theme)
  return toBase64Url(Uint8Array.from(bytes))
}

function unpackColor(packed: number): Quantized {
  return {
    l: packed >>> 22,
    c: (packed >>> 12) & 0x3ff,
    h: packed & 0xfff,
    a: 100,
  }
}

function decodeTheme(value: string): Theme | null {
  if (!value || value.length > maxEncodedLength) return null
  const bytes = fromBase64Url(value)
  if (!bytes || bytes.length < 2) return null
  const version = bytes[0]
  if (version !== legacyVersion && version !== formatVersion) return null

  const radius = bytes[1] / 100
  if (radius > maxRadius) return null

  const palette: Quantized[] = []
  let offset = 2
  const read = () => {
    if (offset >= bytes.length) throw new Error("truncated")
    return bytes[offset++]
  }
  const readPacked = () =>
    ((read() << 24) | (read() << 16) | (read() << 8) | read()) >>> 0
  const readFont = () => {
    const tag = read()
    if (tag !== tagCustomFont) {
      const name = fontNames[tag]
      if (!name) throw new Error("font")
      return name
    }
    const length = read()
    let name = ""
    for (let index = 0; index < length; index += 1) {
      name += String.fromCharCode(read())
    }
    const clean = sanitizeFontName(name)
    if (!clean || clean !== name) throw new Error("font")
    return clean
  }

  try {
    const modes = {} as Record<"light" | "dark", ThemeColors>
    for (const mode of themeModes) {
      const colors = {} as ThemeColors
      for (const name of tokenNames) {
        const tag = read()
        let color: Quantized
        if (tag < 0x80) {
          const found = palette[tag]
          if (!found) return null
          color = found
        } else if (tag === tagGray || tag === tagGrayAlpha) {
          const l = (read() << 8) | read()
          color = { l, c: 0, h: 0, a: 100 }
          if (tag === tagGrayAlpha) color.a = read()
          palette.push(color)
        } else if (tag === tagColor || tag === tagColorAlpha) {
          color = unpackColor(readPacked())
          if (tag === tagColorAlpha) color.a = read()
          palette.push(color)
        } else {
          return null
        }
        if (color.l > 1000 || color.h >= 3600 || color.a > 100) return null
        colors[name] = dequantize(color)
      }
      modes[mode] = colors
    }
    let fonts: ThemeFonts = defaultFonts
    let tracking = defaultTracking
    let textBase = defaultTextBase
    let shadow: ThemeShadow = defaultShadow
    if (version === formatVersion) {
      const flags = read()
      if (flags > 15) return null
      if (flags & flagFonts) {
        fonts = { sans: readFont(), serif: readFont(), mono: readFont() }
      }
      if (flags & flagTracking) {
        tracking = unsigned(read()) / 1000
        if (tracking < minTracking || tracking > maxTracking) return null
      }
      if (flags & flagTextBase) {
        textBase = read()
        if (textBase < minTextBase || textBase > maxTextBase) return null
      }
      if (flags & flagShadow) {
        const color = unpackColor(readPacked())
        if (color.l > 1000 || color.h >= 3600) return null
        const opacity = read()
        if (opacity > 100) return null
        shadow = {
          color: dequantize(color),
          opacity: opacity / 100,
          blur: read(),
          spread: unsigned(read()),
          x: unsigned(read()),
          y: unsigned(read()),
        }
      }
    }
    if (offset !== bytes.length) return null
    return {
      ...defaultTheme,
      radius,
      light: modes.light,
      dark: modes.dark,
      fonts,
      tracking,
      textBase,
      shadow,
    }
  } catch {
    return null
  }
}

function normalizeTheme(theme: Theme): Theme {
  return decodeTheme(encodeTheme(theme)) as Theme
}

export {
  decodeTheme,
  encodeTheme,
  formatVersion,
  maxEncodedLength,
  normalizeTheme,
}
