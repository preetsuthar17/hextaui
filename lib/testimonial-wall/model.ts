import { normalizeFrame, type WallFrame } from "@/lib/testimonial-wall/frame"

const testimonialSources = ["x", "linkedin", "producthunt", "web"] as const
const wallLayouts = [
  "masonry",
  "grid",
  "marquee",
  "carousel",
  "featured",
] as const
const cardStyles = ["plain", "hairline", "filled"] as const
const wallAccents = [
  "neutral",
  "primary",
  "info",
  "success",
  "warning",
] as const
const wallRadii = ["none", "sm", "md", "lg", "xl"] as const
const wallColumns = [1, 2, 3] as const
const wallRows = [1, 2] as const
const wallFields = ["avatar", "handle", "source", "date", "rating"] as const

type TestimonialSource = (typeof testimonialSources)[number]
type WallLayout = (typeof wallLayouts)[number]
type CardStyle = (typeof cardStyles)[number]
type WallAccent = (typeof wallAccents)[number]
type WallRadius = (typeof wallRadii)[number]
type WallColumns = (typeof wallColumns)[number]
type WallRows = (typeof wallRows)[number]
type WallField = (typeof wallFields)[number]

type Testimonial = {
  name: string
  handle?: string
  role?: string
  avatarUrl?: string
  body: string
  source?: TestimonialSource
  url?: string
  date?: string
  rating?: number
}

type WallOptions = {
  layout: WallLayout
  columns: WallColumns
  rows: WallRows
  cardStyle: CardStyle
  accent: WallAccent
  radius: WallRadius
  show: Record<WallField, boolean>
  featured: number
}

type WallState = {
  testimonials: Testimonial[]
  options: WallOptions
  frame?: WallFrame
}

const wallLimits = {
  testimonials: 60,
  name: 80,
  handle: 40,
  role: 80,
  body: 1000,
  url: 500,
} as const

const defaultWallOptions: WallOptions = {
  layout: "masonry",
  columns: 3,
  rows: 2,
  cardStyle: "hairline",
  accent: "warning",
  radius: "md",
  show: { avatar: true, handle: true, source: true, date: false, rating: true },
  featured: 0,
}

const sourceLabels: Record<TestimonialSource, string> = {
  x: "X",
  linkedin: "LinkedIn",
  producthunt: "Product Hunt",
  web: "Website",
}

const layoutLabels: Record<WallLayout, string> = {
  masonry: "Masonry",
  grid: "Grid",
  marquee: "Marquee",
  carousel: "Carousel",
  featured: "Featured",
}

const cardStyleLabels: Record<CardStyle, string> = {
  plain: "Plain",
  hairline: "Hairline",
  filled: "Filled",
}

const accentLabels: Record<WallAccent, string> = {
  neutral: "Neutral",
  primary: "Primary",
  info: "Blue",
  success: "Green",
  warning: "Amber",
}

const radiusLabels: Record<WallRadius, string> = {
  none: "None",
  sm: "Small",
  md: "Medium",
  lg: "Large",
  xl: "Extra large",
}

const fieldLabels: Record<WallField, string> = {
  avatar: "Avatar",
  handle: "Handle or role",
  source: "Source icon",
  date: "Date",
  rating: "Rating",
}

const radiusValues: Record<WallRadius, string> = {
  none: "0rem",
  sm: "0.4rem",
  md: "0.8rem",
  lg: "1.1rem",
  xl: "1.5rem",
}

function isOneOf<T extends string | number>(
  values: readonly T[],
  value: unknown
): value is T {
  return values.includes(value as T)
}

function cleanText(value: unknown, limit: number, multiline = false) {
  if (typeof value !== "string" && typeof value !== "number") return undefined
  const raw = String(value).replace(/\r\n?/g, "\n")
  const text = multiline
    ? raw
        .split("\n")
        .map((line) => line.replace(/[^\S\n]+/g, " ").trim())
        .join("\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
    : raw.replace(/\s+/g, " ").trim()
  if (!text) return undefined
  return [...text].slice(0, limit).join("")
}

function cleanUrl(value: unknown) {
  const text = cleanText(value, wallLimits.url)
  if (!text) return undefined
  try {
    const url = new URL(text)
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : undefined
  } catch {
    return undefined
  }
}

function cleanHandle(value: unknown) {
  const text = cleanText(value, wallLimits.handle + 1)
  if (!text) return undefined
  const handle = text.replace(/^@+/, "").replace(/[^\p{L}\p{N}_.-]/gu, "")
  return handle ? handle.slice(0, wallLimits.handle) : undefined
}

function cleanDate(value: unknown) {
  const text = cleanText(value, 40)
  if (!text) return undefined
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(text)
  const parsed = iso ? null : new Date(text)
  const date = iso
    ? new Date(Date.UTC(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3])))
    : new Date(
        Date.UTC(parsed!.getFullYear(), parsed!.getMonth(), parsed!.getDate())
      )
  if (Number.isNaN(date.getTime())) return undefined
  const year = date.getUTCFullYear()
  if (year < 1990 || year > 2100) return undefined
  return date.toISOString().slice(0, 10)
}

function cleanRating(value: unknown) {
  const number = typeof value === "string" ? Number.parseFloat(value) : value
  if (typeof number !== "number" || !Number.isFinite(number)) return undefined
  const rating = Math.round(number)
  return rating >= 1 && rating <= 5 ? rating : undefined
}

function sourceFromUrl(url: string | undefined): TestimonialSource | undefined {
  if (!url) return undefined
  const host = new URL(url).hostname.replace(/^www\./, "")
  if (host === "x.com" || host.endsWith("twitter.com")) return "x"
  if (host.endsWith("linkedin.com")) return "linkedin"
  if (host.endsWith("producthunt.com")) return "producthunt"
  return "web"
}

function cleanSource(value: unknown, url: string | undefined) {
  const text = cleanText(value, 20)
    ?.toLowerCase()
    .replace(/[^a-z]/g, "")
  if (text === "twitter") return "x"
  if (isOneOf(testimonialSources, text)) return text
  return sourceFromUrl(url)
}

const aliases: Record<keyof Testimonial, string[]> = {
  name: ["name", "author", "fullname", "authorname", "customer", "user"],
  handle: ["handle", "username", "twitter", "x", "screenname"],
  role: ["role", "title", "position", "company", "jobtitle", "tagline"],
  avatarUrl: ["avatarurl", "avatar", "image", "photo", "picture", "imageurl"],
  body: [
    "body",
    "text",
    "quote",
    "content",
    "testimonial",
    "message",
    "review",
  ],
  source: ["source", "platform", "network"],
  url: ["url", "link", "permalink", "href"],
  date: ["date", "createdat", "created", "publishedat", "time"],
  rating: ["rating", "stars", "score"],
}

function normalizeKey(key: string) {
  return key.toLowerCase().replace(/[^a-z]/g, "")
}

function fieldForKey(key: string) {
  const normalized = normalizeKey(key)
  return (Object.keys(aliases) as (keyof Testimonial)[]).find((field) =>
    aliases[field].includes(normalized)
  )
}

function pick(record: Record<string, unknown>) {
  const values: Partial<Record<keyof Testimonial, unknown>> = {}
  for (const [key, value] of Object.entries(record)) {
    const field = fieldForKey(key)
    if (field && values[field] === undefined && value !== "") {
      values[field] = value
    }
  }
  return values
}

function normalizeTestimonial(input: unknown): Testimonial | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null
  const values = pick(input as Record<string, unknown>)
  const body = cleanText(values.body, wallLimits.body, true)
  const name = cleanText(values.name, wallLimits.name)
  if (!body || !name) return null
  const url = cleanUrl(values.url)
  const testimonial: Testimonial = { name, body }
  const handle = cleanHandle(values.handle)
  const role = cleanText(values.role, wallLimits.role)
  const avatarUrl = cleanUrl(values.avatarUrl)
  const source = cleanSource(values.source, url)
  const date = cleanDate(values.date)
  const rating = cleanRating(values.rating)
  if (handle) testimonial.handle = handle
  if (role) testimonial.role = role
  if (avatarUrl) testimonial.avatarUrl = avatarUrl
  if (source) testimonial.source = source
  if (url) testimonial.url = url
  if (date) testimonial.date = date
  if (rating) testimonial.rating = rating
  return testimonial
}

function normalizeOptions(input: unknown): WallOptions {
  const value =
    input && typeof input === "object"
      ? (input as Partial<Record<keyof WallOptions, unknown>>)
      : {}
  const show =
    value.show && typeof value.show === "object"
      ? (value.show as Record<string, unknown>)
      : {}
  const featured = Number(value.featured)
  return {
    layout: isOneOf(wallLayouts, value.layout)
      ? value.layout
      : defaultWallOptions.layout,
    columns: isOneOf(wallColumns, value.columns)
      ? value.columns
      : defaultWallOptions.columns,
    rows: isOneOf(wallRows, value.rows) ? value.rows : defaultWallOptions.rows,
    cardStyle: isOneOf(cardStyles, value.cardStyle)
      ? value.cardStyle
      : defaultWallOptions.cardStyle,
    accent: isOneOf(wallAccents, value.accent)
      ? value.accent
      : defaultWallOptions.accent,
    radius: isOneOf(wallRadii, value.radius)
      ? value.radius
      : defaultWallOptions.radius,
    show: Object.fromEntries(
      wallFields.map((field) => [
        field,
        typeof show[field] === "boolean"
          ? show[field]
          : defaultWallOptions.show[field],
      ])
    ) as Record<WallField, boolean>,
    featured:
      Number.isInteger(featured) &&
      featured >= 0 &&
      featured < wallLimits.testimonials
        ? featured
        : 0,
  }
}

function normalizeTestimonials(input: unknown) {
  if (!Array.isArray(input)) return []
  return input
    .map(normalizeTestimonial)
    .filter((item): item is Testimonial => item !== null)
    .slice(0, wallLimits.testimonials)
}

function normalizeWallState(input: unknown): WallState | null {
  if (!input || typeof input !== "object") return null
  const value = input as {
    testimonials?: unknown
    options?: unknown
    frame?: unknown
  }
  if (!Array.isArray(value.testimonials)) return null
  return {
    testimonials: normalizeTestimonials(value.testimonials),
    options: normalizeOptions(value.options),
    ...(value.frame === undefined
      ? {}
      : { frame: normalizeFrame(value.frame) }),
  }
}

function formatTestimonialDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`))
}

function testimonialSubtitle(testimonial: Testimonial, showHandle: boolean) {
  if (!showHandle) return undefined
  if (testimonial.handle) return `@${testimonial.handle}`
  return testimonial.role
}

export {
  accentLabels,
  cardStyleLabels,
  cardStyles,
  defaultWallOptions,
  fieldLabels,
  formatTestimonialDate,
  layoutLabels,
  normalizeOptions,
  normalizeTestimonial,
  normalizeTestimonials,
  normalizeWallState,
  radiusLabels,
  radiusValues,
  sourceFromUrl,
  sourceLabels,
  testimonialSources,
  testimonialSubtitle,
  wallAccents,
  wallColumns,
  wallFields,
  wallLayouts,
  wallLimits,
  wallRadii,
  wallRows,
  type CardStyle,
  type Testimonial,
  type TestimonialSource,
  type WallAccent,
  type WallColumns,
  type WallField,
  type WallLayout,
  type WallOptions,
  type WallRadius,
  type WallRows,
  type WallState,
}
