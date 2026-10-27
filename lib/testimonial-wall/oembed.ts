import { parseTweetUrl, type TweetRef } from "@/lib/testimonial-wall/import"
import {
  normalizeTestimonial,
  type Testimonial,
} from "@/lib/testimonial-wall/model"

const oembedEndpoint = "https://publish.x.com/oembed"
const maxOembedBytes = 64_000

const entities: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  mdash: "—",
  ndash: "–",
  hellip: "…",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
}

function decodeEntities(value: string) {
  return value.replace(
    /&(#x[0-9a-f]+|#\d+|[a-z]+);/gi,
    (match, code: string) => {
      if (code[0] === "#") {
        const point =
          code[1].toLowerCase() === "x"
            ? Number.parseInt(code.slice(2), 16)
            : Number.parseInt(code.slice(1), 10)
        return Number.isFinite(point) && point > 0 && point <= 0x10ffff
          ? String.fromCodePoint(point)
          : match
      }
      return entities[code.toLowerCase()] ?? match
    }
  )
}

function stripTags(html: string) {
  return decodeEntities(
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(
        /<a\b[^>]*>(pic\.twitter\.com\/[^<]*|https?:\/\/t\.co\/[^<]*)<\/a>/gi,
        ""
      )
      .replace(/<[^>]+>/g, "")
  )
    .replace(/[^\S\n]+/g, " ")
    .replace(/ *\n */g, "\n")
    .trim()
}

function tweetOembedUrl(tweet: TweetRef) {
  const url = new URL(oembedEndpoint)
  url.searchParams.set("url", tweet.url)
  url.searchParams.set("omit_script", "1")
  url.searchParams.set("dnt", "true")
  return url.toString()
}

function parseTweetOembed(value: unknown, tweet: TweetRef): Testimonial | null {
  if (!value || typeof value !== "object") return null
  const data = value as {
    author_name?: unknown
    author_url?: unknown
    html?: unknown
  }
  if (typeof data.html !== "string") return null
  const html = data.html.slice(0, maxOembedBytes)
  const paragraph = /<p\b[^>]*>([\s\S]*?)<\/p>/i.exec(html)?.[1]
  if (!paragraph) return null
  const author =
    typeof data.author_url === "string"
      ? parseTweetUrl(`${data.author_url}/status/${tweet.id}`)
      : null
  const links = [...html.matchAll(/<a\b[^>]*>([^<]*)<\/a>/gi)]
  const dateText = links.at(-1)?.[1]
  return normalizeTestimonial({
    name:
      typeof data.author_name === "string" && data.author_name.trim()
        ? data.author_name
        : (author?.handle ?? tweet.handle),
    handle: author?.handle ?? tweet.handle,
    body: stripTags(paragraph),
    source: "x",
    url: tweet.url,
    date: dateText ? decodeEntities(dateText) : undefined,
  })
}

export {
  decodeEntities,
  maxOembedBytes,
  oembedEndpoint,
  parseTweetOembed,
  stripTags,
  tweetOembedUrl,
}
