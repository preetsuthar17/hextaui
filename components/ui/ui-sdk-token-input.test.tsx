import * as React from "react"
import { cleanup, render } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it } from "vitest"

import {
  TokenInput,
  TokenInputEditor,
  TokenInputToken,
  type TokenInputValue,
} from "./ui-sdk-token-input"

afterEach(cleanup)

const draft: TokenInputValue = [
  "Explain ",
  { type: "file", value: "src/routes.ts", label: "routes.ts" },
  " now",
]

describe("UI SDK TokenInput", () => {
  it("renders each token with the default chip and a remove button", () => {
    const { container } = render(
      <TokenInput defaultValue={draft}>
        <TokenInputEditor aria-label="Prompt" />
      </TokenInput>
    )
    const token = container.querySelector("[data-slot=token-input-token]")!
    expect(token.textContent).toContain("routes.ts")
    expect(
      token.querySelector("[data-slot=token-input-token-remove] svg")
    ).not.toBeNull()
  })

  it("keeps a caller's renderToken", () => {
    const { container } = render(
      <TokenInput
        defaultValue={draft}
        renderToken={(token) => (
          <TokenInputToken data-testid="custom">{token.value}</TokenInputToken>
        )}
      >
        <TokenInputEditor aria-label="Prompt" />
      </TokenInput>
    )
    expect(container.querySelector("[data-testid=custom]")?.textContent).toBe(
      "src/routes.ts"
    )
    expect(
      container.querySelector("[data-slot=token-input-token-remove]")
    ).toBeNull()
  })

  it("marks an empty editor and exposes its placeholder", () => {
    const { container } = render(
      <TokenInput>
        <TokenInputEditor aria-label="Prompt" placeholder="Ask anything" />
      </TokenInput>
    )
    const editor = container.querySelector("[data-slot=token-input-editor]")!
    expect(editor.hasAttribute("data-empty")).toBe(true)
    expect(editor.getAttribute("aria-placeholder")).toBe("Ask anything")
  })

  it("merges a function className with the base classes", () => {
    const { container } = render(
      <TokenInput readOnly defaultValue={draft}>
        <TokenInputEditor
          aria-label="Prompt"
          className={(state) => (state.readOnly ? "is-locked" : "is-open")}
        />
      </TokenInput>
    )
    const editor = container.querySelector("[data-slot=token-input-editor]")!
    expect(editor.className).toContain("is-locked")
    expect(editor.className).toContain("rounded-md")
  })

  it("submits the codec text under its name", () => {
    const { container } = render(
      <form>
        <TokenInput name="prompt" defaultValue={draft}>
          <TokenInputEditor aria-label="Prompt" />
        </TokenInput>
      </form>
    )
    const data = new FormData(container.querySelector("form")!)
    expect(data.get("prompt")).toBe(
      "Explain [@routes.ts](file:src/routes.ts) now"
    )
  })

  it("renders on the server with its tokens", () => {
    const html = renderToString(
      <TokenInput defaultValue={draft}>
        <TokenInputEditor aria-label="Prompt" />
      </TokenInput>
    )
    expect(html).toContain('data-slot="token-input-editor"')
    expect(html).toContain("routes.ts")
  })
})
