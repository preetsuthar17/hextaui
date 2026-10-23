import { fromBase64Url, toBase64Url } from "@/lib/base64url"
import { siteUrl } from "@/lib/site"

const encoder = new TextEncoder()

function importKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  )
}

function message(userId: string) {
  return encoder.encode(`unsubscribe:${userId}`)
}

async function signUnsubscribe(secret: string, userId: string) {
  const key = await importKey(secret)
  const signature = await crypto.subtle.sign("HMAC", key, message(userId))
  return toBase64Url(new Uint8Array(signature))
}

async function verifyUnsubscribe(
  secret: string,
  userId: string,
  token: string
) {
  const signature = fromBase64Url(token)
  if (!signature) return false
  const key = await importKey(secret)
  return crypto.subtle.verify("HMAC", key, signature, message(userId))
}

async function unsubscribeLinks(secret: string, userId: string) {
  const query = new URLSearchParams({
    u: userId,
    t: await signUnsubscribe(secret, userId),
  })
  return {
    page: `${siteUrl}/unsubscribe?${query}`,
    oneClick: `${siteUrl}/api/email/unsubscribe?${query}`,
  }
}

export { signUnsubscribe, unsubscribeLinks, verifyUnsubscribe }
