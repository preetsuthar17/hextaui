import { describe, expect, it } from "vitest"

import { fromBase64Url, toBase64Url } from "@/lib/base64url"
import { formatOklch, parseColor, toHex } from "@/lib/theme-editor/color"
import { parseThemeCss, themeToCss, themeToJson } from "@/lib/theme-editor/css"
import {
  decodeTheme,
  encodeTheme,
  formatVersion,
  maxEncodedLength,
} from "@/lib/theme-editor/encode"
import { fontStack, googleFontsUrl, parseFontStack } from "@/lib/theme-editor/fonts"
import {
  exportFormats,
  tailwindV3Config,
  themeToDtcg,
  themeToFigma,
  themeToScss,
  themeToV3Css,
} from "@/lib/theme-editor/formats"
import { themePresets } from "@/lib/theme-editor/presets"
import { buildThemeItem } from "@/lib/theme-editor/registry"
import {
  parseSavedThemes,
  removeTheme,
  saveTheme,
  updateTheme,
} from "@/lib/theme-editor/saved"
import { defaultShadow, shadowScale } from "@/lib/theme-editor/shadow"
import {
  checkContrast,
  defaultTheme,
  previewVars,
  themeModes,
  type Theme,
} from "@/lib/theme-editor/theme"
import {
  adjustTheme,
  applyHarmony,
  colorScale,
  deriveLinked,
  harmonyColors,
  scaleToCss,
  shuffleTheme,
} from "@/lib/theme-editor/tools"
import { tokenNames, type TokenName } from "@/lib/theme-editor/tokens"

function color(value: string) {
  const parsed = parseColor(value)
  if (!parsed) throw new Error(`Unparsable ${value}`)
  return parsed
}

const styled: Theme = {
  ...themePresets[2].theme,
  fonts: { sans: "Plus Jakarta Sans", serif: "Lora", mono: "My Custom Mono" },
  tracking: -0.02,
  textBase: 17,
  shadow: {
    color: color("oklch(0.3 0.05 260)"),
    opacity: 0.18,
    blur: 6,
    spread: -1,
    x: 1,
    y: 3,
  },
}

function seeded(seed: number) {
  let value = seed
  return () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}

describe("share encoding v2", () => {
  it("round-trips fonts, tracking, text size and shadows", () => {
    const id = encodeTheme(styled)
    expect(fromBase64Url(id)?.[0]).toBe(formatVersion)
    const decoded = decodeTheme(id)!
    expect(decoded.fonts).toEqual(styled.fonts)
    expect(decoded.tracking).toBeCloseTo(-0.02, 3)
    expect(decoded.textBase).toBe(17)
    expect(decoded.shadow.opacity).toBeCloseTo(0.18, 2)
    expect(decoded.shadow).toMatchObject({ blur: 6, spread: -1, x: 1, y: 3 })
    expect(formatOklch(decoded.shadow.color)).toBe("oklch(0.3 0.05 260)")
    expect(encodeTheme(decoded)).toBe(id)
  })

  it("adds one byte for a theme with default extras", () => {
    const bytes = fromBase64Url(encodeTheme(defaultTheme))!
    expect(bytes[bytes.length - 1]).toBe(0)
    expect(encodeTheme(defaultTheme).length).toBeLessThan(260)
  })

  it("still opens version 1 links", () => {
    for (const preset of themePresets.slice(0, 4)) {
      const bytes = fromBase64Url(encodeTheme({ ...defaultTheme, ...preset.theme, fonts: defaultTheme.fonts, tracking: 0, shadow: defaultShadow }))!
      const legacy = toBase64Url(Uint8Array.from([1, ...bytes.slice(1, -1)]))
      const decoded = decodeTheme(legacy)
      expect(decoded, preset.slug).not.toBeNull()
      expect(decoded!.fonts).toEqual(defaultTheme.fonts)
      expect(formatOklch(decoded!.light.primary)).toBe(
        formatOklch(decodeTheme(encodeTheme(preset.theme))!.light.primary)
      )
      expect(buildThemeItem(legacy).ok).toBe(true)
    }
  })

  it("keeps every preset under the length limit", () => {
    for (const preset of themePresets) {
      const id = encodeTheme(preset.theme)
      expect(id.length).toBeLessThan(maxEncodedLength)
      expect(decodeTheme(id)!.fonts, preset.slug).toEqual(preset.theme.fonts)
    }
  })

  it("rejects unknown flags and bad font bytes", () => {
    const bytes = fromBase64Url(encodeTheme(defaultTheme))!
    bytes[bytes.length - 1] = 0x40
    expect(decodeTheme(toBase64Url(bytes))).toBeNull()
    const fonts = Uint8Array.from([...bytes.slice(0, -1), 1, 200, 0, 0])
    expect(decodeTheme(toBase64Url(fonts))).toBeNull()
  })
})

describe("typography and shadows", () => {
  it("matches the Tailwind shadow scale by default", () => {
    const scale = shadowScale(defaultShadow)
    expect(scale.md).toBe(
      "0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.1)"
    )
    expect(scale["2xl"]).toBe("0 25px 50px -12px oklch(0 0 0 / 0.25)")
    expect(scale["2xs"]).toBe("0 1px 0 0 oklch(0 0 0 / 0.05)")
  })

  it("builds font stacks and a Google Fonts URL", () => {
    expect(fontStack("Plus Jakarta Sans", "sans")).toBe(
      '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif'
    )
    expect(fontStack("System", "mono")).toContain("ui-monospace")
    expect(googleFontsUrl(["Inter", "Lato", "System", "Nope"])).toBe(
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lato:wght@400;700&display=swap"
    )
    expect(googleFontsUrl(["System"])).toBeNull()
    expect(parseFontStack('"DM Sans", sans-serif')).toBe("DM Sans")
    expect(parseFontStack("ui-sans-serif, system-ui")).toBe("System")
    expect(parseFontStack("var(--font-geist)")).toBeNull()
  })

  it("sets preview variables for fonts, tracking, text and shadows", () => {
    const vars = previewVars(styled, "dark")
    expect(vars["--font-sans"]).toContain("Plus Jakarta Sans")
    expect(vars["--tracking-normal"]).toBe("-0.02em")
    expect(vars["--tracking-tight"]).toBe("-0.045em")
    expect(vars["--text-base"]).toBe("1.0625rem")
    expect(vars["--color-primary"]).toBe(vars["--primary"])
    expect(vars["--shadow-md"]).toContain("oklch(0.3 0.05 260 / 0.18)")
  })
})

describe("CSS with extras", () => {
  it("leaves fonts, tracking and shadows out of a default export", () => {
    const css = themeToCss(defaultTheme)
    expect(css).not.toContain("--font-sans")
    expect(css).not.toContain("--shadow")
    expect(css).not.toContain("letter-spacing")
  })

  it("exports and re-imports fonts, tracking and shadows", () => {
    const css = themeToCss(styled)
    expect(css).toContain('--font-sans: "Plus Jakarta Sans", ui-sans-serif')
    expect(css).toContain("--shadow-x: 1px;")
    expect(css).toContain("--tracking-tight: calc(var(--tracking-normal) - 0.025em);")
    expect(css).toContain("--text-base: 1.0625rem;")
    expect(css).toContain("letter-spacing: var(--tracking-normal);")
    const parsed = parseThemeCss(css)!
    expect(parsed.invalid).toEqual([])
    expect(parsed.theme.fonts).toEqual(styled.fonts)
    expect(parsed.theme.tracking).toBeCloseTo(-0.02, 3)
    expect(parsed.theme.shadow).toMatchObject({ blur: 6, spread: -1, x: 1, y: 3 })
  })

  it("reads a tweakcn export with shadow parameters", () => {
    const parsed = parseThemeCss(`
      :root {
        --background: oklch(0.98 0.01 90);
        --primary: oklch(0.55 0.2 260);
        --font-sans: Outfit, sans-serif;
        --font-mono: "JetBrains Mono", monospace;
        --shadow-color: hsl(220 40% 20%);
        --shadow-opacity: 0.15;
        --shadow-blur: 8px;
        --shadow-spread: -2px;
        --shadow-offset-x: 0px;
        --shadow-offset-y: 4px;
        --tracking-normal: 0.01em;
      }
    `)!
    expect(parsed.theme.fonts.sans).toBe("Outfit")
    expect(parsed.theme.fonts.mono).toBe("JetBrains Mono")
    expect(parsed.theme.shadow).toMatchObject({ opacity: 0.15, blur: 8, spread: -2, y: 4 })
    expect(parsed.theme.tracking).toBeCloseTo(0.01)
    expect(parsed.invalid).toEqual([])
  })

  it("reads a tweakcn registry item", () => {
    const parsed = parseThemeCss(
      JSON.stringify({
        name: "x",
        type: "registry:style",
        cssVars: {
          theme: { "font-sans": "Geist, sans-serif", radius: "0.5rem" },
          light: { background: "#ffffff", primary: "oklch(0.6 0.2 30)" },
          dark: { background: "#0a0a0a", primary: "oklch(0.7 0.2 30)" },
        },
      })
    )!
    expect(parsed.theme.fonts.sans).toBe("Geist")
    expect(parsed.theme.radius).toBe(0.5)
    expect(toHex(parsed.theme.dark.background)).toBe("#0a0a0a")
  })

  it("round-trips its JSON export with extras", () => {
    const parsed = parseThemeCss(themeToJson(styled))!
    expect(parsed.theme.fonts).toEqual(styled.fonts)
    expect(parsed.theme.shadow.blur).toBe(6)
  })

  it("puts extras in the registry item", () => {
    const result = buildThemeItem(encodeTheme(styled))
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.item.cssVars.light["font-sans"]).toContain("Plus Jakarta Sans")
    expect(result.item.cssVars.light["shadow-md"]).toBeDefined()
    expect(result.item.cssVars.theme["font-sans"]).toBe("var(--font-sans)")
    expect(result.item.cssVars.theme["text-sm"]).toBe("0.9208rem")
    expect("css" in result.item).toBe(true)
  })
})

describe("export formats", () => {
  it("writes Tailwind v3 HSL and a config", () => {
    const css = themeToV3Css(defaultTheme)
    expect(css).toContain("@layer base {")
    expect(css).toContain("--background: 0 0% 100%;")
    expect(css).toContain("--border: 0 0% 100% / 10%;")
    const config = tailwindV3Config(defaultTheme)
    expect(config).toContain('DEFAULT: "hsl(var(--primary))"')
    expect(config).toContain('"primary-foreground": "hsl(var(--sidebar-primary-foreground))"')
    expect(config).toContain('1: "hsl(var(--chart-1))"')
    expect(config).not.toContain("boxShadow")
    expect(tailwindV3Config(styled)).toContain("boxShadow")
  })

  it("writes SCSS maps", () => {
    const scss = themeToScss(defaultTheme)
    expect(scss).toContain('$light: (\n  "background": #ffffff,')
    expect(scss).toContain('"border": rgba(255, 255, 255, 0.1),')
    expect(scss).toContain("@include theme-vars($dark);")
  })

  it("writes DTCG and Figma JSON", () => {
    const tokens = JSON.parse(themeToDtcg(styled))
    expect(tokens.color.light.primary.$type).toBe("color")
    expect(tokens.color.dark.border.$value.alpha).toBe(0.1)
    expect(tokens.color.light.background.$value.colorSpace).toBe("oklch")
    expect(tokens.shadow.md.$value).toHaveLength(2)
    expect(tokens.font.family.sans.$value[0]).toBe("Plus Jakarta Sans")
    const figma = JSON.parse(themeToFigma(defaultTheme, "light"))
    expect(figma.base.background).toEqual({ $type: "color", $value: "#ffffff" })
    expect(figma.chart["1"].$type).toBe("color")
    expect(figma.sidebar.background.$value).toMatch(/^#/)
  })

  it("lists every format with at least one file", () => {
    for (const format of exportFormats) {
      const files = format.files(styled)
      expect(files.length, format.id).toBeGreaterThan(0)
      for (const file of files) expect(file.value.length).toBeGreaterThan(100)
    }
  })
})

describe("color tools", () => {
  it("builds an 11-step scale that gets darker", () => {
    const scale = colorScale(color("#2563eb"))
    expect(scale.map((item) => item.step)).toEqual([
      50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
    ])
    for (let index = 1; index < scale.length; index += 1) {
      expect(scale[index].color.l).toBeLessThan(scale[index - 1].color.l)
    }
    expect(scaleToCss([{ name: "primary", base: color("#2563eb") }])).toContain(
      "--color-primary-500: oklch("
    )
    expect(colorScale(color("#777777")).every((item) => item.color.c === 0)).toBe(true)
  })

  it("makes harmonies around the brand hue", () => {
    const brand = color("oklch(0.6 0.2 30)")
    expect(harmonyColors(brand, "complementary").map((item) => Math.round(item.h))).toEqual([30, 210])
    expect(harmonyColors(brand, "triadic").map((item) => Math.round(item.h))).toEqual([30, 150, 270])
    const theme = applyHarmony(defaultTheme, brand, "triadic", new Set(["chart-2"]))
    expect(Math.round(theme.light["chart-3"].h)).toBe(270)
    expect(theme.light["chart-2"]).toEqual(defaultTheme.light["chart-2"])
  })

  it("shifts the whole theme but skips locked tokens", () => {
    const base = themePresets[2].theme
    const locked = new Set<TokenName>(["primary"])
    const shifted = adjustTheme(base, { hue: 40, saturation: 1, lightness: 0 }, locked)
    expect(shifted.light.primary).toEqual(base.light.primary)
    expect(shifted.light.ring.h).toBeCloseTo((base.light.ring.h + 40) % 360, 0)
    const neutral = adjustTheme(base, { hue: 0, saturation: 1, lightness: 0 })
    for (const name of tokenNames) {
      expect(formatOklch(neutral.light[name])).toBe(formatOklch(base.light[name]))
    }
  })

  it("shuffles unlocked tokens and keeps text readable", () => {
    const locked = new Set<TokenName>(["primary", "primary-foreground"])
    for (const seed of [1, 7, 42, 1234, 99999]) {
      const { theme } = shuffleTheme(defaultTheme, locked, seeded(seed))
      expect(theme.light.primary).toEqual(defaultTheme.light.primary)
      for (const mode of themeModes) {
        const failing = checkContrast(theme, mode).filter(
          (result) =>
            !result.passes &&
            !locked.has(result.foreground)
        )
        expect(failing.map((result) => `${seed} ${mode} ${result.foreground}`)).toEqual([])
      }
    }
  })

  it("carries hue and chroma to the other mode when linked", () => {
    const base = themePresets[2].theme
    const next = color("oklch(0.55 0.2 20)")
    const derived = deriveLinked(base, "light", "primary", next)
    expect(derived.h).toBeCloseTo(20, 0)
    expect(derived.l).toBeCloseTo(base.dark.primary.l + (next.l - base.light.primary.l), 2)
  })
})

describe("saved themes", () => {
  it("ignores bad storage and keeps valid entries", () => {
    expect(parseSavedThemes(null)).toEqual([])
    expect(parseSavedThemes("{")).toEqual([])
    expect(parseSavedThemes(JSON.stringify([{ id: "a", name: "x", code: "!!", savedAt: 1 }]))).toEqual([])
    const code = encodeTheme(defaultTheme)
    const list = saveTheme([], code, "  ", 10, "a")
    expect(list[0].name).toBe("My theme 1")
    expect(parseSavedThemes(JSON.stringify(list))).toEqual(list)
  })

  it("renames, updates and removes", () => {
    const code = encodeTheme(defaultTheme)
    let list = saveTheme([], code, "Brand", 1, "a")
    list = saveTheme(list, code, "Second", 2, "b")
    expect(list.map((item) => item.id)).toEqual(["b", "a"])
    list = updateTheme(list, "a", { name: "Renamed" }, 3)
    expect(list[1].name).toBe("Renamed")
    expect(list[1].savedAt).toBe(1)
    list = updateTheme(list, "a", { code }, 4)
    expect(list[1].savedAt).toBe(4)
    expect(removeTheme(list, "b").map((item) => item.id)).toEqual(["a"])
  })
})
