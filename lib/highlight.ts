import {
  createJavaScriptRegexEngine,
  getSingletonHighlighter,
  type BundledLanguage,
  type SpecialLanguage,
} from "shiki"

const themes = {
  light: "github-light-default",
  dark: "github-dark-default",
} as const

const specialLanguages = new Set<string>([
  "text",
  "plaintext",
  "txt",
  "plain",
  "ansi",
])

type HighlightOptions = {
  highlightLines?: string | number[]
  lineNumbers?: boolean
}

function parseLines(value: string | number[] | undefined) {
  const lines = new Set<number>()

  if (Array.isArray(value)) {
    value.forEach((line) => lines.add(line))
    return lines
  }

  value
    ?.replace(/[{}\s]/g, "")
    .split(",")
    .forEach((part) => {
      const [start, end = start] = part.split("-").map(Number)
      if (!Number.isInteger(start) || !Number.isInteger(end)) {
        return
      }
      for (let line = start; line <= end; line++) {
        lines.add(line)
      }
    })

  return lines
}

async function highlight(
  code: string,
  lang: BundledLanguage | SpecialLanguage = "tsx",
  { highlightLines, lineNumbers = false }: HighlightOptions = {}
) {
  const highlighter = await getSingletonHighlighter({
    themes: [themes.light, themes.dark],
    langs: ["tsx", "ts", "bash", "css", "json"],
    engine: createJavaScriptRegexEngine(),
  })

  if (
    !specialLanguages.has(lang) &&
    !highlighter.getLoadedLanguages().includes(lang)
  ) {
    await highlighter.loadLanguage(lang)
  }

  const source = code.trimEnd()
  const highlighted = parseLines(highlightLines)
  const digits = String(source.split("\n").length).length

  return highlighter.codeToHtml(source, {
    lang,
    themes,
    defaultColor: false,
    transformers: [
      {
        pre(node) {
          if (lineNumbers) {
            node.properties["data-line-numbers"] = ""
            node.properties.style = `${node.properties.style ?? ""};--code-digits:${digits}ch`
          }
        },
        line(node, line) {
          if (highlighted.has(line)) {
            node.properties["data-highlighted"] = ""
          }
        },
      },
    ],
  })
}

export { highlight }
export type { HighlightOptions }
