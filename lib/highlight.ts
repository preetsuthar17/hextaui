import {
  createJavaScriptRegexEngine,
  getSingletonHighlighter,
  hastToHtml,
  type BundledLanguage,
  type ShikiTransformer,
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

const plainToken = "--shiki-light:#1F2328;--shiki-dark:#E6EDF3"

const tokenClasses: Record<string, string> = {
  "--shiki-light:#CF222E;--shiki-dark:#FF7B72": "hk",
  "--shiki-light:#0A3069;--shiki-dark:#A5D6FF": "hs",
  "--shiki-light:#0550AE;--shiki-dark:#79C0FF": "hc",
  "--shiki-light:#8250DF;--shiki-dark:#D2A8FF": "hf",
  "--shiki-light:#116329;--shiki-dark:#7EE787": "ht",
  "--shiki-light:#116329;--shiki-light-font-weight:bold;--shiki-dark:#7EE787;--shiki-dark-font-weight:bold":
    "ht",
  "--shiki-light:#953800;--shiki-dark:#FFA657": "hv",
  "--shiki-light:#6E7781;--shiki-dark:#8B949E": "hm",
}

type LineNode = Parameters<NonNullable<ShikiTransformer["line"]>>[0]

type TokenNode = LineNode["children"][number]

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

function compactToken(node: TokenNode): TokenNode[] {
  if (node.type !== "element" || node.tagName !== "span") {
    return [node]
  }

  const style = node.properties.style

  if (style === plainToken) {
    return node.children
  }

  const token = typeof style === "string" ? tokenClasses[style] : undefined

  if (token) {
    node.properties = { class: token }
  }

  return [node]
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

  const tree = highlighter.codeToHast(source, {
    lang,
    themes,
    defaultColor: false,
    transformers: [
      {
        pre(node) {
          node.properties = {
            class: "shiki",
            tabindex: "0",
            ...(lineNumbers
              ? {
                  "data-line-numbers": "",
                  style: `--code-digits:${digits}ch`,
                }
              : {}),
          }
        },
        line(node, line) {
          node.children = node.children.flatMap(compactToken)
          if (highlighted.has(line)) {
            node.properties["data-highlighted"] = ""
          }
        },
      },
    ],
  })

  return hastToHtml(tree, {
    preferUnquoted: true,
    characterReferences: { useShortestReferences: true },
  })
}

export { highlight }
export type { HighlightOptions }
