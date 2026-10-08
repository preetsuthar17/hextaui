import { siteUrl } from "@/lib/site"

const apiErrors = {
  bad_request: { status: 400, title: "Bad request" },
  unauthorized: { status: 401, title: "Unauthorized" },
  invalid_signature: { status: 401, title: "Invalid signature" },
  forbidden: { status: 403, title: "Forbidden" },
  pro_required: { status: 403, title: "HextaUI Pro required" },
  not_found: { status: 404, title: "Not found" },
  method_not_allowed: { status: 405, title: "Method not allowed" },
  token_limit: { status: 400, title: "Token limit reached" },
  seat_limit: { status: 400, title: "Seat limit reached" },
  team_required: { status: 403, title: "Team plan required" },
} as const

type ApiErrorCode = keyof typeof apiErrors

type ApiErrorOptions = {
  detail: string
  resolution: string
  error?: string
  message?: string
  headers?: HeadersInit
}

const apiErrorDocs = `${siteUrl}/docs/api#errors`

function apiError(
  code: ApiErrorCode,
  { detail, resolution, error, message, headers }: ApiErrorOptions
) {
  const { status, title } = apiErrors[code]
  const responseHeaders = new Headers(headers)
  responseHeaders.set("content-type", "application/problem+json")
  responseHeaders.set("cache-control", "no-store")

  return new Response(
    JSON.stringify({
      type: `${apiErrorDocs}-${code.replaceAll("_", "-")}`,
      title,
      status,
      code,
      detail,
      resolution,
      docs: apiErrorDocs,
      error: error ?? detail,
      ...(message ? { message } : {}),
    }),
    { status, headers: responseHeaders }
  )
}

function signInError() {
  return apiError("unauthorized", {
    error: "Sign in first",
    detail: "This endpoint needs a signed-in HextaUI session.",
    resolution: `Sign in with GitHub or Google at ${siteUrl}/account, then send the session cookie with the request.`,
  })
}

function sameOriginError() {
  return apiError("forbidden", {
    error: "Forbidden",
    detail: "This endpoint only accepts requests from pages on hextaui.com.",
    resolution: `Call it from ${siteUrl} with an Origin header of ${siteUrl}.`,
  })
}

function apiNotFound(pathname: string) {
  return apiError("not_found", {
    error: "Not found",
    detail: `No HextaUI API endpoint matches ${pathname}.`,
    resolution: `See ${siteUrl}/openapi.json for every endpoint, or ${siteUrl}/docs/api for the API docs.`,
  })
}

export {
  apiError,
  apiErrorDocs,
  apiErrors,
  apiNotFound,
  sameOriginError,
  signInError,
  type ApiErrorCode,
}
