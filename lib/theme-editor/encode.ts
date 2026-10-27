import { fromBase64Url, toBase64Url } from "@/lib/base64url"
import { clamp, type Oklch } from "@/lib/theme-editor/color"
import {
  maxRadius,
  themeModes,
  type Theme,
  type ThemeColors,
} from "@/lib/theme-editor/theme"
import { tokenNames } from "@/lib/theme-editor/tokens"

const formatVersion = 1
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
        const packed = ((color.l << 22) | (color.c << 12) | color.h) >>> 0
        bytes.push(
          alpha ? tagColorAlpha : tagColor,
          (packed >>> 24) & 0xff,
          (packed >>> 16) & 0xff,
          (packed >>> 8) & 0xff,
          packed & 0xff
        )
      }
      if (alpha) bytes.push(color.a)
    }
  }

  return toBase64Url(Uint8Array.from(bytes))
}

function decodeTheme(value: string): Theme | null {
  if (!value || value.length > maxEncodedLength) return null
  const bytes = fromBase64Url(value)
  if (!bytes || bytes.length < 2 || bytes[0] !== formatVersion) return null

  const radius = bytes[1] / 100
  if (radius > maxRadius) return null

  const palette: Quantized[] = []
  let offset = 2
  const read = () => {
    if (offset >= bytes.length) throw new Error("truncated")
    return bytes[offset++]
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
          const packed =
            ((read() << 24) | (read() << 16) | (read() << 8) | read()) >>> 0
          color = {
            l: packed >>> 22,
            c: (packed >>> 12) & 0x3ff,
            h: packed & 0xfff,
            a: 100,
          }
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
    if (offset !== bytes.length) return null
    return { radius, light: modes.light, dark: modes.dark }
  } catch {
    return null
  }
}

function normalizeTheme(theme: Theme): Theme {
  return decodeTheme(encodeTheme(theme)) as Theme
}

export { decodeTheme, encodeTheme, maxEncodedLength, normalizeTheme }
