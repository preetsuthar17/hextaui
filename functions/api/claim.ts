import { getAuth } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { isSameOrigin } from "@/lib/origin"
import { claimPurchase, type PaymentsEnv } from "@/lib/payments"
import { apiError, sameOriginError } from "@/lib/api-error"
import { siteContactEmail } from "@/lib/site"

type Context = {
  request: Request
  env: PaymentsEnv
}

const noStore = { "cache-control": "no-store" }

export async function onRequestPost({ request, env }: Context) {
  if (!isSameOrigin(request, env.BETTER_AUTH_URL)) {
    return sameOriginError()
  }

  const body = (await request.json().catch(() => ({}))) as {
    paymentId?: unknown
    token?: unknown
  }
  const { paymentId, token } = body
  if (
    typeof paymentId !== "string" ||
    !/^pay_[A-Za-z0-9]{1,64}$/.test(paymentId) ||
    typeof token !== "string" ||
    token.length > 128
  ) {
    return apiError("bad_request", {
      error: "Missing claim details",
      detail: "The paymentId or token field is missing or malformed.",
      resolution:
        "Send the payment_id and claim values from the checkout return link.",
    })
  }

  const session = await getAuth(env).api.getSession({
    headers: request.headers,
  })
  const result = await claimPurchase(env, getDb(env.DB), {
    paymentId,
    token,
    userId: session?.user.id ?? null,
  })

  if (result.status === "invalid") {
    return apiError("forbidden", {
      error: "This claim link doesn’t match the payment",
      detail: "The claim token was not issued for this payment.",
      resolution: `Use the link from your checkout or purchase email, or email ${siteContactEmail}.`,
    })
  }
  if (result.status === "not_found") {
    return apiError("not_found", {
      error: "Payment not found",
      detail: `No HextaUI Pro payment matches ${paymentId}.`,
      resolution: `Check the link, or email ${siteContactEmail} with your receipt.`,
    })
  }

  return Response.json(result, { headers: noStore })
}
