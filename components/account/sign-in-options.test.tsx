import { act, fireEvent, render } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { SignInOptions } from "@/components/account/sign-in-options"

const mocks = vi.hoisted(() => ({ signIn: vi.fn(() => new Promise(() => {})) }))

vi.mock("@/lib/auth-client", () => ({ signIn: mocks.signIn }))

const xIphone =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/22E240 Twitter for iPhone/12.26"
const safari =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.4 Mobile/15E148 Safari/604.1"

function withUserAgent(userAgent: string) {
  vi.spyOn(navigator, "userAgent", "get").mockReturnValue(userAgent)
}

function button(name: string) {
  const match = [...document.querySelectorAll("button")].find((node) =>
    node.textContent?.includes(name)
  )
  if (!match) throw new Error(`No button ${name}`)
  return match
}

afterEach(() => {
  mocks.signIn.mockClear()
  document.body.innerHTML = ""
})

describe("SignInOptions", () => {
  it("signs in straight away in a real browser", () => {
    withUserAgent(safari)
    render(<SignInOptions />)
    fireEvent.click(button("Continue with Google"))

    expect(mocks.signIn).toHaveBeenCalledWith("google")
    expect(document.body.textContent).not.toContain("Open in your browser")
  })

  it("asks in-app browser visitors to open their browser, and still lets them continue", async () => {
    withUserAgent(xIphone)
    render(<SignInOptions openHref="https://hextaui.com/account?claim=t" />)
    await act(async () => {
      fireEvent.click(button("Continue with Google"))
    })

    expect(mocks.signIn).not.toHaveBeenCalled()
    expect(document.body.textContent).toContain("Open in your browser")
    expect(document.body.textContent).toContain("X’s in-app browser")
    const link = document.querySelector<HTMLInputElement>("input[readonly]")
    expect(link?.value).toBe("https://hextaui.com/account?claim=t")

    await act(async () => {
      fireEvent.click(button("Continue here anyway"))
    })
    expect(mocks.signIn).toHaveBeenCalledWith("google")
  })
})
