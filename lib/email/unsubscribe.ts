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

function toBase64Url(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "")
}

function fromBase64Url(value: string) {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) return null
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/")
  return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0))
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
