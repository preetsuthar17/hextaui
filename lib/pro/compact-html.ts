type CompactHtml = { head: string; runs: string }

const classToLetter: Record<string, string> = {
  hk: "k",
  hs: "s",
  hc: "c",
  hf: "f",
  ht: "t",
  hv: "v",
  hm: "m",
}

const letterToClass = Object.fromEntries(
  Object.entries(classToLetter).map(([name, letter]) => [letter, name])
)

const tail = "</code></pre>"

function escapeText(text: string) {
  return text.replace(/&/g, "&#38;").replace(/</g, "&lt;")
}

function unescapeText(text: string) {
  return text.replace(/&lt;/g, "<").replace(/&#38;/g, "&")
}

function sourceLines(code: string) {
  return code.trimEnd().split("\n")
}

function encodeLine(inner: string, source: string) {
  const runs: string[] = []
  const pattern = /<span class=(h[a-z])>([^<]*)<\/span>|([^<]+)/g
  let covered = 0
  let length = 0
  for (const match of inner.matchAll(pattern)) {
    if (match.index !== covered) return null
    covered += match[0].length
    if (match[1]) {
      const letter = classToLetter[match[1]]
      if (!letter) return null
      const text = unescapeText(match[2])
      length += text.length
      runs.push(`${letter}${text.length}`)
    } else {
      const text = unescapeText(match[3])
      length += text.length
      runs.push(String(text.length))
    }
  }
  return covered === inner.length && length === source.length
    ? runs.join(",")
    : null
}

function decodeCompactHtml(code: string, compact: CompactHtml) {
  const lines = sourceLines(code)
  const runLines = compact.runs.split("\n")
  const body = lines.map((line, index) => {
    let offset = 0
    let html = ""
    const runs = runLines[index] ? runLines[index].split(",") : []
    for (const run of runs) {
      const letter = /^[a-z]/.test(run) ? run[0] : ""
      const length = Number(letter ? run.slice(1) : run)
      const text = escapeText(line.slice(offset, offset + length))
      offset += length
      html += letter ? `<span class=${letterToClass[letter]}>${text}</span>` : text
    }
    return `<span class=line>${html}</span>`
  })
  return `${compact.head}${body.join("\n")}${tail}`
}

function encodeCompactHtml(code: string, html: string): CompactHtml | null {
  const start = html.indexOf("<code>")
  if (start === -1 || !html.endsWith(tail)) return null
  const head = html.slice(0, start + "<code>".length)
  const inner = html.slice(head.length, html.length - tail.length)
  const lineHtml = inner.split("\n")
  const lines = sourceLines(code)
  if (lineHtml.length !== lines.length) return null
  const runs: string[] = []
  for (const [index, line] of lineHtml.entries()) {
    const match = /^<span class=line>(.*)<\/span>$/.exec(line)
    if (!match) return null
    const encoded = encodeLine(match[1], lines[index])
    if (encoded === null) return null
    runs.push(encoded)
  }
  const compact = { head, runs: runs.join("\n") }
  return decodeCompactHtml(code, compact) === html ? compact : null
}

export { decodeCompactHtml, encodeCompactHtml, type CompactHtml }
