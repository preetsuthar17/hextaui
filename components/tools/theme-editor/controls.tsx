"use client"

import * as React from "react"
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconPhoto,
} from "@tabler/icons-react"
import { cn } from "cn"

import { ColorField } from "@/components/tools/theme-editor/color-field"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { formatOklch, type Oklch } from "@/lib/theme-editor/color"
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

import type { ThemeState } from "@/components/tools/theme-editor/use-theme-state"

type Actions = {
  applyPreset: (slug: string) => void
  generate: (brand: Oklch, tint?: number) => void
  setToken: (mode: ThemeMode, name: TokenName, color: Oklch) => void
  setRadius: (radius: number) => void
}

function Section({
  title,
  action,
  children,
  className,
}: {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  const id = React.useId()
  return (
    <section aria-labelledby={id} className={cn("flex flex-col gap-2.5 border-b px-4 py-4", className)}>
      <div className="flex min-h-6 items-center justify-between gap-2">
        <h2 id={id} className="text-xs font-medium text-muted-foreground">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  )
}

function PresetPicker({
  selected,
  mode,
  onSelect,
}: {
  selected: string | null
  mode: ThemeMode
  onSelect: (slug: string) => void
}) {
  return (
    <div role="radiogroup" aria-label="Presets" className="grid grid-cols-3 gap-1.5">
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
            className="flex min-w-0 flex-col items-start gap-1.5 rounded-md p-1.5 text-start text-xs text-muted-foreground inset-ring-(length:--hairline) inset-ring-border transition duration-150 ease-out-cubic outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-focus-ring data-active:bg-muted data-active:text-foreground data-active:inset-ring-foreground/40 motion-reduce:transition-none forced-colors:border forced-colors:data-active:border-highlight"
          >
            <span aria-hidden="true" className="flex h-3 w-full overflow-hidden rounded-xs inset-ring-(length:--hairline) inset-ring-foreground/10">
              {[palette.primary, palette.accent, palette["chart-2"], palette.background].map(
                (color, index) => (
                  <span
                    key={index}
                    className="flex-1 bg-(--swatch)"
                    style={{ "--swatch": formatOklch(color) } as React.CSSProperties}
                  />
                )
              )}
            </span>
            <span className="truncate">{preset.name}</span>
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
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => inputRef.current?.click()}
      >
        <IconPhoto data-icon="inline-start" />
        Theme from an image
      </Button>
      {swatches.length > 0 ? (
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Picked</span>
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
      ) : null}
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

function RadiusControl({
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
  return (
    <Slider
      aria-label="Radius"
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
  )
}

function TokenGroups({
  theme,
  mode,
  contrast,
  onChange,
}: {
  theme: Theme
  mode: ThemeMode
  contrast: ContrastResult[]
  onChange: (name: TokenName, color: Oklch) => void
}) {
  return (
    <div className="px-4">
    <Accordion multiple defaultValue={["Base", "Primary"]}>
      {tokenGroups.map((group) => (
        <AccordionItem key={group.title} value={group.title}>
          <AccordionTrigger>{group.title}</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-3 pb-1">
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
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
    </div>
  )
}

function Controls({
  state,
  mode,
  actions,
}: {
  state: ThemeState
  mode: ThemeMode
  actions: Actions
}) {
  const { theme, source, brand, tint } = state
  const contrast = React.useMemo(() => checkContrast(theme, mode), [theme, mode])
  const [tintValue, setTintValue] = React.useState(tint)

  return (
    <div className="flex flex-col">
      <Section title="Presets">
        <PresetPicker
          selected={source.kind === "preset" ? source.slug : null}
          mode={mode}
          onSelect={actions.applyPreset}
        />
      </Section>
      <Section title="Generate from one color">
        <ColorField
          id="brand-color"
          label="Brand color"
          color={brand}
          onChange={(color) => actions.generate(color)}
        />
        <div className="flex flex-col gap-1.5">
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
              actions.generate(brand, number)
            }}
          />
        </div>
        <ImagePalette onPick={(color) => actions.generate(color)} />
      </Section>
      <Section
        title="Radius"
        action={
          <span className="text-xs text-muted-foreground tabular-nums">
            {theme.radius.toFixed(2)}rem
          </span>
        }
      >
        <RadiusControl value={theme.radius} onChange={actions.setRadius} />
      </Section>
      <Section title={`Colors · ${mode === "dark" ? "Dark" : "Light"} mode`} className="border-b-0 pb-1">
        <ContrastSummary results={contrast} />
      </Section>
      <TokenGroups
        theme={theme}
        mode={mode}
        contrast={contrast}
        onChange={(name, color) => actions.setToken(mode, name, color)}
      />
    </div>
  )
}

export { Controls }
