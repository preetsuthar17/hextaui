"use client"

import * as React from "react"
import {
  IconAlertTriangle,
  IconCheck,
  IconCircleCheck,
  IconDots,
  IconLock,
  IconLockOpen,
  IconPhoto,
} from "@tabler/icons-react"

import { ColorField, Swatch as ColorSwatch } from "@/components/tools/theme-editor/color-field"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { formatOklch, parseColor, type Oklch } from "@/lib/theme-editor/color"
import { decodeTheme } from "@/lib/theme-editor/encode"
import { extractPalette, pickBrand, type Swatch } from "@/lib/theme-editor/image"
import { themePresets, type ThemePreset } from "@/lib/theme-editor/presets"
import { maxNameLength, type SavedTheme } from "@/lib/theme-editor/saved"
import {
  shadowLimits,
  shadowScale,
  type ThemeShadow,
} from "@/lib/theme-editor/shadow"
import {
  checkContrast,
  maxRadius,
  minRadius,
  type ContrastResult,
  type Theme,
  type ThemeMode,
} from "@/lib/theme-editor/theme"
import { harmonies, harmonyColors, type HarmonyKind } from "@/lib/theme-editor/tools"
import { tokenGroups, tokenLabel, type TokenName } from "@/lib/theme-editor/tokens"
import { track } from "@/lib/track"

function SliderRow({
  id,
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  id: string
  label: string
  value: number
  min: number
  max: number
  step: number
  format: (value: number) => string
  onChange: (value: number) => void
}) {
  const [local, setLocal] = React.useState(value)
  const [source, setSource] = React.useState(value)
  if (value !== source) {
    setSource(value)
    setLocal(value)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs">
        <span id={`${id}-label`} className="font-medium">
          {label}
        </span>
        <span className="text-muted-foreground tabular-nums">{format(local)}</span>
      </div>
      <Slider
        aria-labelledby={`${id}-label`}
        min={min}
        max={max}
        step={step}
        value={local}
        onValueChange={(next) => {
          const number = Array.isArray(next) ? next[0] : (next as number)
          setLocal(number)
          onChange(number)
        }}
      />
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xs font-medium text-muted-foreground">{children}</h3>
}

function PresetTile({
  preset,
  mode,
  active,
  label,
  onSelect,
}: {
  preset: Pick<ThemePreset, "slug" | "name" | "theme">
  mode: ThemeMode
  active: boolean
  label: string
  onSelect: () => void
}) {
  const palette = preset.theme[mode]
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      aria-label={preset.name}
      data-active={active ? "" : undefined}
      onClick={onSelect}
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
        className="relative flex h-12 w-full flex-col justify-between overflow-hidden rounded-md bg-(--preset-background) p-2 inset-ring-(length:--hairline) inset-ring-foreground/10 transition-shadow duration-150 ease-out-cubic group-hover/preset:inset-ring-foreground/25 group-data-active/preset:inset-ring-2 group-data-active/preset:inset-ring-foreground motion-reduce:transition-none forced-colors:border"
      >
        <span className="flex gap-1">
          <span className="size-2 rounded-full bg-(--preset-chart-1)" />
          <span className="size-2 rounded-full bg-(--preset-chart-2)" />
          <span className="size-2 rounded-full bg-(--preset-chart-3)" />
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-8 rounded-(--preset-radius) bg-(--preset-primary)" />
          <span className="h-3 w-5 rounded-(--preset-radius) bg-(--preset-muted)" />
        </span>
      </span>
      <span className="flex items-center justify-between gap-1 px-0.5">
        <span className="truncate">{label}</span>
        {active ? <IconCheck className="size-3 shrink-0" aria-hidden="true" /> : null}
      </span>
    </button>
  )
}

function SavedRow({
  entry,
  mode,
  active,
  editing,
  onLoad,
  onEdit,
  onRename,
  onOverwrite,
  onRemove,
}: {
  entry: SavedTheme
  mode: ThemeMode
  active: boolean
  editing: boolean
  onLoad: () => void
  onEdit: (editing: boolean) => void
  onRename: (name: string) => void
  onOverwrite: () => void
  onRemove: () => void
}) {
  const theme = React.useMemo(() => decodeTheme(entry.code), [entry.code])
  const [draft, setDraft] = React.useState(entry.name)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing])

  if (!theme) return null
  const palette = theme[mode]
  const swatches = [palette.background, palette.primary, palette.accent, palette["chart-1"]]

  return (
    <li className="group/saved flex h-9 items-center gap-2 rounded-md px-1.5 data-active:bg-muted" data-active={active ? "" : undefined}>
      <span aria-hidden="true" className="flex shrink-0 -space-x-1">
        {swatches.map((color, index) => (
          <span
            key={index}
            className="size-3.5 rounded-full bg-(--swatch) inset-ring-(length:--hairline) inset-ring-foreground/15 ring-2 ring-popover forced-colors:border"
            style={{ "--swatch": formatOklch(color) } as React.CSSProperties}
          />
        ))}
      </span>
      {editing ? (
        <Input
          ref={inputRef}
          size="sm"
          aria-label="Theme name"
          value={draft}
          maxLength={maxNameLength}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              onRename(draft)
              onEdit(false)
            }
            if (event.key === "Escape") {
              event.preventDefault()
              event.stopPropagation()
              setDraft(entry.name)
              onEdit(false)
            }
          }}
          onBlur={() => {
            onRename(draft)
            onEdit(false)
          }}
        />
      ) : (
        <button
          type="button"
          onClick={onLoad}
          aria-current={active ? "true" : undefined}
          className="min-w-0 flex-1 truncate rounded-sm text-start text-sm outline-none focus-visible:ring-3 focus-visible:ring-focus-ring"
        >
          {entry.name}
        </button>
      )}
      {active && !editing ? <IconCheck aria-label="Current theme" className="size-3.5 shrink-0" /> : null}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon-xs" aria-label={`Actions for ${entry.name}`} />}
        >
          <IconDots />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            onClick={() => {
              setDraft(entry.name)
              onEdit(true)
            }}
          >
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onOverwrite}>Update to current</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={onRemove}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  )
}

function PresetGrid({
  selected,
  savedSelected,
  mode,
  saved,
  editingId,
  onEditingChange,
  onSelect,
  onLoadSaved,
  onRenameSaved,
  onOverwriteSaved,
  onRemoveSaved,
}: {
  selected: string | null
  savedSelected: string | null
  mode: ThemeMode
  saved: SavedTheme[]
  editingId: string | null
  onEditingChange: (id: string | null) => void
  onSelect: (slug: string) => void
  onLoadSaved: (id: string) => void
  onRenameSaved: (id: string, name: string) => void
  onOverwriteSaved: (id: string) => void
  onRemoveSaved: (id: string) => void
}) {
  const groups = [
    { title: "HextaUI", presets: themePresets.filter((preset) => preset.group === "hextaui") },
    { title: "Inspired by", presets: themePresets.filter((preset) => preset.group === "inspired") },
  ]

  return (
    <div className="flex flex-col gap-3">
      {saved.length > 0 ? (
        <section className="flex flex-col gap-1.5" aria-labelledby="preset-saved">
          <h3 id="preset-saved" className="px-1 text-xs font-medium text-muted-foreground">
            My themes
          </h3>
          <ul className="flex max-h-40 flex-col overflow-y-auto">
            {saved.map((entry) => (
              <SavedRow
                key={entry.id}
                entry={entry}
                mode={mode}
                active={entry.id === savedSelected}
                editing={entry.id === editingId}
                onEdit={(editing) => onEditingChange(editing ? entry.id : null)}
                onLoad={() => onLoadSaved(entry.id)}
                onRename={(name) => onRenameSaved(entry.id, name)}
                onOverwrite={() => onOverwriteSaved(entry.id)}
                onRemove={() => onRemoveSaved(entry.id)}
              />
            ))}
          </ul>
        </section>
      ) : null}
      {groups.map((group) => (
        <section key={group.title} className="flex flex-col gap-1.5" aria-label={`${group.title} presets`}>
          <h3 className="px-1 text-xs font-medium text-muted-foreground">{group.title}</h3>
          <div role="radiogroup" aria-label={`${group.title} presets`} className="grid grid-cols-4 gap-1.5 max-sm:grid-cols-3">
            {group.presets.map((preset) => (
              <PresetTile
                key={preset.slug}
                preset={preset}
                mode={mode}
                active={preset.slug === selected}
                label={preset.name.replace(/^Inspired by /, "")}
                onSelect={() => {
                  onSelect(preset.slug)
                  track("Theme editor preset", { preset: preset.slug })
                }}
              />
            ))}
          </div>
        </section>
      ))}
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

function HarmonyPicker({
  brand,
  onApply,
}: {
  brand: Oklch
  onApply: (kind: HarmonyKind) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <SectionTitle>Harmony for charts and accent</SectionTitle>
      <div className="grid grid-cols-2 gap-1.5">
        {harmonies.map((harmony) => (
          <button
            key={harmony.kind}
            type="button"
            onClick={() => {
              onApply(harmony.kind)
              track("Theme editor harmony", { harmony: harmony.kind })
            }}
            className="flex h-8 min-w-0 items-center gap-2 rounded-md px-2 text-start text-xs text-muted-foreground inset-ring-(length:--hairline) inset-ring-border outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-focus-ring forced-colors:border"
          >
            <span aria-hidden="true" className="flex shrink-0 -space-x-1">
              {harmonyColors(brand, harmony.kind).map((color) => (
                <span
                  key={color.h}
                  className="size-3 rounded-full bg-(--swatch) ring-2 ring-popover forced-colors:border"
                  style={{ "--swatch": formatOklch(color) } as React.CSSProperties}
                />
              ))}
            </span>
            <span className="truncate">{harmony.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function ColorPanel({
  brand,
  tint,
  onGenerate,
  onHarmony,
}: {
  brand: Oklch
  tint: number
  onGenerate: (brand: Oklch, tint?: number) => void
  onHarmony: (kind: HarmonyKind) => void
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
      <HarmonyPicker brand={brand} onApply={onHarmony} />
    </div>
  )
}

const radiusPresets = [0, 0.4, 0.6, 0.8, 1.2]

function ShadowEditor({
  shadow,
  onChange,
}: {
  shadow: ThemeShadow
  onChange: (patch: Partial<ThemeShadow>, key?: string) => void
}) {
  const scale = shadowScale(shadow)
  const sizes = ["sm", "md", "lg", "xl"] as const
  const px = (value: number) => `${value}px`

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <SectionTitle>Shadow</SectionTitle>
        <span className="text-xs text-muted-foreground">Popovers, menus, dialogs</span>
      </div>
      <div aria-hidden="true" className="grid grid-cols-4 gap-2 rounded-md bg-muted/60 p-3 dark:bg-muted/30">
        {sizes.map((size) => (
          <span key={size} className="flex flex-col items-center gap-1.5">
            <span
              className="h-8 w-full rounded-md bg-popover shadow-(--tile-shadow) ring-(length:--hairline) ring-foreground/5"
              style={{ "--tile-shadow": scale[size] } as React.CSSProperties}
            />
            <span className="text-xs text-muted-foreground">{size}</span>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <ColorSwatch
          color={shadow.color}
          label="Shadow color"
          onChange={(color) => onChange({ color: { ...color, a: 1 } }, "shadow-color")}
          className="size-7"
        />
        <div className="min-w-0 flex-1">
          <SliderRow
            id="shadow-opacity"
            label="Opacity"
            value={shadow.opacity}
            min={shadowLimits.opacity[0]}
            max={0.5}
            step={0.01}
            format={(value) => `${Math.round(value * 100)}%`}
            onChange={(opacity) => onChange({ opacity }, "shadow-opacity")}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <SliderRow
          id="shadow-blur"
          label="Blur"
          value={shadow.blur}
          min={shadowLimits.blur[0]}
          max={shadowLimits.blur[1]}
          step={1}
          format={px}
          onChange={(blur) => onChange({ blur }, "shadow-blur")}
        />
        <SliderRow
          id="shadow-spread"
          label="Spread"
          value={shadow.spread}
          min={shadowLimits.spread[0]}
          max={shadowLimits.spread[1]}
          step={1}
          format={px}
          onChange={(spread) => onChange({ spread }, "shadow-spread")}
        />
        <SliderRow
          id="shadow-x"
          label="Offset X"
          value={shadow.x}
          min={shadowLimits.x[0]}
          max={shadowLimits.x[1]}
          step={1}
          format={px}
          onChange={(x) => onChange({ x }, "shadow-x")}
        />
        <SliderRow
          id="shadow-y"
          label="Offset Y"
          value={shadow.y}
          min={shadowLimits.y[0]}
          max={shadowLimits.y[1]}
          step={1}
          format={px}
          onChange={(y) => onChange({ y }, "shadow-y")}
        />
      </div>
    </div>
  )
}

function ShapePanel({
  radius,
  shadow,
  onRadiusChange,
  onShadowChange,
}: {
  radius: number
  shadow: ThemeShadow
  onRadiusChange: (value: number) => void
  onShadowChange: (patch: Partial<ThemeShadow>, key?: string) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <RadiusPanel value={radius} onChange={onRadiusChange} />
      <div className="-mx-3 border-t" />
      <ShadowEditor shadow={shadow} onChange={onShadowChange} />
    </div>
  )
}

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

function LockButton({
  name,
  locked,
  onToggle,
}: {
  name: TokenName
  locked: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={locked}
      aria-label={`Lock ${tokenLabel(name).toLowerCase()}`}
      title={locked ? "Locked: shuffle, presets and adjust skip it" : "Lock this token"}
      onClick={onToggle}
      className="-my-1 grid size-5 shrink-0 place-items-center rounded-sm text-muted-foreground/60 outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-focus-ring aria-pressed:text-foreground forced-colors:aria-pressed:outline-1 forced-colors:aria-pressed:outline-solid"
    >
      {locked ? <IconLock className="size-3.5" aria-hidden="true" /> : <IconLockOpen className="size-3.5" aria-hidden="true" />}
    </button>
  )
}

function TokenEditor({
  theme,
  mode,
  locked,
  linked,
  onLinkedChange,
  onToggleLock,
  onChange,
}: {
  theme: Theme
  mode: ThemeMode
  locked: ReadonlySet<TokenName>
  linked: boolean
  onLinkedChange: (linked: boolean) => void
  onToggleLock: (name: TokenName) => void
  onChange: (name: TokenName, color: Oklch) => void
}) {
  const contrast = React.useMemo(() => checkContrast(theme, mode), [theme, mode])

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 border-b px-4 py-3">
        <label className="flex items-center justify-between gap-3 text-xs">
          <span className="flex flex-col gap-0.5">
            <span className="font-medium">Link light and dark</span>
            <span className="text-muted-foreground">
              {linked
                ? "Hue and chroma edits carry to the other mode."
                : "Each mode is edited on its own."}
            </span>
          </span>
          <Switch size="sm" checked={linked} onCheckedChange={onLinkedChange} />
        </label>
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
                <span className="flex items-center gap-1.5">
                  <ContrastBadge
                    results={contrast.filter((result) => result.foreground === name)}
                  />
                  <LockButton
                    name={name}
                    locked={locked.has(name)}
                    onToggle={() => onToggleLock(name)}
                  />
                </span>
              </ColorField>
            ))}
          </section>
        )
      })}
    </div>
  )
}

export {
  ColorPanel,
  PresetGrid,
  SectionTitle,
  ShapePanel,
  SliderRow,
  TokenEditor,
}
