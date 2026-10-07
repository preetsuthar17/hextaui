import { describe, expect, it } from "vitest"

import { apiError, apiNotFound, signInError } from "@/lib/api-error"
import { accessError } from "@/lib/pro/access"

describe("apiError", () => {
  it("returns RFC 9457 problem details with a resolution", async () => {
    const response = apiError("token_limit", {
      error: "Delete a token before creating another",
      detail: "An account can hold at most 10 API tokens.",
      resolution: "Delete one first.",
    })
    expect(response.status).toBe(400)
    expect(response.headers.get("content-type")).toBe(
      "application/problem+json"
    )
    expect(await response.json()).toEqual({
      type: "https://hextaui.com/docs/api#errors-token-limit",
      title: "Token limit reached",
      status: 400,
      code: "token_limit",
      detail: "An account can hold at most 10 API tokens.",
      resolution: "Delete one first.",
      docs: "https://hextaui.com/docs/api#errors",
      error: "Delete a token before creating another",
    })
  })

  it("keeps the messages the account page and shadcn CLI show", async () => {
    expect((await signInError().json()).error).toBe("Sign in first")
    const unauthorized = accessError({ status: "anonymous" })!
    expect(unauthorized.status).toBe(401)
    expect(await unauthorized.json()).toMatchObject({
      error: "Unauthorized",
      message: expect.stringContaining("HEXTAUI_PRO_TOKEN"),
      code: "unauthorized",
    })
    const forbidden = accessError({ status: "free", userId: "u" })!
    expect(forbidden.status).toBe(403)
    expect((await forbidden.json()).code).toBe("pro_required")
  })

  it("names the path in not-found errors", async () => {
    const body = await apiNotFound("/api/nope").json()
    expect(body.detail).toContain("/api/nope")
    expect(body.status).toBe(404)
  })
})
