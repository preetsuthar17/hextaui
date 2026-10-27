"use client"

import * as React from "react"
import { IconDownload, IconFileCode, IconLock } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DocsCopyButton } from "@/components/docs/docs-copy-button"
import Link from "@/components/site/link"
import type { PageDoc } from "@/lib/page-builder/doc"
import {
  componentsInstallCommand,
  exportPage,
  pageInstallCommand,
  proInstallCommand,
} from "@/lib/page-builder/export"
import { createZip } from "@/lib/page-builder/zip"
import { track } from "@/lib/track"

function Command({
  label,
  value,
  event,
}: {
  label: string
  value: string
  event: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="flex items-start gap-1 rounded-md bg-muted/50 py-1 ps-3 pe-1 ring-(length:--hairline) ring-border forced-colors:border">
        <code className="min-w-0 flex-1 py-1.5 font-mono text-xs/5 break-all">
          {value}
        </code>
        <DocsCopyButton
          value={value}
          label={`Copy ${label.toLowerCase()}`}
          event={event}
        />
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
  const result = React.useMemo(
    () => (open ? exportPage(doc) : null),
    [doc, open]
  )
  const [active, setActive] = React.useState(0)
  const file = result?.files[Math.min(active, result.files.length - 1)]
  const components = result ? componentsInstallCommand(result) : null
  const pro = result ? proInstallCommand(result) : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Export page</DialogTitle>
          <DialogDescription>
            Install it into a Next.js app with one command, or copy the files.
            The code uses your HextaUI components and has no lock-in.
          </DialogDescription>
        </DialogHeader>
        {result ? (
          <div className="flex min-h-0 flex-col gap-5 overflow-y-auto px-6 pb-6">
            <div className="flex flex-col gap-4">
              {encoded ? (
                <Command
                  label="Install the page"
                  value={pageInstallCommand(encoded)}
                  event="Page builder copy install"
                />
              ) : null}
              {pro ? (
                <div className="flex flex-col gap-2">
                  <Command
                    label="Pro blocks (needs a Pro token)"
                    value={pro}
                    event="Page builder copy pro install"
                  />
                  <p className="flex items-start gap-1.5 text-xs text-pretty text-muted-foreground">
                    <IconLock
                      aria-hidden="true"
                      className="mt-px size-3.5 shrink-0"
                    />
                    <span>
                      Locked sections export as placeholders.{" "}
                      <Link
                        href="/pricing"
                        className="text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
                        onClick={() =>
                          track("Page builder unlock", { from: "export" })
                        }
                      >
                        Unlock with Pro
                      </Link>{" "}
                      to install the real blocks.
                    </span>
                  </p>
                </div>
              ) : null}
              {components ? (
                <details className="group/details text-sm">
                  <summary className="cursor-pointer rounded-sm text-xs text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-focus-ring">
                    Copying files by hand? Install the components first
                  </summary>
                  <div className="mt-3">
                    <Command
                      label="Components"
                      value={components}
                      event="Page builder copy components"
                    />
                  </div>
                </details>
              ) : null}
            </div>
            <div className="grid min-h-0 overflow-hidden rounded-lg ring-(length:--hairline) ring-border md:grid-cols-[13rem_1fr] forced-colors:border">
              <ul
                aria-label="Files"
                className="flex gap-px overflow-x-auto border-b bg-muted/30 p-1 md:flex-col md:overflow-y-auto md:border-e md:border-b-0"
              >
                {result.files.map((item, index) => (
                  <li key={item.path}>
                    <button
                      type="button"
                      aria-current={item === file ? "true" : undefined}
                      onClick={() => setActive(index)}
                      className="flex h-7 w-full cursor-pointer items-center gap-1.5 rounded-sm px-2 text-start font-mono text-xs whitespace-nowrap text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-focus-ring aria-current:bg-background aria-current:text-foreground aria-current:ring-(length:--hairline) aria-current:ring-border"
                    >
                      <IconFileCode
                        aria-hidden="true"
                        className="size-3.5 shrink-0"
                      />
                      <span className="truncate">
                        {item.path.split("/").pop()}
                      </span>
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
                  <pre className="max-h-[42svh] min-h-48 overflow-auto p-3 font-mono text-xs/5">
                    <code>{file.content}</code>
                  </pre>
                </div>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={() => {
                  const readme = [
                    "# Landing page",
                    "",
                    "Made with the HextaUI Page Builder: https://hextaui.com/tools/page-builder",
                    "",
                    "Copy `app` and `components` into a Next.js app with HextaUI set up, then install the components:",
                    "",
                    "```sh",
                    components ?? "",
                    ...(pro ? [pro] : []),
                    "```",
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
                  track("Page builder download", {
                    sections: String(doc.sections.length),
                  })
                }}
              >
                <IconDownload data-icon="inline-start" />
                Download .zip
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (file)
                    download(
                      file.path.split("/").pop() ?? "page.tsx",
                      file.content,
                      "text/plain"
                    )
                }}
              >
                Download {file?.path.split("/").pop()}
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

export { ExportDialog }
