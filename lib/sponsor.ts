type SponsorCard = {
  name: string
  headline: string
  description: string
  cta: string
  url: string
}

type SponsorInput = SponsorCard & { email: string }

const sponsorPrice = 199
const sponsorCurrency = "USD"
const sponsorReviewDays = 1

const sponsorLimits = {
  name: 40,
  headline: 48,
  description: 140,
  cta: 18,
  url: 200,
  email: 254,
} as const

const currentSponsor: SponsorCard | null = null

const sponsorPlaceholder: SponsorCard = {
  name: "HextaUI",
  headline: "Put your product in front of shadcn/ui developers",
  description: `One sponsor at a time, on every docs and blocks page. $${sponsorPrice} a month, cancel anytime.`,
  cta: "Become a sponsor",
  url: "/sponsor",
}

function sponsorHref(url: string) {
  if (url.startsWith("/")) return url
  const href = new URL(url)
  href.searchParams.set("utm_source", "hextaui")
  href.searchParams.set("utm_medium", "sponsor")
  return href.href
}

function isHttpsUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === "https:" && url.hostname.includes(".")
  } catch {
    return false
  }
}

function parseSponsorInput(
  body: unknown
): { ok: true; input: SponsorInput } | { ok: false; error: string } {
  const source = (body ?? {}) as Record<string, unknown>
  const read = (key: keyof SponsorInput) =>
    typeof source[key] === "string" ? source[key].trim() : ""
  const input: SponsorInput = {
    name: read("name"),
    headline: read("headline"),
    description: read("description"),
    cta: read("cta"),
    url: read("url"),
    email: read("email"),
  }

  for (const key of Object.keys(sponsorLimits) as (keyof SponsorInput)[]) {
    if (!input[key]) return { ok: false, error: `${key} is required.` }
    if (input[key].length > sponsorLimits[key]) {
      return {
        ok: false,
        error: `${key} must be ${sponsorLimits[key]} characters or fewer.`,
      }
    }
  }
  if (!isHttpsUrl(input.url)) {
    return { ok: false, error: "url must be an https:// link." }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    return { ok: false, error: "email must be a valid email address." }
  }
  return { ok: true, input }
}

export {
  currentSponsor,
  parseSponsorInput,
  sponsorCurrency,
  sponsorHref,
  sponsorLimits,
  sponsorPlaceholder,
  sponsorPrice,
  sponsorReviewDays,
  type SponsorCard,
  type SponsorInput,
}
