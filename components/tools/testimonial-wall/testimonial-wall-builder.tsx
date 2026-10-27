"use client"

import * as React from "react"
import {
  IconCarouselHorizontal,
  IconDownload,
  IconLayoutBoard,
  IconLayoutGrid,
  IconLink,
  IconMoon,
  IconPhoto,
  IconQuote,
  IconSun,
  IconViewportWide,
} from "@tabler/icons-react"
import { useTheme } from "next-themes"

import { DocsCommand } from "@/components/docs/docs-command"
import { DocsCopyButton } from "@/components/docs/docs-copy-button"
import { DesignPanel } from "@/components/tools/testimonial-wall/design-panel"
import { ImportDialog } from "@/components/tools/testimonial-wall/import-dialog"
import {
  TestimonialEditor,
  type Draft,
} from "@/components/tools/testimonial-wall/testimonial-editor"
import { TestimonialWall } from "@/components/tools/testimonial-wall/testimonial-wall"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/toast"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  generateWallCode,
  wallInstallPackages,
  wallNeedsIconPackage,
} from "@/lib/testimonial-wall/codegen"
import {
  defaultWallOptions,
  layoutLabels,
  normalizeTestimonial,
  wallLayouts,
  wallLimits,
  type Testimonial,
  type WallLayout,
  type WallOptions,
  type WallState,
} from "@/lib/testimonial-wall/model"
import { seedTestimonials } from "@/lib/testimonial-wall/seed"
import {
  decodeWallState,
  encodeWallState,
  readShareHash,
  shareHash,
} from "@/lib/testimonial-wall/share"
import { track } from "@/lib/track"

const layoutIcons: Record<WallLayout, typeof IconLayoutGrid> = {
  masonry: IconLayoutBoard,
  grid: IconLayoutGrid,
  marquee: IconViewportWide,
  carousel: IconCarouselHorizontal,
  featured: IconQuote,
}

const longShareLink = 8000

let nextId = 0

const subscribeNothing = () => () => {}

function toDrafts(testimonials: Testimonial[]): Draft[] {
  return testimonials.map((testimonial) => ({
    ...testimonial,
    id: String(nextId++),
  }))
}

function cleanTestimonials(drafts: Draft[]) {
  return drafts
    .map(({ id: _id, ...draft }) => normalizeTestimonial(draft))
    .filter((item): item is Testimonial => item !== null)
}

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = name
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function IconAction({
  label,
  onClick,
  busy,
  children,
}: {
  label: string
  onClick: () => void
  busy?: boolean
  children: React.ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={label}
            aria-busy={busy || undefined}
            onClick={onClick}
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

function TestimonialWallBuilder() {
  const [drafts, setDrafts] = React.useState(() => toDrafts(seedTestimonials))
  const [options, setOptions] = React.useState<WallOptions>(defaultWallOptions)
  const [openId, setOpenId] = React.useState<string | null>(null)
  const [panel, setPanel] = React.useState("content")
  const [importOpen, setImportOpen] = React.useState(false)
  const [exporting, setExporting] = React.useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const captureRef = React.useRef<HTMLDivElement>(null)
  const changed = React.useRef(false)

  const testimonials = React.useMemo(() => cleanTestimonials(drafts), [drafts])
  const wall = React.useMemo<WallState>(
    () => ({ testimonials, options }),
    [testimonials, options]
  )
  const preview = React.useDeferredValue(wall)
  const code = React.useMemo(() => generateWallCode(preview), [preview])
  const mounted = React.useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false
  )
  const dark = mounted && resolvedTheme === "dark"

  React.useEffect(() => {
    const encoded = readShareHash(window.location.hash)
    if (!encoded) return
    let live = true
    decodeWallState(encoded).then((state) => {
      if (!live) return
      if (!state) {
        toast.error("That share link is broken or out of date")
        return
      }
      setDrafts(toDrafts(state.testimonials))
      setOptions(state.options)
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

  const addDraft = () => {
    const [draft] = toDrafts([{ name: "", body: "" }])
    updateDrafts((current) => [draft, ...current])
    setOpenId(draft.id)
    setPanel("content")
  }

  const importTestimonials = (
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
    toast.success(
      `${mode === "replace" ? "Replaced with" : "Added"} ${items.length} ${items.length === 1 ? "testimonial" : "testimonials"}`
    )
    track("Testimonial wall import", { mode, count: String(items.length) })
  }

  const copyShareLink = async () => {
    try {
      const encoded = await encodeWallState(wall)
      const url = `${window.location.origin}${window.location.pathname}${shareHash(encoded)}`
      window.history.replaceState(window.history.state, "", url)
      await navigator.clipboard.writeText(url)
      toast.success(
        url.length > longShareLink
          ? "Copied share link. It’s long, so some apps may cut it"
          : "Copied share link"
      )
      track("Testimonial wall share", { count: String(testimonials.length) })
    } catch {
      toast.error("Couldn’t copy the link")
    }
  }

  const downloadPng = async () => {
    const node = captureRef.current
    if (!node || exporting) return
    setExporting(true)
    try {
      const { exportPng } =
        await import("@/components/tools/testimonial-wall/export-png")
      downloadBlob(await exportPng(node, { dark }), "testimonial-wall.png")
      track("Testimonial wall PNG", { layout: options.layout })
    } catch {
      toast.error("Couldn’t make the PNG. Try another browser")
    } finally {
      setExporting(false)
    }
  }

  const downloadCode = () => {
    downloadBlob(
      new Blob([code], { type: "text/plain" }),
      "testimonial-wall.tsx"
    )
    track("Testimonial wall download", { layout: options.layout })
  }

  const empty = preview.testimonials.length === 0

  return (
    <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:items-start">
      <aside
        aria-label="Wall settings"
        className="flex min-h-0 flex-col overflow-hidden rounded-xl border lg:sticky lg:top-20 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:max-h-[calc(100dvh-6rem)]"
      >
        <Tabs
          value={panel}
          onValueChange={(value) => setPanel(String(value))}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="border-b p-2">
            <TabsList className="w-full *:flex-1">
              <TabsTrigger value="content">Testimonials</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
            </TabsList>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <TabsContent value="content">
              <TestimonialEditor
                drafts={drafts}
                openId={openId}
                onOpenChange={setOpenId}
                onAdd={addDraft}
                onImport={() => setImportOpen(true)}
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
                    if (from < 0 || to < 0 || to >= current.length) {
                      return current
                    }
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
            </TabsContent>
            <TabsContent value="design">
              <DesignPanel
                options={options}
                testimonials={testimonials}
                onChange={updateOptions}
              />
            </TabsContent>
          </div>
        </Tabs>
      </aside>

      <div className="flex min-w-0 flex-col gap-4 max-lg:order-first lg:col-start-2 lg:row-start-1">
        <div className="flex flex-wrap items-center gap-2">
          <ToggleGroup
            variant="outline"
            size="sm"
            aria-label="Layout"
            value={[options.layout]}
            onValueChange={(value) => {
              if (value.length > 0) {
                updateOptions({ layout: value[0] as WallLayout })
              }
            }}
          >
            {wallLayouts.map((layout) => {
              const Icon = layoutIcons[layout]
              return (
                <ToggleGroupItem
                  key={layout}
                  value={layout}
                  aria-label={layoutLabels[layout]}
                >
                  <Icon />
                  <span className="max-md:hidden">{layoutLabels[layout]}</span>
                </ToggleGroupItem>
              )
            })}
          </ToggleGroup>
          <div className="ms-auto flex items-center gap-2">
            <IconAction
              label={dark ? "Light preview" : "Dark preview"}
              onClick={() => setTheme(dark ? "light" : "dark")}
            >
              {dark ? <IconSun /> : <IconMoon />}
            </IconAction>
            <IconAction label="Copy share link" onClick={copyShareLink}>
              <IconLink />
            </IconAction>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadPng}
              disabled={empty}
              aria-busy={exporting || undefined}
            >
              <IconPhoto data-icon="inline-start" />
              <span className="max-sm:sr-only">
                {exporting ? "Rendering…" : "PNG"}
              </span>
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border">
          <div
            ref={captureRef}
            data-slot="testimonial-wall-capture"
            className="bg-background p-4 sm:p-8"
          >
            {empty ? (
              <p className="py-16 text-center text-sm text-muted-foreground">
                Add a testimonial with a name and a quote to see the wall.
              </p>
            ) : (
              <TestimonialWall
                testimonials={preview.testimonials}
                options={preview.options}
              />
            )}
          </div>
        </div>
      </div>

      <section
        aria-labelledby="testimonial-wall-code"
        className="flex min-w-0 flex-col gap-3 pt-4 lg:col-start-2 lg:row-start-2"
      >
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2
              id="testimonial-wall-code"
              className="text-base font-semibold tracking-tight"
            >
              Get the code
            </h2>
            <p className="mt-1 text-sm text-pretty text-muted-foreground">
              Install the components, then save the file as{" "}
              <code className="font-mono text-sm text-foreground">
                components/testimonial-wall.tsx
              </code>
              .
            </p>
          </div>
        </div>
        <DocsCommand
          packages={wallInstallPackages(preview.options)}
          mode="dlx"
        />
        {wallNeedsIconPackage(preview.options) ? (
          <DocsCommand packages={["@tabler/icons-react"]} />
        ) : null}
        <figure className="min-w-0 overflow-hidden rounded-xl border bg-muted">
          <figcaption className="flex h-10 items-center gap-1 border-b ps-4 pe-1">
            <span className="me-auto truncate font-mono text-xs text-muted-foreground">
              testimonial-wall.tsx
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Download file"
              onClick={downloadCode}
              disabled={empty}
            >
              <IconDownload />
            </Button>
            <DocsCopyButton
              value={code}
              label="Copy code"
              event="Testimonial wall code"
              eventProps={{ layout: preview.options.layout }}
            />
          </figcaption>
          <pre
            tabIndex={0}
            aria-label="Generated component"
            className="max-h-96 overflow-auto overscroll-contain p-4 font-mono text-xs/5 outline-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:ring-inset"
          >
            <code>{code}</code>
          </pre>
        </figure>
      </section>

      <ImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        onImport={importTestimonials}
      />
    </div>
  )
}

export { TestimonialWallBuilder }
