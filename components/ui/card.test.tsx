import * as React from "react"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardLink,
  CardTitle,
} from "./card"

afterEach(() => {
  cleanup()
})

function slot(container: HTMLElement, name: string) {
  return container.querySelector<HTMLElement>(`[data-slot=${name}]`)!
}

function FullCard(props: React.ComponentProps<typeof Card>) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Title</CardTitle>
        <CardDescription>Description</CardDescription>
        <CardAction>
          <button type="button">Action</button>
        </CardAction>
      </CardHeader>
      <CardContent>Body</CardContent>
      <CardFooter>Footer</CardFooter>
    </Card>
  )
}

describe("Card", () => {
  it("renders every part with its slot", () => {
    const { container } = render(<FullCard />)

    for (const name of [
      "card",
      "card-header",
      "card-title",
      "card-description",
      "card-action",
      "card-content",
      "card-footer",
    ]) {
      expect(slot(container, name)).not.toBeNull()
    }
  })

  it("defaults to the default variant and size", () => {
    const { container } = render(<FullCard />)
    const card = slot(container, "card")

    expect(card.getAttribute("data-variant")).toBe("default")
    expect(card.getAttribute("data-size")).toBe("default")
    expect(card.className).not.toMatch(/\bshadow-(xs|sm|md)\b/)
    expect(card.hasAttribute("data-link")).toBe(false)
  })

  it.each([
    ["outline", "bg-transparent"],
    ["muted", "bg-muted"],
  ] as const)("renders the %s variant", (variant, expected) => {
    const { container } = render(<FullCard variant={variant} />)
    const className = slot(container, "card").className

    expect(className).toContain(expected)
    expect(className).not.toContain("bg-card")
  })

  it("scales spacing and radius with size", () => {
    const { container } = render(<FullCard size="sm" />)
    const className = slot(container, "card").className

    expect(className).toContain("[--card-spacing:--spacing(4)]")
    expect(className).toContain("[--card-radius:var(--radius-lg)]")
    expect(className).not.toContain("[--card-spacing:--spacing(6)]")
  })

  it("drops inner spacing when flush", () => {
    const { container } = render(<Card size="flush">Rows</Card>)
    const card = slot(container, "card")

    expect(card.getAttribute("data-size")).toBe("flush")
    expect(card.className).toContain("[--card-spacing:--spacing(0)]")
  })

  it("keeps its slot and state attributes over user props", () => {
    const { container } = render(
      <Card data-slot="nope" data-variant="nope" variant="muted" />
    )
    const card = slot(container, "card")

    expect(card).not.toBeNull()
    expect(card.getAttribute("data-variant")).toBe("muted")
  })

  it("passes refs, props and className through", () => {
    const ref = React.createRef<HTMLDivElement>()
    const { container } = render(
      <Card ref={ref} id="c" className="mt-2" aria-label="Plan" />
    )

    expect(ref.current).toBe(slot(container, "card"))
    expect(ref.current!.id).toBe("c")
    expect(ref.current!.className).toContain("mt-2")
  })

  it("renders every part as another element", () => {
    render(
      <Card render={<article />}>
        <CardHeader render={<header />}>
          <CardTitle render={<h3 />}>Heading</CardTitle>
          <CardDescription render={<p />}>Text</CardDescription>
        </CardHeader>
        <CardFooter render={<footer />}>Footer</CardFooter>
      </Card>
    )

    expect(screen.getByRole("article")).not.toBeNull()
    expect(screen.getByRole("heading", { name: "Heading" }).tagName).toBe("H3")
    expect(document.querySelector("footer[data-slot=card-footer]")).not.toBe(
      null
    )
  })

  it("lets long titles shrink next to an action", () => {
    const { container } = render(<FullCard />)

    expect(slot(container, "card-header").className).toContain(
      "grid-cols-[minmax(0,1fr)_auto]"
    )
    expect(slot(container, "card-title").className).toContain("wrap-anywhere")
    expect(slot(container, "card-title").className).toContain("min-w-0")
  })

  it("does not make the header a containing block", () => {
    const { container } = render(<FullCard />)

    expect(slot(container, "card-header").className).not.toContain("@container")
  })

  it("server-renders", () => {
    const html = renderToString(<FullCard variant="outline" size="sm" />)

    expect(html).toContain('data-slot="card"')
    expect(html).toContain('data-size="sm"')
  })
})

describe("CardLink", () => {
  it("marks its card as a link and stretches over it", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>
            <CardLink href="/projects/acme">Acme</CardLink>
          </CardTitle>
        </CardHeader>
      </Card>
    )
    const link = screen.getByRole("link", { name: "Acme" })

    expect(link.getAttribute("href")).toBe("/projects/acme")
    expect(link.getAttribute("data-slot")).toBe("card-link")
    expect(link.className).toContain("after:inset-0")
    expect(slot(container, "card").hasAttribute("data-link")).toBe(true)
  })

  it("only marks the nearest card", () => {
    const { container } = render(
      <Card>
        <CardContent>
          <Card>
            <CardTitle>
              <CardLink href="#inner">Inner</CardLink>
            </CardTitle>
          </Card>
        </CardContent>
      </Card>
    )
    const cards = container.querySelectorAll("[data-slot=card]")

    expect(cards[0].hasAttribute("data-link")).toBe(false)
    expect(cards[1].hasAttribute("data-link")).toBe(true)
  })

  it("clears the link state when the link unmounts", () => {
    function Toggle({ show }: { show: boolean }) {
      return (
        <Card>
          <CardTitle>{show ? <CardLink href="#a">A</CardLink> : "A"}</CardTitle>
        </Card>
      )
    }
    const { container, rerender } = render(<Toggle show />)

    expect(slot(container, "card").hasAttribute("data-link")).toBe(true)
    rerender(<Toggle show={false} />)
    expect(slot(container, "card").hasAttribute("data-link")).toBe(false)
  })

  it("counts several links so removing one keeps the state", () => {
    function Links({ count }: { count: number }) {
      return (
        <Card>
          {Array.from({ length: count }, (_, index) => (
            <CardLink key={index} href={`#${index}`}>
              {index}
            </CardLink>
          ))}
        </Card>
      )
    }
    const { container, rerender } = render(<Links count={2} />)

    rerender(<Links count={1} />)
    expect(slot(container, "card").hasAttribute("data-link")).toBe(true)
    rerender(<Links count={0} />)
    expect(slot(container, "card").hasAttribute("data-link")).toBe(false)
  })

  it("composes click handlers and keeps inner buttons separate", () => {
    const onOpen = vi.fn()
    const onStar = vi.fn()
    render(
      <Card>
        <CardHeader>
          <CardTitle>
            <CardLink href="#acme" onClick={onOpen}>
              Acme
            </CardLink>
          </CardTitle>
          <CardAction>
            <button type="button" onClick={onStar}>
              Star
            </button>
          </CardAction>
        </CardHeader>
      </Card>
    )

    fireEvent.click(screen.getByRole("button", { name: "Star" }))
    expect(onStar).toHaveBeenCalledTimes(1)
    expect(onOpen).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole("link", { name: "Acme" }))
    expect(onOpen).toHaveBeenCalledTimes(1)
  })

  it("works outside a card", () => {
    render(<CardLink href="#x">Loose</CardLink>)

    expect(screen.getByRole("link", { name: "Loose" })).not.toBeNull()
  })

  it("renders through a custom link component", () => {
    render(
      <Card>
        <CardLink render={<a href="/next" data-router="" />}>Next</CardLink>
      </Card>
    )
    const link = screen.getByRole("link", { name: "Next" })

    expect(link.hasAttribute("data-router")).toBe(true)
    expect(link.getAttribute("data-slot")).toBe("card-link")
  })
})
