"use client"

import * as React from "react"
import {
  IconAlertTriangle,
  IconCheck,
  IconCircleCheck,
  IconPhoto,
} from "@tabler/icons-react"

import { ColorField } from "@/components/tools/theme-editor/color-field"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { formatOklch, parseColor, type Oklch } from "@/lib/theme-editor/color"
import { extractPalette, pickBrand, type Swatch } from "@/lib/theme-editor/image"
import { themePresets } from "@/lib/theme-editor/presets"
import {
  checkContrast,
  maxRadius,
  minRadius,
  type ContrastResult,
  type Theme,
  type ThemeMode,
} from "@/lib/theme-editor/theme"
import { tokenGroups, tokenLabel, type TokenName } from "@/lib/theme-editor/tokens"
import { track } from "@/lib/track"

function PresetGrid({
  selected,
  mode,
  onSelect,
}: {
  selected: string | null
  mode: ThemeMode
  onSelect: (slug: string) => void
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Presets"
      className="grid grid-cols-3 gap-2 max-sm:grid-cols-2"
    >
      {themePresets.map((preset) => {
        const palette = preset.theme[mode]
        const active = preset.slug === selected
        return (
          <button
            key={preset.slug}
            type="button"
            role="radio"
            aria-checked={active}
            data-active={active ? "" : undefined}
            onClick={() => {
              onSelect(preset.slug)
              track("Theme editor preset", { preset: preset.slug })
            }}
            style={
              {
                "--preset-background": formatOklch(palette.background),
                "--preset-primary": formatOklch(palette.primary),
                "--preset-muted": formatOklch(palette.muted),
                "--preset-chart-1": formatOklch(palette["chart-1"]),
                "--preset-chart-2": formatOklch(palette["chart-2"]),
                "--preset-chart-3": formatOklch(palette["chart-3"]),
                "--preset-radius": `min(${preset.theme.radius * 0.5}rem, 0.375rem)`,
              } as React.CSSProperties
            }
            className="group/preset flex min-w-0 flex-col gap-1.5 rounded-lg p-1 text-start text-xs text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-focus-ring data-active:text-foreground forced-colors:data-active:outline-2 forced-colors:data-active:outline-solid"
          >
            <span
              aria-hidden="true"
              className="relative flex h-14 w-full flex-col justify-between overflow-hidden rounded-md bg-(--preset-background) p-2 inset-ring-(length:--hairline) inset-ring-foreground/10 transition-shadow duration-150 ease-out-cubic group-hover/preset:inset-ring-foreground/25 group-data-active/preset:inset-ring-2 group-data-active/preset:inset-ring-foreground motion-reduce:transition-none forced-colors:border"
            >
              <span className="flex gap-1">
                <span className="size-2 rounded-full bg-(--preset-chart-1)" />
                <span className="size-2 rounded-full bg-(--preset-chart-2)" />
                <span className="size-2 rounded-full bg-(--preset-chart-3)" />
              </span>
              <span className="flex items-center gap-1">
                <span className="h-3.5 w-9 rounded-(--preset-radius) bg-(--preset-primary)" />
                <span className="h-3.5 w-6 rounded-(--preset-radius) bg-(--preset-muted)" />
              </span>
            </span>
            <span className="flex items-center justify-between gap-1 px-0.5">
              <span className="truncate">{preset.name}</span>
              {active ? <IconCheck className="size-3 shrink-0" aria-hidden="true" /> : null}
            </span>
          </button>
        )
      })}
    </div>
  )
}

async function readImage(file: File) {
  const bitmap = await createImageBitmap(file)
  const size = 64
  const scale = Math.min(1, size / Math.max(bitmap.width, bitmap.height))
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext("2d", { willReadFrequently: true })
  if (!context) throw new Error("No canvas")
  context.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()
  return extractPalette(context.getImageData(0, 0, width, height).data)
}

function ImagePalette({ onPick }: { onPick: (color: Oklch) => void }) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [swatches, setSwatches] = React.useState<Swatch[]>([])
  const [error, setError] = React.useState("")

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={async (event) => {
          const file = event.target.files?.[0]
          event.target.value = ""
          if (!file) return
          try {
            const palette = await readImage(file)
            setSwatches(palette)
            setError("")
            const brand = pickBrand(palette)
            if (brand) {
              onPick(brand)
              track("Theme editor image")
            }
          } catch {
            setError("That image couldn’t be read. Try a PNG or JPEG.")
          }
        }}
      />
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
        >
          <IconPhoto data-icon="inline-start" />
          From an image
        </Button>
        {swatches.length > 0 ? (
          <div className="flex items-center gap-1">
            {swatches.map((swatch) => (
              <button
                key={formatOklch(swatch.color)}
                type="button"
                aria-label={`Use ${formatOklch(swatch.color)}`}
                onClick={() => onPick(swatch.color)}
                className="size-5 rounded-full bg-(--swatch) inset-ring-(length:--hairline) inset-ring-foreground/15 outline-none focus-visible:ring-3 focus-visible:ring-focus-ring forced-colors:border"
                style={{ "--swatch": formatOklch(swatch.color) } as React.CSSProperties}
              />
            ))}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Stays on your device</span>
        )}
      </div>
      {error ? <p role="alert" className="text-xs text-destructive">{error}</p> : null}
    </div>
  )
}

function ContrastBadge({ results }: { results: ContrastResult[] }) {
  if (results.length === 0) return null
  const worst = results.reduce((a, b) => (a.ratio <= b.ratio ? a : b))
  const label = `${worst.ratio.toFixed(1)}:1 on ${tokenLabel(worst.background).toLowerCase()}, APCA Lc ${Math.abs(worst.apca).toFixed(0)}`
  return (
    <span
      title={label}
      aria-label={`Contrast ${label}${worst.passes ? "" : ", below 4.5:1"}`}
      data-fail={worst.passes ? undefined : ""}
      className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground tabular-nums data-fail:text-destructive"
    >
      {worst.passes ? (
        <IconCircleCheck className="size-3.5" aria-hidden="true" />
      ) : (
        <IconAlertTriangle className="size-3.5" aria-hidden="true" />
      )}
      {worst.ratio.toFixed(1)}
    </span>
  )
}

function ContrastSummary({ results }: { results: ContrastResult[] }) {
  const failing = results.filter((result) => !result.passes)
  if (failing.length === 0) {
    return (
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <IconCircleCheck className="size-3.5 text-success" aria-hidden="true" />
        All {results.length} text pairs pass WCAG AA
      </p>
    )
  }
  return (
    <div role="status" className="flex flex-col gap-1 rounded-md bg-destructive/8 px-2.5 py-2 text-xs text-foreground dark:bg-destructive/15">
      <p className="flex items-center gap-1.5 font-medium">
        <IconAlertTriangle className="size-3.5 text-destructive" aria-hidden="true" />
        {failing.length} {failing.length === 1 ? "pair is" : "pairs are"} below 4.5:1
      </p>
      <ul className="flex flex-col gap-0.5 ps-5 text-muted-foreground">
        {failing.map((result) => (
          <li key={`${result.foreground}-${result.background}`}>
            {tokenLabel(result.foreground)} on {tokenLabel(result.background).toLowerCase()}:{" "}
            <span className="tabular-nums">{result.ratio.toFixed(2)}:1</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const brandSwatches = [
  "oklch(0.205 0 0)",
  "oklch(0.55 0.19 255)",
  "oklch(0.54 0.23 292)",
  "oklch(0.6 0.21 12)",
  "oklch(0.64 0.2 41)",
  "oklch(0.78 0.16 75)",
  "oklch(0.52 0.13 155)",
  "oklch(0.6 0.11 190)",
]

function ColorPanel({
  brand,
  tint,
  onGenerate,
}: {
  brand: Oklch
  tint: number
  onGenerate: (brand: Oklch, tint?: number) => void
}) {
  const [tintValue, setTintValue] = React.useState(tint)
  const [tintSource, setTintSource] = React.useState(tint)
  if (tint !== tintSource) {
    setTintSource(tint)
    setTintValue(tint)
  }
  const current = formatOklch(brand)

  return (
    <div className="flex flex-col gap-4">
      <ColorField
        id="brand-color"
        label="Brand color"
        color={brand}
        onChange={(color) => onGenerate(color)}
      />
      <div role="group" aria-label="Quick colors" className="flex items-center justify-between gap-1">
        {brandSwatches.map((value) => {
          const color = parseColor(value)
          if (!color) return null
          const active = formatOklch(color) === current
          return (
            <button
              key={value}
              type="button"
              aria-label={`Use ${value}`}
              aria-pressed={active}
              onClick={() => onGenerate(color)}
              className="size-7 rounded-full bg-(--swatch) ring-offset-2 ring-offset-popover inset-ring-(length:--hairline) inset-ring-foreground/15 outline-none transition-transform duration-150 ease-out-cubic aria-pressed:ring-2 aria-pressed:ring-foreground focus-visible:ring-3 focus-visible:ring-focus-ring motion-safe:active:scale-95 forced-colors:border forced-colors:aria-pressed:outline-2 forced-colors:aria-pressed:outline-solid"
              style={{ "--swatch": value } as React.CSSProperties}
            />
          )
        })}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span id="tint-label" className="font-medium">
            Tint neutrals
          </span>
          <span className="text-muted-foreground tabular-nums">
            {Math.round(tintValue * 100)}%
          </span>
        </div>
        <Slider
          aria-labelledby="tint-label"
          min={0}
          max={1}
          step={0.05}
          value={tintValue}
          onValueChange={(next) => {
            const number = Array.isArray(next) ? next[0] : (next as number)
            setTintValue(number)
            onGenerate(brand, number)
          }}
        />
      </div>
      <ImagePalette onPick={(color) => onGenerate(color)} />
    </div>
  )
}

const radiusPresets = [0, 0.4, 0.6, 0.8, 1.2]

function RadiusPanel({
  value,
  onChange,
}: {
  value: number
  onChange: (value: number) => void
}) {
  const [local, setLocal] = React.useState(value)
  const [source, setSource] = React.useState(value)
  if (value !== source) {
    setSource(value)
    setLocal(value)
  }
  const preset = radiusPresets.find((item) => Math.abs(item - local) < 0.001)

  return (
    <div className="flex flex-col gap-4">
      <ToggleGroup
        variant="outline"
        size="sm"
        aria-label="Radius presets"
        value={preset === undefined ? [] : [String(preset)]}
        onValueChange={(next) => {
          if (next[0] === undefined) return
          const number = Number(next[0])
          setLocal(number)
          onChange(number)
        }}
        className="grid w-full grid-cols-5"
      >
        {radiusPresets.map((item) => (
          <ToggleGroupItem
            key={item}
            value={String(item)}
            aria-label={`${item}rem`}
            className="h-12"
          >
            <span className="flex flex-col items-center gap-1 text-xs tabular-nums">
              <span
                aria-hidden="true"
                className="size-4 rounded-ss-(--corner) border-s-2 border-t-2 border-current"
                style={{ "--corner": `${item * 0.75}rem` } as React.CSSProperties}
              />
              {item}
            </span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span id="radius-label" className="font-medium">
            Custom
          </span>
          <span className="text-muted-foreground tabular-nums">{local.toFixed(2)}rem</span>
        </div>
        <Slider
          aria-labelledby="radius-label"
          min={minRadius}
          max={Math.min(maxRadius, 1.6)}
          step={0.05}
          value={local}
          onValueChange={(next) => {
            const number = Array.isArray(next) ? next[0] : (next as number)
            setLocal(number)
            onChange(number)
          }}
        />
      </div>
    </div>
  )
}

function TokenEditor({
  theme,
  mode,
  onChange,
}: {
  theme: Theme
  mode: ThemeMode
  onChange: (name: TokenName, color: Oklch) => void
}) {
  const contrast = React.useMemo(() => checkContrast(theme, mode), [theme, mode])

  return (
    <div className="flex flex-col">
      <div className="border-b px-4 py-3">
        <ContrastSummary results={contrast} />
      </div>
      {tokenGroups.map((group) => {
        const id = `tokens-${group.title.toLowerCase().replace(/\W+/g, "-")}`
        return (
          <section
            key={group.title}
            aria-labelledby={id}
            className="flex flex-col gap-3 border-b px-4 pt-3 pb-4 last:border-b-0"
          >
            <h3 id={id} className="text-xs font-medium text-muted-foreground">
              {group.title}
            </h3>
            {group.tokens.map((name) => (
              <ColorField
                key={`${mode}-${name}`}
                id={`token-${mode}-${name}`}
                label={tokenLabel(name)}
                color={theme[mode][name]}
                onChange={(color) => onChange(name, color)}
              >
                <ContrastBadge
                  results={contrast.filter((result) => result.foreground === name)}
                />
              </ColorField>
            ))}
          </section>
        )
      })}
    </div>
  )
}

export { ColorPanel, PresetGrid, RadiusPanel, TokenEditor }
