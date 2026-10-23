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

function message(nonce: string) {
  return encoder.encode(`purchase-claim:${nonce}`)
}

function isClaimNonce(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9_-]{16,64}$/.test(value)
}

async function signClaim(secret: string, nonce: string) {
  const key = await importKey(secret)
  const signature = await crypto.subtle.sign("HMAC", key, message(nonce))
  return toBase64Url(new Uint8Array(signature))
}

async function createClaim(secret: string) {
  const nonce = toBase64Url(crypto.getRandomValues(new Uint8Array(18)))
  return { nonce, token: await signClaim(secret, nonce) }
}

async function verifyClaim(secret: string, nonce: unknown, token: unknown) {
  if (!isClaimNonce(nonce) || typeof token !== "string") return false
  const signature = fromBase64Url(token)
  if (!signature) return false
  const key = await importKey(secret)
  return crypto.subtle.verify("HMAC", key, signature, message(nonce))
}

function checkoutReturnUrl(baseUrl: string, token: string) {
  const url = new URL("/account", baseUrl)
  url.searchParams.set("checkout", "done")
  url.searchParams.set("claim", token)
  return url.href
}

function claimLink(token: string, paymentId: string) {
  const url = new URL("/account", siteUrl)
  url.searchParams.set("claim", token)
  url.searchParams.set("payment_id", paymentId)
  return url.href
}

export {
  checkoutReturnUrl,
  claimLink,
  createClaim,
  isClaimNonce,
  signClaim,
  verifyClaim,
}
