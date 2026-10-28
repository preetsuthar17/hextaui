"use client"

import * as React from "react"
import { IconCheck } from "@tabler/icons-react"
import { cn } from "cn"

import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  frameBackgroundLabels,
  frameBackgroundStyle,
  frameBackgrounds,
  frameLimits,
  framePaddingLabels,
  framePaddings,
  type WallFrame,
} from "@/lib/testimonial-wall/frame"
import {
  accentLabels,
  cardStyleLabels,
  cardStyles,
  fieldLabels,
  layoutLabels,
  radiusLabels,
  wallAccents,
  wallColumns,
  wallFields,
  wallLayouts,
  wallRadii,
  type Testimonial,
  type WallAccent,
  type WallLayout,
  type WallOptions,
} from "@/lib/testimonial-wall/model"

const accentSwatches: Record<WallAccent, string> = {
  neutral: "bg-foreground",
  primary: "bg-primary",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
}

const radiusShort: Record<(typeof wallRadii)[number], string> = {
  none: "0",
  sm: "S",
  md: "M",
  lg: "L",
  xl: "XL",
}

const radiusCorners: Record<(typeof wallRadii)[number], string> = {
  none: "0rem",
  sm: "0.2rem",
  md: "0.4rem",
  lg: "0.55rem",
  xl: "0.75rem",
}

const tile =
  "rounded-xs bg-foreground/12 group-data-active/layout:bg-foreground/20"

function LayoutThumb({ layout }: { layout: WallLayout }) {
  switch (layout) {
    case "masonry":
      return (
        <span className="grid size-full grid-cols-3 gap-1">
          {[
            ["h-5", "h-3", "h-4"],
            ["h-3", "h-5", "h-2"],
            ["h-4", "h-2", "h-5"],
          ].map((column, index) => (
            <span key={index} className="flex flex-col gap-1">
              {column.map((height, row) => (
                <span key={row} className={cn(tile, height)} />
              ))}
            </span>
          ))}
        </span>
      )
    case "grid":
      return (
        <span className="grid size-full grid-cols-3 grid-rows-2 gap-1">
          {Array.from({ length: 6 }, (_, index) => (
            <span key={index} className={tile} />
          ))}
        </span>
      )
    case "marquee":
      return (
        <span className="flex size-full flex-col justify-center gap-1 overflow-hidden mask-x-from-70% mask-x-to-100%">
          {["-ms-2", "-ms-5"].map((offset) => (
            <span key={offset} className={cn("flex gap-1", offset)}>
              {Array.from({ length: 5 }, (_, index) => (
                <span key={index} className={cn(tile, "h-4 w-6 shrink-0")} />
              ))}
            </span>
          ))}
        </span>
      )
    case "carousel":
      return (
        <span className="flex size-full flex-col justify-center gap-1.5">
          <span className="flex gap-1">
            <span className={cn(tile, "h-7 flex-1")} />
            <span className={cn(tile, "h-7 flex-1")} />
            <span className={cn(tile, "h-7 w-2 shrink-0 opacity-50")} />
          </span>
          <span className="flex justify-center gap-0.5">
            <span className="size-1 rounded-full bg-foreground/40" />
            <span className="size-1 rounded-full bg-foreground/15" />
            <span className="size-1 rounded-full bg-foreground/15" />
          </span>
        </span>
      )
    case "featured":
      return (
        <span className="flex size-full flex-col items-center justify-center gap-1">
          <span className="h-1 w-12 rounded-full bg-foreground/25" />
          <span className="h-1 w-9 rounded-full bg-foreground/25" />
          <span className="mt-1 size-2.5 rounded-full bg-foreground/15" />
        </span>
      )
  }
}

function Label({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <p id={id} className="text-xs font-medium">
      {children}
    </p>
  )
}

function Segmented<Value extends string>({
  labelledBy,
  value,
  values,
  label,
  ariaLabel,
  disabled,
  onChange,
}: {
  labelledBy: string
  value: Value
  values: readonly Value[]
  label: (value: Value) => React.ReactNode
  ariaLabel?: (value: Value) => string
  disabled?: boolean
  onChange: (value: Value) => void
}) {
  return (
    <ToggleGroup
      variant="outline"
      size="sm"
      aria-labelledby={labelledBy}
      value={[value]}
      disabled={disabled}
      onValueChange={(next) => {
        if (next.length > 0) onChange(next[0] as Value)
      }}
      className="w-full *:flex-1"
    >
      {values.map((item) => (
        <ToggleGroupItem key={item} value={item} aria-label={ariaLabel?.(item)}>
          {label(item)}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

function LayoutPanel({
  options,
  testimonials,
  onChange,
}: {
  options: WallOptions
  testimonials: Testimonial[]
  onChange: (patch: Partial<WallOptions>) => void
}) {
  const id = React.useId()

  return (
    <div className="flex flex-col gap-4">
      <div
        role="radiogroup"
        aria-label="Layout"
        className="grid grid-cols-5 gap-1.5 max-sm:grid-cols-3"
      >
        {wallLayouts.map((layout) => {
          const active = layout === options.layout
          return (
            <button
              key={layout}
              type="button"
              role="radio"
              aria-checked={active}
              data-active={active ? "" : undefined}
              onClick={() => onChange({ layout })}
              className="group/layout flex min-w-0 flex-col gap-1.5 rounded-lg p-1 text-start text-xs text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-focus-ring data-active:text-foreground forced-colors:data-active:outline-2 forced-colors:data-active:outline-solid"
            >
              <span
                aria-hidden="true"
                className="flex h-14 w-full items-stretch overflow-hidden rounded-md bg-background p-2 inset-ring-(length:--hairline) inset-ring-foreground/10 transition-shadow duration-150 ease-out-cubic group-hover/layout:inset-ring-foreground/25 group-data-active/layout:inset-ring-2 group-data-active/layout:inset-ring-foreground motion-reduce:transition-none forced-colors:border"
              >
                <LayoutThumb layout={layout} />
              </span>
              <span className="flex items-center justify-between gap-1 px-0.5">
                <span className="truncate">{layoutLabels[layout]}</span>
                {active ? (
                  <IconCheck className="size-3 shrink-0" aria-hidden="true" />
                ) : null}
              </span>
            </button>
          )
        })}
      </div>
      {options.layout === "marquee" ? (
        <div className="flex flex-col gap-2">
          <Label id={`${id}-rows`}>Rows</Label>
          <Segmented
            labelledBy={`${id}-rows`}
            value={String(options.rows)}
            values={["1", "2"]}
            label={(value) => (value === "1" ? "One row" : "Two rows")}
            onChange={(value) =>
              onChange({ rows: Number(value) as WallOptions["rows"] })
            }
          />
        </div>
      ) : null}
      {options.layout === "featured" && testimonials.length > 0 ? (
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-featured`} className="text-xs font-medium">
            Featured quote
          </label>
          <NativeSelect
            id={`${id}-featured`}
            size="sm"
            className="w-full"
            value={String(Math.min(options.featured, testimonials.length - 1))}
            onChange={(event) =>
              onChange({ featured: Number(event.target.value) })
            }
          >
            {testimonials.map((testimonial, index) => (
              <NativeSelectOption key={index} value={String(index)}>
                {testimonial.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
      ) : null}
    </div>
  )
}

function StylePanel({
  options,
  onChange,
}: {
  options: WallOptions
  onChange: (patch: Partial<WallOptions>) => void
}) {
  const id = React.useId()
  const columnsApply =
    options.layout === "masonry" ||
    options.layout === "grid" ||
    options.layout === "carousel"

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label id={`${id}-cards`}>Cards</Label>
        <Segmented
          labelledBy={`${id}-cards`}
          value={options.cardStyle}
          values={cardStyles}
          label={(value) => cardStyleLabels[value]}
          onChange={(cardStyle) => onChange({ cardStyle })}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label id={`${id}-radius`}>Corners</Label>
        <Segmented
          labelledBy={`${id}-radius`}
          value={options.radius}
          values={wallRadii}
          label={(value) => (
            <span className="flex items-center gap-1.5 tabular-nums">
              <span
                aria-hidden="true"
                className="size-3 rounded-ss-(--corner) border-s-2 border-t-2 border-current"
                style={
                  { "--corner": radiusCorners[value] } as React.CSSProperties
                }
              />
              {radiusShort[value]}
            </span>
          )}
          ariaLabel={(value) => radiusLabels[value]}
          onChange={(radius) => onChange({ radius })}
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <Label id={`${id}-columns`}>Columns</Label>
          {columnsApply ? null : (
            <span className="text-xs text-muted-foreground">
              Not used by {options.layout}
            </span>
          )}
        </div>
        <Segmented
          labelledBy={`${id}-columns`}
          value={String(options.columns)}
          values={wallColumns.map(String)}
          label={(value) => value}
          disabled={!columnsApply}
          onChange={(value) =>
            onChange({ columns: Number(value) as WallOptions["columns"] })
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label id={`${id}-accent`}>Accent</Label>
        <div
          role="radiogroup"
          aria-labelledby={`${id}-accent`}
          className="flex items-center gap-2"
        >
          {wallAccents.map((accent) => (
            <button
              key={accent}
              type="button"
              role="radio"
              aria-checked={accent === options.accent}
              aria-label={accentLabels[accent]}
              title={accentLabels[accent]}
              onClick={() => onChange({ accent })}
              className={cn(
                "size-7 rounded-full inset-ring-(length:--hairline) inset-ring-foreground/15 ring-offset-2 ring-offset-popover transition-transform duration-150 ease-out-cubic outline-none focus-visible:ring-3 focus-visible:ring-focus-ring aria-checked:ring-2 aria-checked:ring-foreground motion-safe:active:scale-95 forced-colors:border forced-colors:aria-checked:outline-2 forced-colors:aria-checked:outline-solid",
                accentSwatches[accent]
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function ShowPanel({
  options,
  onChange,
}: {
  options: WallOptions
  onChange: (patch: Partial<WallOptions>) => void
}) {
  return (
    <div className="-my-1 flex flex-col">
      {wallFields.map((field) => (
        <label
          key={field}
          className="flex items-center justify-between gap-4 py-1.5 text-sm"
        >
          {fieldLabels[field]}
          <Switch
            size="sm"
            checked={options.show[field]}
            onCheckedChange={(checked) =>
              onChange({ show: { ...options.show, [field]: checked } })
            }
          />
        </label>
      ))}
    </div>
  )
}

function FramePanel({
  frame,
  accent,
  dark,
  onChange,
}: {
  frame: WallFrame
  accent: WallAccent
  dark: boolean
  onChange: (patch: Partial<WallFrame>) => void
}) {
  const id = React.useId()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label id={`${id}-background`}>Background</Label>
        <div
          role="radiogroup"
          aria-labelledby={`${id}-background`}
          className="grid grid-cols-6 gap-1.5 max-sm:grid-cols-3"
        >
          {frameBackgrounds.map((background) => {
            const active = background === frame.background
            return (
              <button
                key={background}
                type="button"
                role="radio"
                aria-checked={active}
                data-active={active ? "" : undefined}
                onClick={() => onChange({ background })}
                className="group/background flex min-w-0 flex-col items-center gap-1.5 rounded-lg p-1 text-xs text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-focus-ring data-active:text-foreground forced-colors:data-active:outline-2 forced-colors:data-active:outline-solid"
              >
                <span
                  aria-hidden="true"
                  data-none={background === "none" ? "" : undefined}
                  className="h-9 w-full rounded-md bg-(image:--swatch) inset-ring-(length:--hairline) inset-ring-foreground/10 transition-shadow duration-150 ease-out-cubic group-hover/background:inset-ring-foreground/25 group-data-active/background:inset-ring-2 group-data-active/background:inset-ring-foreground data-none:border data-none:border-dashed data-none:border-foreground/20 motion-reduce:transition-none forced-colors:border"
                  style={
                    {
                      "--swatch": frameBackgroundStyle(
                        background,
                        accent,
                        dark || background === "graphite"
                      ),
                    } as React.CSSProperties
                  }
                />
                <span className="w-full truncate text-center">
                  {frameBackgroundLabels[background]}
                </span>
              </button>
            )
          })}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label id={`${id}-padding`}>Padding</Label>
        <Segmented
          labelledBy={`${id}-padding`}
          value={frame.padding}
          values={framePaddings}
          label={(value) => framePaddingLabels[value]}
          ariaLabel={(value) =>
            ({ sm: "Small", md: "Medium", lg: "Large" })[value]
          }
          onChange={(padding) => onChange({ padding })}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="flex items-center justify-between gap-4 text-xs font-medium">
          Heading
          <Switch
            size="sm"
            checked={frame.heading}
            onCheckedChange={(heading) => onChange({ heading })}
          />
        </label>
        <Input
          size="sm"
          aria-label="Heading text"
          value={frame.title}
          maxLength={frameLimits.title}
          disabled={!frame.heading}
          placeholder="Loved by builders"
          onValueChange={(title) => onChange({ title })}
        />
      </div>
    </div>
  )
}

export { FramePanel, LayoutPanel, ShowPanel, StylePanel }
