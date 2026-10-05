import * as React from "react"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it } from "vitest"

import { Bubble, BubbleContent } from "./bubble"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "./message"

afterEach(() => {
  cleanup()
})

function slot(name: string) {
  return document.querySelector<HTMLElement>(`[data-slot="${name}"]`)!
}

describe("Message", () => {
  it("renders parts and passes its alignment to bubbles", () => {
    render(
      <Message align="end">
        <MessageAvatar>MO</MessageAvatar>
        <MessageContent>
          <MessageHeader>Mira</MessageHeader>
          <Bubble>
            <BubbleContent>Hello</BubbleContent>
          </Bubble>
          <Bubble align="start">
            <BubbleContent>Override</BubbleContent>
          </Bubble>
          <MessageFooter>Read</MessageFooter>
        </MessageContent>
      </Message>
    )

    expect(slot("message").dataset.align).toBe("end")
    const bubbles = document.querySelectorAll<HTMLElement>("[data-slot=bubble]")
    expect(bubbles[0].dataset.align).toBe("end")
    expect(bubbles[1].dataset.align).toBe("start")
    expect(screen.getByText("Read")).toBe(slot("message-footer"))
  })

  it("defaults to start and leaves bubbles outside messages alone", () => {
    render(
      <>
        <Message>
          <Bubble>
            <BubbleContent>In</BubbleContent>
          </Bubble>
        </Message>
        <Bubble>
          <BubbleContent>Out</BubbleContent>
        </Bubble>
      </>
    )

    const bubbles = document.querySelectorAll<HTMLElement>("[data-slot=bubble]")
    expect(slot("message").dataset.align).toBe("start")
    expect(bubbles[0].dataset.align).toBe("start")
    expect(bubbles[1].dataset.align).toBe("start")
  })
})

describe("MessageGroup", () => {
  it("animates only messages added after the first render", () => {
    function Thread() {
      const [items, setItems] = React.useState(["one"])
      return (
        <>
          <button type="button" onClick={() => setItems([...items, "two"])}>
            Send
          </button>
          <MessageGroup>
            {items.map((item) => (
              <Message key={item}>
                <MessageContent>{item}</MessageContent>
              </Message>
            ))}
          </MessageGroup>
        </>
      )
    }
    render(<Thread />)

    expect(slot("message").hasAttribute("data-entering")).toBe(false)
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "Send" }))
    })
    const messages = document.querySelectorAll("[data-slot=message]")
    expect(messages[0].hasAttribute("data-entering")).toBe(false)
    expect(messages[1].hasAttribute("data-entering")).toBe(true)
  })

  it("can turn the entrance off per message", () => {
    function Thread() {
      const [show, setShow] = React.useState(false)
      return (
        <MessageGroup>
          <button type="button" onClick={() => setShow(true)}>
            Add
          </button>
          {show && (
            <Message animated={false}>
              <MessageContent>quiet</MessageContent>
            </Message>
          )}
        </MessageGroup>
      )
    }
    render(<Thread />)
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "Add" }))
    })
    expect(slot("message").hasAttribute("data-entering")).toBe(false)
  })

  it("server renders without entrance state", () => {
    const html = renderToString(
      <MessageGroup>
        <Message align="end">
          <MessageContent>Hi</MessageContent>
        </Message>
      </MessageGroup>
    )
    expect(html).toContain('data-slot="message-group"')
    expect(html).not.toContain("data-entering=")
  })
})
