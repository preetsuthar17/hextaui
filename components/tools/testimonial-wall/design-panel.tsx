"use client"

import * as React from "react"
import { cn } from "cn"

import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  accentLabels,
  cardStyleLabels,
  cardStyles,
  fieldLabels,
  radiusLabels,
  wallAccents,
  wallColumns,
  wallFields,
  wallRadii,
  wallRows,
  type Testimonial,
  type WallAccent,
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

function Row({
  label,
  id,
  children,
}: {
  label: string
  id: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <p id={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  )
}

function Segmented<Value extends string>({
  labelledBy,
  value,
  values,
  label,
  ariaLabel,
  onChange,
  className,
}: {
  labelledBy: string
  value: Value
  values: readonly Value[]
  label: (value: Value) => React.ReactNode
  ariaLabel?: (value: Value) => string
  onChange: (value: Value) => void
  className?: string
}) {
  return (
    <ToggleGroup
      variant="outline"
      size="sm"
      aria-labelledby={labelledBy}
      value={[value]}
      onValueChange={(next) => {
        if (next.length > 0) onChange(next[0] as Value)
      }}
      className={cn("w-full *:flex-1", className)}
    >
      {values.map((item) => (
        <ToggleGroupItem key={item} value={item} aria-label={ariaLabel?.(item)}>
          {label(item)}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

function DesignPanel({
  options,
  testimonials,
  onChange,
}: {
  options: WallOptions
  testimonials: Testimonial[]
  onChange: (patch: Partial<WallOptions>) => void
}) {
  const id = React.useId()
  const columnsApply =
    options.layout === "masonry" ||
    options.layout === "grid" ||
    options.layout === "carousel"

  return (
    <div className="flex flex-col gap-5 p-3">
      {columnsApply ? (
        <Row label="Columns" id={`${id}-columns`}>
          <Segmented
            labelledBy={`${id}-columns`}
            value={String(options.columns)}
            values={wallColumns.map(String)}
            label={(value) => value}
            onChange={(value) =>
              onChange({ columns: Number(value) as WallOptions["columns"] })
            }
          />
        </Row>
      ) : null}
      {options.layout === "marquee" ? (
        <Row label="Rows" id={`${id}-rows`}>
          <Segmented
            labelledBy={`${id}-rows`}
            value={String(options.rows)}
            values={wallRows.map(String)}
            label={(value) => (value === "1" ? "One row" : "Two rows")}
            onChange={(value) =>
              onChange({ rows: Number(value) as WallOptions["rows"] })
            }
          />
        </Row>
      ) : null}
      {options.layout === "featured" ? (
        <div className="flex flex-col gap-2">
          <label
            htmlFor={`${id}-featured`}
            className="text-xs font-medium text-muted-foreground"
          >
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
      <Row label="Cards" id={`${id}-cards`}>
        <Segmented
          labelledBy={`${id}-cards`}
          value={options.cardStyle}
          values={cardStyles}
          label={(value) => cardStyleLabels[value]}
          onChange={(cardStyle) => onChange({ cardStyle })}
        />
      </Row>
      <Row label="Corners" id={`${id}-radius`}>
        <Segmented
          labelledBy={`${id}-radius`}
          value={options.radius}
          values={wallRadii}
          label={(value) => radiusShort[value]}
          ariaLabel={(value) => radiusLabels[value]}
          onChange={(radius) => onChange({ radius })}
        />
      </Row>
      <Row label="Accent" id={`${id}-accent`}>
        <Segmented
          labelledBy={`${id}-accent`}
          value={options.accent}
          values={wallAccents}
          label={(value) => (
            <span
              aria-hidden
              className={cn(
                "size-3 rounded-full forced-colors:bg-canvas-text",
                accentSwatches[value]
              )}
            />
          )}
          ariaLabel={(value) => accentLabels[value]}
          onChange={(accent) => onChange({ accent })}
        />
      </Row>
      <div className="flex flex-col gap-1">
        <p className="pb-1 text-xs font-medium text-muted-foreground">Show</p>
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
    </div>
  )
}

export { DesignPanel }
