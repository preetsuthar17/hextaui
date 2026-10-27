import { siteUrl } from "@/lib/site"
import { formatOklch } from "@/lib/theme-editor/color"
import {
  hasCustomTracking,
  themeExtras,
  themeInlineExtras,
} from "@/lib/theme-editor/css"
import { decodeTheme, maxEncodedLength } from "@/lib/theme-editor/encode"
import type { Theme, ThemeMode } from "@/lib/theme-editor/theme"
import { tokenNames } from "@/lib/theme-editor/tokens"

const themeEditorPath = "/tools/theme-editor"

const statusTokens = ["success", "info", "warning"] as const

function themeRegistryUrl(id: string) {
  return `${siteUrl}/r/themes/${id}.json`
}

function themeInstallCommand(id: string) {
  return `npx shadcn@latest add ${themeRegistryUrl(id)}`
}

function themeShareUrl(id: string) {
  return `${siteUrl}${themeEditorPath}#t=${id}`
}

function modeVars(theme: Theme, mode: ThemeMode): Record<string, string> {
  return {
    ...(mode === "light" ? { radius: `${theme.radius}rem` } : {}),
    ...Object.fromEntries(
      tokenNames.map((name) => [name, formatOklch(theme[mode][name])])
    ),
    ...(mode === "light" ? themeExtras(theme) : {}),
  }
}

function themeRegistryItem(theme: Theme, id: string) {
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: `hextaui-theme-${id.slice(-8).toLowerCase().replace(/[^a-z0-9]/g, "")}`,
    type: "registry:theme",
    title: "HextaUI theme",
    description: `A shadcn/ui theme made with the HextaUI theme editor. Edit it at ${themeShareUrl(id)}`,
    cssVars: {
      theme: {
        ...Object.fromEntries(
          statusTokens.flatMap((token) => [
            [`color-${token}`, `var(--${token})`],
            [`color-${token}-foreground`, `var(--${token}-foreground)`],
          ])
        ),
        ...themeInlineExtras(theme),
      } as Record<string, string>,
      light: modeVars(theme, "light"),
      dark: modeVars(theme, "dark"),
    },
    ...(hasCustomTracking(theme)
      ? { css: { body: { "letter-spacing": "var(--tracking-normal)" } } }
      : {}),
  }
}

type ThemeItemResult =
  | { ok: true; item: ReturnType<typeof themeRegistryItem> }
  | { ok: false; detail: string }

function buildThemeItem(raw: string): ThemeItemResult {
  const id = raw.replace(/\.json$/, "")
  if (id.length === 0 || id.length > maxEncodedLength) {
    return {
      ok: false,
      detail: `A theme id is 1 to ${maxEncodedLength} characters long.`,
    }
  }
  if (!/^[A-Za-z0-9_-]+$/.test(id)) {
    return {
      ok: false,
      detail: "A theme id only uses the base64url characters A–Z, a–z, 0–9, - and _.",
    }
  }
  const theme = decodeTheme(id)
  if (!theme) {
    return {
      ok: false,
      detail: "This theme id doesn’t decode to a theme. Copy the install command again from the theme editor.",
    }
  }
  return { ok: true, item: themeRegistryItem(theme, id) }
}

export {
  buildThemeItem,
  themeEditorPath,
  themeInstallCommand,
  themeRegistryItem,
  themeRegistryUrl,
  themeShareUrl,
}
