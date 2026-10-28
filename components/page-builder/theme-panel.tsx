"use client"

import * as React from "react"
import { IconArrowUpRight, IconCheck } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  parseThemeInput,
  presetSlug,
  presetThemes,
} from "@/lib/page-builder/theme"
import { formatOklch } from "@/lib/theme-editor/color"
import { themeEditorPath } from "@/lib/theme-editor/registry"
import type { ThemeMode } from "@/lib/theme-editor/theme"

function ThemePanel({
  theme,
  mode,
  onChange,
}: {
  theme: string | null
  mode: ThemeMode
  onChange: (theme: string | null, source: string) => void
}) {
  const [value, setValue] = React.useState("")
  const [error, setError] = React.useState("")
  const inputId = React.useId()
  const selected = presetSlug(theme)
  const editorHref = theme ? `${themeEditorPath}#t=${theme}` : themeEditorPath

  const apply = () => {
    const id = parseThemeInput(value)
    if (!id) {
      setError("That isn’t a theme link. Copy Share in the theme editor and paste it here.")
      return
    }
    setError("")
    setValue("")
    onChange(id, "link")
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        role="radiogroup"
        aria-label="Presets"
        className="grid grid-cols-4 gap-1.5 max-sm:grid-cols-3"
      >
        {presetThemes.map(({ preset, id }) => {
          const palette = preset.theme[mode]
          const active = preset.slug === selected
          return (
            <button
              key={preset.slug}
              type="button"
              role="radio"
              aria-checked={active}
              data-active={active ? "" : undefined}
              onClick={() => onChange(id, preset.slug)}
              style={
                {
                  "--preset-background": formatOklch(palette.background),
                  "--preset-primary": formatOklch(palette.primary),
                  "--preset-muted": formatOklch(palette.muted),
                  "--preset-foreground": formatOklch(palette.foreground),
                  "--preset-radius": `min(${preset.theme.radius * 0.5}rem, 0.375rem)`,
                } as React.CSSProperties
              }
              className="group/preset flex min-w-0 flex-col gap-1.5 rounded-lg p-1 text-start text-xs text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-focus-ring data-active:text-foreground forced-colors:data-active:outline-2 forced-colors:data-active:outline-solid"
            >
              <span
                aria-hidden="true"
                className="flex h-12 w-full flex-col justify-between overflow-hidden rounded-md bg-(--preset-background) p-1.5 inset-ring-(length:--hairline) inset-ring-foreground/10 transition-shadow duration-150 ease-out-cubic group-hover/preset:inset-ring-foreground/25 group-data-active/preset:inset-ring-2 group-data-active/preset:inset-ring-foreground motion-reduce:transition-none forced-colors:border"
              >
                <span className="h-1.5 w-8 rounded-full bg-(--preset-foreground) opacity-80" />
                <span className="flex items-center gap-1">
                  <span className="h-3 w-7 rounded-(--preset-radius) bg-(--preset-primary)" />
                  <span className="h-3 w-5 rounded-(--preset-radius) bg-(--preset-muted)" />
                </span>
              </span>
              <span className="flex items-center justify-between gap-1 px-0.5">
                <span className="truncate">{preset.name}</span>
                {active ? (
                  <IconCheck className="size-3 shrink-0" aria-hidden="true" />
                ) : null}
              </span>
            </button>
          )
        })}
      </div>
      <form
        className="flex flex-col gap-1.5 border-t pt-3"
        onSubmit={(event) => {
          event.preventDefault()
          apply()
        }}
      >
        <label htmlFor={inputId} className="text-xs font-medium text-muted-foreground">
          Paste a theme link
        </label>
        <InputGroup>
          <InputGroupInput
            id={inputId}
            autoComplete="off"
            spellCheck={false}
            placeholder="hextaui.com/tools/theme-editor#t=…"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${inputId}-error` : undefined}
            value={value}
            onChange={(event) => {
              setValue(event.currentTarget.value)
              if (error) setError("")
            }}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton type="submit" disabled={!value.trim()}>
              Apply
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        {error ? (
          <p id={`${inputId}-error`} className="text-xs text-pretty text-destructive">
            {error}
          </p>
        ) : null}
      </form>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-pretty text-muted-foreground">
          {theme
            ? "Exports add this theme as app/theme.css."
            : "The default theme. Exports keep your CSS as is."}
        </p>
        <Button
          variant="ghost"
          size="xs"
          nativeButton={false}
          render={<a href={editorHref} target="_blank" rel="noopener" />}
        >
          Theme editor
          <IconArrowUpRight data-icon="inline-end" />
        </Button>
      </div>
    </div>
  )
}

export { ThemePanel }
