import {
  normalizeTestimonial,
  wallLimits,
  type Testimonial,
} from "@/lib/testimonial-wall/model"

type ImportResult =
  | { ok: true; testimonials: Testimonial[]; skipped: number }
  | { ok: false; error: string }

const maxImportLength = 200_000

function parseCsvRows(text: string, delimiter: string) {
  const rows: string[][] = []
  let row: string[] = []
  let field = ""
  let quoted = false
  for (let index = 0; index < text.length; index++) {
    const char = text[index]
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') {
        field += '"'
        index++
      } else if (char === '"') {
        quoted = false
      } else {
        field += char
      }
      continue
    }
    if (char === '"' && field === "") {
      quoted = true
    } else if (char === delimiter) {
      row.push(field)
      field = ""
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[index + 1] === "\n") index++
      row.push(field)
      rows.push(row)
      row = []
      field = ""
    } else {
      field += char
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field)
    rows.push(row)
  }
  return rows.filter((cells) => cells.some((cell) => cell.trim() !== ""))
}

function detectDelimiter(header: string) {
  const counts = [",", "\t", ";"].map(
    (delimiter) => [delimiter, header.split(delimiter).length] as const
  )
  return counts.sort((a, b) => b[1] - a[1])[0][0]
}

function parseCsv(text: string) {
  const firstLine = text.split(/\r?\n/, 1)[0] ?? ""
  const [header, ...body] = parseCsvRows(text, detectDelimiter(firstLine))
  if (!header) return []
  return body.map((cells) =>
    Object.fromEntries(
      header.map((key, index) => [key.trim(), cells[index]?.trim() ?? ""])
    )
  )
}

function collect(records: unknown[]): ImportResult {
  const testimonials: Testimonial[] = []
  let skipped = 0
  for (const record of records) {
    const testimonial = normalizeTestimonial(record)
    if (testimonial && testimonials.length < wallLimits.testimonials) {
      testimonials.push(testimonial)
    } else {
      skipped++
    }
  }
  if (testimonials.length === 0) {
    return {
      ok: false,
      error:
        "No testimonials found. Each one needs a name and a body (or text, quote).",
    }
  }
  return { ok: true, testimonials, skipped }
}

function parseImport(input: string): ImportResult {
  const text = input.trim()
  if (!text) return { ok: false, error: "Paste JSON or CSV first." }
  if (text.length > maxImportLength) {
    return { ok: false, error: "That paste is too long. Keep it under 200 KB." }
  }
  if (text.startsWith("[") || text.startsWith("{")) {
    let parsed: unknown
    try {
      parsed = JSON.parse(text)
    } catch {
      return {
        ok: false,
        error: "That JSON doesn’t parse. Check for a missing comma or quote.",
      }
    }
    const list = Array.isArray(parsed)
      ? parsed
      : parsed &&
          typeof parsed === "object" &&
          Array.isArray((parsed as { testimonials?: unknown }).testimonials)
        ? (parsed as { testimonials: unknown[] }).testimonials
        : [parsed]
    return collect(list)
  }
  return collect(parseCsv(text))
}

const tweetHosts = new Set([
  "x.com",
  "www.x.com",
  "mobile.x.com",
  "twitter.com",
  "www.twitter.com",
  "mobile.twitter.com",
])

type TweetRef = { handle: string; id: string; url: string }

function parseTweetUrl(value: string): TweetRef | null {
  let url: URL
  try {
    url = new URL(value.trim())
  } catch {
    return null
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null
  if (!tweetHosts.has(url.hostname.toLowerCase())) return null
  const match =
    /^\/([A-Za-z0-9_]{1,15})\/status(?:es)?\/(\d{1,25})(?:\/|$)/.exec(
      url.pathname
    )
  if (!match) return null
  const [, handle, id] = match
  return { handle, id, url: `https://x.com/${handle}/status/${id}` }
}

function findTweetUrls(text: string) {
  const seen = new Set<string>()
  const tweets: TweetRef[] = []
  for (const candidate of text.match(/https?:\/\/[^\s"'<>]+/g) ?? []) {
    const tweet = parseTweetUrl(candidate)
    if (tweet && !seen.has(tweet.id)) {
      seen.add(tweet.id)
      tweets.push(tweet)
    }
  }
  return tweets
}

export {
  findTweetUrls,
  maxImportLength,
  parseCsv,
  parseImport,
  parseTweetUrl,
  type ImportResult,
  type TweetRef,
}
