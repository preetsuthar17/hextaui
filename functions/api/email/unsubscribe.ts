import { eq } from "drizzle-orm"

import type { AuthEnv } from "@/lib/auth"
import { getDb, schema } from "@/lib/db"
import { verifyUnsubscribe } from "@/lib/email/unsubscribe"
import { apiError } from "@/lib/api-error"
import { siteUrl } from "@/lib/site"

type Context = {
  request: Request
  env: AuthEnv
}

function invalidLink() {
  return apiError("bad_request", {
    error: "This unsubscribe link isn’t valid",
    detail: "The link is incomplete or its signature doesn’t match.",
    resolution: `Turn emails off in ${siteUrl}/account instead.`,
  })
}

export function onRequestGet({ request }: Context) {
  const { search } = new URL(request.url)
  return Response.redirect(`${siteUrl}/unsubscribe${search}`, 303)
}

export async function onRequestPost({ request, env }: Context) {
  const params = new URL(request.url).searchParams
  const userId = params.get("u")
  const token = params.get("t")
  if (
    !userId ||
    !token ||
    !(await verifyUnsubscribe(env.BETTER_AUTH_SECRET, userId, token))
  ) {
    return invalidLink()
  }

  const body = request.headers.get("content-type")?.includes("json")
    ? ((await request.json().catch(() => ({}))) as { subscribed?: unknown })
    : {}
  const subscribed = body.subscribed === true

  await getDb(env.DB)
    .update(schema.user)
    .set({ unsubscribedAt: subscribed ? null : new Date() })
    .where(eq(schema.user.id, userId))

  return Response.json(
    { subscribed },
    { headers: { "cache-control": "no-store" } }
  )
}
