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
import {
  generateWallCode,
  wallInstallCommand,
  wallNeedsIconPackage,
} from "@/lib/testimonial-wall/codegen"
import type { WallState } from "@/lib/testimonial-wall/model"
import { track } from "@/lib/track"

const fileName = "testimonial-wall.tsx"

function CodePanel({
  value,
  label,
  prompt,
  children,
}: {
  value: string
  label: string
  prompt?: boolean
  children?: React.ReactNode
}) {
  return (
    <div className="flex min-w-0 items-start rounded-lg bg-muted/50 inset-ring-(length:--hairline) inset-ring-border dark:bg-muted/30">
      <pre
        tabIndex={prompt ? undefined : 0}
        aria-label={prompt ? undefined : "Generated component"}
        data-prompt={prompt ? "" : undefined}
        className="max-h-[min(22rem,45svh)] min-w-0 flex-1 overflow-auto rounded-lg py-2.5 ps-3 font-mono text-xs/5 whitespace-pre text-foreground outline-none focus-visible:ring-3 focus-visible:ring-focus-ring data-prompt:max-h-none data-prompt:py-2"
      >
        {prompt ? (
          <span
            aria-hidden="true"
            className="text-muted-foreground select-none"
          >
            ${" "}
          </span>
        ) : null}
        <code>{value}</code>
      </pre>
      <div className="flex shrink-0 items-center p-1">
        {children}
        <DocsCopyButton
          value={value}
          label={label}
          event="Testimonial wall code"
          eventProps={{ format: label }}
        />
      </div>
    </div>
  )
}

function ExportDialog({
  open,
  onOpenChange,
  wall,
  onDownload,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  wall: WallState
  onDownload: (code: string) => void
}) {
  const code = React.useMemo(
    () =>
      generateWallCode({
        testimonials: wall.testimonials,
        options: wall.options,
      }),
    [wall.testimonials, wall.options]
  )
  const install = wallInstallCommand(wall.options)
  const icons = wallNeedsIconPackage(wall.options)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Export wall</DialogTitle>
          <DialogDescription>
            Add the components it uses, then drop the file into your project and
            render {"<TestimonialWall />"}.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div className="flex min-w-0 flex-col gap-5">
            <section className="flex flex-col gap-2">
              <h3 className="text-xs font-medium text-muted-foreground">
                1. Install with the shadcn CLI
              </h3>
              <CodePanel value={install} label="Copy install command" prompt />
              {icons ? (
                <CodePanel
                  value="npm install @tabler/icons-react"
                  label="Copy icons command"
                  prompt
                />
              ) : null}
            </section>
            <section className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-medium text-muted-foreground">
                  2. Save as{" "}
                  <code className="font-mono text-foreground">
                    components/{fileName}
                  </code>
                </h3>
              </div>
              <CodePanel value={code} label="Copy code">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Download file"
                  onClick={() => {
                    onDownload(code)
                    track("Testimonial wall download", {
                      layout: wall.options.layout,
                    })
                  }}
                >
                  <IconDownload />
                </Button>
              </CodePanel>
            </section>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}

export { ExportDialog }
