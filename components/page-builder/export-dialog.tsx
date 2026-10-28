"use client"

import * as React from "react"
import { IconDownload, IconFileCode, IconLock } from "@tabler/icons-react"

import { DocsCopyButton } from "@/components/docs/docs-copy-button"
import Link from "@/components/site/link"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { PageDoc } from "@/lib/page-builder/doc"
import {
  componentsInstallCommand,
  exportPage,
  pageInstallCommand,
  proInstallCommand,
} from "@/lib/page-builder/export"
import { createZip } from "@/lib/page-builder/zip"
import { track } from "@/lib/track"

function CommandPanel({
  value,
  label,
  event,
}: {
  value: string
  label: string
  event: string
}) {
  return (
    <div className="flex min-w-0 items-start rounded-lg bg-muted/50 inset-ring-(length:--hairline) inset-ring-border dark:bg-muted/30 forced-colors:border">
      <pre className="min-w-0 flex-1 overflow-x-auto py-2 ps-3 font-mono text-xs/5 whitespace-pre text-foreground [scrollbar-width:thin]">
        <span aria-hidden="true" className="text-muted-foreground select-none">
          ${" "}
        </span>
        <code>{value}</code>
      </pre>
      <div className="shrink-0 p-1">
        <DocsCopyButton value={value} label={label} event={event} />
      </div>
    </div>
  )
}

function download(name: string, data: BlobPart, type: string) {
  const url = URL.createObjectURL(new Blob([data], { type }))
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = name
  anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function fileName(path: string) {
  return path.split("/").pop() ?? path
}

function ExportDialog({
  open,
  onOpenChange,
  doc,
  encoded,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  doc: PageDoc
  encoded: string | null
}) {
  const result = React.useMemo(() => (open ? exportPage(doc) : null), [doc, open])
  const [active, setActive] = React.useState(0)
  const file = result?.files[Math.min(active, result.files.length - 1)]
  const components = result ? componentsInstallCommand(result) : null
  const pro = result ? proInstallCommand(result) : null

  const downloadZip = () => {
    if (!result) return
    const readme = [
      "# Landing page",
      "",
      "Made with the HextaUI page builder: https://hextaui.com/tools/page-builder",
      "",
      "Copy `app` and `components` into a Next.js app with HextaUI set up, then install the components:",
      "",
      "```sh",
      components ?? "",
      ...(pro ? [pro] : []),
      "```",
      ...(result.theme
        ? [
            "",
            "`app/theme.css` holds the page theme. Import it in `app/globals.css` after Tailwind, or paste its contents there.",
          ]
        : []),
      "",
    ].join("\n")
    download(
      "landing-page.zip",
      createZip([
        ...result.files,
        { path: "README.md", content: readme },
      ]) as Uint8Array<ArrayBuffer>,
      "application/zip"
    )
    track("Page builder download", { sections: String(doc.sections.length) })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Export page</DialogTitle>
          <DialogDescription>
            One command writes the page, its sections
            {result?.theme ? ", the theme" : ""} and the components it uses.
            Or copy the files.
          </DialogDescription>
        </DialogHeader>
        {result ? (
          <DialogBody>
            <div className="flex min-w-0 flex-col gap-5">
              {encoded ? (
                <section className="flex flex-col gap-2">
                  <h3 className="text-xs font-medium text-muted-foreground">
                    Install with the shadcn CLI
                  </h3>
                  <CommandPanel
                    value={pageInstallCommand(encoded)}
                    label="Copy install command"
                    event="Page builder copy install"
                  />
                </section>
              ) : null}
              {pro ? (
                <section className="flex flex-col gap-2">
                  <h3 className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <IconLock aria-hidden="true" className="size-3.5" />
                    Pro blocks, with a Pro token
                  </h3>
                  <CommandPanel
                    value={pro}
                    label="Copy Pro install command"
                    event="Page builder copy pro install"
                  />
                  <p className="text-xs text-pretty text-muted-foreground">
                    Locked sections export as placeholders.{" "}
                    <Link
                      href="/pricing"
                      className="rounded-sm text-foreground underline decoration-foreground/30 underline-offset-4 outline-none hover:decoration-foreground focus-visible:ring-3 focus-visible:ring-focus-ring"
                      onClick={() => track("Page builder unlock", { from: "export" })}
                    >
                      Unlock with Pro
                    </Link>{" "}
                    to install the real blocks.
                  </p>
                </section>
              ) : null}
              <section className="flex min-w-0 flex-col gap-2">
                <h3 className="text-xs font-medium text-muted-foreground">
                  Or copy the files
                </h3>
                <div className="grid min-h-0 min-w-0 overflow-hidden rounded-lg inset-ring-(length:--hairline) inset-ring-border md:grid-cols-[13rem_minmax(0,1fr)] forced-colors:border">
                  <ul
                    aria-label="Files"
                    className="flex gap-px overflow-x-auto border-b bg-muted/30 p-1 [scrollbar-width:thin] md:max-h-[min(24rem,48svh)] md:flex-col md:overflow-y-auto md:border-e md:border-b-0 dark:bg-muted/20"
                  >
                    {result.files.map((item, index) => (
                      <li key={item.path} className="shrink-0">
                        <button
                          type="button"
                          aria-current={item === file ? "true" : undefined}
                          onClick={() => setActive(index)}
                          className="flex h-7 w-full cursor-pointer items-center gap-1.5 rounded-md px-2 text-start font-mono text-xs whitespace-nowrap text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-focus-ring aria-current:bg-background aria-current:text-foreground aria-current:inset-ring-(length:--hairline) aria-current:inset-ring-border pointer-coarse:h-9 forced-colors:aria-current:outline-2 forced-colors:aria-current:-outline-offset-2 forced-colors:aria-current:outline-solid"
                        >
                          <IconFileCode aria-hidden="true" className="size-3.5 shrink-0" />
                          <span className="truncate">{fileName(item.path)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  {file ? (
                    <div className="flex min-w-0 flex-col">
                      <div className="flex h-9 items-center justify-between gap-2 border-b ps-3 pe-1">
                        <p className="truncate font-mono text-xs text-muted-foreground">
                          {file.path}
                        </p>
                        <DocsCopyButton
                          value={file.content}
                          label={`Copy ${file.path}`}
                          event="Page builder copy file"
                        />
                      </div>
                      <pre className="max-h-[min(21.75rem,40svh)] min-h-48 overflow-auto p-3 font-mono text-xs/5 [scrollbar-width:thin]">
                        <code>{file.content}</code>
                      </pre>
                    </div>
                  ) : null}
                </div>
              </section>
              {components ? (
                <details className="text-sm">
                  <summary className="w-fit cursor-pointer rounded-sm text-xs text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-focus-ring">
                    Copying files by hand? Install the components first
                  </summary>
                  <div className="mt-2">
                    <CommandPanel
                      value={components}
                      label="Copy components command"
                      event="Page builder copy components"
                    />
                  </div>
                </details>
              ) : null}
            </div>
          </DialogBody>
        ) : null}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              if (file) download(fileName(file.path), file.content, "text/plain")
            }}
          >
            Download {file ? fileName(file.path) : "file"}
          </Button>
          <Button onClick={downloadZip}>
            <IconDownload data-icon="inline-start" />
            Download .zip
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { ExportDialog }
