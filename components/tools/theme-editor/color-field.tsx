"use client"

import * as React from "react"
import { cn } from "cn"

import { Input } from "@/components/ui/input"
import {
  formatOklch,
  parseColor,
  toHex,
  type Oklch,
} from "@/lib/theme-editor/color"

function useDraft(value: string) {
  const [draft, setDraft] = React.useState(value)
  const [source, setSource] = React.useState(value)
  const [editing, setEditing] = React.useState(false)
  if (value !== source) {
    setSource(value)
    if (!editing) setDraft(value)
  }
  return { draft, setDraft, editing, setEditing, source }
}

function Swatch({
  color,
  label,
  onChange,
  className,
}: {
  color: Oklch
  label: string
  onChange: (color: Oklch) => void
  className?: string
}) {
  const hex = toHex(color)
  const [value, setValue] = React.useState(hex)
  const [source, setSource] = React.useState(hex)
  if (hex !== source) {
    setSource(hex)
    setValue(hex)
  }

  return (
    <span
      className={cn(
        "relative inline-grid size-8 shrink-0 overflow-hidden rounded-md bg-background inset-ring-(length:--hairline) inset-ring-border has-focus-visible:ring-3 has-focus-visible:ring-focus-ring forced-colors:border",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="col-start-1 row-start-1 rounded-md bg-(--swatch) inset-ring-(length:--hairline) inset-ring-foreground/15"
        style={{ "--swatch": formatOklch(color) } as React.CSSProperties}
      />
      <input
        type="color"
        aria-label={label}
        value={value}
        onChange={(event) => {
          setValue(event.target.value)
          const parsed = parseColor(event.target.value)
          if (parsed) onChange({ ...parsed, a: color.a })
        }}
        className="col-start-1 row-start-1 size-full cursor-pointer opacity-0"
      />
    </span>
  )
}

function ColorField({
  id,
  label,
  color,
  onChange,
  invalidMessage = "Use hex, rgb(), hsl() or oklch()",
  className,
  children,
}: {
  id: string
  label: React.ReactNode
  color: Oklch
  onChange: (color: Oklch) => void
  invalidMessage?: string
  className?: string
  children?: React.ReactNode
}) {
  const formatted = formatOklch(color)
  const { draft, setDraft, setEditing } = useDraft(formatted)
  const invalid = parseColor(draft) === null

  return (
    <div className={cn("flex min-w-0 items-center gap-2", className)}>
      <Swatch
        color={color}
        label={`${typeof label === "string" ? label : id} color picker`}
        onChange={onChange}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <label
            htmlFor={id}
            className="truncate text-xs font-medium text-foreground"
          >
            {label}
          </label>
          {children}
        </div>
        <Input
          id={id}
          size="sm"
          value={draft}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? `${id}-error` : undefined}
          onFocus={() => setEditing(true)}
          onBlur={() => {
            setEditing(false)
            setDraft(formatted)
          }}
          onChange={(event) => {
            const next = event.target.value
            setDraft(next)
            const parsed = parseColor(next)
            if (parsed) onChange(parsed)
          }}
        />
        {invalid ? (
          <p id={`${id}-error`} className="text-xs text-destructive">
            {invalidMessage}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export { ColorField, Swatch }
