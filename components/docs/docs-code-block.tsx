import {
  IconBrandCss3,
  IconBrandHtml5,
  IconBrandJavascript,
  IconBrandTypescript,
  IconFile,
  IconJson,
  IconMarkdown,
  IconTerminal2,
  type Icon,
} from "@tabler/icons-react"
import { cn } from "cn"
import type { BundledLanguage, SpecialLanguage } from "shiki"

import { DocsCodePanel } from "@/components/docs/docs-code-panel"
import { DocsCopyButton } from "@/components/docs/docs-copy-button"
import { highlight } from "@/lib/highlight"

const collapseAfterLines = 14

const fileIcons: Record<string, Icon> = {
  ts: IconBrandTypescript,
  tsx: IconBrandTypescript,
  mts: IconBrandTypescript,
  cts: IconBrandTypescript,
  js: IconBrandJavascript,
  jsx: IconBrandJavascript,
  mjs: IconBrandJavascript,
  cjs: IconBrandJavascript,
  css: IconBrandCss3,
  html: IconBrandHtml5,
  json: IconJson,
  md: IconMarkdown,
  mdx: IconMarkdown,
  sh: IconTerminal2,
  bash: IconTerminal2,
  zsh: IconTerminal2,
}

function getFileIcon(title: string, lang: string) {
  const extension = /\.([a-z0-9]+)$/i.exec(title)?.[1]?.toLowerCase()
  return fileIcons[extension ?? lang] ?? IconFile
}

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
  const FileIcon = title ? getFileIcon(title, lang) : null

  return (
    <figure
      className={cn(
        "min-w-0 overflow-hidden rounded-xl border bg-muted",
        className
      )}
    >
      {title && FileIcon ? (
        <figcaption className="flex h-10 items-center justify-between gap-2 border-b ps-4 pe-1 font-mono text-xs text-muted-foreground">
          <span className="flex min-w-0 items-center gap-2">
            <FileIcon aria-hidden="true" className="size-4 shrink-0" />
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
