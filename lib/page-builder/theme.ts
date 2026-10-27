import { fromBase64Url } from "@/lib/base64url"

type ThemeVars = Record<string, string>

type CanvasTheme = { light: ThemeVars; dark: ThemeVars }

const varName = /^-{0,2}[a-z][a-z0-9-]{0,40}$/
const unsafeValue = /[;{}<>]|url\(|expression\(/i

function cleanVars(value: unknown): ThemeVars {
  if (typeof value !== "object" || value === null) return {}
  const vars: ThemeVars = {}
  for (const [key, raw] of Object.entries(value).slice(0, 80)) {
    if (typeof raw !== "string" || !varName.test(key)) continue
    if (raw.length > 120 || unsafeValue.test(raw)) continue
    vars[key.startsWith("--") ? key : `--${key.replace(/^-+/, "")}`] = raw
  }
  return vars
}

function decodeThemeParam(encoded: string | null): CanvasTheme | null {
  if (!encoded) return null
  const bytes = fromBase64Url(encoded)
  if (!bytes) return null
  try {
    const value = JSON.parse(new TextDecoder().decode(bytes)) as Record<
      string,
      unknown
    >
    const light = cleanVars(value.light ?? value)
    const dark = cleanVars(value.dark ?? value.light ?? value)
    return Object.keys(light).length || Object.keys(dark).length
      ? { light, dark }
      : null
  } catch {
    return null
  }
}

function applyTheme(vars: ThemeVars, el: HTMLElement) {
  const previous = (el.dataset.pbThemeVars ?? "").split(",").filter(Boolean)
  for (const name of previous) el.style.removeProperty(name)
  const names = Object.keys(vars)
  for (const name of names) el.style.setProperty(name, vars[name])
  el.dataset.pbThemeVars = names.join(",")
}

export {
  applyTheme,
  cleanVars,
  decodeThemeParam,
  type CanvasTheme,
  type ThemeVars,
}
