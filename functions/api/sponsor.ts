import { getDb } from "@/lib/db"
import { isSameOrigin } from "@/lib/origin"
import { parseSponsorInput } from "@/lib/sponsor"
import {
  isSponsorSlotTaken,
  startSponsorCheckout,
  type SponsorEnv,
} from "@/lib/sponsor-server"
import { apiError, sameOriginError } from "@/lib/api-error"
import { siteContactEmail } from "@/lib/site"

type Context = {
  request: Request
  env: SponsorEnv
}

export async function onRequestPost({ request, env }: Context) {
  if (!isSameOrigin(request, env.BETTER_AUTH_URL)) {
    return sameOriginError()
  }

  if (!env.DODO_SPONSOR_PRODUCT_ID) {
    return apiError("not_found", {
      error: "Sponsorships aren’t open yet",
      detail: "The sponsor slot isn’t on sale yet.",
      resolution: `Email ${siteContactEmail} to book it.`,
    })
  }

  const parsed = parseSponsorInput(await request.json().catch(() => null))
  if (!parsed.ok) {
    return apiError("bad_request", {
      error: parsed.error,
      detail: parsed.error,
      resolution:
        "Send name, headline, description, cta, an https url and a contact email within their length limits.",
    })
  }

  const db = getDb(env.DB)
  if (await isSponsorSlotTaken(db)) {
    return apiError("sponsor_slot_taken", {
      error: "The sponsor slot is booked",
      detail: "Another brand holds the sponsor slot right now.",
      resolution: `Email ${siteContactEmail} to get the next opening.`,
    })
  }

  const url = await startSponsorCheckout(env, db, parsed.input)
  return Response.json({ url })
}
