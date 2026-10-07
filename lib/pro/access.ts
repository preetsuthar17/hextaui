import { protectedResourceMetadataUrl } from "@/lib/agent-manifests"
import { apiError } from "@/lib/api-error"
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
    ? apiError("unauthorized", {
        headers: {
          "www-authenticate": `Bearer resource_metadata="${protectedResourceMetadataUrl}"`,
        },
        error: "Unauthorized",
        message:
          "Sign in at https://hextaui.com/account, or set HEXTAUI_PRO_TOKEN to a token from that page.",
        detail: "HextaUI Pro items need a signed-in session or an API token.",
        resolution:
          "Send Authorization: Bearer <token> with a token from https://hextaui.com/account, or sign in there.",
      })
    : apiError("pro_required", {
        error: "Forbidden",
        message:
          "This block is part of HextaUI Pro. Get it at https://hextaui.com/account.",
        detail:
          "This block is part of HextaUI Pro and this account has not bought it.",
        resolution: "Buy HextaUI Pro at https://hextaui.com/account.",
      })
}

export { accessError, getAccess, type Access }
