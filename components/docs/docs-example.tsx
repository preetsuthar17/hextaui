import * as React from "react"
import { cn } from "cn"

import { DocsCodePanel } from "@/components/docs/docs-code-panel"
import { DocsDeferredPreview } from "@/components/docs/docs-deferred-preview"
import { DocsSection } from "@/components/docs/docs-content"
import { readDocsSource } from "@/lib/docs-source"
import { highlight } from "@/lib/highlight"

function DocsPreview({
  className,
  deferred = false,
  children,
}: {
  className?: string
  deferred?: boolean
  children: React.ReactNode
}) {
  const previewClassName = cn(
    "flex min-h-72 min-w-0 items-center justify-center p-6 sm:p-10",
    className
  )

  if (deferred) {
    return (
      <DocsDeferredPreview className={previewClassName}>
        {children}
      </DocsDeferredPreview>
    )
  }

  return <div className={previewClassName}>{children}</div>
}

async function DocsExample({
  file,
  title,
  description,
  level = 3,
  previewClassName,
  children,
}: {
  file: string
  title?: string
  description?: React.ReactNode
  level?: 2 | 3
  previewClassName?: string
  children: React.ReactNode
}) {
  const code = (
    await readDocsSource(`components/examples/${file}.tsx`)
  ).trimEnd()
  const html = await highlight(code)
  const collapsible = code.split("\n").length > 8

  const frame = (
    <div className="min-w-0 overflow-hidden rounded-xl border">
      <DocsPreview className={previewClassName} deferred={Boolean(title)}>
        {children}
      </DocsPreview>
      <DocsCodePanel
        html={html}
        collapsible={collapsible}
        className="border-t bg-muted"
      />
    </div>
  )

  if (!title) {
    return <div className="mt-8">{frame}</div>
  }

  return (
    <DocsSection title={title} description={description} level={level}>
      {frame}
    </DocsSection>
  )
}

export { DocsExample, DocsPreview }
