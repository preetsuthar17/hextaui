"use client"

import * as React from "react"
import { IconPlus } from "@tabler/icons-react"

import { LiveThumb } from "@/components/page-builder/section-thumb"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { sections } from "@/lib/page-builder/registry"
import { starterDoc, starters } from "@/lib/page-builder/starters"
import type { ThemeVars } from "@/lib/page-builder/theme"

const previews = starters.map((starter) => {
  const doc = starterDoc(starter.id)
  return {
    starter,
    items: (doc?.sections ?? []).slice(0, 3).flatMap((placed) =>
      placed.type === "section"
        ? [{ sectionId: placed.sectionId, props: placed.props }]
        : []
    ),
    count: doc?.sections.length ?? 0,
  }
})

function StartScreen({
  vars,
  dark,
  onStart,
  onBlank,
}: {
  vars: ThemeVars
  dark: boolean
  onStart: (id: string) => void
  onBlank: () => void
}) {
  return (
    <div className="flex w-full max-w-6xl flex-col items-center gap-8 py-4 sm:gap-10 sm:py-8">
      <div className="flex max-w-md flex-col items-center gap-2 text-center">
        <h2 className="text-xl font-semibold tracking-tight text-balance sm:text-2xl">
          Start a page
        </h2>
        <p className="text-sm text-pretty text-muted-foreground">
          Pick a starter and make it yours, or start blank. {sections.length} free
          sections, all real HextaUI components.
        </p>
      </div>
      <ul className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {previews.map(({ starter, items, count }) => (
          <li key={starter.id} className="group/starter relative min-w-0">
            <div className="flex w-full flex-col gap-3 p-1.5">
              <span className="block overflow-hidden rounded-lg bg-background ring-(length:--hairline) ring-foreground/10 transition duration-200 ease-out-cubic group-hover/starter:ring-foreground/25 motion-safe:group-hover/starter:-translate-y-0.5 forced-colors:border">
                <LiveThumb
                  items={items}
                  vars={vars}
                  dark={dark}
                  align="start"
                  className="aspect-4/3"
                />
              </span>
              <span className="flex flex-col gap-0.5 px-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-medium">{starter.title}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {count} sections
                  </span>
                </span>
                <span className="text-xs text-pretty text-muted-foreground">
                  {starter.description}
                </span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => onStart(starter.id)}
              aria-label={`Start with the ${starter.title} page`}
              className="absolute inset-0 cursor-pointer rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-focus-ring forced-colors:focus-visible:outline-2"
            />
          </li>
        ))}
      </ul>
      <div className="flex flex-col items-center gap-2">
        <Button variant="outline" onClick={onBlank}>
          <IconPlus data-icon="inline-start" />
          Start blank
        </Button>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground max-sm:hidden">
          Press <Kbd size="sm">A</Kbd> any time to add a section
        </p>
      </div>
    </div>
  )
}

function EmptyPage({ onAdd, onStarters }: { onAdd: () => void; onStarters: () => void }) {
  return (
    <div className="flex min-h-120 flex-col items-center justify-center gap-4 p-10 text-center">
      <div className="flex flex-col gap-1">
        <p className="text-base font-medium">This page is empty</p>
        <p className="text-sm text-pretty text-muted-foreground">
          Add a navbar, a hero or anything else. Sections go in after the one
          you select.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button onClick={onAdd}>
          <IconPlus data-icon="inline-start" />
          Add a section
        </Button>
        <Button variant="ghost" onClick={onStarters}>
          Use a starter
        </Button>
      </div>
    </div>
  )
}

export { EmptyPage, StartScreen }
