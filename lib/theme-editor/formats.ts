import {
  formatHslChannels,
  formatRgb,
  round,
  toHex,
  type Oklch,
} from "@/lib/theme-editor/color"
import {
  hasCustomText,
  hasCustomTracking,
  themeExtras,
  themeToCss,
  themeToJson,
} from "@/lib/theme-editor/css"
import { fontStack } from "@/lib/theme-editor/fonts"
import { shadowParts, shadowSizes } from "@/lib/theme-editor/shadow"
import {
  hasCustomFonts,
  hasCustomShadow,
  textScale,
  textSize,
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

function indent(lines: string[], depth: number) {
  const pad = "  ".repeat(depth)
  return lines.map((line) => `${pad}${line}`)
}

function plainColor(color: Oklch) {
  return color.a < 1 ? formatRgb(color) : toHex(color)
}

function themeToV3Css(theme: Theme) {
  const extras = Object.entries(themeExtras(theme)).map(
    ([name, value]) => `--${name}: ${value};`
  )
  const lines = (mode: ThemeMode) => [
    ...(mode === "light" ? [`--radius: ${theme.radius}rem;`] : []),
    ...tokenNames.map(
      (name) => `--${name}: ${formatHslChannels(theme[mode][name])};`
    ),
    ...(mode === "light" ? extras : []),
  ]
  return [
    "@tailwind base;",
    "@tailwind components;",
    "@tailwind utilities;",
    "",
    "@layer base {",
    "  :root {",
    ...indent(lines("light"), 2),
    "  }",
    "",
    "  .dark {",
    ...indent(lines("dark"), 2),
    "  }",
    ...(hasCustomTracking(theme)
      ? ["", "  body {", "    letter-spacing: var(--tracking-normal);", "  }"]
      : []),
    "}",
  ].join("\n")
}

function colorGroups() {
  const groups: Record<string, Record<string, string> | string> = {}
  for (const name of tokenNames) {
    const value = `hsl(var(--${name}))`
    const chart = /^chart-(\d)$/.exec(name)
    if (chart) {
      const group = (groups.chart ??= {}) as Record<string, string>
      group[chart[1]] = value
      continue
    }
    const [head, ...rest] = name.split("-")
    const pairs = tokenNames.some(
      (other) => other !== name && other.startsWith(`${head}-`)
    )
    if (!pairs) {
      groups[name] = value
      continue
    }
    const group = (groups[head] ??= {}) as Record<string, string>
    group[rest.length === 0 ? "DEFAULT" : rest.join("-")] = value
  }
  return groups
}

function toJs(value: unknown) {
  return JSON.stringify(value, null, 2).replace(
    /"([A-Za-z_$][\w$]*|\d+)":/g,
    "$1:"
  )
}

function tailwindV3Config(theme: Theme) {
  const extend: Record<string, unknown> = {
    colors: colorGroups(),
    borderRadius: Object.fromEntries(
      [...radiusScale].reverse().map(([size, value]) => [size, value])
    ),
  }
  if (hasCustomFonts(theme)) {
    extend.fontFamily = {
      sans: ["var(--font-sans)"],
      serif: ["var(--font-serif)"],
      mono: ["var(--font-mono)"],
    }
  }
  if (hasCustomShadow(theme)) {
    extend.boxShadow = Object.fromEntries(
      shadowSizes.map((size) => [size, `var(--shadow-${size})`])
    )
  }
  if (hasCustomText(theme)) {
    extend.fontSize = Object.fromEntries(
      textScale.map(([name, factor]) => [name, textSize(theme, factor)])
    )
  }
  const config = {
    darkMode: ["class"],
    content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
    theme: { extend },
  }
  return `module.exports = ${toJs(config)}\n`
}

function themeToScss(theme: Theme) {
  const map = (mode: ThemeMode) => [
    `$${mode}: (`,
    ...tokenNames.map(
      (name) => `  "${name}": ${plainColor(theme[mode][name])},`
    ),
    ");",
  ]
  const extras = Object.entries(themeExtras(theme))
  return [
    `$radius: ${theme.radius}rem;`,
    ...(hasCustomFonts(theme)
      ? (["sans", "serif", "mono"] as const).map(
          (slot) => `$font-${slot}: ${fontStack(theme.fonts[slot], slot)};`
        )
      : []),
    "",
    ...map("light"),
    "",
    ...map("dark"),
    "",
    "@mixin theme-vars($tokens) {",
    "  @each $name, $value in $tokens {",
    "    --#{$name}: #{$value};",
    "  }",
    "}",
    "",
    ":root {",
    "  --radius: #{$radius};",
    ...extras.map(([name, value]) => `  --${name}: ${value};`),
    "  @include theme-vars($light);",
    "}",
    "",
    ".dark {",
    "  @include theme-vars($dark);",
    "}",
  ].join("\n")
}

function dtcgColor(color: Oklch) {
  return {
    $type: "color",
    $value: {
      colorSpace: "oklch",
      components: [round(color.l, 4), round(color.c, 4), round(color.h, 2)],
      alpha: round(color.a, 3),
      hex: toHex(color),
    },
  }
}

function dtcgShadow(theme: Theme) {
  const dimension = (value: number) => ({ value, unit: "px" })
  return Object.fromEntries(
    shadowSizes.map((size) => [
      size,
      {
        $type: "shadow",
        $value: shadowParts(theme.shadow, size).map((part) => ({
          color: dtcgColor({ ...theme.shadow.color, a: part.alpha }).$value,
          offsetX: dimension(part.x),
          offsetY: dimension(part.y),
          blur: dimension(part.blur),
          spread: dimension(part.spread),
        })),
      },
    ])
  )
}

function themeToDtcg(theme: Theme) {
  const colors = (mode: ThemeMode) =>
    Object.fromEntries(
      tokenNames.map((name) => [name, dtcgColor(theme[mode][name])])
    )
  const families = (["sans", "serif", "mono"] as const).map((slot) => [
    slot,
    {
      $type: "fontFamily",
      $value: fontStack(theme.fonts[slot], slot)
        .split(",")
        .map((part) => part.trim().replace(/^"|"$/g, "")),
    },
  ])
  return JSON.stringify(
    {
      color: Object.fromEntries(themeModes.map((mode) => [mode, colors(mode)])),
      radius: {
        $type: "dimension",
        $value: { value: theme.radius, unit: "rem" },
      },
      font: {
        family: Object.fromEntries(families),
        size: Object.fromEntries(
          textScale.map(([name, factor]) => [
            name,
            {
              $type: "dimension",
              $value: {
                value: Number.parseFloat(textSize(theme, factor)),
                unit: "rem",
              },
            },
          ])
        ),
        tracking: {
          $type: "dimension",
          $value: { value: theme.tracking, unit: "em" },
        },
      },
      shadow: dtcgShadow(theme),
    },
    null,
    2
  )
}

function figmaGroup(name: TokenName) {
  if (name.startsWith("chart-")) return ["chart", name.slice(6)]
  if (name.startsWith("sidebar")) {
    return ["sidebar", name === "sidebar" ? "background" : name.slice(8)]
  }
  return ["base", name]
}

function themeToFigma(theme: Theme, mode: ThemeMode) {
  const tree: Record<string, Record<string, unknown>> = {}
  for (const name of tokenNames) {
    const [group, key] = figmaGroup(name)
    tree[group] ??= {}
    tree[group][key] = {
      $type: "color",
      $value: plainColor(theme[mode][name]),
    }
  }
  return JSON.stringify(tree, null, 2)
}

type ExportFile = { name: string; value: string; label: string }

type ExportFormat = {
  id: string
  label: string
  title: string
  description: string
  files: (theme: Theme) => ExportFile[]
}

const exportFormats: ExportFormat[] = [
  {
    id: "v4",
    label: "Tailwind v4",
    title: "Tailwind v4 CSS",
    description:
      "OKLCH variables for :root and .dark, plus the @theme inline mapping. Paste it into globals.css.",
    files: (theme) => [
      { name: "globals.css", value: themeToCss(theme), label: "CSS" },
    ],
  },
  {
    id: "v3",
    label: "Tailwind v3",
    title: "Tailwind v3 HSL",
    description:
      "HSL channels inside @layer base, the way shadcn/ui shipped before Tailwind v4, with the matching tailwind.config.js.",
    files: (theme) => [
      { name: "globals.css", value: themeToV3Css(theme), label: "CSS" },
      { name: "tailwind.config.js", value: tailwindV3Config(theme), label: "Config" },
    ],
  },
  {
    id: "scss",
    label: "SCSS",
    title: "SCSS variables",
    description:
      "One Sass map per mode and a mixin that writes them as CSS variables.",
    files: (theme) => [
      { name: "_theme.scss", value: themeToScss(theme), label: "SCSS" },
    ],
  },
  {
    id: "json",
    label: "JSON",
    title: "JSON",
    description: "Every token as an OKLCH string, grouped by mode.",
    files: (theme) => [
      { name: "theme.json", value: themeToJson(theme), label: "JSON" },
    ],
  },
  {
    id: "dtcg",
    label: "Design tokens",
    title: "W3C design tokens",
    description:
      "DTCG format with OKLCH components and a hex fallback, for Style Dictionary, Terrazzo and other token tools.",
    files: (theme) => [
      { name: "tokens.json", value: themeToDtcg(theme), label: "Tokens" },
    ],
  },
  {
    id: "figma",
    label: "Figma",
    title: "Figma variables",
    description:
      "One file per mode. Import each with Figma’s Variables Import Export plugin (figma/plugin-samples), which makes a variable collection from the file.",
    files: (theme) =>
      themeModes.map((mode) => ({
        name: `theme-${mode}.json`,
        value: themeToFigma(theme, mode),
        label: mode === "light" ? "Light" : "Dark",
      })),
  },
]

export {
  exportFormats,
  tailwindV3Config,
  themeToDtcg,
  themeToFigma,
  themeToScss,
  themeToV3Css,
  type ExportFile,
  type ExportFormat,
}
