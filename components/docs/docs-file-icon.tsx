import { IconFileCodeFilled } from "@tabler/icons-react"
import { cn } from "cn"

const marks: Record<string, string> = {
  ts: "TS",
  tsx: "TS",
  mts: "TS",
  cts: "TS",
  js: "JS",
  jsx: "JS",
  mjs: "JS",
  cjs: "JS",
  css: "#",
  html: "<>",
  json: "{}",
  md: "MD",
  mdx: "MD",
  sh: ">_",
  bash: ">_",
  zsh: ">_",
}

function getMark(title: string, lang?: string) {
  const extension = title.split(".").pop()?.toLowerCase() ?? ""
  return marks[extension] ?? (lang ? marks[lang] : undefined)
}

function DocsFileIcon({
  title,
  lang,
  className,
}: {
  title: string
  lang?: string
  className?: string
}) {
  const mark = getMark(title, lang)

  if (!mark) {
    return (
      <IconFileCodeFilled
        aria-hidden="true"
        className={cn("size-4 shrink-0", className)}
      />
    )
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-4 shrink-0", className)}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" fill="currentColor" />
      <text
        x="12"
        y="12.5"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={mark.length > 1 ? 10 : 13}
        fontWeight={800}
        className="fill-background font-sans"
      >
        {mark}
      </text>
    </svg>
  )
}

export { DocsFileIcon }
