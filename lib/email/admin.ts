import { apiError } from "@/lib/api-error"

async function isEmailAdmin(request: Request, expected: string | undefined) {
  const header = request.headers.get("authorization") ?? ""
  const given = header.startsWith("Bearer ") ? header.slice(7) : ""
  if (!expected || !given) return false
  const encoder = new TextEncoder()
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(expected)),
    crypto.subtle.digest("SHA-256", encoder.encode(given)),
  ])
  const left = new Uint8Array(a)
  const right = new Uint8Array(b)
  return left.every((byte, index) => byte === right[index])
}

function emailAdminError() {
  return apiError("forbidden", {
    error: "Forbidden",
    detail: "This endpoint needs the email admin token.",
    resolution: "Send Authorization: Bearer <EMAIL_ADMIN_TOKEN>.",
  })
}

export { emailAdminError, isEmailAdmin }
