import { getAuth } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { isSameOrigin } from "@/lib/origin"
import { findProPurchase, getPayments, type PaymentsEnv } from "@/lib/payments"

type Context = {
  request: Request
  env: PaymentsEnv
}

export async function onRequestPost({ request, env }: Context) {
  if (!isSameOrigin(request, env.BETTER_AUTH_URL)) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const session = await getAuth(env).api.getSession({
    headers: request.headers,
  })
  if (!session) {
    return Response.json({ error: "Sign in first" }, { status: 401 })
  }

  const { user } = session
  if (await findProPurchase(getDb(env.DB), user.id)) {
    return Response.json({ url: "/account" })
  }

  const checkout = await getPayments(env).checkoutSessions.create({
    product_cart: [{ product_id: env.DODO_PRO_PRODUCT_ID, quantity: 1 }],
    customer: { email: user.email, name: user.name },
    metadata: { user_id: user.id },
    return_url: new URL("/account?checkout=done", env.BETTER_AUTH_URL).href,
  })

  return Response.json({ url: checkout.checkout_url })
}
