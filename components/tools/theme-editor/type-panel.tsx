"use client"

import * as React from "react"

import { SliderRow } from "@/components/tools/theme-editor/panels"
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  fontOptionsFor,
  fontStack,
  systemFont,
  type FontSlot,
} from "@/lib/theme-editor/fonts"
import {
  maxTracking,
  minTracking,
  type ThemeFonts,
} from "@/lib/theme-editor/theme"
import { track } from "@/lib/track"

type FontItem = { value: string; label: string }
type FontGroup = { value: string; items: FontItem[] }

const slotLabels: Record<FontSlot, { label: string; own: string }> = {
  sans: { label: "Sans", own: "Sans serif" },
  serif: { label: "Serif", own: "Serif" },
  mono: { label: "Mono", own: "Monospace" },
}

function fontGroups(slot: FontSlot, current: string): FontGroup[] {
  const { own, rest } = fontOptionsFor(slot)
  const toItem = (name: string) => ({ value: name, label: name })
  const known = [systemFont, ...own.map((font) => font.name), ...rest.map((font) => font.name)]
  return [
    {
      value: "System",
      items: [
        { value: systemFont, label: "System default" },
        ...(known.includes(current) ? [] : [toItem(current)]),
      ],
    },
    { value: slotLabels[slot].own, items: own.map((font) => toItem(font.name)) },
    { value: "Other", items: rest.map((font) => toItem(font.name)) },
  ]
}

function FontPicker({
  slot,
  value,
  onChange,
}: {
  slot: FontSlot
  value: string
  onChange: (name: string) => void
}) {
  const groups = React.useMemo(() => fontGroups(slot, value), [slot, value])
  const selected =
    groups.flatMap((group) => group.items).find((item) => item.value === value) ??
    groups[0].items[0]
  const labelId = `font-${slot}-label`

  return (
    <div className="flex items-center gap-3">
      <span id={labelId} className="w-10 shrink-0 text-xs font-medium">
        {slotLabels[slot].label}
      </span>
      <div className="min-w-0 flex-1">
        <Combobox
          items={groups}
          value={selected}
          onValueChange={(item: FontItem | null) => {
            if (!item) return
            onChange(item.value)
            track("Theme editor font", { slot, font: item.value })
          }}
          isItemEqualToValue={(a: FontItem, b: FontItem) => a.value === b.value}
        >
          <ComboboxTrigger aria-labelledby={labelId} className="w-full">
            <ComboboxValue>
              {(item: FontItem | null) => (
                <span className="flex min-w-0 items-baseline gap-2">
                  <span
                    className="font-(family-name:--sample-font) text-base leading-none"
                    style={{ "--sample-font": fontStack(item?.value ?? systemFont, slot) } as React.CSSProperties}
                    aria-hidden="true"
                  >
                    Ag
                  </span>
                  <span className="truncate">{item?.label ?? "System default"}</span>
                </span>
              )}
            </ComboboxValue>
          </ComboboxTrigger>
          <ComboboxContent>
            <ComboboxInput placeholder="Search fonts" />
            <ComboboxEmpty>No font found.</ComboboxEmpty>
            <ComboboxList>
              {(group: FontGroup, index: number) => (
                <React.Fragment key={group.value}>
                  {index > 0 ? <ComboboxSeparator /> : null}
                  <ComboboxGroup items={group.items}>
                    <ComboboxLabel>{group.value}</ComboboxLabel>
                    <ComboboxCollection>
                      {(item: FontItem) => (
                        <ComboboxItem key={item.value} value={item}>
                          {item.label}
                        </ComboboxItem>
                      )}
                    </ComboboxCollection>
                  </ComboboxGroup>
                </React.Fragment>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
    </div>
  )
}

const textSizes = [14, 15, 16, 17, 18]

function TypePanel({
  fonts,
  tracking,
  textBase,
  onFontChange,
  onTrackingChange,
  onTextBaseChange,
}: {
  fonts: ThemeFonts
  tracking: number
  textBase: number
  onFontChange: (slot: FontSlot, name: string) => void
  onTrackingChange: (value: number) => void
  onTextBaseChange: (value: number) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {(["sans", "serif", "mono"] as const).map((slot) => (
          <FontPicker
            key={slot}
            slot={slot}
            value={fonts[slot]}
            onChange={(name) => onFontChange(slot, name)}
          />
        ))}
        <p className="text-xs text-muted-foreground">
          Google Fonts load only when you pick one.
        </p>
      </div>
      <div className="-mx-3 border-t" />
      <SliderRow
        id="tracking"
        label="Letter spacing"
        value={tracking}
        min={minTracking}
        max={maxTracking}
        step={0.005}
        format={(value) => `${value > 0 ? "+" : ""}${Math.round(value * 1000) / 1000}em`}
        onChange={onTrackingChange}
      />
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span id="text-base-label" className="font-medium">
            Base size
          </span>
          <span className="text-muted-foreground">Scales every text size</span>
        </div>
        <ToggleGroup
          variant="outline"
          size="sm"
          aria-labelledby="text-base-label"
          value={[String(textBase)]}
          onValueChange={(next) => {
            if (next[0] !== undefined) onTextBaseChange(Number(next[0]))
          }}
          className="grid w-full grid-cols-5"
        >
          {textSizes.map((size) => (
            <ToggleGroupItem key={size} value={String(size)} aria-label={`${size} pixels`}>
              <span className="tabular-nums">{size}px</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  )
}

export { TypePanel }
