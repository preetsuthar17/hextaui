"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { useTheme } from "next-themes"
import {
  IconArrowBackUp,
  IconArrowForwardUp,
  IconColorSwatch,
  IconDeviceDesktop,
  IconDeviceMobile,
  IconDeviceTablet,
  IconListDetails,
  IconMoon,
  IconPlus,
  IconSun,
} from "@tabler/icons-react"

import { Outline } from "@/components/page-builder/outline"
import { labelOf, PageCanvas, type CanvasActions } from "@/components/page-builder/page-canvas"
import { SectionFields } from "@/components/page-builder/section-fields"
import { SectionPicker } from "@/components/page-builder/section-picker"
import { EmptyPage, StartScreen } from "@/components/page-builder/start-screen"
import { ThemePanel } from "@/components/page-builder/theme-panel"
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
  ToolDockSegmented,
  ToolDockSeparator,
} from "@/components/tools/shell/tool-dock"
import { ToolSheet } from "@/components/tools/shell/tool-sheet"
import { useIsPhone } from "@/components/tools/shell/use-tool-shortcut"
import { Spinner } from "@/components/ui/spinner"
import {
  decodeDoc,
  encodeDoc,
  placePro,
  placeSection,
  readHashParams,
  writeHashParams,
  type PlacedSection,
  type ProBlockInfo,
} from "@/lib/page-builder/doc"
import type { Props } from "@/lib/page-builder/fields"
import { builderReducer, initialState } from "@/lib/page-builder/history"
import { setPath } from "@/lib/page-builder/inline"
import { getSection, kindInfo } from "@/lib/page-builder/registry"
import { starterDoc } from "@/lib/page-builder/starters"
import {
  canvasVars,
  defaultThemeId,
  normalizeThemeId,
  themeFromId,
  themeName,
} from "@/lib/page-builder/theme"
import { track } from "@/lib/track"

const ExportDialog = dynamic(() =>
  import("@/components/page-builder/export-dialog").then(
    (module) => module.ExportDialog
  )
)

type Device = "desktop" | "tablet" | "phone"

const deviceWidths: Record<Device, number> = {
  desktop: 1280,
  tablet: 768,
  phone: 390,
}

const siteOrigin = "https://hextaui.com"

function isTyping(target: EventTarget | null) {
  if (!(target instanceof Element)) return false
  return Boolean(
    target.closest("input, textarea, select, [contenteditable='true'], [contenteditable='plaintext-only']")
  )
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function isApple() {
  return /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
}

function useSiteDark() {
  return React.useSyncExternalStore(
    (notify) => {
      const observer = new MutationObserver(notify)
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      })
      return () => observer.disconnect()
    },
    () => document.documentElement.classList.contains("dark"),
    () => false
  )
}

function PageBuilder({
  title,
  proBlocks,
}: {
  title: string
  proBlocks: ProBlockInfo[]
}) {
  const [state, dispatch] = React.useReducer(builderReducer, null, () =>
    initialState({ sections: [] })
  )
  const [ready, setReady] = React.useState(false)
  const [blank, setBlank] = React.useState(false)
  const [encoded, setEncoded] = React.useState<string | null>(null)
  const [device, setDevice] = React.useState<Device>("desktop")
  const dark = useSiteDark()
  const { setTheme: setSiteTheme } = useTheme()
  const [sheetOpen, setSheetOpen] = React.useState(false)
  const [pickerOpen, setPickerOpen] = React.useState(false)
  const [outlineOpen, setOutlineOpen] = React.useState(false)
  const [themeOpen, setThemeOpen] = React.useState(false)
  const [exportOpen, setExportOpen] = React.useState(false)
  const [exportLoaded, setExportLoaded] = React.useState(false)
  const [announcement, setAnnouncement] = React.useState("")
  const [mod, setMod] = React.useState("Ctrl")
  const canvasRef = React.useRef<HTMLDivElement>(null)
  const isPhone = useIsPhone()
  const canvasDoc = React.useDeferredValue(state.doc)

  React.useEffect(() => {
    let live = true
    setMod(isApple() ? "⌘" : "Ctrl")
    const { page, theme } = readHashParams(window.location.hash)
    const incomingTheme = normalizeThemeId(theme)
    if (!page) {
      if (incomingTheme && incomingTheme !== defaultThemeId) {
        dispatch({ type: "load", doc: { sections: [], theme: incomingTheme } })
      }
      setReady(true)
      return
    }
    decodeDoc(page, proBlocks).then((doc) => {
      if (!live) return
      if (doc && doc.sections.length > 0) {
        dispatch({ type: "load", doc })
        setBlank(true)
      }
      setReady(true)
    })
    return () => {
      live = false
    }
  }, [proBlocks])

  React.useEffect(() => {
    if (!ready) return
    let live = true
    encodeDoc(state.doc).then((value) => {
      if (live) setEncoded(value)
    })
    const timer = setTimeout(async () => {
      const value = await encodeDoc(state.doc)
      if (!live) return
      const hash = writeHashParams(
        window.location.hash,
        state.doc.sections.length ? value : null
      )
      window.history.replaceState(
        window.history.state,
        "",
        `${window.location.pathname}${window.location.search}${hash}`
      )
    }, 400)
    return () => {
      live = false
      clearTimeout(timer)
    }
  }, [state.doc, ready])

  const announce = React.useCallback((message: string) => setAnnouncement(message), [])

  const scrollToSection = React.useCallback((key: string) => {
    let tries = 0
    const attempt = () => {
      const scroller = canvasRef.current
      const frame = scroller?.querySelector("iframe")
      const target = frame?.contentDocument?.querySelector<HTMLElement>(
        `[data-pb-key="${CSS.escape(key)}"]`
      )
      if (!scroller || !frame || !target) {
        tries += 1
        if (tries < 30) requestAnimationFrame(attempt)
        return
      }
      const frameRect = frame.getBoundingClientRect()
      const scale = frameRect.width / frame.offsetWidth
      const top =
        frameRect.top -
        scroller.getBoundingClientRect().top +
        scroller.scrollTop +
        target.offsetTop * scale -
        56
      scroller.scrollTo({
        top: Math.max(0, top),
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      })
    }
    requestAnimationFrame(attempt)
  }, [])

  const actions: CanvasActions = React.useMemo(
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
      onSwap: (key, sectionId) => {
        dispatch({ type: "swap", key, sectionId })
        track("Page builder swap", { section: sectionId })
      },
      onEdit: (key) => {
        dispatch({ type: "select", key })
        setSheetOpen(true)
      },
      onInline: (key, path, value) =>
        dispatch({
          type: "update",
          key,
          patch: (props: Props) => setPath(props, path, value),
          coalesce: `inline:${path}`,
          at: performance.now(),
        }),
    }),
    [announce, scrollToSection]
  )

  const onChange = React.useCallback(
    (key: string, patch: (props: Props) => Props, coalesce: string) => {
      dispatch({ type: "update", key, patch, coalesce, at: performance.now() })
    },
    []
  )

  const insert = (placed: PlacedSection | null, label: string) => {
    if (!placed) return
    dispatch({ type: "insert", section: placed })
    setBlank(true)
    setPickerOpen(false)
    announce(`${label} added.`)
    scrollToSection(placed.key)
    track("Page builder add", {
      section: placed.type === "pro" ? `pro:${placed.name}` : placed.sectionId,
    })
  }

  const selectedRef = React.useRef(state.selected)
  React.useEffect(() => {
    selectedRef.current = state.selected
  })

  const onKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      if (isTyping(event.target)) return
      const mod = event.metaKey || event.ctrlKey
      const key = event.key.toLowerCase()
      if (mod && key === "z" && !event.shiftKey) {
        event.preventDefault()
        dispatch({ type: "undo" })
        return
      }
      if (mod && ((key === "z" && event.shiftKey) || key === "y")) {
        event.preventDefault()
        dispatch({ type: "redo" })
        return
      }
      if (mod && key === "d" && selectedRef.current) {
        event.preventDefault()
        dispatch({ type: "duplicate", key: selectedRef.current })
        return
      }
      if (mod || event.altKey) return
      const target = event.target
      if (
        target instanceof Element &&
        target.closest('[role="dialog"], [role="menu"], [role="listbox"]')
      ) {
        return
      }
      if ((key === "backspace" || key === "delete") && selectedRef.current) {
        event.preventDefault()
        dispatch({ type: "remove", key: selectedRef.current })
        announce("Section deleted. Press Command Z to undo.")
      } else if (key === "escape" && selectedRef.current) {
        dispatch({ type: "select", key: null })
      } else if (key === "e" && selectedRef.current) {
        event.preventDefault()
        setSheetOpen(true)
      }
    },
    [announce]
  )

  React.useEffect(() => {
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [onKeyDown])

  const forwardFrameKey = React.useCallback(
    (event: KeyboardEvent) => {
      if (isTyping(event.target)) return
      const mod = event.metaKey || event.ctrlKey
      if (mod || ["backspace", "delete", "escape", "e"].includes(event.key.toLowerCase())) {
        onKeyDown(event)
        return
      }
      window.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: event.key,
          shiftKey: event.shiftKey,
          bubbles: true,
        })
      )
    },
    [onKeyDown]
  )

  const theme = React.useMemo(() => themeFromId(state.doc.theme), [state.doc.theme])
  const vars = React.useMemo(
    () => canvasVars(theme, dark ? "dark" : "light"),
    [theme, dark]
  )
  const activeDevice: Device = isPhone ? "phone" : device
  const sections = canvasDoc.sections
  const hasSections = state.doc.sections.length > 0
  const showStart = ready && !hasSections && !blank
  const selected = state.doc.sections.find((placed) => placed.key === state.selected) ?? null
  const selectedSection =
    selected?.type === "section" ? getSection(selected.sectionId) : null

  const setTheme = (next: string | null, source: string) => {
    dispatch({ type: "theme", theme: next === defaultThemeId ? null : next })
    track("Page builder theme", { theme: source })
  }

  const startWith = (id: string) => {
    const doc = starterDoc(id)
    if (!doc) return
    dispatch({
      type: "load",
      doc: state.doc.theme ? { ...doc, theme: state.doc.theme } : doc,
    })
    dispatch({ type: "select", key: null })
    setBlank(true)
    canvasRef.current?.scrollTo({ top: 0 })
    track("Page builder starter", { starter: id })
  }

  return (
    <ToolApp
      slug="page-builder"
      title={title}
      sheetOpen={sheetOpen}
      onSheetOpenChange={setSheetOpen}
    >
      <ToolTopBar>
        <ToolShareButton
          getUrl={() => {
            const url = new URL(`${siteOrigin}${window.location.pathname}`)
            if (encoded && hasSections) url.hash = `p=${encoded}`
            return url.toString()
          }}
          onShare={() =>
            track("Page builder share", {
              sections: String(state.doc.sections.length),
            })
          }
        />
        <ToolExportButton
          disabled={!hasSections}
          onClick={() => {
            setExportLoaded(true)
            setExportOpen(true)
            track("Page builder export", {
              sections: String(state.doc.sections.length),
            })
          }}
        />
      </ToolTopBar>
      <ToolCanvas
        ref={canvasRef}
        label="Page canvas"
        contentClassName="sm:pt-6"
        aside={<ToolMoreBelow />}
        dock={
          <ToolDock label="Page builder controls">
            <ToolDockPopover
              icon={<IconPlus />}
              label="Add section"
              shortcut="a"
              open={pickerOpen}
              onOpenChange={setPickerOpen}
              title="Add a section"
              description={
                selected
                  ? `Goes in after ${labelOf(selected)}.`
                  : "Goes in at the end of the page."
              }
              contentClassName="w-[min(60rem,calc(100vw-2rem))]"
            >
              <SectionPicker
                proBlocks={proBlocks}
                vars={vars}
                dark={dark}
                onAdd={(section) =>
                  insert(
                    placeSection(section.id),
                    `${kindInfo(section.kind).title} ${section.variant}`
                  )
                }
                onAddPro={(block) => insert(placePro(block), block.title)}
              />
            </ToolDockPopover>
            <ToolDockPopover
              icon={<IconListDetails />}
              label="Outline"
              hideLabel={isPhone}
              value={hasSections ? String(state.doc.sections.length) : undefined}
              shortcut="o"
              open={outlineOpen}
              onOpenChange={setOutlineOpen}
              title="Outline"
              description="Drag to reorder, or focus a handle and use the arrow keys."
            >
              <Outline
                sections={state.doc.sections}
                selected={state.selected}
                onSelect={(key) => {
                  dispatch({ type: "select", key })
                  scrollToSection(key)
                }}
                onMove={(key, to) => dispatch({ type: "move", key, to })}
                onDuplicate={actions.onDuplicate}
                onRemove={actions.onRemove}
                onAnnounce={announce}
              />
            </ToolDockPopover>
            {isPhone ? null : (
              <>
                <ToolDockSeparator />
                <ToolDockSegmented<Device>
                  label="Device"
                  value={device}
                  onValueChange={(next) => {
                    setDevice(next)
                    track("Page builder device", { device: next })
                  }}
                  options={[
                    { value: "desktop", label: "Desktop", icon: <IconDeviceDesktop />, hideLabel: true },
                    { value: "tablet", label: "Tablet", icon: <IconDeviceTablet />, hideLabel: true },
                    { value: "phone", label: "Phone", icon: <IconDeviceMobile />, hideLabel: true },
                  ]}
                />
              </>
            )}
            <ToolDockSeparator />
            <ToolDockButton
              icon={dark ? <IconMoon /> : <IconSun />}
              label={dark ? "Dark" : "Light"}
              hideLabel={isPhone}
              hint="Switch light and dark"
              shortcut="d"
              listen={false}
              onClick={() => setSiteTheme(dark ? "light" : "dark")}
            />
            <ToolDockPopover
              icon={<IconColorSwatch />}
              label="Theme"
              hideLabel={isPhone}
              value={themeName(state.doc.theme)}
              shortcut="t"
              open={themeOpen}
              onOpenChange={setThemeOpen}
              contentClassName="w-96"
            >
              <ThemePanel
                theme={state.doc.theme ?? null}
                mode={dark ? "dark" : "light"}
                onChange={setTheme}
              />
            </ToolDockPopover>
            <ToolDockSeparator />
            <ToolDockButton
              icon={<IconArrowBackUp />}
              label="Undo"
              hideLabel
              shortcut={mod === "⌘" ? "⌘Z" : "Ctrl+Z"}
              listen={false}
              disabled={state.past.length === 0}
              className="disabled:pointer-events-none disabled:opacity-40"
              onClick={() => dispatch({ type: "undo" })}
            />
            <ToolDockButton
              icon={<IconArrowForwardUp />}
              label="Redo"
              hideLabel
              shortcut={`${mod === "⌘" ? "⇧⌘" : "Ctrl+Shift+"}Z`}
              listen={false}
              disabled={state.future.length === 0}
              className="disabled:pointer-events-none disabled:opacity-40"
              onClick={() => dispatch({ type: "redo" })}
            />
          </ToolDock>
        }
      >
        {!ready ? (
          <div className="flex min-h-80 items-center justify-center text-sm text-muted-foreground">
            <Spinner aria-hidden className="me-2" />
            Opening the page
          </div>
        ) : showStart ? (
          <StartScreen
            vars={vars}
            dark={dark}
            onStart={startWith}
            onBlank={() => {
              setBlank(true)
              setPickerOpen(true)
            }}
          />
        ) : (
          <PageCanvas
            sections={sections}
            selected={state.selected}
            width={deviceWidths[activeDevice]}
            device={activeDevice}
            dark={dark}
            theme={vars}
            actions={actions}
            onKeyDown={forwardFrameKey}
            empty={
              <EmptyPage
                onAdd={() => setPickerOpen(true)}
                onStarters={() => setBlank(false)}
              />
            }
          />
        )}
      </ToolCanvas>
      <ToolSheet
        title={
          selectedSection
            ? `${kindInfo(selectedSection.kind).title} · ${selectedSection.variant}`
            : selected?.type === "pro"
              ? selected.title
              : "Edit section"
        }
        description={selectedSection?.description}
      >
        <SectionFields placed={selected} onChange={onChange} />
      </ToolSheet>
      <p role="status" className="sr-only">
        {announcement}
      </p>
      {exportLoaded ? (
        <ExportDialog
          open={exportOpen}
          onOpenChange={setExportOpen}
          doc={state.doc}
          encoded={encoded}
        />
      ) : null}
    </ToolApp>
  )
}

export { PageBuilder }
