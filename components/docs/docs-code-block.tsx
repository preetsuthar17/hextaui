import { cn } from "cn"
import type { BundledLanguage, SpecialLanguage } from "shiki"

import { DocsCodePanel } from "@/components/docs/docs-code-panel"
import { highlight } from "@/lib/highlight"

const collapseAfterLines = 14

async function DocsCodeBlock({
  code,
  lang = "tsx",
  title,
  highlightLines,
  lineNumbers,
  collapsible,
  className,
}: {
  code: string
  lang?: BundledLanguage | SpecialLanguage
  title?: string
  highlightLines?: string | number[]
  lineNumbers?: boolean
  collapsible?: boolean
  className?: string
}) {
  const source = code.trimEnd()
  const html = await highlight(source, lang, { highlightLines, lineNumbers })
  const isCollapsible =
    collapsible ?? source.split("\n").length > collapseAfterLines

  if (title) {
    return (
      <DocsCodePanel
        html={html}
        title={title}
        lang={lang}
        collapsible={isCollapsible}
        className={className}
      />
    )
  }

  return (
    <figure
      className={cn(
        "min-w-0 overflow-hidden rounded-xl border bg-muted",
        className
      )}
    >
      <DocsCodePanel html={html} collapsible={isCollapsible} />
    </figure>
  )
}

export { DocsCodeBlock }
