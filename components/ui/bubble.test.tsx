import * as React from "react"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from "./bubble"

afterEach(() => {
  cleanup()
})

function slot(container: HTMLElement, name: string) {
  return container.querySelector<HTMLElement>(`[data-slot=${name}]`)!
}

describe("Bubble", () => {
  it("defaults to a default, start-aligned bubble", () => {
    const { container } = render(
      <Bubble>
        <BubbleContent>Hi</BubbleContent>
      </Bubble>
    )
    const bubble = slot(container, "bubble")

    expect(bubble.getAttribute("data-variant")).toBe("default")
    expect(bubble.getAttribute("data-align")).toBe("start")
    expect(bubble.className).toContain("max-w-[80%]")
    expect(slot(container, "bubble-content").tagName).toBe("DIV")
  })

  it.each([
    "default",
    "secondary",
    "muted",
    "tinted",
    "outline",
    "ghost",
    "destructive",
  ] as const)("renders the %s variant", (variant) => {
    const { container } = render(
      <Bubble variant={variant}>
        <BubbleContent>x</BubbleContent>
      </Bubble>
    )

    expect(slot(container, "bubble").getAttribute("data-variant")).toBe(variant)
  })

  it("lets ghost bubbles span the full row", () => {
    const { container } = render(
      <Bubble variant="ghost">
        <BubbleContent>x</BubbleContent>
      </Bubble>
    )
    const className = slot(container, "bubble").className

    expect(className).toContain("max-w-full")
    expect(className).not.toContain("max-w-[80%]")
  })

  it("pushes end-aligned bubbles to the end with logical corners", () => {
    const { container } = render(
      <Bubble align="end">
        <BubbleContent>x</BubbleContent>
      </Bubble>
    )
    const className = slot(container, "bubble").className

    expect(className).toContain("ms-auto")
    expect(className).toContain("rounded-se-(--bubble-radius-top)")
    expect(className).not.toContain("rounded-ss-")
  })

  it("keeps its data attributes when users pass conflicting ones", () => {
    const { container } = render(
      <Bubble variant="muted" data-slot="nope" data-variant="nope">
        <BubbleContent>x</BubbleContent>
      </Bubble>
    )
    const bubble = slot(container, "bubble")

    expect(bubble).not.toBeNull()
    expect(bubble.getAttribute("data-variant")).toBe("muted")
  })

  it("merges className and passes props through", () => {
    const ref = React.createRef<HTMLDivElement>()
    const { container } = render(
      <Bubble ref={ref} className="mt-2" id="b" aria-label="Message">
        <BubbleContent className="max-w-40">x</BubbleContent>
      </Bubble>
    )

    expect(ref.current).toBe(slot(container, "bubble"))
    expect(ref.current!.className).toContain("mt-2")
    expect(ref.current!.id).toBe("b")
    expect(slot(container, "bubble-content").className).toContain("max-w-40")
    expect(slot(container, "bubble-content").className).not.toContain(
      "max-w-full"
    )
  })
})

describe("Bubble shape", () => {
  it("defaults to joined", () => {
    const { container } = render(
      <Bubble>
        <BubbleContent>x</BubbleContent>
      </Bubble>
    )

    expect(slot(container, "bubble").getAttribute("data-shape")).toBe("joined")
  })

  it("inherits the shape from its group and lets a bubble override it", () => {
    const { container } = render(
      <BubbleGroup shape="tail">
        <Bubble>
          <BubbleContent>a</BubbleContent>
        </Bubble>
        <Bubble shape="uniform">
          <BubbleContent>b</BubbleContent>
        </Bubble>
      </BubbleGroup>
    )
    const bubbles = container.querySelectorAll("[data-slot=bubble]")

    expect(slot(container, "bubble-group").getAttribute("data-shape")).toBe(
      "tail"
    )
    expect(bubbles[0].getAttribute("data-shape")).toBe("tail")
    expect(bubbles[1].getAttribute("data-shape")).toBe("uniform")
  })

  it("does not leak the group shape into nested bubbles", () => {
    const { container } = render(
      <BubbleGroup shape="tail">
        <Bubble>
          <BubbleContent>
            <Bubble>
              <BubbleContent>quoted</BubbleContent>
            </Bubble>
          </BubbleContent>
        </Bubble>
      </BubbleGroup>
    )
    const bubbles = container.querySelectorAll("[data-slot=bubble]")

    expect(bubbles[0].getAttribute("data-shape")).toBe("tail")
    expect(bubbles[1].getAttribute("data-shape")).toBe("joined")
  })

  it("only joins corners in the joined shape", () => {
    const joined = render(
      <Bubble shape="joined">
        <BubbleContent>x</BubbleContent>
      </Bubble>
    )
    expect(slot(joined.container, "bubble").className).toContain(
      "--bubble-radius-joined)"
    )
    cleanup()

    const uniform = render(
      <Bubble shape="uniform">
        <BubbleContent>x</BubbleContent>
      </Bubble>
    )
    expect(slot(uniform.container, "bubble").className).not.toContain(
      "--bubble-radius-joined)]"
    )
  })

  it("draws a tail on the sender side and leaves room for it", () => {
    const start = render(
      <Bubble shape="tail">
        <BubbleContent>x</BubbleContent>
      </Bubble>
    )
    const startClass = slot(start.container, "bubble").className
    expect(startClass).toContain("[--bubble-tail:block]")
    expect(startClass).toContain("ps-(--bubble-tail-width)")
    cleanup()

    const end = render(
      <Bubble shape="tail" align="end">
        <BubbleContent>x</BubbleContent>
      </Bubble>
    )
    expect(slot(end.container, "bubble").className).toContain(
      "pe-(--bubble-tail-width)"
    )
  })

  it.each(["outline", "ghost"] as const)(
    "skips the tail for the %s variant",
    (variant) => {
      const { container } = render(
        <Bubble shape="tail" variant={variant}>
          <BubbleContent>x</BubbleContent>
        </Bubble>
      )
      const className = slot(container, "bubble").className

      expect(className).toContain("[--bubble-tail:none]")
      expect(className).not.toContain("[--bubble-tail:block]")
    }
  )
})

describe("BubbleContent", () => {
  it("has no hover or press styles", () => {
    const { container } = render(
      <Bubble>
        <BubbleContent render={<button type="button" />}>x</BubbleContent>
      </Bubble>
    )
    const className = slot(container, "bubble-content").className

    expect(className).not.toContain("hover:")
    expect(className).not.toContain("active:")
  })

  it("renders as a button and composes click handlers", () => {
    const onClick = vi.fn()
    render(
      <Bubble variant="muted">
        <BubbleContent render={<button type="button" onClick={onClick} />}>
          Reply
        </BubbleContent>
      </Bubble>
    )
    const button = screen.getByRole("button", { name: "Reply" })

    expect(button.getAttribute("data-slot")).toBe("bubble-content")
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("renders as a link with its accessible name from the text", () => {
    render(
      <Bubble>
        <BubbleContent render={<a href="/help" />}>Get help</BubbleContent>
      </Bubble>
    )

    expect(
      screen.getByRole("link", { name: "Get help" }).getAttribute("href")
    ).toBe("/help")
  })

  it("accepts a render function", () => {
    render(
      <Bubble>
        <BubbleContent render={(props) => <section {...props} />}>
          x
        </BubbleContent>
      </Bubble>
    )

    expect(
      document.querySelector("section[data-slot=bubble-content]")
    ).not.toBe(null)
  })

  it("wraps unbroken strings instead of overflowing", () => {
    const { container } = render(
      <Bubble>
        <BubbleContent>{"a".repeat(500)}</BubbleContent>
      </Bubble>
    )
    const className = slot(container, "bubble-content").className

    expect(className).toContain("wrap-anywhere")
    expect(className).toContain("min-w-0")
  })
})

describe("BubbleReactions", () => {
  it("defaults to the bottom end", () => {
    const { container } = render(
      <Bubble>
        <BubbleContent>x</BubbleContent>
        <BubbleReactions>
          <span>👍</span>
        </BubbleReactions>
      </Bubble>
    )
    const reactions = slot(container, "bubble-reactions")

    expect(reactions.getAttribute("data-side")).toBe("bottom")
    expect(reactions.getAttribute("data-align")).toBe("end")
    expect(reactions.className).toContain("me-3")
    expect(reactions.className).toContain("-mt-2.5")
  })

  it("anchors to the top start with logical margins", () => {
    const { container } = render(
      <Bubble>
        <BubbleContent>x</BubbleContent>
        <BubbleReactions side="top" align="start">
          <span>👍</span>
        </BubbleReactions>
      </Bubble>
    )
    const className = slot(container, "bubble-reactions").className

    expect(className).toContain("order-first")
    expect(className).toContain("ms-3")
    expect(className).not.toMatch(/\b(left|right)-/)
  })

  it("announces a labelled reaction row once", () => {
    render(
      <Bubble>
        <BubbleContent>x</BubbleContent>
        <BubbleReactions role="img" aria-label="Reactions: thumbs up, 8 more">
          <span>👍</span>
          <span>+8</span>
        </BubbleReactions>
      </Bubble>
    )

    expect(
      screen.getByRole("img", { name: "Reactions: thumbs up, 8 more" })
    ).not.toBeNull()
  })

  it("does not wrap a few emoji under a tiny bubble", () => {
    const { container } = render(
      <Bubble>
        <BubbleContent>ok</BubbleContent>
        <BubbleReactions>
          <span>🎉</span>
          <span>👀</span>
        </BubbleReactions>
      </Bubble>
    )

    expect(slot(container, "bubble-reactions").className).toContain("w-max")
  })
})

describe("BubbleGroup", () => {
  it("renders a group of bubbles", () => {
    const { container } = render(
      <BubbleGroup className="gap-2">
        <Bubble>
          <BubbleContent>a</BubbleContent>
        </Bubble>
        <Bubble>
          <BubbleContent>b</BubbleContent>
        </Bubble>
      </BubbleGroup>
    )
    const group = slot(container, "bubble-group")

    expect(group.children).toHaveLength(2)
    expect(group.className).toContain("gap-2")
    expect(group.className).not.toContain("gap-1")
  })

  it("server-renders without client-only APIs", () => {
    const html = renderToString(
      <BubbleGroup>
        <Bubble align="end" variant="outline">
          <BubbleContent render={<button type="button" />}>x</BubbleContent>
          <BubbleReactions>
            <span>👍</span>
          </BubbleReactions>
        </Bubble>
      </BubbleGroup>
    )

    expect(html).toContain('data-slot="bubble-group"')
    expect(html).toContain('data-align="end"')
    expect(html).toContain("<button")
  })

  it("handles many instances", () => {
    const { container } = render(
      <BubbleGroup>
        {Array.from({ length: 500 }, (_, index) => (
          <Bubble key={index} align={index % 2 ? "end" : "start"}>
            <BubbleContent>{index}</BubbleContent>
          </Bubble>
        ))}
      </BubbleGroup>
    )

    expect(container.querySelectorAll("[data-slot=bubble]")).toHaveLength(500)
  })
})
