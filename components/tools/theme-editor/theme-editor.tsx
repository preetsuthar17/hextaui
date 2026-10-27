"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { useTheme } from "next-themes"
import {
  IconAdjustmentsHorizontal,
  IconBorderRadius,
  IconComponents,
  IconLayoutDashboard,
  IconMoon,
  IconSun,
  IconColorSwatch,
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
  ToolDockSegmented,
  ToolDockSeparator,
} from "@/components/tools/shell/tool-dock"
import { ToolSheet } from "@/components/tools/shell/tool-sheet"
import {
  ColorPanel,
  PresetGrid,
  RadiusPanel,
  TokenEditor,
} from "@/components/tools/theme-editor/panels"
import type { PreviewBlock } from "@/components/tools/theme-editor/pro-preview"
import { ThemeShowcase } from "@/components/tools/theme-editor/showcase"
import { useThemeState } from "@/components/tools/theme-editor/use-theme-state"
import { Button } from "@/components/ui/button"
import { formatOklch } from "@/lib/theme-editor/color"
import { getPreset } from "@/lib/theme-editor/presets"
import { themeShareUrl } from "@/lib/theme-editor/registry"
import { themeVars, type ThemeMode } from "@/lib/theme-editor/theme"
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

type View = "components" | "blocks"

function ThemeEditor({
  title,
  blocks,
}: {
  title: string
  blocks: PreviewBlock[]
}) {
  const { state, id, actions } = useThemeState()
  const { setTheme } = useTheme()
  const siteMode = useSiteMode()
  const mode: ThemeMode = siteMode ?? "light"
  const [view, setView] = React.useState<View>("components")
  const [sheetOpen, setSheetOpen] = React.useState(false)
  const [exportOpen, setExportOpen] = React.useState(false)
  const [importOpen, setImportOpen] = React.useState(false)
  const [loaded, setLoaded] = React.useState({ export: false, import: false })
  const canvasRef = React.useRef<HTMLDivElement>(null)

  const deferredTheme = React.useDeferredValue(state.theme)
  const vars = React.useMemo(
    () => themeVars(deferredTheme, mode),
    [deferredTheme, mode]
  )

  React.useLayoutEffect(() => {
    const element = canvasRef.current
    if (!element) return
    for (const [name, value] of Object.entries(vars)) {
      element.style.setProperty(name, value)
      if (name !== "--radius") {
        element.style.setProperty(`--color-${name.slice(2)}`, value)
      }
    }
  }, [vars])

  const presetName =
    state.source.kind === "preset"
      ? (getPreset(state.source.slug)?.name ?? "Preset")
      : "Custom"

  const openExport = () => {
    setLoaded((current) => ({ ...current, export: true }))
    setExportOpen(true)
    track("Theme editor export")
  }

  return (
    <ToolApp
      slug="theme-editor"
      title={title}
      sheetOpen={sheetOpen}
      onSheetOpenChange={setSheetOpen}
    >
      <ToolTopBar>
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
      <ToolCanvas
        ref={canvasRef}
        label={view === "components" ? "Theme preview" : "Theme on Pro blocks"}
        contentClassName={view === "blocks" ? "sm:pt-6" : undefined}
        aside={<ToolMoreBelow />}
        dock={
          <ToolDock label="Theme controls">
            <ToolDockPopover
              icon={<IconColorSwatch />}
              label="Preset"
              value={presetName}
              shortcut="p"
              contentClassName="w-[27rem]"
            >
              <PresetGrid
                selected={state.source.kind === "preset" ? state.source.slug : null}
                mode={mode}
                onSelect={actions.applyPreset}
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
            >
              <ColorPanel
                brand={state.brand}
                tint={state.tint}
                onGenerate={actions.generate}
              />
            </ToolDockPopover>
            <ToolDockPopover
              icon={<IconBorderRadius />}
              label="Radius"
              value={`${state.theme.radius.toFixed(2).replace(/0$/, "")}`}
              shortcut="r"
            >
              <RadiusPanel value={state.theme.radius} onChange={actions.setRadius} />
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
            <ToolDockSegmented<View>
              label="Preview"
              value={view}
              onValueChange={setView}
              options={[
                { value: "components", label: "Components", icon: <IconComponents /> },
                { value: "blocks", label: "Pro blocks", icon: <IconLayoutDashboard /> },
              ]}
            />
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
        {view === "components" ? (
          <ThemeShowcase portalRef={canvasRef} />
        ) : (
          <ProPreview blocks={blocks} vars={vars} dark={mode === "dark"} />
        )}
      </ToolCanvas>
      <ToolSheet
        title="Tokens"
        description={`Editing ${mode} mode. Press D to switch.`}
      >
        <TokenEditor
          theme={state.theme}
          mode={mode}
          onChange={(name, color) => actions.setToken(mode, name, color)}
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
