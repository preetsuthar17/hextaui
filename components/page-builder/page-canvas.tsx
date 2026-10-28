"use client"

import * as React from "react"
import {
  IconArrowDown,
  IconArrowUp,
  IconCopy,
  IconLock,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react"

import { CanvasFrame, type FrameDevice } from "@/components/page-builder/canvas-frame"
import { renderNode } from "@/components/page-builder/render-node"
import { Button } from "@/components/ui/button"
import { TooltipGroup, TooltipTrigger } from "@/components/ui/tooltip"
import type { PlacedSection } from "@/lib/page-builder/doc"
import type { Props } from "@/lib/page-builder/fields"
import { cleanInline, inlineFields } from "@/lib/page-builder/inline"
import { getSection, kindInfo, sections as allSections } from "@/lib/page-builder/registry"
import type { ThemeVars } from "@/lib/page-builder/theme"

type CanvasActions = {
  onSelect: (key: string | null) => void
  onShift: (key: string, by: number) => void
  onDuplicate: (key: string) => void
  onRemove: (key: string) => void
  onSwap: (key: string, sectionId: string) => void
  onEdit: (key: string) => void
  onInline: (key: string, path: string, value: string) => void
}

type Box = { top: number; height: number }

type Editing = { key: string; path: string; original: string; props: Props }

function labelOf(placed: PlacedSection) {
  if (placed.type === "pro") return `${placed.title} · Pro`
  const section = getSection(placed.sectionId)
  return section ? `${kindInfo(section.kind).title} · ${section.variant}` : ""
}

function ownText(element: Element) {
  let value = ""
  for (const node of Array.from(element.childNodes)) {
    if (node.nodeType === 3) value += node.nodeValue ?? ""
  }
  return value.trim()
}

function tagFields(root: HTMLElement, sectionId: string, props: Props) {
  for (const node of Array.from(root.querySelectorAll("[data-pb-field]"))) {
    node.removeAttribute("data-pb-field")
    node.removeAttribute("data-pb-max")
  }
  const section = getSection(sectionId)
  if (!section) return
  const pending = inlineFields(section, props)
  if (pending.length === 0) return
  for (const element of Array.from(root.querySelectorAll<HTMLElement>("*"))) {
    if (element.closest("svg")) continue
    const value = ownText(element)
    if (!value) continue
    const index = pending.findIndex((field) => field.value.trim() === value)
    if (index === -1) continue
    const [field] = pending.splice(index, 1)
    element.setAttribute("data-pb-field", field.path)
    element.setAttribute("data-pb-max", String(field.max))
    if (pending.length === 0) break
  }
}

const SectionBody = React.memo(function SectionBody({
  sectionId,
  props,
}: {
  sectionId: string
  props: Props
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const section = getSection(sectionId)

  React.useLayoutEffect(() => {
    if (ref.current) tagFields(ref.current, sectionId, props)
  }, [sectionId, props])

  return (
    <div ref={ref} className="contents">
      {section ? renderNode(section.build(props)) : null}
    </div>
  )
})

function ProPlaceholder({ name, title }: { name: string; title: string }) {
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
            <IconLock aria-hidden="true" className="size-4 text-muted-foreground" />
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

function placeCaret(element: HTMLElement, x?: number, y?: number) {
  const doc = element.ownerDocument
  const selection = doc.getSelection()
  if (!selection) return
  let range: Range | null = null
  if (x !== undefined && y !== undefined && "caretRangeFromPoint" in doc) {
    range = doc.caretRangeFromPoint(x, y)
    if (range && !element.contains(range.startContainer)) range = null
  }
  if (!range) {
    range = doc.createRange()
    range.selectNodeContents(element)
    range.collapse(false)
  }
  selection.removeAllRanges()
  selection.addRange(range)
}

function SectionToolbar({
  placed,
  index,
  count,
  actions,
}: {
  placed: PlacedSection
  index: number
  count: number
  actions: CanvasActions
}) {
  const section = placed.type === "section" ? getSection(placed.sectionId) : null
  const variants = section
    ? allSections.filter((item) => item.kind === section.kind)
    : []
  const tip = (label: string, element: React.ReactElement, icon: React.ReactNode) => (
    <TooltipTrigger content={label} render={element}>
      {icon}
    </TooltipTrigger>
  )

  return (
    <TooltipGroup side="top" sideOffset={8}>
      <div
        role="toolbar"
        aria-label={`${labelOf(placed)} actions`}
        className="pointer-events-auto flex items-center gap-0.5 rounded-lg bg-popover p-0.5 text-popover-foreground shadow-lg ring-(length:--hairline) ring-foreground/10 forced-colors:border"
      >
        {variants.length > 1 && placed.type === "section" ? (
          <>
            <div role="group" aria-label="Layout" className="flex items-center gap-0.5">
              {variants.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  aria-pressed={variant.id === placed.sectionId}
                  onClick={() => actions.onSwap(placed.key, variant.id)}
                  className="inline-flex h-7 items-center rounded-md px-2 text-xs whitespace-nowrap text-muted-foreground outline-none transition-colors duration-150 ease-out-cubic hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-focus-ring aria-pressed:bg-muted aria-pressed:font-medium aria-pressed:text-foreground motion-reduce:transition-none pointer-coarse:h-9 forced-colors:aria-pressed:outline-2 forced-colors:aria-pressed:outline-solid"
                >
                  {variant.variant}
                </button>
              ))}
            </div>
            <span aria-hidden="true" className="mx-0.5 h-4 border-s" />
          </>
        ) : (
          <span className="px-2 text-xs font-medium whitespace-nowrap">
            {labelOf(placed)}
          </span>
        )}
        {tip(
          "Move up",
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Move section up"
            disabled={index === 0}
            onClick={() => actions.onShift(placed.key, -1)}
          />,
          <IconArrowUp />
        )}
        {tip(
          "Move down",
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Move section down"
            disabled={index === count - 1}
            onClick={() => actions.onShift(placed.key, 1)}
          />,
          <IconArrowDown />
        )}
        {tip(
          "Duplicate",
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Duplicate section"
            onClick={() => actions.onDuplicate(placed.key)}
          />,
          <IconCopy />
        )}
        {placed.type === "section" ? (
          <Button variant="ghost" size="xs" onClick={() => actions.onEdit(placed.key)}>
            <IconPencil data-icon="inline-start" />
            Edit
          </Button>
        ) : null}
        {tip(
          "Delete",
          <Button
            variant="ghost-destructive"
            size="icon-xs"
            aria-label="Delete section"
            onClick={() => actions.onRemove(placed.key)}
          />,
          <IconTrash />
        )}
      </div>
    </TooltipGroup>
  )
}

function PageCanvas({
  sections,
  selected,
  width,
  device,
  dark,
  theme,
  actions,
  onKeyDown,
  empty,
}: {
  sections: PlacedSection[]
  selected: string | null
  width: number
  device: FrameDevice
  dark: boolean
  theme: ThemeVars
  actions: CanvasActions
  onKeyDown: (event: KeyboardEvent) => void
  empty?: React.ReactNode
}) {
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const [rootElement, setRootElement] = React.useState<HTMLDivElement | null>(
    null
  )
  const [hovered, setHovered] = React.useState<string | null>(null)
  const [boxes, setBoxes] = React.useState<Record<string, Box>>({})
  const [scale, setScale] = React.useState(1)
  const [editing, setEditing] = React.useState<Editing | null>(null)
  const [versions, setVersions] = React.useState<Record<string, number>>({})
  const editingRef = React.useRef<Editing | null>(null)
  const actionsRef = React.useRef(actions)

  React.useEffect(() => {
    actionsRef.current = actions
  })

  const measure = React.useCallback(() => {
    const root = rootRef.current
    if (!root) return
    const next: Record<string, Box> = {}
    for (const node of Array.from(
      root.querySelectorAll<HTMLElement>(":scope > [data-pb-key]")
    )) {
      next[node.dataset.pbKey ?? ""] = {
        top: node.offsetTop,
        height: node.offsetHeight,
      }
    }
    setBoxes((current) => {
      const keys = Object.keys(next)
      if (
        keys.length === Object.keys(current).length &&
        keys.every(
          (key) =>
            current[key]?.top === next[key].top &&
            current[key]?.height === next[key].height
        )
      ) {
        return current
      }
      return next
    })
  }, [])

  React.useLayoutEffect(() => {
    measure()
  })

  React.useEffect(() => {
    if (!rootElement) return
    const observer = new ResizeObserver(() => measure())
    observer.observe(rootElement)
    return () => observer.disconnect()
  }, [measure, rootElement])

  const finishEditing = React.useCallback((revert: boolean) => {
    const current = editingRef.current
    if (!current) return
    editingRef.current = null
    const element = rootRef.current?.querySelector<HTMLElement>(
      "[data-pb-editing]"
    )
    const max = Number(element?.dataset.pbMax ?? 600)
    const value = revert
      ? current.original
      : cleanInline(element?.textContent ?? "", max).trim()
    actionsRef.current.onInline(current.key, current.path, value || current.original)
    element?.ownerDocument.getSelection()?.removeAllRanges()
    setEditing(null)
    setVersions((all) => ({ ...all, [current.key]: (all[current.key] ?? 0) + 1 }))
  }, [])

  const startEditing = (
    element: HTMLElement,
    placed: Extract<PlacedSection, { type: "section" }>,
    x?: number,
    y?: number
  ) => {
    const path = element.dataset.pbField
    if (!path) return
    if (editingRef.current) finishEditing(false)
    const next = {
      key: placed.key,
      path,
      original: ownText(element),
      props: placed.props,
    }
    editingRef.current = next
    setEditing(next)
    element.setAttribute("data-pb-editing", "")
    element.contentEditable = "plaintext-only"
    element.spellcheck = true
    element.focus({ preventScroll: true })
    placeCaret(element, x, y)
    const max = Number(element.dataset.pbMax ?? 600)
    const onBeforeInput = (event: InputEvent) => {
      if (
        event.inputType === "insertParagraph" ||
        event.inputType === "insertLineBreak"
      ) {
        event.preventDefault()
        return
      }
      if (!event.inputType.startsWith("insert")) return
      const selection = element.ownerDocument.getSelection()
      const selected = selection ? selection.toString().length : 0
      const incoming =
        event.data ?? event.dataTransfer?.getData("text/plain") ?? ""
      if ((element.textContent ?? "").length - selected + incoming.length > max) {
        event.preventDefault()
      }
    }
    const onBlur = () => {
      element.removeEventListener("beforeinput", onBeforeInput)
      element.removeEventListener("blur", onBlur)
      finishEditing(false)
    }
    element.addEventListener("beforeinput", onBeforeInput)
    element.addEventListener("blur", onBlur)
  }

  const selectedIndex = sections.findIndex((placed) => placed.key === selected)
  const selectedPlaced = sections[selectedIndex] ?? null
  const hoveredPlaced =
    hovered && hovered !== selected
      ? (sections.find((placed) => placed.key === hovered) ?? null)
      : null
  const selectedBox = selected ? boxes[selected] : undefined
  const hoveredBox = hoveredPlaced ? boxes[hoveredPlaced.key] : undefined
  const toolbarBelow = selectedBox ? selectedBox.height * scale < 140 : false

  const overlay = (
    <div className="pointer-events-none absolute inset-0 z-10">
      {hoveredPlaced && hoveredBox ? (
        <div
          className="absolute inset-x-0 top-(--pb-top) h-(--pb-height) outline-1 -outline-offset-1 outline-info/50"
          style={
            {
              "--pb-top": `${hoveredBox.top * scale}px`,
              "--pb-height": `${hoveredBox.height * scale}px`,
            } as React.CSSProperties
          }
        >
          <span className="absolute start-2 top-2 rounded-md bg-popover px-1.5 py-0.5 text-xs font-medium whitespace-nowrap text-popover-foreground shadow-md ring-(length:--hairline) ring-foreground/10 forced-colors:border">
            {labelOf(hoveredPlaced)}
          </span>
        </div>
      ) : null}
      {selectedPlaced && selectedBox ? (
        <div
          data-pb-selection=""
          className="absolute inset-x-0 top-(--pb-top) h-(--pb-height) outline-2 -outline-offset-2 outline-info/80"
          style={
            {
              "--pb-top": `${selectedBox.top * scale}px`,
              "--pb-height": `${selectedBox.height * scale}px`,
            } as React.CSSProperties
          }
        >
          <div
            className={
              toolbarBelow
                ? "absolute end-2 top-[calc(100%+0.5rem)] z-10"
                : "sticky top-3 z-10 flex justify-end px-2 pt-2"
            }
          >
            <SectionToolbar
              placed={selectedPlaced}
              index={selectedIndex}
              count={sections.length}
              actions={actions}
            />
          </div>
        </div>
      ) : null}
    </div>
  )

  return (
    <CanvasFrame
      width={width}
      device={device}
      dark={dark}
      theme={theme}
      title="Page preview"
      onKeyDown={(event) => {
        if (editingRef.current) {
          if (event.key === "Enter") {
            event.preventDefault()
            ;(event.target as HTMLElement).blur()
          } else if (event.key === "Escape") {
            event.preventDefault()
            event.stopPropagation()
            const element = event.target as HTMLElement
            element.textContent = editingRef.current.original
            finishEditing(true)
          }
          return
        }
        onKeyDown(event)
      }}
      onScale={setScale}
      overlay={overlay}
    >
      <div
        ref={(node) => {
          rootRef.current = node
          setRootElement(node)
        }}
        className="flow-root min-h-80 [&_[data-pb-editing]]:cursor-text [&_[data-pb-editing]]:rounded-sm [&_[data-pb-editing]]:outline-2 [&_[data-pb-editing]]:outline-offset-2 [&_[data-pb-editing]]:outline-info/70 [&_[data-pb-editing]]:outline-dashed"
        onPointerOver={(event) => {
          if (event.pointerType !== "mouse") return
          const key =
            (event.target as Element).closest<HTMLElement>("[data-pb-key]")?.dataset
              .pbKey ?? null
          if (key !== hovered) setHovered(key)
        }}
        onPointerLeave={() => setHovered(null)}
        onClickCapture={(event) => {
          const target = event.target as Element
          const anchor = target.closest("a")
          if (anchor && !anchor.hasAttribute("data-pb-allow")) event.preventDefault()
        }}
        onClick={(event) => {
          const target = event.target as HTMLElement
          if (target.closest("[data-pb-editing]")) return
          const wrapper = target.closest<HTMLElement>("[data-pb-key]")
          const key = wrapper?.dataset.pbKey ?? null
          if (!key) {
            actions.onSelect(null)
            return
          }
          const placed = sections.find((item) => item.key === key)
          const field = target.closest<HTMLElement>("[data-pb-field]")
          if (placed?.type === "section" && field && key === selected) {
            event.preventDefault()
            startEditing(field, placed, event.clientX, event.clientY)
            return
          }
          if (key !== selected) actions.onSelect(key)
        }}
        onDoubleClick={(event) => {
          const target = event.target as HTMLElement
          const field = target.closest<HTMLElement>("[data-pb-field]")
          const key = target.closest<HTMLElement>("[data-pb-key]")?.dataset.pbKey
          const placed = sections.find((item) => item.key === key)
          if (!field || placed?.type !== "section" || editingRef.current) return
          if (key !== selected) actions.onSelect(placed.key)
          startEditing(field, placed, event.clientX, event.clientY)
        }}
        onInput={(event) => {
          const current = editingRef.current
          const element = event.target as HTMLElement
          if (!current || !element.hasAttribute("data-pb-editing")) return
          const max = Number(element.dataset.pbMax ?? 600)
          actions.onInline(
            current.key,
            current.path,
            cleanInline(element.textContent ?? "", max)
          )
        }}
      >
        {sections.length === 0 ? empty : null}
        {sections.map((placed) => (
          <div
            key={placed.key}
            data-pb-key={placed.key}
            data-selected={placed.key === selected ? "" : undefined}
            className="relative data-selected:[&_[data-pb-field]]:cursor-text data-selected:[&_[data-pb-field]:hover]:rounded-sm data-selected:[&_[data-pb-field]:hover]:outline-1 data-selected:[&_[data-pb-field]:hover]:outline-offset-2 data-selected:[&_[data-pb-field]:hover]:outline-info/50 data-selected:[&_[data-pb-field]:hover]:outline-dashed"
          >
            {placed.type === "section" ? (
              <SectionBody
                key={`${placed.key}:${versions[placed.key] ?? 0}`}
                sectionId={placed.sectionId}
                props={
                  editing?.key === placed.key ? editing.props : placed.props
                }
              />
            ) : (
              <ProPlaceholder name={placed.name} title={placed.title} />
            )}
          </div>
        ))}
      </div>
    </CanvasFrame>
  )
}

export { PageCanvas, labelOf, type CanvasActions }
