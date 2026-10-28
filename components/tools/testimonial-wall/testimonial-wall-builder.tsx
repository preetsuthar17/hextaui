"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { useTheme } from "next-themes"
import {
  IconArrowLeft,
  IconCarouselHorizontal,
  IconEye,
  IconFrame,
  IconLayoutBoard,
  IconLayoutGrid,
  IconMoon,
  IconPalette,
  IconPhoto,
  IconPlus,
  IconQuote,
  IconSparkles,
  IconSun,
  IconUpload,
  IconViewportWide,
} from "@tabler/icons-react"

import {
  ToolApp,
  ToolCanvas,
  ToolExportButton,
  ToolMoreBelow,
  ToolShareButton,
  ToolTopBar,
} from "@/components/tools/shell/tool-app"
import {
  ToolDock,
  ToolDockButton,
  ToolDockPopover,
  ToolDockSeparator,
} from "@/components/tools/shell/tool-dock"
import { ToolSheet } from "@/components/tools/shell/tool-sheet"
import {
  FramePanel,
  LayoutPanel,
  ShowPanel,
  StylePanel,
} from "@/components/tools/testimonial-wall/panels"
import {
  TestimonialEditor,
  type Draft,
  type FocusRequest,
} from "@/components/tools/testimonial-wall/testimonial-editor"
import { TestimonialWall } from "@/components/tools/testimonial-wall/testimonial-wall"
import { WallFrame } from "@/components/tools/testimonial-wall/wall-frame"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  defaultWallFrame,
  frameBackgroundLabels,
  type WallFrame as WallFrameState,
} from "@/lib/testimonial-wall/frame"
import {
  cardStyleLabels,
  defaultWallOptions,
  layoutLabels,
  normalizeTestimonial,
  wallFields,
  wallLimits,
  type Testimonial,
  type WallLayout,
  type WallOptions,
} from "@/lib/testimonial-wall/model"
import { seedTestimonials } from "@/lib/testimonial-wall/seed"
import {
  decodeWallState,
  encodeWallState,
  readShareHash,
  shareHash,
} from "@/lib/testimonial-wall/share"
import { track } from "@/lib/track"

const ExportDialog = dynamic(() =>
  import("@/components/tools/testimonial-wall/export-dialog").then(
    (module) => module.ExportDialog
  )
)
const ImportPanel = dynamic(() =>
  import("@/components/tools/testimonial-wall/import-panel").then(
    (module) => module.ImportPanel
  )
)

const layoutIcons: Record<WallLayout, typeof IconLayoutGrid> = {
  masonry: IconLayoutBoard,
  grid: IconLayoutGrid,
  marquee: IconViewportWide,
  carousel: IconCarouselHorizontal,
  featured: IconQuote,
}

let nextId = 0

function toDrafts(testimonials: Testimonial[]): Draft[] {
  return testimonials.map((testimonial) => ({
    ...testimonial,
    id: String(nextId++),
  }))
}

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = name
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function useSiteMode() {
  return React.useSyncExternalStore(
    (notify) => {
      const observer = new MutationObserver(notify)
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      })
      return () => observer.disconnect()
    },
    () =>
      document.documentElement.classList.contains("dark")
        ? ("dark" as const)
        : ("light" as const),
    () => null
  )
}

function EmptyWall({
  onAdd,
  onSample,
  onImport,
}: {
  onAdd: () => void
  onSample: () => void
  onImport: () => void
}) {
  return (
    <Empty size="sm" className="max-w-sm">
      <EmptyHeader>
        <EmptyMedia variant="stack">
          <IconQuote />
        </EmptyMedia>
        <EmptyTitle>No quotes on the wall</EmptyTitle>
        <EmptyDescription>
          Add one by hand, paste X posts or a spreadsheet, or start again from
          the sample wall.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button size="sm" onClick={onAdd}>
            <IconPlus data-icon="inline-start" />
            Add quote
          </Button>
          <Button variant="outline" size="sm" onClick={onSample}>
            <IconSparkles data-icon="inline-start" />
            Load sample
          </Button>
          <Button variant="ghost" size="sm" onClick={onImport}>
            <IconUpload data-icon="inline-start" />
            Import
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  )
}

function TestimonialWallBuilder({ title }: { title: string }) {
  const [drafts, setDrafts] = React.useState(() => toDrafts(seedTestimonials))
  const [options, setOptions] = React.useState<WallOptions>(defaultWallOptions)
  const [frame, setFrame] = React.useState<WallFrameState>(defaultWallFrame)
  const [openId, setOpenId] = React.useState<string | null>(null)
  const [focus, setFocus] = React.useState<FocusRequest>(null)
  const [sheetOpen, setSheetOpen] = React.useState(false)
  const [importing, setImporting] = React.useState(false)
  const [exportOpen, setExportOpen] = React.useState(false)
  const [exportLoaded, setExportLoaded] = React.useState(false)
  const [rendering, setRendering] = React.useState(false)
  const { setTheme } = useTheme()
  const siteMode = useSiteMode()
  const dark = siteMode === "dark"
  const captureRef = React.useRef<HTMLDivElement>(null)
  const changed = React.useRef(false)

  const entries = React.useMemo(
    () =>
      drafts.flatMap(({ id, ...draft }) => {
        const testimonial = normalizeTestimonial(draft)
        return testimonial ? [{ id, testimonial }] : []
      }),
    [drafts]
  )
  const testimonials = React.useMemo(
    () => entries.map((entry) => entry.testimonial),
    [entries]
  )
  const wall = React.useMemo(
    () => ({ testimonials, options, frame }),
    [testimonials, options, frame]
  )
  const preview = React.useDeferredValue(wall)
  const previewIds = React.useDeferredValue(entries)

  React.useEffect(() => {
    const encoded = readShareHash(window.location.hash)
    if (!encoded) return
    let live = true
    decodeWallState(encoded).then(async (state) => {
      if (!live) return
      if (!state) {
        const { toast } = await import("@/components/ui/toast")
        toast.error("That share link is broken or out of date")
        return
      }
      setDrafts(toDrafts(state.testimonials))
      setOptions(state.options)
      if (state.frame) setFrame(state.frame)
    })
    return () => {
      live = false
    }
  }, [])

  React.useEffect(() => {
    if (!changed.current) return
    let live = true
    const timer = setTimeout(() => {
      encodeWallState(wall).then((encoded) => {
        if (!live) return
        window.history.replaceState(
          window.history.state,
          "",
          `${window.location.pathname}${window.location.search}${shareHash(encoded)}`
        )
      })
    }, 600)
    return () => {
      live = false
      clearTimeout(timer)
    }
  }, [wall])

  const updateDrafts = (update: (current: Draft[]) => Draft[]) => {
    changed.current = true
    setDrafts(update)
  }

  const updateOptions = (patch: Partial<WallOptions>) => {
    changed.current = true
    setOptions((current) => ({ ...current, ...patch }))
  }

  const updateFrame = (patch: Partial<WallFrameState>) => {
    changed.current = true
    setFrame((current) => ({ ...current, ...patch }))
  }

  const openQuote = (id: string, field: "name" | "body" = "body") => {
    setImporting(false)
    setOpenId(id)
    setSheetOpen(true)
    setFocus({ id, field, at: Date.now() })
  }

  const addDraft = () => {
    if (drafts.length >= wallLimits.testimonials) return
    const [draft] = toDrafts([{ name: "", body: "" }])
    updateDrafts((current) => [draft, ...current])
    openQuote(draft.id, "name")
  }

  const loadSample = () => {
    updateDrafts(() => toDrafts(seedTestimonials))
    setOpenId(null)
  }

  const openImport = () => {
    setImporting(true)
    setSheetOpen(true)
  }

  const importTestimonials = async (
    items: Testimonial[],
    mode: "add" | "replace"
  ) => {
    updateDrafts((current) =>
      (mode === "replace"
        ? toDrafts(items)
        : [...toDrafts(items), ...current]
      ).slice(0, wallLimits.testimonials)
    )
    setOpenId(null)
    const { toast } = await import("@/components/ui/toast")
    toast.success(
      `${mode === "replace" ? "Replaced with" : "Added"} ${items.length} ${items.length === 1 ? "quote" : "quotes"}`
    )
    track("Testimonial wall import", { mode, count: String(items.length) })
  }

  const downloadPng = async () => {
    const node = captureRef.current
    if (!node || rendering) return
    setRendering(true)
    try {
      const { exportPng } =
        await import("@/components/tools/testimonial-wall/export-png")
      downloadBlob(await exportPng(node, { dark }), "testimonial-wall.png")
      track("Testimonial wall PNG", {
        layout: options.layout,
        frame: frame.background,
      })
    } catch {
      const { toast } = await import("@/components/ui/toast")
      toast.error("Couldn’t make the PNG. Try another browser")
    } finally {
      setRendering(false)
    }
  }

  const empty = preview.testimonials.length === 0
  const shown = wallFields.filter((field) => options.show[field]).length

  return (
    <ToolApp
      slug="testimonial-wall"
      title={title}
      sheetOpen={sheetOpen}
      onSheetOpenChange={(open) => {
        setSheetOpen(open)
        if (!open) setImporting(false)
      }}
    >
      <ToolTopBar>
        <Button
          variant="ghost"
          size="sm"
          aria-label="Download PNG"
          onClick={downloadPng}
          disabled={empty}
          aria-busy={rendering || undefined}
        >
          <IconPhoto data-icon="inline-start" />
          <span className="max-sm:sr-only">
            {rendering ? "Rendering…" : "PNG"}
          </span>
        </Button>
        <ToolShareButton
          getUrl={async () => {
            const url = `${window.location.origin}${window.location.pathname}${shareHash(await encodeWallState(wall))}`
            window.history.replaceState(window.history.state, "", url)
            return url
          }}
          onShare={() =>
            track("Testimonial wall share", {
              count: String(testimonials.length),
            })
          }
        />
        <ToolExportButton
          disabled={empty}
          onClick={() => {
            setExportLoaded(true)
            setExportOpen(true)
            track("Testimonial wall export", { layout: options.layout })
          }}
        />
      </ToolTopBar>
      <ToolCanvas
        label="Testimonial wall preview"
        aside={<ToolMoreBelow />}
        dock={
          <ToolDock label="Wall controls">
            <ToolDockPopover
              icon={React.createElement(layoutIcons[options.layout])}
              label="Layout"
              value={layoutLabels[options.layout]}
              shortcut="l"
              contentClassName="w-[29rem]"
            >
              <LayoutPanel
                options={options}
                testimonials={testimonials}
                onChange={updateOptions}
              />
            </ToolDockPopover>
            <ToolDockPopover
              icon={<IconPalette />}
              label="Style"
              value={cardStyleLabels[options.cardStyle]}
              shortcut="s"
            >
              <StylePanel options={options} onChange={updateOptions} />
            </ToolDockPopover>
            <ToolDockPopover
              icon={<IconEye />}
              label="Show"
              value={`${shown}/${wallFields.length}`}
              shortcut="h"
              contentClassName="w-64"
            >
              <ShowPanel options={options} onChange={updateOptions} />
            </ToolDockPopover>
            <ToolDockPopover
              icon={<IconFrame />}
              label="Frame"
              value={frameBackgroundLabels[frame.background]}
              shortcut="f"
              description="Shown in the PNG. The exported code is just the wall."
              contentClassName="w-[25rem]"
            >
              <FramePanel
                frame={frame}
                accent={options.accent}
                dark={dark}
                onChange={updateFrame}
              />
            </ToolDockPopover>
            <ToolDockSeparator />
            <ToolDockButton
              icon={dark ? <IconMoon /> : <IconSun />}
              label={dark ? "Dark" : "Light"}
              hint="Switch light and dark"
              shortcut="d"
              listen={false}
              onClick={() => setTheme(dark ? "light" : "dark")}
            />
            <ToolDockSeparator />
            <ToolDockButton
              icon={<IconQuote />}
              label="Quotes"
              value={drafts.length}
              hint="Edit quotes"
              shortcut="q"
              aria-pressed={sheetOpen}
              onClick={() => {
                if (sheetOpen) {
                  setSheetOpen(false)
                  setImporting(false)
                } else {
                  setSheetOpen(true)
                }
              }}
            />
          </ToolDock>
        }
      >
        {empty ? (
          <EmptyWall
            onAdd={addDraft}
            onSample={loadSample}
            onImport={openImport}
          />
        ) : (
          <WallFrame
            ref={captureRef}
            frame={preview.frame}
            options={preview.options}
            accent={preview.options.accent}
            dark={dark}
          >
            <TestimonialWall
              testimonials={preview.testimonials}
              options={preview.options}
              onSelect={(index) => {
                const entry = previewIds[index]
                if (entry) openQuote(entry.id)
              }}
            />
          </WallFrame>
        )}
      </ToolCanvas>
      <ToolSheet
        title={importing ? "Import quotes" : "Quotes"}
        description={
          importing
            ? "Read public X posts, or paste rows from a spreadsheet or an export."
            : `${drafts.length} of ${wallLimits.testimonials}. Click a card on the wall to edit it.`
        }
        action={
          importing ? (
            <Button
              variant="ghost"
              size="sm"
              className="-mt-1"
              onClick={() => setImporting(false)}
            >
              <IconArrowLeft data-icon="inline-start" />
              Back
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="-mt-1"
              onClick={() => setImporting(true)}
            >
              <IconUpload data-icon="inline-start" />
              Import
            </Button>
          )
        }
        footer={
          importing ? undefined : (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={addDraft}
              disabled={drafts.length >= wallLimits.testimonials}
            >
              <IconPlus data-icon="inline-start" />
              Add quote
            </Button>
          )
        }
      >
        {importing ? (
          <ImportPanel
            onImport={importTestimonials}
            onDone={() => setImporting(false)}
          />
        ) : drafts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
            <p className="text-sm text-pretty text-muted-foreground">
              No quotes yet. Add one, import X posts, JSON or CSV, or load the
              sample.
            </p>
            <Button variant="outline" size="sm" onClick={loadSample}>
              <IconSparkles data-icon="inline-start" />
              Load sample
            </Button>
          </div>
        ) : (
          <TestimonialEditor
            drafts={drafts}
            openId={openId}
            focus={focus}
            onOpenChange={setOpenId}
            onChange={(id, patch) =>
              updateDrafts((current) =>
                current.map((draft) =>
                  draft.id === id ? { ...draft, ...patch } : draft
                )
              )
            }
            onMove={(id, offset) =>
              updateDrafts((current) => {
                const from = current.findIndex((draft) => draft.id === id)
                const to = from + offset
                if (from < 0 || to < 0 || to >= current.length) return current
                const next = [...current]
                const [item] = next.splice(from, 1)
                next.splice(to, 0, item)
                return next
              })
            }
            onRemove={(id) => {
              updateDrafts((current) =>
                current.filter((draft) => draft.id !== id)
              )
              setOpenId(null)
            }}
          />
        )}
      </ToolSheet>
      {exportLoaded ? (
        <ExportDialog
          open={exportOpen}
          onOpenChange={setExportOpen}
          wall={preview}
          onDownload={(code) =>
            downloadBlob(
              new Blob([code], { type: "text/plain" }),
              "testimonial-wall.tsx"
            )
          }
        />
      ) : null}
    </ToolApp>
  )
}

export { TestimonialWallBuilder }
