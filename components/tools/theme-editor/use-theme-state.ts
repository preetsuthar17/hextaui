"use client"

import * as React from "react"

import { parseColor, type Oklch } from "@/lib/theme-editor/color"
import { decodeTheme, encodeTheme } from "@/lib/theme-editor/encode"
import { generateTheme } from "@/lib/theme-editor/generate"
import { themePresets } from "@/lib/theme-editor/presets"
import {
  parseSavedThemes,
  removeTheme,
  saveTheme,
  savedThemesKey,
  updateTheme,
  type SavedTheme,
} from "@/lib/theme-editor/saved"
import type { ThemeShadow } from "@/lib/theme-editor/shadow"
import {
  cloneTheme,
  defaultTheme,
  themeModes,
  type Theme,
  type ThemeFonts,
  type ThemeMode,
} from "@/lib/theme-editor/theme"
import {
  adjustTheme,
  applyHarmony,
  deriveLinked,
  shuffleTheme,
  type Adjustment,
  type HarmonyKind,
} from "@/lib/theme-editor/tools"
import { tokenNames, type TokenName } from "@/lib/theme-editor/tokens"

type Source =
  | { kind: "preset"; slug: string }
  | { kind: "saved"; id: string }
  | { kind: "custom" }

type ThemeState = {
  theme: Theme
  source: Source
  brand: Oklch
  tint: number
}

const initialState: ThemeState = {
  theme: defaultTheme,
  source: { kind: "preset", slug: "hextaui" },
  brand: { l: 0.55, c: 0.19, h: 255, a: 1 },
  tint: 0.5,
}

const coalesceWindow = 700
const historyLimit = 100

function readHash() {
  const match = /[#&]t=([A-Za-z0-9_-]+)/.exec(window.location.hash)
  return match ? decodeTheme(match[1]) : null
}

function readSaved() {
  try {
    return parseSavedThemes(window.localStorage.getItem(savedThemesKey))
  } catch {
    return []
  }
}

function writeSaved(themes: SavedTheme[]) {
  try {
    window.localStorage.setItem(savedThemesKey, JSON.stringify(themes))
  } catch {}
}

function keepLocked(next: Theme, current: Theme, locked: ReadonlySet<TokenName>) {
  if (locked.size === 0) return next
  const theme = cloneTheme(next)
  for (const mode of themeModes) {
    for (const name of locked) theme[mode][name] = current[mode][name]
  }
  return theme
}

function useThemeState() {
  const [state, setState] = React.useState(initialState)
  const latest = React.useRef(initialState)
  const past = React.useRef<ThemeState[]>([])
  const future = React.useRef<ThemeState[]>([])
  const lastEdit = React.useRef<{ key?: string; at: number }>({ at: 0 })
  const [history, setHistory] = React.useState({ undo: false, redo: false })
  const [touched, setTouched] = React.useState(false)
  const [id, setId] = React.useState(() => encodeTheme(defaultTheme))
  const [locked, setLocked] = React.useState<ReadonlySet<TokenName>>(() => new Set())
  const lockedRef = React.useRef(locked)
  const [linked, setLinked] = React.useState(false)
  const linkedRef = React.useRef(linked)
  const [saved, setSaved] = React.useState<SavedTheme[]>([])
  const [lastSaved, setLastSaved] = React.useState<string | null>(null)

  React.useEffect(() => {
    lockedRef.current = locked
    linkedRef.current = linked
  }, [locked, linked])

  const syncHistory = React.useCallback(() => {
    const undo = past.current.length > 0
    const redo = future.current.length > 0
    setHistory((current) =>
      current.undo === undo && current.redo === redo ? current : { undo, redo }
    )
  }, [])

  const commit = React.useCallback((next: ThemeState) => {
    latest.current = next
    React.startTransition(() => setState(next))
  }, [])

  React.useEffect(() => {
    const load = () => {
      const theme = readHash()
      if (theme) {
        const next = { ...latest.current, theme, source: { kind: "custom" } as const }
        latest.current = next
        setState(next)
      }
    }
    load()
    const stored = readSaved()
    if (stored.length > 0) {
      React.startTransition(() => {
        setSaved(stored)
        setLastSaved(stored[0].code)
      })
    }
    window.addEventListener("hashchange", load)
    return () => window.removeEventListener("hashchange", load)
  }, [])

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const next = encodeTheme(state.theme)
      setId(next)
      if (touched) {
        window.history.replaceState(
          window.history.state,
          "",
          `${window.location.pathname}${window.location.search}#t=${next}`
        )
      }
    }, 250)
    return () => clearTimeout(timer)
  }, [state.theme, touched])

  const update = React.useCallback(
    (recipe: (current: ThemeState) => ThemeState, key?: string) => {
      const before = latest.current
      const next = recipe(before)
      if (next === before) return
      const now = performance.now()
      const coalesce =
        key !== undefined &&
        lastEdit.current.key === key &&
        now - lastEdit.current.at < coalesceWindow
      lastEdit.current = { key, at: now }
      if (!coalesce) {
        past.current = [...past.current, before].slice(-historyLimit)
      }
      future.current = []
      setTouched(true)
      commit(next)
      syncHistory()
    },
    [commit, syncHistory]
  )

  const persist = React.useCallback((next: SavedTheme[]) => {
    writeSaved(next)
    setSaved(next)
  }, [])

  const actions = React.useMemo(
    () => ({
      applyPreset(slug: string) {
        const preset = themePresets.find((item) => item.slug === slug)
        if (!preset) return
        const brand = parseColor(preset.brand)
        update((current) => ({
          ...current,
          brand: brand ?? current.brand,
          theme: keepLocked(preset.theme, current.theme, lockedRef.current),
          source: { kind: "preset", slug },
        }))
      },
      generate(brand: Oklch, tint?: number) {
        update(
          (current) => {
            const nextTint = tint ?? current.tint
            const generated = generateTheme(brand, {
              tint: nextTint,
              radius: current.theme.radius,
            })
            return {
              ...current,
              brand,
              tint: nextTint,
              theme: keepLocked(
                {
                  ...current.theme,
                  light: generated.light,
                  dark: generated.dark,
                },
                current.theme,
                lockedRef.current
              ),
              source: { kind: "custom" },
            }
          },
          tint === undefined ? "brand" : "tint"
        )
      },
      setToken(mode: ThemeMode, name: TokenName, color: Oklch) {
        update((current) => {
          const theme = cloneTheme(current.theme)
          theme[mode][name] = color
          if (linkedRef.current) {
            const other = mode === "light" ? "dark" : "light"
            theme[other][name] = deriveLinked(current.theme, mode, name, color)
          }
          return { ...current, theme, source: { kind: "custom" } }
        }, `token:${mode}:${name}`)
      },
      setRadius(radius: number) {
        update(
          (current) => ({
            ...current,
            theme: { ...current.theme, radius },
          }),
          "radius"
        )
      },
      setFont(slot: keyof ThemeFonts, name: string) {
        update((current) => ({
          ...current,
          theme: {
            ...current.theme,
            fonts: { ...current.theme.fonts, [slot]: name },
          },
          source: { kind: "custom" },
        }))
      },
      setTracking(tracking: number) {
        update(
          (current) => ({ ...current, theme: { ...current.theme, tracking } }),
          "tracking"
        )
      },
      setTextBase(textBase: number) {
        update(
          (current) => ({ ...current, theme: { ...current.theme, textBase } }),
          "text"
        )
      },
      setShadow(patch: Partial<ThemeShadow>, key = "shadow") {
        update(
          (current) => ({
            ...current,
            theme: {
              ...current.theme,
              shadow: { ...current.theme.shadow, ...patch },
            },
            source: { kind: "custom" },
          }),
          key
        )
      },
      replace(theme: Theme) {
        update((current) => ({ ...current, theme, source: { kind: "custom" } }))
      },
      shuffle() {
        update((current) => {
          const result = shuffleTheme(current.theme, lockedRef.current)
          return {
            ...current,
            brand: result.brand,
            theme: result.theme,
            source: { kind: "custom" },
          }
        })
      },
      harmony(kind: HarmonyKind) {
        update((current) => ({
          ...current,
          theme: applyHarmony(current.theme, current.brand, kind, lockedRef.current),
          source: { kind: "custom" },
        }))
      },
      adjust(base: Theme, adjustment: Adjustment) {
        update(
          (current) => ({
            ...current,
            theme: adjustTheme(base, adjustment, lockedRef.current),
            source: { kind: "custom" },
          }),
          "adjust"
        )
      },
      undo() {
        const previous = past.current.at(-1)
        if (!previous) return
        past.current = past.current.slice(0, -1)
        future.current = [...future.current, latest.current]
        lastEdit.current = { at: 0 }
        commit(previous)
        syncHistory()
      },
      redo() {
        const next = future.current.at(-1)
        if (!next) return
        future.current = future.current.slice(0, -1)
        past.current = [...past.current, latest.current]
        lastEdit.current = { at: 0 }
        commit(next)
        syncHistory()
      },
      toggleLock(name: TokenName) {
        setLocked((current) => {
          const next = new Set(current)
          if (next.has(name)) next.delete(name)
          else next.add(name)
          return next
        })
      },
      setLinked,
      save(name = "") {
        const code = encodeTheme(latest.current.theme)
        const next = saveTheme(readSaved(), code, name, Date.now())
        persist(next)
        setLastSaved(code)
        update((current) => ({ ...current, source: { kind: "saved", id: next[0].id } }))
        return next[0]
      },
      overwriteSaved(savedId: string) {
        const code = encodeTheme(latest.current.theme)
        persist(updateTheme(readSaved(), savedId, { code }, Date.now()))
        setLastSaved(code)
      },
      renameSaved(savedId: string, name: string) {
        persist(updateTheme(readSaved(), savedId, { name }, Date.now()))
      },
      removeSaved(savedId: string) {
        persist(removeTheme(readSaved(), savedId))
      },
      loadSaved(savedId: string) {
        const entry = readSaved().find((item) => item.id === savedId)
        const theme = entry ? decodeTheme(entry.code) : null
        if (!entry || !theme) return
        setLastSaved(entry.code)
        update((current) => ({
          ...current,
          theme: keepLocked(theme, current.theme, lockedRef.current),
          source: { kind: "saved", id: savedId },
        }))
      },
    }),
    [commit, persist, syncHistory, update]
  )

  return { state, id, actions, history, locked, linked, saved, lastSaved }
}

function lockedCount(locked: ReadonlySet<TokenName>) {
  return tokenNames.filter((name) => locked.has(name)).length
}

export { lockedCount, useThemeState, type Source, type ThemeState }
