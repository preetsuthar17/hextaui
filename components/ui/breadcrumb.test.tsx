import * as React from "react"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  Breadcrumb,
  BreadcrumbCollapse,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb"

afterEach(() => {
  cleanup()
})

function slots(container: HTMLElement, name: string) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(`[data-slot=${name}]`)
  )
}

function Trail(props: React.ComponentProps<typeof BreadcrumbCollapse>) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbCollapse {...props}>
          <BreadcrumbItem>
            <BreadcrumbLink href="/a">Alpha</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/b">Beta</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbCollapse>
        <BreadcrumbItem>
          <BreadcrumbPage>Current</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

describe("Breadcrumb", () => {
  it("renders a labelled nav with an ordered list", () => {
    render(<Trail />)

    const nav = screen.getByRole("navigation", { name: "Breadcrumb" })
    expect(nav.getAttribute("data-slot")).toBe("breadcrumb")
    expect(nav.querySelector("ol")?.getAttribute("data-slot")).toBe(
      "breadcrumb-list"
    )
  })

  it("lets the user override the nav label", () => {
    render(<Breadcrumb aria-label="You are here" />)

    expect(
      screen.getByRole("navigation", { name: "You are here" })
    ).toBeTruthy()
  })

  it("marks the current page", () => {
    render(<Trail />)

    const page = screen.getByText("Current")
    expect(page.getAttribute("aria-current")).toBe("page")
    expect(page.getAttribute("role")).toBeNull()
  })

  it("hides separators from assistive tech and flips the chevron in RTL", () => {
    const { container } = render(<Trail />)
    const separator = slots(container, "breadcrumb-separator")[0]

    expect(separator.getAttribute("aria-hidden")).toBe("true")
    expect(separator.getAttribute("role")).toBe("presentation")
    expect(separator.querySelector("svg")?.getAttribute("class")).toContain(
      "rtl:-scale-x-100"
    )
  })

  it("renders custom separator content", () => {
    const { container } = render(
      <ol>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
      </ol>
    )

    expect(slots(container, "breadcrumb-separator")[0].textContent).toBe("/")
  })

  it("supports render and composes handlers and classes", () => {
    const onClick = vi.fn()
    render(
      <BreadcrumbLink
        render={<button type="button" />}
        className="underline"
        onClick={onClick}
      >
        Go
      </BreadcrumbLink>
    )

    const button = screen.getByRole("button", { name: "Go" })
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(button.className).toContain("underline")
    expect(button.className).toContain("hover:text-foreground")
    expect(button.getAttribute("data-slot")).toBe("breadcrumb-link")
  })

  it("keeps the static ellipsis decorative", () => {
    const { container } = render(<BreadcrumbEllipsis />)
    const ellipsis = slots(container, "breadcrumb-ellipsis")[0]

    expect(ellipsis.getAttribute("aria-hidden")).toBe("true")
  })

  it("names an interactive ellipsis instead of hiding it", () => {
    render(<BreadcrumbEllipsis render={<button type="button" />} />)

    const button = screen.getByRole("button", { name: "More" })
    expect(button.hasAttribute("aria-hidden")).toBe(false)
  })

  it("server renders the collapsed state", () => {
    const html = renderToString(<Trail />)

    expect(html).toContain('data-slot="breadcrumb-collapse"')
    expect(html).toContain('aria-label="Show full path"')
    expect(html).toContain("data-collapsed")
  })
})

describe("BreadcrumbCollapse", () => {
  it("starts collapsed", () => {
    const { container } = render(<Trail />)

    const [alpha, beta] = ["Alpha", "Beta"].map((name) =>
      screen.getByText(name).closest("li")!
    )
    expect(alpha.hasAttribute("data-collapsed")).toBe(true)
    expect(beta.hasAttribute("data-collapsed")).toBe(true)
    expect(
      slots(container, "breadcrumb-collapse")[0].hasAttribute("data-collapsed")
    ).toBe(false)
  })

  it("marks every grouped separator so CSS keeps only the last one", () => {
    const { container } = render(<Trail />)
    const grouped = slots(container, "breadcrumb-separator").filter((node) =>
      node.hasAttribute("data-breadcrumb-group")
    )

    expect(grouped).toHaveLength(2)
    expect(grouped.every((node) => node.hasAttribute("data-collapsed"))).toBe(
      true
    )
    expect(grouped[1].nextElementSibling?.hasAttribute("data-collapsed")).toBe(
      false
    )
  })

  it("expands on click, reports the change and moves focus to the first revealed link", () => {
    const onOpenChange = vi.fn()
    const { container } = render(<Trail onOpenChange={onOpenChange} />)
    const trigger = screen.getByRole("button", { name: "Show full path" })

    trigger.focus()
    fireEvent.click(trigger)

    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(
      screen.getByText("Alpha").closest("li")!.hasAttribute("data-collapsed")
    ).toBe(false)
    expect(
      slots(container, "breadcrumb-collapse")[0].hasAttribute("data-collapsed")
    ).toBe(true)
    expect(document.activeElement).toBe(screen.getByText("Alpha"))
  })

  it("respects the controlled open prop", () => {
    const onOpenChange = vi.fn()
    render(<Trail open={false} onOpenChange={onOpenChange} />)

    fireEvent.click(screen.getByRole("button", { name: "Show full path" }))

    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(
      screen.getByText("Alpha").closest("li")!.hasAttribute("data-collapsed")
    ).toBe(true)
  })

  it("returns focus to the trigger when collapsed from outside", () => {
    const { rerender } = render(<Trail open />)

    screen.getByText("Beta").focus()
    rerender(<Trail open={false} />)

    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Show full path" })
    )
  })

  it("renders expanded with defaultOpen and takes the trigger out of the tab order", () => {
    const { container } = render(<Trail defaultOpen />)
    const triggerItem = slots(container, "breadcrumb-collapse")[0]

    expect(triggerItem.hasAttribute("data-collapsed")).toBe(true)
    expect(triggerItem.querySelector("button")?.tabIndex).toBe(-1)
  })

  it("accepts a custom trigger label", () => {
    render(<Trail label="Show 2 more" />)

    expect(screen.getByRole("button", { name: "Show 2 more" })).toBeTruthy()
  })

  it("animates open, reverses from the current width and settles after the exit", async () => {
    const animations: {
      element: Element
      keyframes: Keyframe[]
      cancel: ReturnType<typeof vi.fn>
      resolve: () => void
    }[] = []

    const animate = vi.fn(function (this: Element, keyframes: Keyframe[]) {
      let resolve = () => {}
      let reject: (reason: unknown) => void = () => {}
      const finished = new Promise<void>((res, rej) => {
        resolve = res
        reject = rej
      })
      const record = {
        element: this,
        keyframes,
        cancel: vi.fn(() => reject(new DOMException("cancel", "AbortError"))),
        resolve,
      }
      animations.push(record)
      return { finished, cancel: record.cancel } as unknown as Animation
    })

    Object.defineProperty(Element.prototype, "animate", {
      configurable: true,
      value: animate,
    })
    const rect = vi
      .spyOn(Element.prototype, "getBoundingClientRect")
      .mockReturnValue({ width: 40 } as DOMRect)

    try {
      const { container, rerender } = render(<Trail open={false} />)
      const alphaItem = screen.getByText("Alpha").closest("li")!
      const triggerItem = slots(container, "breadcrumb-collapse")[0]

      const trigger = screen.getByRole("button", { name: "Show full path" })
      trigger.focus()
      rerender(<Trail open />)

      expect(document.activeElement).toBe(trigger)
      const opening = animations.slice()
      expect(opening).toHaveLength(4)
      const alphaOpening = opening.find((a) => a.element === alphaItem)!
      expect(alphaOpening.keyframes[0].width).toBe("0px")
      expect(alphaOpening.keyframes[1].width).toBe("40px")
      const triggerOpening = opening.find((a) => a.element === triggerItem)!
      expect(triggerOpening.keyframes[0].width).toBe("40px")
      expect(triggerOpening.keyframes[1].width).toBe("0px")
      expect(triggerItem.hasAttribute("data-collapsed")).toBe(false)
      expect(alphaItem.style.overflow).toBe("hidden")

      rect.mockReturnValue({ width: 20 } as DOMRect)
      await act(async () => {
        rerender(<Trail open={false} />)
      })

      expect(opening.every((a) => a.cancel.mock.calls.length === 1)).toBe(true)
      const closing = animations.slice(4)
      const alphaClosing = closing.find((a) => a.element === alphaItem)!
      expect(alphaClosing.keyframes[0].width).toBe("20px")
      expect(alphaClosing.keyframes[0].opacity).toBe(1)
      expect(alphaClosing.keyframes[1].width).toBe("0px")
      expect(alphaItem.hasAttribute("data-collapsed")).toBe(false)

      await act(async () => {
        closing.forEach((a) => a.resolve())
      })

      expect(alphaItem.hasAttribute("data-collapsed")).toBe(true)
      expect(triggerItem.hasAttribute("data-collapsed")).toBe(false)
      expect(alphaItem.style.overflow).toBe("")
      expect(document.activeElement).toBe(trigger)
      expect(closing.every((a) => a.cancel.mock.calls.length === 1)).toBe(true)
    } finally {
      rect.mockRestore()
      delete (Element.prototype as { animate?: unknown }).animate
    }
  })
})
