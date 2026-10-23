import { getAuth } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { isSameOrigin } from "@/lib/origin"
import {
  checkoutProduct,
  findProAccess,
  getPayments,
  type PaymentsEnv,
} from "@/lib/payments"
import { checkoutReturnUrl, createClaim } from "@/lib/purchase-claim"
import { isProPlanId, planRank } from "@/lib/pro/pricing"
import { apiError, sameOriginError } from "@/lib/api-error"

type Context = {
  request: Request
  env: PaymentsEnv
}

export async function onRequestPost({ request, env }: Context) {
  if (!isSameOrigin(request, env.BETTER_AUTH_URL)) {
    return sameOriginError()
  }

  const body = (await request.json().catch(() => ({}))) as { plan?: unknown }
  const plan = body.plan ?? "solo"
  if (!isProPlanId(plan)) {
    return apiError("bad_request", {
      error: "Unknown plan",
      detail: "The plan must be solo, team or unlimited.",
      resolution:
        'Send { "plan": "solo" }, { "plan": "team" } or { "plan": "unlimited" }.',
    })
  }

  const session = await getAuth(env).api.getSession({
    headers: request.headers,
  })
  const user = session?.user ?? null

  if (user) {
    const access = await findProAccess(getDb(env.DB), user.id)
    if (access && planRank[access.plan] >= planRank[plan]) {
      return Response.json({ url: "/account" })
    }
  }

  const productId = checkoutProduct(env, plan)
  if (!productId) {
    return apiError("not_found", {
      error: "This plan isn't on sale yet",
      detail: `The ${plan} plan has no product configured for checkout.`,
      resolution: "Choose another plan, or email hi@hextaui.com.",
    })
  }

  const claim = await createClaim(env.BETTER_AUTH_SECRET)
  const checkout = await getPayments(env).checkoutSessions.create({
    product_cart: [{ product_id: productId, quantity: 1 }],
    ...(user ? { customer: { email: user.email, name: user.name } } : {}),
    metadata: user
      ? { user_id: user.id, plan, claim: claim.nonce }
      : { plan, claim: claim.nonce },
    return_url: checkoutReturnUrl(env.BETTER_AUTH_URL, claim.token),
  })

  return Response.json({ url: checkout.checkout_url })
}
