import * as React from "react"
import { cleanup, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it } from "vitest"

import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "./message-scroller"

afterEach(() => {
  cleanup()
})

function slot(name: string) {
  return document.querySelector<HTMLElement>(`[data-slot="${name}"]`)
}

function Thread({ count = 3 }: { count?: number }) {
  return (
    <MessageScrollerProvider>
      <MessageScroller>
        <MessageScrollerViewport aria-label="Conversation">
          <MessageScrollerContent>
            {Array.from({ length: count }, (_, index) => (
              <MessageScrollerItem key={index} messageId={`m${index}`}>
                Message {index}
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  )
}

describe("MessageScroller", () => {
  it("renders a labelled region with a log of messages", () => {
    render(<Thread />)

    expect(screen.getByRole("region", { name: "Conversation" })).toBe(
      slot("message-scroller-viewport")
    )
    expect(screen.getByRole("log")).toBe(slot("message-scroller-content"))
    expect(
      document.querySelectorAll("[data-slot=message-scroller-item]")
    ).toHaveLength(3)
    expect(slot("message-scroller-item")?.getAttribute("data-message-id")).toBe(
      "m0"
    )
  })

  it("keeps the jump button out of the way while there is nothing to jump to", () => {
    render(<Thread />)
    const button = slot("message-scroller-button")

    expect(button?.getAttribute("data-direction")).toBe("end")
    expect(button?.getAttribute("data-active")).toBe("false")
    expect(button?.getAttribute("tabindex")).toBe("-1")
    expect(button?.textContent).toContain("Scroll to latest")
    expect(button?.hasAttribute("data-unseen")).toBe(false)
  })

  it("server renders", () => {
    const html = renderToString(<Thread count={2} />)
    expect(html).toContain('data-slot="message-scroller"')
    expect(html).toContain('role="log"')
  })
})
