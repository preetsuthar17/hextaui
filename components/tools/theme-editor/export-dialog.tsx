"use client"

import * as React from "react"

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
import { parseThemeCss, themeToCss, themeToJson } from "@/lib/theme-editor/css"
import { themeInstallCommand } from "@/lib/theme-editor/registry"
import type { Theme } from "@/lib/theme-editor/theme"

function CodePanel({
  value,
  label,
  prompt,
}: {
  value: string
  label: string
  prompt?: boolean
}) {
  return (
    <div className="flex min-w-0 items-start rounded-lg bg-muted/50 inset-ring-(length:--hairline) inset-ring-border dark:bg-muted/30">
      <pre
        data-prompt={prompt ? "" : undefined}
        className="max-h-[min(22rem,45svh)] min-w-0 flex-1 overflow-auto py-2.5 ps-3 font-mono text-xs/5 whitespace-pre text-foreground data-prompt:max-h-none data-prompt:py-2"
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
  const css = React.useMemo(() => themeToCss(theme), [theme])
  const json = React.useMemo(() => themeToJson(theme), [theme])
  const command = themeInstallCommand(id)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Export theme</DialogTitle>
          <DialogDescription>
            One command writes both modes into your CSS. Or copy the code.
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
            <Tabs defaultValue="css">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-medium text-muted-foreground">
                  Or copy the code
                </h3>
                <TabsList>
                  <TabsTrigger value="css">CSS</TabsTrigger>
                  <TabsTrigger value="json">JSON</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="css">
                <CodePanel value={css} label="Copy CSS" />
              </TabsContent>
              <TabsContent value="json">
                <CodePanel value={json} label="Copy JSON" />
              </TabsContent>
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
            Paste the CSS variables from a shadcn/ui or tweakcn theme. Hex,
            rgb(), hsl() and oklch() values all work.
          </DialogDescription>
        </DialogHeader>
        <form
          className="contents"
          onSubmit={(event) => {
            event.preventDefault()
            const result = parseThemeCss(value, theme)
            if (!result) {
              setMessage(
                "No theme variables found. Paste a :root { … } block with variables like --background and --primary."
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
