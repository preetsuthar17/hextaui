type Oklch = { l: number; c: number; h: number; a: number }

type Rgb = { r: number; g: number; b: number; a: number }

const namedColors: Record<string, string> = {
  white: "#ffffff",
  black: "#000000",
  transparent: "#00000000",
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function round(value: number, digits: number) {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

function normalizeHue(hue: number) {
  const value = hue % 360
  return value < 0 ? value + 360 : value
}

function srgbToLinear(value: number) {
  const abs = Math.abs(value)
  return abs <= 0.04045
    ? value / 12.92
    : Math.sign(value) * ((abs + 0.055) / 1.055) ** 2.4
}

function linearToSrgb(value: number) {
  const abs = Math.abs(value)
  return abs <= 0.0031308
    ? value * 12.92
    : Math.sign(value) * (1.055 * abs ** (1 / 2.4) - 0.055)
}

function rgbToOklch({ r, g, b, a }: Rgb): Oklch {
  const lr = srgbToLinear(r)
  const lg = srgbToLinear(g)
  const lb = srgbToLinear(b)
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  const c = Math.hypot(A, B)
  const h = c < 1e-4 ? 0 : normalizeHue((Math.atan2(B, A) * 180) / Math.PI)
  return { l: clamp(L, 0, 1), c: c < 1e-4 ? 0 : c, h, a }
}

function oklchToLinear({ l, c, h }: Oklch) {
  const rad = (h * Math.PI) / 180
  const A = c * Math.cos(rad)
  const B = c * Math.sin(rad)
  const l1 = (l + 0.3963377774 * A + 0.2158037573 * B) ** 3
  const m1 = (l - 0.1055613458 * A - 0.0638541728 * B) ** 3
  const s1 = (l - 0.0894841775 * A - 1.291485548 * B) ** 3
  return {
    r: 4.0767416621 * l1 - 3.3077115913 * m1 + 0.2309699292 * s1,
    g: -1.2684380046 * l1 + 2.6097574011 * m1 - 0.3413193965 * s1,
    b: -0.0041960863 * l1 - 0.7034186147 * m1 + 1.707614701 * s1,
  }
}

function inGamut(color: Oklch) {
  const { r, g, b } = oklchToLinear(color)
  const epsilon = 1e-4
  return [r, g, b].every((value) => value >= -epsilon && value <= 1 + epsilon)
}

function toGamut(color: Oklch): Oklch {
  if (inGamut(color)) return color
  let low = 0
  let high = color.c
  for (let step = 0; step < 24; step += 1) {
    const mid = (low + high) / 2
    if (inGamut({ ...color, c: mid })) low = mid
    else high = mid
  }
  return { ...color, c: low }
}

function oklchToRgb(color: Oklch): Rgb {
  const { r, g, b } = oklchToLinear(toGamut(color))
  return {
    r: clamp(linearToSrgb(r), 0, 1),
    g: clamp(linearToSrgb(g), 0, 1),
    b: clamp(linearToSrgb(b), 0, 1),
    a: color.a,
  }
}

function hslToRgb(h: number, s: number, l: number, a: number): Rgb {
  const k = (n: number) => (n + h / 30) % 12
  const f = (n: number) =>
    l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))
  return { r: f(0), g: f(8), b: f(4), a }
}

function parseNumber(token: string, percentScale = 1) {
  const value = token.trim()
  if (value === "none") return 0
  if (value.endsWith("%")) {
    const number = Number.parseFloat(value)
    return Number.isFinite(number) ? (number / 100) * percentScale : Number.NaN
  }
  const number = Number.parseFloat(value)
  return /^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?(deg)?$/i.test(value)
    ? number
    : Number.NaN
}

function parseAlpha(token: string | undefined) {
  if (token === undefined) return 1
  const value = parseNumber(token)
  return Number.isFinite(value) ? clamp(value, 0, 1) : Number.NaN
}

function splitArgs(body: string) {
  const [main, alpha] = body.includes("/")
    ? body.split("/").map((part) => part.trim())
    : [body, undefined]
  const parts = main.split(/[\s,]+/).filter(Boolean)
  if (alpha === undefined && parts.length === 4 && body.includes(",")) {
    return { parts: parts.slice(0, 3), alpha: parts[3] }
  }
  return { parts, alpha }
}

function parseHex(value: string): Rgb | null {
  const hex = value.slice(1)
  if (!/^([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(hex)) {
    return null
  }
  const full =
    hex.length <= 4
      ? hex
          .split("")
          .map((char) => char + char)
          .join("")
      : hex
  const byte = (index: number) =>
    Number.parseInt(full.slice(index * 2, index * 2 + 2), 16) / 255
  return {
    r: byte(0),
    g: byte(1),
    b: byte(2),
    a: full.length === 8 ? byte(3) : 1,
  }
}

function parseColor(input: string): Oklch | null {
  const value = input.trim().toLowerCase().replace(/;$/, "")
  if (!value) return null
  const named = namedColors[value]
  if (named) return parseColor(named)
  if (value.startsWith("#")) {
    const rgb = parseHex(value)
    return rgb ? rgbToOklch(rgb) : null
  }

  const call = /^([a-z]+)\((.*)\)$/.exec(value)
  if (!call) {
    const bare = splitArgs(value)
    if (bare.parts.length === 3 && bare.parts[1].endsWith("%")) {
      return parseColor(`hsl(${value})`)
    }
    return null
  }

  const [, fn, body] = call
  const { parts, alpha: alphaToken } = splitArgs(body)
  if (parts.length !== 3) return null
  const alpha = parseAlpha(alphaToken)
  if (!Number.isFinite(alpha)) return null

  if (fn === "oklch") {
    const l = parseNumber(parts[0])
    const c = parseNumber(parts[1], 0.4)
    const h = parseNumber(parts[2])
    if (![l, c, h].every(Number.isFinite)) return null
    return {
      l: clamp(l, 0, 1),
      c: Math.max(0, c),
      h: normalizeHue(h),
      a: alpha,
    }
  }

  if (fn === "rgb" || fn === "rgba") {
    const channels = parts.map((part) =>
      part.endsWith("%") ? parseNumber(part) : parseNumber(part) / 255
    )
    if (!channels.every(Number.isFinite)) return null
    const [r, g, b] = channels.map((channel) => clamp(channel, 0, 1))
    return rgbToOklch({ r, g, b, a: alpha })
  }

  if (fn === "hsl" || fn === "hsla") {
    const h = parseNumber(parts[0])
    const s = parseNumber(parts[1].endsWith("%") ? parts[1] : `${parts[1]}%`)
    const l = parseNumber(parts[2].endsWith("%") ? parts[2] : `${parts[2]}%`)
    if (![h, s, l].every(Number.isFinite)) return null
    return rgbToOklch(
      hslToRgb(normalizeHue(h), clamp(s, 0, 1), clamp(l, 0, 1), alpha)
    )
  }

  return null
}

function formatOklch(color: Oklch) {
  const l = round(color.l, 3)
  const c = round(color.c, 3)
  const h = c === 0 ? 0 : round(color.h, 1)
  const alpha =
    color.a < 1 ? ` / ${round(color.a * 100, 0)}%` : ""
  return `oklch(${l} ${c} ${h}${alpha})`
}

function toHex(color: Oklch, withAlpha = false) {
  const { r, g, b, a } = oklchToRgb(color)
  const channels = withAlpha && a < 1 ? [r, g, b, a] : [r, g, b]
  return `#${channels
    .map((channel) =>
      Math.round(channel * 255)
        .toString(16)
        .padStart(2, "0")
    )
    .join("")}`
}

function toHsl(color: Oklch) {
  const { r, g, b, a } = oklchToRgb(color)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  const d = max - min
  let h = 0
  let s = 0
  if (d > 1e-6) {
    s = d / (1 - Math.abs(2 * l - 1))
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h = normalizeHue(h * 60)
  }
  return { h, s, l, a }
}

function formatHslChannels(color: Oklch) {
  const { h, s, l, a } = toHsl(color)
  const alpha = a < 1 ? ` / ${round(a * 100, 0)}%` : ""
  return `${round(h, 1)} ${round(s * 100, 1)}% ${round(l * 100, 1)}%${alpha}`
}

function formatRgb(color: Oklch) {
  const { r, g, b, a } = oklchToRgb(color)
  const channels = [r, g, b].map((channel) => Math.round(channel * 255))
  return a < 1
    ? `rgba(${channels.join(", ")}, ${round(a, 2)})`
    : `rgb(${channels.join(", ")})`
}

function relativeLuminance({ r, g, b }: Rgb) {
  return (
    0.2126 * srgbToLinear(r) +
    0.7152 * srgbToLinear(g) +
    0.0722 * srgbToLinear(b)
  )
}

function composite(top: Rgb, bottom: Rgb): Rgb {
  const a = top.a
  return {
    r: top.r * a + bottom.r * (1 - a),
    g: top.g * a + bottom.g * (1 - a),
    b: top.b * a + bottom.b * (1 - a),
    a: 1,
  }
}

function flatten(color: Oklch, backdrop: Oklch) {
  const base = oklchToRgb({ ...backdrop, a: 1 })
  return color.a < 1 ? composite(oklchToRgb(color), base) : oklchToRgb(color)
}

function contrastRatio(foreground: Oklch, background: Oklch, backdrop?: Oklch) {
  const bg = flatten(background, backdrop ?? { l: 1, c: 0, h: 0, a: 1 })
  const fg = composite(oklchToRgb(foreground), bg)
  const a = relativeLuminance(fg)
  const b = relativeLuminance(bg)
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

function apcaY({ r, g, b }: Rgb) {
  return (
    0.2126729 * r ** 2.4 + 0.7151522 * g ** 2.4 + 0.072175 * b ** 2.4
  )
}

function apcaContrast(foreground: Oklch, background: Oklch, backdrop?: Oklch) {
  const bg = flatten(background, backdrop ?? { l: 1, c: 0, h: 0, a: 1 })
  const fg = composite(oklchToRgb(foreground), bg)
  const soft = (y: number) => (y > 0.022 ? y : y + (0.022 - y) ** 1.414)
  const text = soft(apcaY(fg))
  const surface = soft(apcaY(bg))
  if (Math.abs(surface - text) < 0.0005) return 0
  if (surface > text) {
    const value = (surface ** 0.56 - text ** 0.57) * 1.14
    return value < 0.1 ? 0 : (value - 0.027) * 100
  }
  const value = (surface ** 0.65 - text ** 0.62) * 1.14
  return value > -0.1 ? 0 : (value + 0.027) * 100
}

function sameColor(a: Oklch, b: Oklch) {
  return formatOklch(a) === formatOklch(b)
}

export {
  apcaContrast,
  clamp,
  contrastRatio,
  formatHslChannels,
  formatOklch,
  formatRgb,
  inGamut,
  normalizeHue,
  oklchToRgb,
  parseColor,
  rgbToOklch,
  round,
  sameColor,
  toGamut,
  toHex,
  toHsl,
  type Oklch,
  type Rgb,
}
