"use client"

import * as React from "react"

import { parseColor, type Oklch } from "@/lib/theme-editor/color"
import { decodeTheme, encodeTheme } from "@/lib/theme-editor/encode"
import { generateTheme } from "@/lib/theme-editor/generate"
import { themePresets } from "@/lib/theme-editor/presets"
import {
  cloneTheme,
  defaultTheme,
  type Theme,
  type ThemeMode,
} from "@/lib/theme-editor/theme"
import type { TokenName } from "@/lib/theme-editor/tokens"

type Source = { kind: "preset"; slug: string } | { kind: "custom" }

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

function readHash() {
  const match = /[#&]t=([A-Za-z0-9_-]+)/.exec(window.location.hash)
  return match ? decodeTheme(match[1]) : null
}

function useThemeState() {
  const [state, setState] = React.useState(initialState)
  const [touched, setTouched] = React.useState(false)
  const [id, setId] = React.useState(() => encodeTheme(defaultTheme))

  React.useEffect(() => {
    const load = () => {
      const theme = readHash()
      if (theme) {
        setState((current) => ({ ...current, theme, source: { kind: "custom" } }))
      }
    }
    load()
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
    (recipe: (current: ThemeState) => ThemeState) => {
      setTouched(true)
      React.startTransition(() => setState(recipe))
    },
    []
  )

  const actions = React.useMemo(
    () => ({
      applyPreset(slug: string) {
        const preset = themePresets.find((item) => item.slug === slug)
        if (!preset) return
        const brand = parseColor(preset.brand)
        update((current) => ({
          ...current,
          brand: brand ?? current.brand,
          theme: preset.theme,
          source: { kind: "preset", slug },
        }))
      },
      generate(brand: Oklch, tint?: number) {
        update((current) => {
          const nextTint = tint ?? current.tint
          return {
            ...current,
            brand,
            tint: nextTint,
            theme: generateTheme(brand, {
              tint: nextTint,
              radius: current.theme.radius,
            }),
            source: { kind: "custom" },
          }
        })
      },
      setToken(mode: ThemeMode, name: TokenName, color: Oklch) {
        update((current) => {
          const theme = cloneTheme(current.theme)
          theme[mode][name] = color
          return { ...current, theme, source: { kind: "custom" } }
        })
      },
      setRadius(radius: number) {
        update((current) => ({
          ...current,
          theme: { ...current.theme, radius },
        }))
      },
      replace(theme: Theme) {
        update((current) => ({ ...current, theme, source: { kind: "custom" } }))
      },
    }),
    [update]
  )

  return { state, id, actions }
}

export { useThemeState, type ThemeState }
