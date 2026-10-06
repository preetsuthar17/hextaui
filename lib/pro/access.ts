import { getAuth } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { findProPurchase, type PaymentsEnv } from "@/lib/payments"
import { findTokenUser } from "@/lib/pro/tokens"

type Access =
  | { status: "anonymous" }
  | { status: "free"; userId: string }
  | { status: "pro"; userId: string }

async function getAccess(env: PaymentsEnv, request: Request): Promise<Access> {
  const db = getDb(env.DB)
  const authorization = request.headers.get("authorization")
  const bearer = authorization?.match(/^Bearer\s+(\S+)$/i)?.[1]

  const userId = bearer
    ? await findTokenUser(db, bearer)
    : (await getAuth(env).api.getSession({ headers: request.headers }))?.user.id

  if (!userId) return { status: "anonymous" }
  return (await findProPurchase(db, userId))
    ? { status: "pro", userId }
    : { status: "free", userId }
}

function accessError(access: Access) {
  if (access.status === "pro") return null
  return access.status === "anonymous"
    ? Response.json(
        {
          error: "Unauthorized",
          message:
            "Sign in at https://hextaui.com/account, or set HEXTAUI_PRO_TOKEN to a token from that page.",
        },
        { status: 401 }
      )
    : Response.json(
        {
          error: "Forbidden",
          message:
            "This block is part of HextaUI Pro. Get it at https://hextaui.com/account.",
        },
        { status: 403 }
      )
}

export { accessError, getAccess, type Access }
