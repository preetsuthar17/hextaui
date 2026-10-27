"use client"

import * as React from "react"
import {
  IconArrowBackUp,
  IconArrowForwardUp,
  IconDeviceDesktop,
  IconDeviceMobile,
  IconDeviceTablet,
  IconLink,
  IconMoon,
  IconSun,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { TooltipGroup, TooltipTrigger } from "@/components/ui/tooltip"
import { CanvasFrame } from "@/components/page-builder/canvas-frame"
import {
  CanvasSections,
  type SectionActions,
} from "@/components/page-builder/canvas-sections"
import { ExportDialog } from "@/components/page-builder/export-dialog"
import { Inspector } from "@/components/page-builder/inspector"
import { Outline } from "@/components/page-builder/outline"
import { Palette } from "@/components/page-builder/palette"
import {
  decodeDoc,
  encodeDoc,
  placePro,
  placeSection,
  readHashParams,
  writeHashParams,
  type PageDoc,
  type ProBlockInfo,
} from "@/lib/page-builder/doc"
import type { Props } from "@/lib/page-builder/fields"
import { builderReducer, initialState } from "@/lib/page-builder/history"
import { starterSections } from "@/lib/page-builder/registry"
import { decodeThemeParam, type CanvasTheme } from "@/lib/page-builder/theme"
import { track } from "@/lib/track"

type Device = "desktop" | "tablet" | "phone"

const devices: {
  value: Device
  label: string
  width: number
  icon: typeof IconDeviceDesktop
}[] = [
  { value: "desktop", label: "Desktop", width: 1280, icon: IconDeviceDesktop },
  { value: "tablet", label: "Tablet", width: 768, icon: IconDeviceTablet },
  { value: "phone", label: "Phone", width: 390, icon: IconDeviceMobile },
]

const wideQuery = "(min-width: 1024px)"

function starterDoc(): PageDoc {
  return {
    sections: starterSections.flatMap((id) => {
      const placed = placeSection(id)
      return placed ? [placed] : []
    }),
  }
}

function subscribeWide(callback: () => void) {
  const query = window.matchMedia(wideQuery)
  query.addEventListener("change", callback)
  return () => query.removeEventListener("change", callback)
}

function useWide() {
  return React.useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia(wideQuery).matches,
    () => true
  )
}

function isTyping(target: EventTarget | null) {
  if (!(target instanceof Element)) return false
  return Boolean(
    target.closest("input, textarea, select, [contenteditable='true']")
  )
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function PageBuilder({ proBlocks }: { proBlocks: ProBlockInfo[] }) {
  const [state, dispatch] = React.useReducer(builderReducer, null, () =>
    initialState(starterDoc())
  )
  const [ready, setReady] = React.useState(false)
  const [encoded, setEncoded] = React.useState<string | null>(null)
  const [device, setDevice] = React.useState<Device>("desktop")
  const [dark, setDark] = React.useState(false)
  const [theme, setTheme] = React.useState<CanvasTheme | null>(null)
  const [tab, setTab] = React.useState("sections")
  const [exportOpen, setExportOpen] = React.useState(false)
  const [announcement, setAnnouncement] = React.useState("")
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const wide = useWide()
  const canvasDoc = React.useDeferredValue(state.doc)

  React.useEffect(() => {
    let live = true
    setDark(document.documentElement.classList.contains("dark"))
    const { page, theme: themeParam } = readHashParams(window.location.hash)
    setTheme(decodeThemeParam(themeParam))
    if (!page) {
      setReady(true)
      return
    }
    decodeDoc(page, proBlocks).then((doc) => {
      if (!live) return
      if (doc && doc.sections.length > 0) dispatch({ type: "load", doc })
      setReady(true)
    })
    return () => {
      live = false
    }
  }, [proBlocks])

  React.useEffect(() => {
    if (!ready) return
    let live = true
    const timer = setTimeout(() => {
      encodeDoc(state.doc).then((value) => {
        if (!live) return
        setEncoded(value)
        const hash = writeHashParams(
          window.location.hash,
          state.doc.sections.length ? value : null
        )
        window.history.replaceState(
          window.history.state,
          "",
          `${window.location.pathname}${window.location.search}${hash}`
        )
      })
    }, 400)
    return () => {
      live = false
      clearTimeout(timer)
    }
  }, [state.doc, ready])

  const announce = React.useCallback(
    (message: string) => setAnnouncement(message),
    []
  )

  const scrollToSection = React.useCallback((key: string) => {
    let tries = 0
    const attempt = () => {
      const scroller = scrollerRef.current
      const frame = scroller?.querySelector("iframe")
      const target = frame?.contentDocument?.querySelector<HTMLElement>(
        `[data-pb-key="${CSS.escape(key)}"]`
      )
      if (!scroller || !frame || !target) {
        tries += 1
        if (tries < 20) requestAnimationFrame(attempt)
        return
      }
      const frameRect = frame.getBoundingClientRect()
      const scale = frameRect.width / frame.offsetWidth
      const top =
        frameRect.top -
        scroller.getBoundingClientRect().top +
        scroller.scrollTop +
        target.offsetTop * scale -
        24
      scroller.scrollTo({
        top: Math.max(0, top),
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      })
    }
    requestAnimationFrame(attempt)
  }, [])

  const actions: SectionActions = React.useMemo(
    () => ({
      onSelect: (key) => dispatch({ type: "select", key }),
      onShift: (key, by) => {
        dispatch({ type: "shift", key, by })
        scrollToSection(key)
      },
      onDuplicate: (key) => dispatch({ type: "duplicate", key }),
      onRemove: (key) => {
        dispatch({ type: "remove", key })
        announce("Section deleted. Press Command Z to undo.")
      },
    }),
    [announce, scrollToSection]
  )

  const onChange = React.useCallback(
    (key: string, patch: (props: Props) => Props, coalesce: string) => {
      dispatch({ type: "update", key, patch, coalesce, at: performance.now() })
    },
    []
  )

  const insert = (
    placed: ReturnType<typeof placePro> | null,
    label: string
  ) => {
    if (!placed) return
    dispatch({ type: "insert", section: placed })
    announce(`${label} added.`)
    scrollToSection(placed.key)
    track("Page builder add", {
      section: placed.type === "pro" ? `pro:${placed.name}` : placed.sectionId,
    })
  }

  const onKeyDown = React.useCallback((event: KeyboardEvent) => {
    if (isTyping(event.target)) return
    const mod = event.metaKey || event.ctrlKey
    if (!mod) return
    const key = event.key.toLowerCase()
    if (key === "z" && !event.shiftKey) {
      event.preventDefault()
      dispatch({ type: "undo" })
    } else if ((key === "z" && event.shiftKey) || key === "y") {
      event.preventDefault()
      dispatch({ type: "redo" })
    }
  }, [])

  React.useEffect(() => {
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [onKeyDown])

  const selectedIndex = state.doc.sections.findIndex(
    (placed) => placed.key === state.selected
  )
  const selected = state.doc.sections[selectedIndex] ?? null
  const activeDevice = wide
    ? (devices.find((item) => item.value === device) ?? devices[0])
    : devices[2]
  const canvasTheme = theme ? (dark ? theme.dark : theme.light) : null

  const shareUrl = async () => {
    const value = encoded ?? (await encodeDoc(state.doc))
    const url = new URL(window.location.href)
    url.hash = writeHashParams(url.hash, value).slice(1)
    await navigator.clipboard.writeText(url.toString())
    track("Page builder share", { sections: String(state.doc.sections.length) })
  }

  const toolbar = (
    <div className="flex h-12 shrink-0 items-center gap-2 border-b px-3">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <p className="truncate text-sm font-medium">Page builder</p>
        <span className="text-xs text-muted-foreground tabular-nums">
          {state.doc.sections.length}{" "}
          {state.doc.sections.length === 1 ? "section" : "sections"}
        </span>
      </div>
      {wide ? (
        <ToggleGroup
          size="sm"
          aria-label="Preview width"
          value={[device]}
          onValueChange={(value) => {
            if (value[0]) setDevice(value[0] as Device)
          }}
        >
          {devices.map((item) => (
            <ToggleGroupItem
              key={item.value}
              value={item.value}
              aria-label={item.label}
            >
              <item.icon aria-hidden="true" />
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      ) : null}
      <div className="flex flex-1 items-center justify-end gap-1">
        <TooltipGroup>
          {wide ? (
            <>
              <TooltipTrigger
                content={
                  <>
                    Undo
                    <Kbd keys="mod+z" />
                  </>
                }
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Undo"
                    disabled={state.past.length === 0}
                    focusableWhenDisabled
                    onClick={() => dispatch({ type: "undo" })}
                  />
                }
              >
                <IconArrowBackUp />
              </TooltipTrigger>
              <TooltipTrigger
                content={
                  <>
                    Redo
                    <Kbd keys="mod+shift+z" />
                  </>
                }
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Redo"
                    disabled={state.future.length === 0}
                    focusableWhenDisabled
                    onClick={() => dispatch({ type: "redo" })}
                  />
                }
              >
                <IconArrowForwardUp />
              </TooltipTrigger>
            </>
          ) : null}
          <TooltipTrigger
            content={dark ? "Preview in light mode" : "Preview in dark mode"}
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Dark preview"
                aria-pressed={dark}
                onClick={() => setDark((value) => !value)}
              />
            }
          >
            {dark ? <IconSun /> : <IconMoon />}
          </TooltipTrigger>
        </TooltipGroup>
        <Button
          variant="outline"
          size="sm"
          feedback
          successLabel="Link copied"
          onClick={shareUrl}
        >
          <IconLink data-icon="inline-start" />
          Share
        </Button>
        <Button
          size="sm"
          disabled={state.doc.sections.length === 0}
          onClick={() => {
            setExportOpen(true)
            track("Page builder export", {
              sections: String(state.doc.sections.length),
            })
          }}
        >
          Export
        </Button>
      </div>
    </div>
  )

  const canvas = (
    <div
      ref={scrollerRef}
      className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain bg-muted/40 p-3 sm:p-6 dark:bg-muted/20"
    >
      <CanvasFrame
        width={activeDevice.width}
        dark={dark}
        theme={canvasTheme}
        title="Page preview"
        onKeyDown={onKeyDown}
      >
        <CanvasSections
          sections={canvasDoc.sections}
          selected={state.selected}
          editable={wide}
          actions={actions}
        />
      </CanvasFrame>
    </div>
  )

  return (
    <div
      data-slot="page-builder"
      data-ready={ready ? "" : undefined}
      className="flex h-[calc(100svh-3.5rem)] min-h-[36rem] flex-col border-y bg-background text-foreground"
    >
      {toolbar}
      {wide ? (
        <div className="grid min-h-0 flex-1 grid-cols-[16.5rem_minmax(0,1fr)_19rem]">
          <aside
            aria-label="Sections"
            className="flex min-h-0 flex-col border-e"
          >
            <Tabs
              value={tab}
              onValueChange={(value) => setTab(String(value))}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="border-b px-2 py-1.5">
                <TabsList className="w-full">
                  <TabsTrigger value="sections" className="flex-1">
                    Sections
                  </TabsTrigger>
                  <TabsTrigger value="outline" className="flex-1">
                    Outline
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent
                value="sections"
                className="flex min-h-0 flex-1 flex-col"
              >
                <Palette
                  proBlocks={proBlocks}
                  onAdd={(section) =>
                    insert(placeSection(section.id), section.variant)
                  }
                  onAddPro={(block) => insert(placePro(block), block.title)}
                />
              </TabsContent>
              <TabsContent
                value="outline"
                className="flex min-h-0 flex-1 flex-col"
              >
                <Outline
                  sections={state.doc.sections}
                  selected={state.selected}
                  onSelect={(key) => {
                    dispatch({ type: "select", key })
                    scrollToSection(key)
                  }}
                  onMove={(key, to) => dispatch({ type: "move", key, to })}
                  onAnnounce={announce}
                />
              </TabsContent>
            </Tabs>
          </aside>
          {canvas}
          <aside
            aria-label="Edit section"
            className="flex min-h-0 flex-col border-s"
          >
            <Inspector
              placed={selected}
              index={selectedIndex}
              count={state.doc.sections.length}
              onChange={onChange}
              onShift={actions.onShift}
              onDuplicate={actions.onDuplicate}
              onRemove={actions.onRemove}
            />
          </aside>
        </div>
      ) : (
        <>
          <p className="border-b bg-muted/40 px-4 py-2.5 text-sm text-pretty text-muted-foreground">
            This is a preview. Open the page builder on a larger screen to add
            and edit sections. Share and Export work here too.
          </p>
          {canvas}
        </>
      )}
      <p role="status" className="sr-only">
        {announcement}
      </p>
      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        doc={state.doc}
        encoded={encoded}
      />
    </div>
  )
}

export { PageBuilder }
