import { minilyticsOrigin } from "@/lib/minilytics"

type Context = {
  request: Request & {
    cf?: { country?: string; region?: string; city?: string }
  }
}

const upstream: Record<string, string> = {
  "/stats/script.js": "/js/script.js",
  "/stats/event": "/api/event",
}

export async function onRequest({ request }: Context) {
  const path = upstream[new URL(request.url).pathname]
  if (!path) return new Response(null, { status: 404 })

  const headers = new Headers()
  for (const name of ["content-type", "user-agent", "accept-language"]) {
    const value = request.headers.get(name)
    if (value) headers.set(name, value)
  }
  const { country, region, city } = request.cf ?? {}
  if (country) {
    headers.set("x-vercel-ip-country", country)
    if (region) {
      headers.set("x-vercel-ip-country-region", encodeURIComponent(region))
    }
    if (city) headers.set("x-vercel-ip-city", encodeURIComponent(city))
  }

  const response = await fetch(new URL(path, minilyticsOrigin), {
    method: request.method,
    headers,
    body: request.method === "POST" ? request.body : undefined,
  })

  const out = new Headers(response.headers)
  out.delete("set-cookie")
  if (path === "/js/script.js") {
    out.set("cache-control", "public, max-age=3600")
  }
  return new Response(response.body, { status: response.status, headers: out })
}
