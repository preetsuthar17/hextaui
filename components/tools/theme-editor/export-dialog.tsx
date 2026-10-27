"use client"

import * as React from "react"
import { IconDownload } from "@tabler/icons-react"

import { DocsCopyButton } from "@/components/docs/docs-copy-button"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { parseThemeCss } from "@/lib/theme-editor/css"
import { googleFontsUrl, isGoogleFont } from "@/lib/theme-editor/fonts"
import { exportFormats, type ExportFile } from "@/lib/theme-editor/formats"
import { themeInstallCommand } from "@/lib/theme-editor/registry"
import type { Theme } from "@/lib/theme-editor/theme"
import { track } from "@/lib/track"

function download(file: ExportFile) {
  const type = file.name.endsWith(".json") ? "application/json" : "text/plain"
  const url = URL.createObjectURL(new Blob([file.value], { type }))
  const link = document.createElement("a")
  link.href = url
  link.download = file.name
  document.body.append(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function CodePanel({
  value,
  label,
  prompt,
  compact,
}: {
  value: string
  label: string
  prompt?: boolean
  compact?: boolean
}) {
  return (
    <div className="flex min-w-0 items-start rounded-lg bg-muted/50 inset-ring-(length:--hairline) inset-ring-border dark:bg-muted/30">
      <pre
        data-prompt={prompt ? "" : undefined}
        data-compact={compact ? "" : undefined}
        className="max-h-[min(20rem,40svh)] min-w-0 flex-1 overflow-auto py-2.5 ps-3 font-mono text-xs/5 whitespace-pre text-foreground data-compact:max-h-[min(12rem,24svh)] data-prompt:max-h-none data-prompt:py-2"
      >
        {prompt ? (
          <span aria-hidden="true" className="text-muted-foreground select-none">
            ${" "}
          </span>
        ) : null}
        <code>{value}</code>
      </pre>
      <div className="shrink-0 p-1">
        <DocsCopyButton
          value={value}
          label={label}
          event="Theme editor copy"
          eventProps={{ format: label }}
        />
      </div>
    </div>
  )
}

function FileBlock({ file, compact }: { file: ExportFile; compact: boolean }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs text-muted-foreground">{file.name}</span>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => {
            download(file)
            track("Theme editor download", { file: file.name })
          }}
        >
          <IconDownload data-icon="inline-start" />
          Download
        </Button>
      </div>
      <CodePanel value={file.value} label={`Copy ${file.name}`} compact={compact} />
    </div>
  )
}

function FontsNote({ theme }: { theme: Theme }) {
  const names = [theme.fonts.sans, theme.fonts.serif, theme.fonts.mono].filter(isGoogleFont)
  const url = googleFontsUrl(names)
  if (!url) return null
  const unique = [...new Set(names)]
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-xs font-medium text-muted-foreground">
        Load {unique.join(", ")} from Google Fonts, or use next/font
      </h3>
      <CodePanel
        value={`<link rel="stylesheet" href="${url}" />`}
        label="Copy font link"
        prompt={false}
        compact
      />
    </section>
  )
}

function ExportDialog({
  open,
  onOpenChange,
  theme,
  id,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  theme: Theme
  id: string
}) {
  const [format, setFormat] = React.useState(exportFormats[0].id)
  const active = exportFormats.find((item) => item.id === format) ?? exportFormats[0]
  const files = React.useMemo(() => (open ? active.files(theme) : []), [active, theme, open])
  const command = themeInstallCommand(id)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Export theme</DialogTitle>
          <DialogDescription>
            One command writes both modes into your CSS. Or pick a format to
            copy or download.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div className="flex min-w-0 flex-col gap-5">
            <section className="flex flex-col gap-2">
              <h3 className="text-xs font-medium text-muted-foreground">
                Install with the shadcn CLI
              </h3>
              <CodePanel value={command} label="Copy install command" prompt />
            </section>
            <FontsNote theme={theme} />
            <Tabs value={format} onValueChange={(value) => setFormat(String(value))}>
              <TabsList variant="line" aria-label="Export format">
                {exportFormats.map((item) => (
                  <TabsTrigger key={item.id} value={item.id}>
                    {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {exportFormats.map((item) => (
                <TabsContent key={item.id} value={item.id}>
                  {item.id === active.id ? (
                    <div className="flex min-w-0 flex-col gap-3">
                      <p className="text-xs text-pretty text-muted-foreground">
                        {item.description}
                      </p>
                      {files.map((file) => (
                        <FileBlock key={file.name} file={file} compact={files.length > 1} />
                      ))}
                    </div>
                  ) : null}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}

function ImportDialog({
  open,
  onOpenChange,
  theme,
  onImport,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  theme: Theme
  onImport: (theme: Theme) => void
}) {
  const [value, setValue] = React.useState("")
  const [message, setMessage] = React.useState("")
  const id = React.useId()

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) setMessage("")
      }}
    >
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Import a theme</DialogTitle>
          <DialogDescription>
            Paste CSS variables, a tweakcn export or a shadcn registry JSON.
            Fonts, shadows and letter spacing come along. Hex, rgb(), hsl() and
            oklch() all work.
          </DialogDescription>
        </DialogHeader>
        <form
          className="contents"
          onSubmit={(event) => {
            event.preventDefault()
            const result = parseThemeCss(value, theme)
            if (!result) {
              setMessage(
                "No theme variables found. Paste a :root { … } block with variables like --background and --primary, or a registry JSON with cssVars."
              )
              return
            }
            onImport(result.theme)
            onOpenChange(false)
            setValue("")
            setMessage("")
          }}
        >
          <DialogBody>
            <div className="flex flex-col gap-2">
            <label htmlFor={id} className="sr-only">
              Theme CSS
            </label>
            <Textarea
              id={id}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder={":root {\n  --background: oklch(1 0 0);\n  --primary: oklch(0.55 0.19 255);\n}\n.dark {\n  …\n}"}
              spellCheck={false}
              minRows={8}
              maxRows={16}
              aria-describedby={message ? `${id}-message` : undefined}
            />
            {message ? (
              <p id={`${id}-message`} role="alert" className="text-sm text-destructive">
                {message}
              </p>
            ) : null}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={value.trim() === ""}>
                Import
              </Button>
            </div>
            </div>
          </DialogBody>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { ExportDialog, ImportDialog }
