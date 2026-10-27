import { describe, expect, it } from "vitest"

import {
  apcaContrast,
  contrastRatio,
  formatOklch,
  inGamut,
  parseColor,
  toHex,
} from "@/lib/theme-editor/color"
import { parseThemeCss, themeToCss, themeToJson } from "@/lib/theme-editor/css"
import {
  decodeTheme,
  encodeTheme,
  maxEncodedLength,
  normalizeTheme,
} from "@/lib/theme-editor/encode"
import { generateTheme } from "@/lib/theme-editor/generate"
import { extractPalette, pickBrand } from "@/lib/theme-editor/image"
import { themePresets } from "@/lib/theme-editor/presets"
import { buildThemeItem } from "@/lib/theme-editor/registry"
import {
  checkContrast,
  defaultTheme,
  themeModes,
} from "@/lib/theme-editor/theme"
import { tokenNames } from "@/lib/theme-editor/tokens"

function color(value: string) {
  const parsed = parseColor(value)
  if (!parsed) throw new Error(`Unparsable ${value}`)
  return parsed
}

describe("color", () => {
  it("parses hex, rgb, hsl, oklch and bare shadcn hsl", () => {
    expect(toHex(color("#3b82f6"))).toBe("#3b82f6")
    expect(toHex(color("#fff"))).toBe("#ffffff")
    expect(toHex(color("rgb(59 130 246)"))).toBe("#3b82f6")
    expect(toHex(color("rgba(59, 130, 246, 0.5)"))).toBe("#3b82f6")
    expect(toHex(color("hsl(217.2 91.2% 59.8%)"))).toBe("#3b82f6")
    expect(toHex(color("217.2 91.2% 59.8%"))).toBe("#3b82f6")
    expect(formatOklch(color("oklch(0.5 0.1 200 / 40%)"))).toBe(
      "oklch(0.5 0.1 200 / 40%)"
    )
    expect(color("oklch(1 0 0 / 10%)").a).toBeCloseTo(0.1)
  })

  it("rejects garbage", () => {
    for (const value of ["", "red-ish", "#12", "oklch(a b c)", "url(x)"]) {
      expect(parseColor(value), value).toBeNull()
    }
  })

  it("round-trips hex through OKLCH", () => {
    for (const hex of ["#000000", "#ffffff", "#ff0000", "#00ff00", "#123456"]) {
      expect(toHex(color(hex))).toBe(hex)
    }
  })

  it("measures WCAG and APCA contrast", () => {
    expect(contrastRatio(color("#000"), color("#fff"))).toBeCloseTo(21, 0)
    expect(contrastRatio(color("#777"), color("#fff"))).toBeCloseTo(4.48, 1)
    expect(apcaContrast(color("#000"), color("#fff"))).toBeCloseTo(106, 0)
    expect(apcaContrast(color("#fff"), color("#000"))).toBeCloseTo(-108, 0)
  })
})

describe("share encoding", () => {
  it("round-trips every preset", () => {
    for (const preset of themePresets) {
      const encoded = encodeTheme(preset.theme)
      expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/)
      expect(encoded.length).toBeLessThan(maxEncodedLength)
      const decoded = decodeTheme(encoded)
      expect(decoded, preset.slug).not.toBeNull()
      expect(encodeTheme(decoded!)).toBe(encoded)
      for (const mode of themeModes) {
        for (const name of tokenNames) {
          const a = preset.theme[mode][name]
          const b = decoded![mode][name]
          expect(Math.abs(a.l - b.l)).toBeLessThan(0.001)
          expect(Math.abs(a.c - b.c)).toBeLessThan(0.001)
          expect(Math.abs(a.a - b.a)).toBeLessThan(0.01)
        }
      }
      expect(decoded!.radius).toBeCloseTo(preset.theme.radius, 2)
    }
  })

  it("keeps the default theme short", () => {
    expect(encodeTheme(defaultTheme).length).toBeLessThan(260)
  })

  it("rejects malformed ids", () => {
    const valid = encodeTheme(defaultTheme)
    for (const value of [
      "",
      "!!!",
      valid.slice(0, -4),
      `${valid}AAAA`,
      "AAAA",
      "x".repeat(maxEncodedLength + 1),
    ]) {
      expect(decodeTheme(value), value.slice(0, 20)).toBeNull()
    }
  })
})

describe("generator", () => {
  const brands = [
    "#2563eb",
    "#16a34a",
    "#facc15",
    "#e11d48",
    "#7c3aed",
    "#0f172a",
    "#f5f5f4",
    "#06b6d4",
    "#f97316",
    "#000000",
    "#ffffff",
  ]

  it("passes WCAG AA for every text pair in both modes", () => {
    for (const brand of brands) {
      for (const tint of [0, 0.5, 1]) {
        const theme = generateTheme(color(brand), { tint })
        for (const mode of themeModes) {
          const failing = checkContrast(theme, mode).filter(
            (result) => !result.passes
          )
          expect(
            failing.map(
              (result) =>
                `${brand} ${mode} ${result.foreground}/${result.background} ${result.ratio.toFixed(2)}`
            )
          ).toEqual([])
        }
      }
    }
  })

  it("stays in the sRGB gamut", () => {
    const theme = generateTheme(color("oklch(0.7 0.37 145)"))
    for (const mode of themeModes) {
      for (const name of tokenNames.filter(
        (token) => !/^(destructive|success|info|warning)/.test(token)
      )) {
        expect(inGamut(theme[mode][name]), `${mode} ${name}`).toBe(true)
      }
    }
  })

  it("keeps the brand hue on primary", () => {
    const theme = generateTheme(color("#2563eb"))
    expect(Math.abs(theme.light.primary.h - color("#2563eb").h)).toBeLessThan(1)
  })

  it("ships presets that pass contrast", () => {
    for (const preset of themePresets.filter((item) => item.slug !== "hextaui")) {
      for (const mode of themeModes) {
        expect(
          checkContrast(preset.theme, mode).filter((result) => !result.passes),
          `${preset.slug} ${mode}`
        ).toEqual([])
      }
    }
  })
})

describe("CSS import and export", () => {
  it("round-trips its own CSS export", () => {
    const theme = normalizeTheme(themePresets[3].theme)
    const parsed = parseThemeCss(themeToCss(theme))
    expect(parsed?.missing).toEqual([])
    expect(parsed?.invalid).toEqual([])
    expect(encodeTheme(parsed!.theme)).toBe(encodeTheme(theme))
  })

  it("round-trips its own JSON export", () => {
    const theme = normalizeTheme(themePresets[2].theme)
    const parsed = parseThemeCss(themeToJson(theme))
    expect(encodeTheme(parsed!.theme)).toBe(encodeTheme(theme))
  })

  it("reads shadcn v3 HSL themes inside @layer base", () => {
    const parsed = parseThemeCss(`
      @layer base {
        :root {
          --background: 0 0% 100%;
          --foreground: 222.2 84% 4.9%;
          --primary: 221.2 83.2% 53.3%;
          --radius: 0.5rem;
        }
        .dark {
          --background: 222.2 84% 4.9%;
          --primary: 217.2 91.2% 59.8%;
        }
      }
    `)
    expect(parsed).not.toBeNull()
    expect(parsed!.found).toBe(5)
    expect(parsed!.theme.radius).toBe(0.5)
    expect(toHex(parsed!.theme.light.primary)).toBe("#2563eb")
    expect(toHex(parsed!.theme.dark.primary)).toBe("#3b82f6")
    expect(parsed!.missing).toContain("card")
  })

  it("reads tweakcn exports with hex, oklch and extra variables", () => {
    const parsed = parseThemeCss(`
      :root {
        --background: #fdfdfd;
        --primary: oklch(0.6 0.2 30);
        --font-sans: Inter, sans-serif;
        --shadow-sm: 0 1px 2px rgb(0 0 0 / 0.1);
        --radius: 12px;
      }
      .dark { --background: oklch(0.2 0.01 30); }
      @theme inline { --color-background: var(--background); }
    `)
    expect(parsed!.found).toBe(3)
    expect(parsed!.theme.radius).toBe(0.75)
    expect(parsed!.invalid).toEqual([])
  })

  it("reports invalid values and returns null without tokens", () => {
    const parsed = parseThemeCss(":root { --primary: nope; --background: #fff }")
    expect(parsed!.invalid).toEqual(["--primary: nope"])
    expect(parseThemeCss("body { color: red }")).toBeNull()
    expect(parseThemeCss("")).toBeNull()
  })

  it("exports Tailwind v4 CSS with an @theme inline mapping", () => {
    const css = themeToCss(defaultTheme)
    expect(css).toContain(":root {\n  --radius: 0.8rem;")
    expect(css).toContain(".dark {")
    expect(css).toContain("--color-sidebar-ring: var(--sidebar-ring);")
    expect(css).toContain("--border: oklch(1 0 0 / 10%);")
  })
})

describe("theme registry item", () => {
  it("builds a registry:theme item from an id", () => {
    const id = encodeTheme(themePresets[2].theme)
    const result = buildThemeItem(`${id}.json`)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.item.type).toBe("registry:theme")
    expect(result.item.name).toMatch(/^hextaui-theme-[a-z0-9]+$/)
    expect(result.item.cssVars.light.radius).toBe("0.75rem")
    expect(result.item.cssVars.light.primary).toMatch(/^oklch\(/)
    expect(Object.keys(result.item.cssVars.dark)).toHaveLength(tokenNames.length)
    expect(result.item.cssVars.theme["color-success"]).toBe("var(--success)")
  })

  it("rejects bad ids with a reason", () => {
    for (const id of ["", "a b", "x".repeat(2000), "AAAA.json"]) {
      const result = buildThemeItem(id)
      expect(result.ok).toBe(false)
      if (!result.ok) expect(result.detail.length).toBeGreaterThan(10)
    }
  })
})

describe("image palette", () => {
  it("finds the brand color in a mostly white image", () => {
    const pixels = new Uint8ClampedArray(100 * 4)
    for (let index = 0; index < 100; index += 1) {
      const blue = index < 30
      pixels.set(blue ? [37, 99, 235, 255] : [250, 250, 250, 255], index * 4)
    }
    const swatches = extractPalette(pixels)
    expect(swatches[0].weight).toBeCloseTo(0.7, 1)
    const brand = pickBrand(swatches)
    expect(toHex(brand!)).toBe("#2563eb")
  })

  it("ignores transparent pixels and empty images", () => {
    expect(extractPalette(new Uint8ClampedArray(16))).toEqual([])
    expect(pickBrand([])).toBeNull()
  })
})
