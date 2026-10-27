"use client"

import * as React from "react"
import {
  IconArrowDown,
  IconArrowUp,
  IconCopy,
  IconLock,
  IconTrash,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { renderNode } from "@/components/page-builder/render-node"
import type { PlacedSection } from "@/lib/page-builder/doc"
import type { Props } from "@/lib/page-builder/fields"
import { getSection, sectionLabel } from "@/lib/page-builder/registry"

type SectionActions = {
  onSelect: (key: string) => void
  onShift: (key: string, by: number) => void
  onDuplicate: (key: string) => void
  onRemove: (key: string) => void
}

const SectionBody = React.memo(function SectionBody({
  sectionId,
  props,
}: {
  sectionId: string
  props: Props
}) {
  const section = getSection(sectionId)
  return section ? renderNode(section.build(props)) : null
})

function ProPreview({ name, title }: { name: string; title: string }) {
  return (
    <section className="px-6 py-16">
      <div className="relative mx-auto h-[34rem] max-w-6xl overflow-hidden rounded-2xl border bg-muted/40">
        <iframe
          src={`/preview/blocks/${name}`}
          title={`${title} preview`}
          tabIndex={-1}
          aria-hidden
          inert
          loading="lazy"
          className="pointer-events-none absolute inset-0 size-full border-0 opacity-60 blur-xs saturate-50"
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-3 border-t bg-background/90 px-5 py-4 backdrop-blur">
          <p className="flex items-center gap-2 text-sm">
            <IconLock
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
            <span className="font-medium">{title}</span>
            <span className="text-muted-foreground">HextaUI Pro block</span>
          </p>
          <Button
            size="sm"
            nativeButton={false}
            render={<a href="/pricing" target="_top" data-pb-allow="" />}
          >
            Unlock with Pro
          </Button>
        </div>
      </div>
    </section>
  )
}

function SectionToolbar({
  placed,
  label,
  index,
  count,
  actions,
}: {
  placed: PlacedSection
  label: string
  index: number
  count: number
  actions: SectionActions
}) {
  return (
    <div
      data-pb-toolbar=""
      data-edge={index === 0 ? "bottom" : "top"}
      className="absolute end-3 top-0 z-30 flex origin-right -translate-y-1/2 scale-(--pb-ui-scale) items-center gap-0.5 rounded-lg bg-popover p-0.5 text-popover-foreground shadow-lg ring-(length:--hairline) ring-border data-[edge=bottom]:top-auto data-[edge=bottom]:bottom-0 data-[edge=bottom]:translate-y-1/2 forced-colors:border"
    >
      <span className="px-2 text-xs font-medium whitespace-nowrap text-muted-foreground">
        {label}
      </span>
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label="Move section up"
        disabled={index === 0}
        onClick={() => actions.onShift(placed.key, -1)}
      >
        <IconArrowUp />
      </Button>
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label="Move section down"
        disabled={index === count - 1}
        onClick={() => actions.onShift(placed.key, 1)}
      >
        <IconArrowDown />
      </Button>
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label="Duplicate section"
        onClick={() => actions.onDuplicate(placed.key)}
      >
        <IconCopy />
      </Button>
      <Button
        variant="ghost-destructive"
        size="icon-xs"
        aria-label="Delete section"
        onClick={() => actions.onRemove(placed.key)}
      >
        <IconTrash />
      </Button>
    </div>
  )
}

function CanvasSections({
  sections,
  selected,
  editable,
  actions,
}: {
  sections: PlacedSection[]
  selected: string | null
  editable: boolean
  actions: SectionActions
}) {
  if (sections.length === 0) {
    return (
      <div className="flex min-h-120 flex-col items-center justify-center gap-1 p-10 text-center">
        <p className="text-base font-medium">Start with a section</p>
        <p className="text-sm text-muted-foreground">
          Pick a navbar, hero or anything else from the list on the left.
        </p>
      </div>
    )
  }

  return (
    <div
      className="flow-root"
      onClickCapture={(event) => {
        const target = event.target as Element
        const anchor = target.closest("a")
        if (anchor && !anchor.hasAttribute("data-pb-allow"))
          event.preventDefault()
      }}
    >
      {sections.map((placed, index) => {
        const active = editable && placed.key === selected
        const section =
          placed.type === "section" ? getSection(placed.sectionId) : null
        const label = section
          ? sectionLabel(section)
          : placed.type === "pro"
            ? `${placed.title} · Pro`
            : ""
        return (
          <div
            key={placed.key}
            data-pb-key={placed.key}
            data-selected={active ? "true" : undefined}
            data-editable={editable ? "" : undefined}
            className="group/pb relative"
            onPointerDown={(event) => {
              if (
                !editable ||
                (event.target as Element).closest("[data-pb-toolbar]")
              )
                return
              actions.onSelect(placed.key)
            }}
          >
            {placed.type === "section" ? (
              <SectionBody sectionId={placed.sectionId} props={placed.props} />
            ) : (
              <ProPreview name={placed.name} title={placed.title} />
            )}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20 ring-brand/60 ring-inset group-data-editable/pb:group-hover/pb:ring-1 group-data-selected/pb:ring-2 group-data-selected/pb:ring-brand forced-colors:group-data-selected/pb:outline-2 forced-colors:group-data-selected/pb:-outline-offset-2 forced-colors:group-data-selected/pb:outline-highlight"
            />
            {active ? (
              <SectionToolbar
                placed={placed}
                label={label}
                index={index}
                count={sections.length}
                actions={actions}
              />
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

export { CanvasSections, type SectionActions }
