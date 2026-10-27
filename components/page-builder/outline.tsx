"use client"

import * as React from "react"
import { IconGripVertical, IconLock } from "@tabler/icons-react"

import type { PlacedSection } from "@/lib/page-builder/doc"
import { getSection, sectionLabel } from "@/lib/page-builder/registry"

type Drag = {
  key: string
  pointer: number
  from: number
  to: number
  startY: number
  centers: number[]
  heights: number[]
  rows: HTMLElement[]
}

function labelOf(placed: PlacedSection) {
  if (placed.type === "pro") return `${placed.title} · Pro`
  const section = getSection(placed.sectionId)
  return section ? sectionLabel(section) : placed.sectionId
}

function Outline({
  sections,
  selected,
  onSelect,
  onMove,
  onAnnounce,
}: {
  sections: PlacedSection[]
  selected: string | null
  onSelect: (key: string) => void
  onMove: (key: string, to: number) => void
  onAnnounce: (message: string) => void
}) {
  const listRef = React.useRef<HTMLOListElement>(null)
  const drag = React.useRef<Drag | null>(null)
  const pendingFocus = React.useRef<string | null>(null)

  React.useLayoutEffect(() => {
    const key = pendingFocus.current
    if (!key) return
    pendingFocus.current = null
    listRef.current
      ?.querySelector<HTMLElement>(`[data-handle="${CSS.escape(key)}"]`)
      ?.focus()
  })

  const clearTransforms = (rows: HTMLElement[]) => {
    for (const row of rows) {
      row.style.transform = ""
      row.style.transition = ""
      row.removeAttribute("data-dragging")
    }
  }

  const onPointerDown = (
    event: React.PointerEvent<HTMLButtonElement>,
    key: string,
    index: number
  ) => {
    if (event.button !== 0 || !listRef.current) return
    const rows = Array.from(
      listRef.current.querySelectorAll<HTMLElement>("[data-row]")
    )
    const rects = rows.map((row) => row.getBoundingClientRect())
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = {
      key,
      pointer: event.pointerId,
      from: index,
      to: index,
      startY: event.clientY,
      centers: rects.map((rect) => rect.top + rect.height / 2),
      heights: rects.map((rect) => rect.height),
      rows,
    }
    rows[index].setAttribute("data-dragging", "")
  }

  const onPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const state = drag.current
    if (!state || state.pointer !== event.pointerId) return
    const delta = event.clientY - state.startY
    const center = state.centers[state.from] + delta
    let to = state.from
    while (to < state.centers.length - 1 && center > state.centers[to + 1])
      to += 1
    while (to > 0 && center < state.centers[to - 1]) to -= 1
    state.to = to
    const gap = state.heights[state.from]
    const transition = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? "none"
      : "transform 150ms cubic-bezier(0.23, 1, 0.32, 1)"
    state.rows.forEach((row, index) => {
      if (index === state.from) {
        row.style.transition = "none"
        row.style.transform = `translateY(${delta}px)`
        return
      }
      row.style.transition = transition
      const shift =
        state.from < to && index > state.from && index <= to
          ? -gap
          : state.from > to && index < state.from && index >= to
            ? gap
            : 0
      row.style.transform = shift ? `translateY(${shift}px)` : ""
    })
  }

  const endDrag = (
    event: React.PointerEvent<HTMLButtonElement>,
    commit: boolean
  ) => {
    const state = drag.current
    if (!state || state.pointer !== event.pointerId) return
    drag.current = null
    clearTransforms(state.rows)
    if (commit && state.to !== state.from) {
      onMove(state.key, state.to)
      onAnnounce(`Moved to position ${state.to + 1} of ${state.rows.length}.`)
      pendingFocus.current = state.key
    }
  }

  const onKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    key: string,
    index: number
  ) => {
    const by = event.key === "ArrowUp" ? -1 : event.key === "ArrowDown" ? 1 : 0
    const to =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? sections.length - 1
          : index + by
    if (
      (by === 0 && event.key !== "Home" && event.key !== "End") ||
      to === index
    )
      return
    if (to < 0 || to >= sections.length) return
    event.preventDefault()
    pendingFocus.current = key
    onMove(key, to)
    onAnnounce(
      `${labelOf(sections[index])} moved to position ${to + 1} of ${sections.length}.`
    )
  }

  if (sections.length === 0) {
    return (
      <p className="p-6 text-center text-sm text-pretty text-muted-foreground">
        The page is empty. Add sections from the Sections tab.
      </p>
    )
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
      <p
        id="pb-outline-help"
        className="px-2 pb-2 text-xs text-pretty text-muted-foreground"
      >
        Drag the handle, or focus it and use the arrow keys, to reorder.
      </p>
      <ol
        ref={listRef}
        aria-label="Page sections"
        className="flex flex-col gap-px"
      >
        {sections.map((placed, index) => {
          const label = labelOf(placed)
          const active = placed.key === selected
          return (
            <li
              key={placed.key}
              data-row=""
              data-active={active ? "" : undefined}
              className="relative flex items-center gap-1 rounded-md bg-background data-dragging:z-10 data-dragging:shadow-md data-dragging:ring-(length:--hairline) data-dragging:ring-border data-active:bg-muted"
            >
              <button
                type="button"
                data-handle={placed.key}
                aria-label={`Reorder ${label}, position ${index + 1} of ${sections.length}`}
                aria-describedby="pb-outline-help"
                onPointerDown={(event) =>
                  onPointerDown(event, placed.key, index)
                }
                onPointerMove={onPointerMove}
                onPointerUp={(event) => endDrag(event, true)}
                onPointerCancel={(event) => endDrag(event, false)}
                onKeyDown={(event) => onKeyDown(event, placed.key, index)}
                className="flex h-8 w-6 shrink-0 cursor-grab touch-none items-center justify-center rounded-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-focus-ring active:cursor-grabbing forced-colors:focus-visible:outline-2"
              >
                <IconGripVertical aria-hidden="true" className="size-3.5" />
              </button>
              <button
                type="button"
                aria-current={active ? "true" : undefined}
                onClick={() => onSelect(placed.key)}
                className="flex h-8 min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-sm pe-2 text-start text-sm outline-none focus-visible:ring-3 focus-visible:ring-focus-ring forced-colors:focus-visible:outline-2"
              >
                <span className="w-4 shrink-0 text-xs text-muted-foreground tabular-nums">
                  {index + 1}
                </span>
                <span className="truncate">{label}</span>
                {placed.type === "pro" ? (
                  <IconLock
                    aria-hidden="true"
                    className="ms-auto size-3.5 shrink-0 text-muted-foreground"
                  />
                ) : null}
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export { Outline }
