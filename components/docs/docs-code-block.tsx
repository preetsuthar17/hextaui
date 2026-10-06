import { cn } from "cn"
import type { BundledLanguage, SpecialLanguage } from "shiki"

import { DocsCodePanel } from "@/components/docs/docs-code-panel"
import { DocsCopyButton } from "@/components/docs/docs-copy-button"
import { DocsFileIcon } from "@/components/docs/docs-file-icon"
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
  const lines = source.split("\n").length

  return (
    <figure
      className={cn(
        "min-w-0 overflow-hidden rounded-xl border bg-muted",
        className
      )}
    >
      {title ? (
        <figcaption className="flex h-10 items-center justify-between gap-2 border-b ps-4 pe-1 font-mono text-xs text-muted-foreground">
          <span className="flex min-w-0 items-center gap-2">
            <DocsFileIcon title={title} lang={lang} />
            <span className="truncate">{title}</span>
          </span>
          <DocsCopyButton value={source} />
        </figcaption>
      ) : null}
      <DocsCodePanel
        html={html}
        code={source}
        collapsible={collapsible ?? lines > collapseAfterLines}
        copyable={!title}
      />
    </figure>
  )
}

export { DocsCodeBlock }
