"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { useTheme } from "next-themes"
import {
  IconAdjustmentsHorizontal,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconBorderRadius,
  IconColorSwatch,
  IconDeviceFloppy,
  IconDice5,
  IconEye,
  IconMoon,
  IconSun,
  IconTypography,
  IconUpload,
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
import { useToolShortcut } from "@/components/tools/shell/use-tool-shortcut"
import {
  PagePanel,
  previewPages,
  type CompareTarget,
  type PreviewPage,
} from "@/components/tools/theme-editor/page-panel"
import { PortalContainer } from "@/components/tools/theme-editor/preview-frame"
import { ColorPanel, PresetGrid, ShapePanel } from "@/components/tools/theme-editor/panels"
import type { PreviewBlock } from "@/components/tools/theme-editor/pro-preview"
import { ThemeShowcase } from "@/components/tools/theme-editor/showcase"
import { TokensSheetBody, type SheetTab } from "@/components/tools/theme-editor/tokens-sheet"
import { TypePanel } from "@/components/tools/theme-editor/type-panel"
import { useThemeState } from "@/components/tools/theme-editor/use-theme-state"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { Skeleton } from "@/components/ui/skeleton"
import { TooltipGroup, TooltipTrigger } from "@/components/ui/tooltip"
import { formatOklch } from "@/lib/theme-editor/color"
import { decodeTheme } from "@/lib/theme-editor/encode"
import { googleFontsUrl, isGoogleFont } from "@/lib/theme-editor/fonts"
import { getPreset } from "@/lib/theme-editor/presets"
import { themeShareUrl } from "@/lib/theme-editor/registry"
import {
  defaultTheme,
  previewVars,
  type ThemeFonts,
  type ThemeMode,
} from "@/lib/theme-editor/theme"
import { cvdFilterValues, cvdModes, type CvdMode } from "@/lib/theme-editor/tools"
import { track } from "@/lib/track"

const ExportDialog = dynamic(() =>
  import("@/components/tools/theme-editor/export-dialog").then(
    (module) => module.ExportDialog
  )
)
const ImportDialog = dynamic(() =>
  import("@/components/tools/theme-editor/export-dialog").then(
    (module) => module.ImportDialog
  )
)
const ProPreview = dynamic(
  () =>
    import("@/components/tools/theme-editor/pro-preview").then(
      (module) => module.ProPreview
    ),
  { ssr: false }
)

function PageLoading() {
  return (
    <div className="flex h-[max(30rem,calc(100svh-11rem))] w-full max-w-[80rem] flex-col gap-3 rounded-xl bg-background p-6 ring-(length:--hairline) ring-foreground/10 sm:h-[max(32rem,calc(100svh-13rem))]">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-72" />
    </div>
  )
}

const pageLoaders = {
  dashboard: dynamic(() => import("@/components/tools/theme-editor/pages/dashboard"), {
    ssr: false,
    loading: PageLoading,
  }),
  chat: dynamic(() => import("@/components/tools/theme-editor/pages/chat"), {
    ssr: false,
    loading: PageLoading,
  }),
  "sign-in": dynamic(() => import("@/components/tools/theme-editor/pages/sign-in"), {
    ssr: false,
    loading: PageLoading,
  }),
  pricing: dynamic(() => import("@/components/tools/theme-editor/pages/pricing"), {
    ssr: false,
    loading: PageLoading,
  }),
  settings: dynamic(() => import("@/components/tools/theme-editor/pages/settings"), {
    ssr: false,
    loading: PageLoading,
  }),
  mail: dynamic(() => import("@/components/tools/theme-editor/pages/mail"), {
    ssr: false,
    loading: PageLoading,
  }),
  store: dynamic(() => import("@/components/tools/theme-editor/pages/store"), {
    ssr: false,
    loading: PageLoading,
  }),
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

function useFontLinks(fonts: ThemeFonts) {
  React.useEffect(() => {
    for (const name of [fonts.sans, fonts.serif, fonts.mono]) {
      if (!isGoogleFont(name)) continue
      if (document.head.querySelector(`link[data-theme-font="${name}"]`)) continue
      const href = googleFontsUrl([name])
      if (!href) continue
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = href
      link.dataset.themeFont = name
      document.head.append(link)
    }
  }, [fonts.sans, fonts.serif, fonts.mono])
}

function useCanvasVars(
  ref: React.RefObject<HTMLElement | null>,
  vars: Record<string, string>
) {
  const written = React.useRef<Record<string, string>>({})
  const pending = React.useRef(vars)
  const frame = React.useRef(0)

  const flush = React.useCallback(() => {
    frame.current = 0
    const element = ref.current
    if (!element) return
    const next = pending.current
    for (const [name, value] of Object.entries(next)) {
      if (written.current[name] !== value) element.style.setProperty(name, value)
    }
    written.current = next
  }, [ref])

  React.useLayoutEffect(() => {
    pending.current = vars
    if (Object.keys(written.current).length === 0) {
      flush()
      return
    }
    if (!frame.current) frame.current = requestAnimationFrame(flush)
  }, [vars, flush])

  React.useEffect(() => () => cancelAnimationFrame(frame.current), [])
}

function CvdFilters() {
  return (
    <svg aria-hidden="true" className="absolute size-0 overflow-hidden">
      {cvdModes.flatMap((mode) =>
        mode.value === "none"
          ? []
          : [
              <filter key={mode.value} id={`theme-cvd-${mode.value}`}>
                <feColorMatrix type="matrix" values={cvdFilterValues(mode.value)} />
              </filter>,
            ]
      )}
    </svg>
  )
}

const pageKeys = previewPages.map((page) => page.value)

function isTyping(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT")
  )
}

function ThemeEditor({
  title,
  blocks,
}: {
  title: string
  blocks: PreviewBlock[]
}) {
  const { state, id, actions, history, locked, linked, saved, lastSaved } =
    useThemeState()
  const { setTheme } = useTheme()
  const siteMode = useSiteMode()
  const mode: ThemeMode = siteMode ?? "light"
  const [page, setPage] = React.useState<PreviewPage>("components")
  const [cvd, setCvd] = React.useState<CvdMode>("none")
  const [compareTarget, setCompareTarget] = React.useState<CompareTarget>("default")
  const [pinned, setPinned] = React.useState(false)
  const [peeking, setPeeking] = React.useState(false)
  const [sheetOpen, setSheetOpen] = React.useState(false)
  const [sheetTab, setSheetTab] = React.useState<SheetTab>("colors")
  const [presetOpen, setPresetOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [exportOpen, setExportOpen] = React.useState(false)
  const [importOpen, setImportOpen] = React.useState(false)
  const [loaded, setLoaded] = React.useState({ export: false, import: false })
  const canvasRef = React.useRef<HTMLDivElement>(null)

  useFontLinks(state.theme.fonts)

  const baseline = React.useMemo(() => {
    if (compareTarget === "saved" && lastSaved) {
      return decodeTheme(lastSaved) ?? defaultTheme
    }
    return defaultTheme
  }, [compareTarget, lastSaved])

  const comparing = pinned || peeking
  const shown = comparing ? baseline : state.theme
  const vars = React.useMemo(() => previewVars(shown, mode), [shown, mode])
  useCanvasVars(canvasRef, vars)
  useFontLinks(baseline.fonts)

  const save = React.useCallback(() => {
    const entry = actions.save()
    setEditingId(entry.id)
    setPresetOpen(true)
    track("Theme editor save")
  }, [actions])

  useToolShortcut("s", () => {
    actions.shuffle()
    track("Theme editor shuffle")
  })

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const meta = event.metaKey || event.ctrlKey
      const key = event.key.toLowerCase()
      if (meta && !event.altKey && (key === "z" || key === "y")) {
        if (isTyping(event.target)) return
        event.preventDefault()
        if (key === "y" || event.shiftKey) actions.redo()
        else actions.undo()
        return
      }
      if (meta && !event.altKey && !event.shiftKey && key === "s") {
        event.preventDefault()
        save()
        return
      }
      if (meta || event.altKey || event.defaultPrevented || isTyping(event.target)) return
      if (
        event.target instanceof HTMLElement &&
        event.target.closest('[role="dialog"], [role="menu"], [role="listbox"]')
      ) {
        return
      }
      if (key === "b" && !event.repeat) {
        setPeeking(true)
        return
      }
      const index = Number(event.key) - 1
      if (!event.repeat && Number.isInteger(index) && index >= 0 && index < pageKeys.length) {
        event.preventDefault()
        setPage(pageKeys[index])
      }
    }
    function onKeyUp(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "b") setPeeking(false)
    }
    function onBlur() {
      setPeeking(false)
    }
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    window.addEventListener("blur", onBlur)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
      window.removeEventListener("blur", onBlur)
    }
  }, [actions, save])

  const presetName =
    state.source.kind === "preset"
      ? (getPreset(state.source.slug)?.name.replace(/^Inspired by /, "") ?? "Preset")
      : state.source.kind === "saved"
        ? (saved.find((entry) => entry.id === (state.source as { id: string }).id)?.name ?? "Saved")
        : "Custom"
  const pageLabel = previewPages.find((item) => item.value === page)?.label ?? "Components"

  const openExport = () => {
    setLoaded((current) => ({ ...current, export: true }))
    setExportOpen(true)
    track("Theme editor export")
  }

  const PageView = page in pageLoaders ? pageLoaders[page as keyof typeof pageLoaders] : null

  return (
    <ToolApp
      slug="theme-editor"
      title={title}
      sheetOpen={sheetOpen}
      onSheetOpenChange={setSheetOpen}
    >
      <ToolTopBar>
        <TooltipGroup side="bottom" sideOffset={6}>
          <div className="flex items-center max-sm:hidden">
            <TooltipTrigger
              content={
                <span className="flex items-center gap-2">
                  Undo <Kbd size="sm">⌘Z</Kbd>
                </span>
              }
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Undo"
                  disabled={!history.undo}
                  onClick={actions.undo}
                />
              }
            >
              <IconArrowBackUp />
            </TooltipTrigger>
            <TooltipTrigger
              content={
                <span className="flex items-center gap-2">
                  Redo <Kbd size="sm">⇧⌘Z</Kbd>
                </span>
              }
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Redo"
                  disabled={!history.redo}
                  onClick={actions.redo}
                />
              }
            >
              <IconArrowForwardUp />
            </TooltipTrigger>
          </div>
        </TooltipGroup>
        <span aria-hidden="true" className="mx-0.5 h-4 border-s max-sm:hidden" />
        <Button
          variant="ghost"
          size="sm"
          aria-label="Import"
          onClick={() => {
            setLoaded((current) => ({ ...current, import: true }))
            setImportOpen(true)
          }}
        >
          <IconUpload data-icon="inline-start" />
          <span className="max-sm:sr-only">Import</span>
        </Button>
        <ToolShareButton
          getUrl={() => {
            window.history.replaceState(
              window.history.state,
              "",
              `${window.location.pathname}#t=${id}`
            )
            return themeShareUrl(id)
          }}
          onShare={() => track("Theme editor share")}
        />
        <ToolExportButton onClick={openExport} />
      </ToolTopBar>
      <CvdFilters />
      <ToolCanvas
        ref={canvasRef}
        label={page === "blocks" ? "Theme on Pro blocks" : `Theme preview: ${pageLabel}`}
        contentClassName={page === "components" ? undefined : "sm:pt-6"}
        className="font-(family-name:--font-sans) tracking-normal filter-(--cvd) [&_[data-slot=dropdown-menu-content]]:shadow-(--shadow-md) [&_[data-slot=hover-card-content]]:shadow-(--shadow-md) [&_[data-slot=popover-content]]:shadow-(--shadow-md) [&_[data-slot=select-content]]:shadow-(--shadow-md) [&_[data-slot=tooltip-content]]:shadow-(--shadow-md) [&_[data-float=lg]]:shadow-(--shadow-lg) [&_[data-float=md]]:shadow-(--shadow-md) [&_[data-float=xl]]:shadow-(--shadow-xl)"
        style={
          cvd === "none"
            ? undefined
            : ({ "--cvd": `url(#theme-cvd-${cvd})` } as React.CSSProperties)
        }
        aside={
          <>
            {comparing ? (
              <div
                role="status"
                className="pointer-events-none absolute top-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background shadow-md"
              >
                Showing {compareTarget === "saved" && lastSaved ? "last saved" : "HextaUI default"}
              </div>
            ) : null}
            <ToolMoreBelow />
          </>
        }
        dock={
          <ToolDock label="Theme controls">
            <ToolDockPopover
              icon={<IconColorSwatch />}
              label="Preset"
              value={presetName}
              shortcut="p"
              open={presetOpen}
              onOpenChange={(open) => {
                setPresetOpen(open)
                if (!open) setEditingId(null)
              }}
              contentClassName="w-[30rem]"
              action={
                <Button variant="ghost" size="xs" onClick={save}>
                  <IconDeviceFloppy data-icon="inline-start" />
                  Save
                  <Kbd size="sm">⌘S</Kbd>
                </Button>
              }
            >
              <PresetGrid
                selected={state.source.kind === "preset" ? state.source.slug : null}
                savedSelected={state.source.kind === "saved" ? state.source.id : null}
                mode={mode}
                saved={saved}
                editingId={editingId}
                onEditingChange={setEditingId}
                onSelect={actions.applyPreset}
                onLoadSaved={actions.loadSaved}
                onRenameSaved={actions.renameSaved}
                onOverwriteSaved={actions.overwriteSaved}
                onRemoveSaved={actions.removeSaved}
              />
            </ToolDockPopover>
            <ToolDockPopover
              icon={
                <span
                  aria-hidden="true"
                  className="size-3.5 rounded-full bg-(--swatch) inset-ring-(length:--hairline) inset-ring-foreground/20 forced-colors:border"
                  style={
                    { "--swatch": formatOklch(state.theme[mode].primary) } as React.CSSProperties
                  }
                />
              }
              label="Color"
              title="Generate from one color"
              shortcut="c"
              action={
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => {
                    actions.shuffle()
                    track("Theme editor shuffle")
                  }}
                >
                  <IconDice5 data-icon="inline-start" />
                  Shuffle
                  <Kbd size="sm">S</Kbd>
                </Button>
              }
            >
              <ColorPanel
                brand={state.brand}
                tint={state.tint}
                onGenerate={actions.generate}
                onHarmony={actions.harmony}
              />
            </ToolDockPopover>
            <ToolDockPopover
              icon={<IconTypography />}
              label="Type"
              value={state.theme.fonts.sans === "System" ? undefined : state.theme.fonts.sans}
              title="Typography"
              shortcut="f"
              contentClassName="w-[22rem]"
            >
              <TypePanel
                fonts={state.theme.fonts}
                tracking={state.theme.tracking}
                textBase={state.theme.textBase}
                onFontChange={actions.setFont}
                onTrackingChange={actions.setTracking}
                onTextBaseChange={actions.setTextBase}
              />
            </ToolDockPopover>
            <ToolDockPopover
              icon={<IconBorderRadius />}
              label="Shape"
              value={`${state.theme.radius.toFixed(2).replace(/0$/, "")}`}
              title="Radius and shadow"
              shortcut="r"
            >
              <ShapePanel
                radius={state.theme.radius}
                shadow={state.theme.shadow}
                onRadiusChange={actions.setRadius}
                onShadowChange={actions.setShadow}
              />
            </ToolDockPopover>
            <ToolDockSeparator />
            <ToolDockButton
              icon={mode === "dark" ? <IconMoon /> : <IconSun />}
              label={mode === "dark" ? "Dark" : "Light"}
              hint="Switch light and dark"
              shortcut="d"
              listen={false}
              onClick={() => setTheme(mode === "dark" ? "light" : "dark")}
            />
            <ToolDockSeparator />
            <ToolDockPopover
              icon={<IconEye />}
              label="Page"
              value={pageLabel}
              title="Preview"
              hint="Pages, color vision and compare"
              shortcut="v"
              contentClassName="w-[24rem]"
            >
              <PagePanel
                page={page}
                onPageChange={(next) => {
                  setPage(next)
                  track("Theme editor page", { page: next })
                }}
                cvd={cvd}
                onCvdChange={setCvd}
                compareTarget={compareTarget}
                onCompareTargetChange={setCompareTarget}
                hasSaved={lastSaved !== null}
                comparing={pinned}
                onComparingChange={setPinned}
              />
            </ToolDockPopover>
            <ToolDockSeparator />
            <ToolDockButton
              icon={<IconAdjustmentsHorizontal />}
              label="Tokens"
              hint="Edit every token"
              shortcut="t"
              aria-pressed={sheetOpen}
              onClick={() => setSheetOpen(!sheetOpen)}
            />
          </ToolDock>
        }
      >
        {page === "components" ? (
          <ThemeShowcase portalRef={canvasRef} />
        ) : page === "blocks" ? (
          <ProPreview blocks={blocks} vars={vars} dark={mode === "dark"} />
        ) : PageView ? (
          <PortalContainer.Provider value={canvasRef}>
            <PageView />
          </PortalContainer.Provider>
        ) : null}
      </ToolCanvas>
      <ToolSheet
        title="Tokens"
        description={`Editing ${mode} mode. Press D to switch.`}
      >
        <TokensSheetBody
          theme={state.theme}
          mode={mode}
          tab={sheetTab}
          onTabChange={setSheetTab}
          locked={locked}
          linked={linked}
          onLinkedChange={actions.setLinked}
          onToggleLock={actions.toggleLock}
          onTokenChange={(name, color) => actions.setToken(mode, name, color)}
          onAdjust={actions.adjust}
        />
      </ToolSheet>
      {loaded.export ? (
        <ExportDialog
          open={exportOpen}
          onOpenChange={setExportOpen}
          theme={state.theme}
          id={id}
        />
      ) : null}
      {loaded.import ? (
        <ImportDialog
          open={importOpen}
          onOpenChange={setImportOpen}
          theme={state.theme}
          onImport={actions.replace}
        />
      ) : null}
    </ToolApp>
  )
}

export { ThemeEditor }
