import { apiError } from "@/lib/api-error"
import { siteUrl } from "@/lib/site"
import { parseTweetUrl } from "@/lib/testimonial-wall/import"
import {
  maxOembedBytes,
  parseTweetOembed,
  tweetOembedUrl,
} from "@/lib/testimonial-wall/oembed"

type Context = { request: Request }

const cacheSeconds = 86_400
const timeoutMs = 6_000

function badUrl(detail: string) {
  return apiError("bad_request", {
    detail,
    resolution: `Pass a post link like ?url=https://x.com/<handle>/status/<id>. Add the testimonial by hand at ${siteUrl}/tools/testimonial-wall if it still fails.`,
  })
}

function upstream(detail: string) {
  return apiError("upstream_error", {
    detail,
    resolution:
      "Try again in a minute, or paste the post text into the form by hand.",
  })
}

async function readCapped(response: Response) {
  const text = await response.text()
  return text.length > maxOembedBytes * 2 ? null : text
}

export async function onRequestGet({ request }: Context) {
  const target = new URL(request.url).searchParams.get("url")
  if (!target) return badUrl("The url query parameter is missing.")
  if (target.length > 500) return badUrl("That link is too long.")
  const tweet = parseTweetUrl(target)
  if (!tweet) {
    return badUrl("Only x.com and twitter.com post links can be imported.")
  }

  let response: Response
  try {
    response = await fetch(tweetOembedUrl(tweet), {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(timeoutMs),
      cf: { cacheTtl: cacheSeconds, cacheEverything: true },
    } as RequestInit)
  } catch {
    return upstream("X didn’t answer in time.")
  }

  if (response.status === 404 || response.status === 403) {
    return apiError("not_found", {
      detail: "That post is deleted, private or from a protected account.",
      resolution: "Check the link opens while signed out, or add it by hand.",
    })
  }
  if (!response.ok) {
    return upstream(`X returned ${response.status} for that post.`)
  }

  const text = await readCapped(response)
  let data: unknown = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = null
  }
  const testimonial = parseTweetOembed(data, tweet)
  if (!testimonial) return upstream("X sent a reply this tool can’t read.")

  return Response.json(
    { testimonial },
    {
      headers: {
        "cache-control": `public, max-age=${cacheSeconds}`,
        "x-content-type-options": "nosniff",
      },
    }
  )
}
