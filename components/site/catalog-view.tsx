"use client"

import * as React from "react"
import {
  IconLayoutGrid,
  IconList,
  IconSquareRounded,
} from "@tabler/icons-react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { catalogViewStorageKey } from "@/lib/catalog-view"

const views = [
  { value: "cards", label: "Grid", icon: IconLayoutGrid },
  { value: "single", label: "One per row", icon: IconSquareRounded },
  { value: "list", label: "List", icon: IconList },
] as const

type CatalogView = (typeof views)[number]["value"]

const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function readView(): CatalogView {
  const view = document.documentElement.dataset.catalogView
  return views.find((item) => item.value === view)?.value ?? "single"
}

function writeView(view: CatalogView) {
  document.documentElement.dataset.catalogView = view
  try {
    localStorage.setItem(catalogViewStorageKey, view)
  } catch {}
  listeners.forEach((listener) => listener())
}

function CatalogViewToggle() {
  const view = React.useSyncExternalStore(subscribe, readView, () => "single")

  return (
    <ToggleGroup
      variant="outline"
      size="sm"
      aria-label="View"
      value={[view]}
      onValueChange={(value) => {
        if (value.length > 0) writeView(value[0] as CatalogView)
      }}
    >
      {views.map(({ value, label, icon: Icon }) => (
        <ToggleGroupItem key={value} value={value} aria-label={label}>
          <Icon />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

export { CatalogViewToggle }
