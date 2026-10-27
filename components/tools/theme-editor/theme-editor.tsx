"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import {
  IconDownload,
  IconLink,
  IconMoon,
  IconSun,
  IconUpload,
} from "@tabler/icons-react"

import { Controls } from "@/components/tools/theme-editor/controls"
import { ThemePreview } from "@/components/tools/theme-editor/preview"
import type { PreviewBlock } from "@/components/tools/theme-editor/pro-preview"
import { useThemeState } from "@/components/tools/theme-editor/use-theme-state"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
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

function ModeToggle({
  mode,
  onChange,
}: {
  mode: ThemeMode
  onChange: (mode: ThemeMode) => void
}) {
  return (
    <ToggleGroup
      variant="outline"
      size="sm"
      aria-label="Preview mode"
      value={[mode]}
      onValueChange={(value) => {
        if (value[0]) onChange(value[0] as ThemeMode)
      }}
    >
      <ToggleGroupItem value="light" aria-label="Light mode">
        <IconSun />
        <span className="max-sm:sr-only">Light</span>
      </ToggleGroupItem>
      <ToggleGroupItem value="dark" aria-label="Dark mode">
        <IconMoon />
        <span className="max-sm:sr-only">Dark</span>
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

function ThemeEditor({ blocks }: { blocks: PreviewBlock[] }) {
  const { state, id, actions } = useThemeState()
  const siteMode = useSiteMode()
  const [chosenMode, setChosenMode] = React.useState<ThemeMode | null>(null)
  const mode = chosenMode ?? siteMode ?? "light"
  const [pane, setPane] = React.useState<"controls" | "preview">("preview")
  const [view, setView] = React.useState<"components" | "blocks">("components")
  const [exportOpen, setExportOpen] = React.useState(false)
  const [importOpen, setImportOpen] = React.useState(false)
  const [loaded, setLoaded] = React.useState({ export: false, import: false })

  const deferredTheme = React.useDeferredValue(state.theme)
  const vars = React.useMemo(
    () => themeVars(deferredTheme, mode),
    [deferredTheme, mode]
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <ToggleGroup
          variant="outline"
          size="sm"
          aria-label="Show"
          value={[pane]}
          onValueChange={(value) => {
            if (value[0]) setPane(value[0] as "controls" | "preview")
          }}
          className="lg:hidden"
        >
          <ToggleGroupItem value="controls">Edit</ToggleGroupItem>
          <ToggleGroupItem value="preview">Preview</ToggleGroupItem>
        </ToggleGroup>
        <ModeToggle mode={mode} onChange={setChosenMode} />
        <div className="ms-auto flex flex-wrap items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setLoaded((current) => ({ ...current, import: true }))
              setImportOpen(true)
            }}
          >
            <IconUpload data-icon="inline-start" />
            Import
          </Button>
          <Button
            variant="outline"
            size="sm"
            feedback
            successLabel="Link copied"
            onClick={async () => {
              const url = themeShareUrl(id)
              window.history.replaceState(
                window.history.state,
                "",
                `${window.location.pathname}#t=${id}`
              )
              await navigator.clipboard.writeText(url)
              track("Theme editor share")
            }}
          >
            <IconLink data-icon="inline-start" />
            Share
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setLoaded((current) => ({ ...current, export: true }))
              setExportOpen(true)
              track("Theme editor export")
            }}
          >
            <IconDownload data-icon="inline-start" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] overflow-hidden rounded-xl bg-background inset-ring-(length:--hairline) inset-ring-border lg:h-[clamp(40rem,calc(100svh-9rem),60rem)] lg:grid-cols-[19rem_minmax(0,1fr)] forced-colors:border">
        <aside
          aria-label="Theme controls"
          data-pane={pane === "controls" ? "" : undefined}
          className="min-h-0 overscroll-contain border-e max-lg:hidden max-lg:border-e-0 max-lg:data-pane:block lg:overflow-y-auto"
        >
          <Controls state={state} mode={mode} actions={actions} />
        </aside>
        <div
          data-pane={pane === "preview" ? "" : undefined}
          className="flex min-h-0 min-w-0 flex-col max-lg:hidden max-lg:data-pane:flex"
        >
          <div className="flex items-center gap-2 border-b px-3 py-2">
            <ToggleGroup
              variant="outline"
              size="sm"
              aria-label="Preview"
              value={[view]}
              onValueChange={(value) => {
                if (value[0]) setView(value[0] as "components" | "blocks")
              }}
            >
              <ToggleGroupItem value="components">Components</ToggleGroupItem>
              <ToggleGroupItem value="blocks">On Pro blocks</ToggleGroupItem>
            </ToggleGroup>
          </div>
          {view === "components" ? (
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <ThemePreview vars={vars} dark={mode === "dark"} />
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col">
              <ProPreview blocks={blocks} vars={vars} dark={mode === "dark"} />
            </div>
          )}
        </div>
      </div>

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
    </div>
  )
}

export { ThemeEditor }
