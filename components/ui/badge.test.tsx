import * as React from "react"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Badge, BadgeClose, BadgeCount, BadgeDot } from "./badge"

afterEach(() => {
  cleanup()
})

function slot(container: HTMLElement, name: string) {
  return container.querySelector<HTMLElement>(`[data-slot=${name}]`)
}

describe("Badge", () => {
  it("defaults to an outline default badge", () => {
    const { container } = render(<Badge>New</Badge>)
    const badge = slot(container, "badge")!

    expect(badge.getAttribute("data-variant")).toBe("default")
    expect(badge.getAttribute("data-appearance")).toBe("outline")
    expect(badge.getAttribute("data-size")).toBe("default")
    expect(badge.className).toContain("inset-ring-border")
  })

  it.each([
    ["solid", "success", "bg-success"],
    ["outline", "warning", "inset-ring-border"],
    ["solid", "default", "bg-primary"],
  ] as const)("renders %s %s", (appearance, variant, expected) => {
    const { container } = render(
      <Badge appearance={appearance} variant={variant}>
        x
      </Badge>
    )

    expect(slot(container, "badge")!.className).toContain(expected)
  })

  it("wraps text in a truncating label and leaves elements alone", () => {
    const { container } = render(
      <Badge>
        <BadgeDot /> Live {3}
      </Badge>
    )
    const labels = container.querySelectorAll("[data-slot=badge-label]")

    expect(labels.length).toBeGreaterThan(0)
    expect(labels[0].className).toContain("truncate")
    expect(labels[0].id).not.toBe("")
    expect(Array.from(labels).filter((label) => label.id)).toHaveLength(1)
    expect(slot(container, "badge-dot")!.getAttribute("aria-hidden")).toBe(
      "true"
    )
  })

  it("renders as a link", () => {
    render(<Badge render={<a href="/changelog" />}>New</Badge>)

    expect(
      screen.getByRole("link", { name: "New" }).getAttribute("data-slot")
    ).toBe("badge")
  })

  it("server renders without an enter animation", () => {
    const html = renderToString(<Badge>New</Badge>)

    expect(html).toContain('data-slot="badge"')
    expect(html).not.toContain("zoom-in-90")
  })

  it("throws a helpful error for a close outside a badge", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})

    expect(() => render(<BadgeClose />)).toThrow(
      "<BadgeClose> must be used within <Badge>."
    )
    vi.restoreAllMocks()
  })
})

describe("BadgeClose", () => {
  it("is named after the badge label", () => {
    render(
      <Badge>
        design
        <BadgeClose />
      </Badge>
    )

    expect(screen.getByRole("button", { name: "Remove design" })).toBeTruthy()
  })

  it("lets aria-label override the name", () => {
    render(
      <Badge>
        design
        <BadgeClose aria-label="Delete tag" />
      </Badge>
    )

    expect(screen.getByRole("button", { name: "Delete tag" })).toBeTruthy()
  })

  it("removes an uncontrolled badge and reports it once", () => {
    const onOpenChange = vi.fn()
    const { container } = render(
      <Badge onOpenChange={onOpenChange}>
        design
        <BadgeClose />
      </Badge>
    )
    const button = screen.getByRole("button")

    fireEvent.click(button)
    fireEvent.click(button)

    expect(onOpenChange).toHaveBeenCalledTimes(1)
    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(slot(container, "badge")).toBeNull()
  })

  it("reports completion after the exit so lists can drop the item", () => {
    const events: string[] = []
    render(
      <Badge
        onOpenChange={() => events.push("change")}
        onOpenChangeComplete={() => events.push("complete")}
      >
        design
        <BadgeClose />
      </Badge>
    )

    fireEvent.click(screen.getByRole("button"))

    expect(events).toEqual(["change", "complete"])
  })

  it("moves focus when the list drops the item on completion", () => {
    function Tags() {
      const [tags, setTags] = React.useState(["one", "two", "three"])

      return (
        <div>
          {tags.map((tag) => (
            <Badge
              key={tag}
              onOpenChangeComplete={() =>
                setTags((current) => current.filter((item) => item !== tag))
              }
            >
              {tag}
              <BadgeClose />
            </Badge>
          ))}
        </div>
      )
    }

    render(<Tags />)
    const two = screen.getByRole("button", { name: "Remove two" })

    act(() => two.focus())
    fireEvent.click(two)

    expect(screen.queryByText("two")).toBeNull()
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Remove three" })
    )
  })

  it("skips removal when onClick prevents default", () => {
    const { container } = render(
      <Badge>
        design
        <BadgeClose onClick={(event) => event.preventDefault()} />
      </Badge>
    )

    fireEvent.click(screen.getByRole("button"))

    expect(slot(container, "badge")).not.toBeNull()
  })

  it.each(["Backspace", "Delete"])("removes on %s", (key) => {
    const { container } = render(
      <Badge>
        design
        <BadgeClose />
      </Badge>
    )

    fireEvent.keyDown(screen.getByRole("button"), { key })

    expect(slot(container, "badge")).toBeNull()
  })

  it("follows a controlled open prop", () => {
    function Controlled() {
      const [open, setOpen] = React.useState(true)

      return (
        <>
          <Badge open={open} onOpenChange={setOpen}>
            design
            <BadgeClose />
          </Badge>
          <button type="button" onClick={() => setOpen(true)}>
            Restore
          </button>
        </>
      )
    }

    const { container } = render(<Controlled />)

    fireEvent.click(screen.getByRole("button", { name: "Remove design" }))
    expect(slot(container, "badge")).toBeNull()

    fireEvent.click(screen.getByRole("button", { name: "Restore" }))
    expect(slot(container, "badge")).not.toBeNull()

    fireEvent.click(screen.getByRole("button", { name: "Remove design" }))
    expect(slot(container, "badge")).toBeNull()
  })

  it("moves focus to the next tag after removal", () => {
    render(
      <div>
        {["one", "two", "three"].map((tag) => (
          <Badge key={tag}>
            {tag}
            <BadgeClose />
          </Badge>
        ))}
      </div>
    )
    const two = screen.getByRole("button", { name: "Remove two" })

    act(() => two.focus())
    fireEvent.click(two)

    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Remove three" })
    )
  })

  it("moves focus to the previous tag when the last is removed", () => {
    render(
      <div>
        {["one", "two"].map((tag) => (
          <Badge key={tag}>
            {tag}
            <BadgeClose />
          </Badge>
        ))}
      </div>
    )
    const two = screen.getByRole("button", { name: "Remove two" })

    act(() => two.focus())
    fireEvent.click(two)

    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Remove one" })
    )
  })
})

describe("BadgeCount", () => {
  function shown(container: HTMLElement) {
    const flow = slot(container, "number-flow")!.cloneNode(true) as HTMLElement
    flow
      .querySelectorAll(
        "[data-slot=number-flow-column], [data-slot=number-flow-text]"
      )
      .forEach((column) => column.remove())
    return flow.textContent
  }

  it.each([
    [5, undefined, "5", "5"],
    [100, undefined, "99+", "100"],
    [1e12, 999, "999+", "1000000000000"],
    [-5, undefined, "0", "0"],
    [Number.NaN, undefined, "0", "0"],
    [3.9, undefined, "3", "3"],
    [150, Infinity, "150", "150"],
    [150, Number.NaN, "99+", "150"],
    [12345, Infinity, "12345", "12345"],
  ])("shows %s with max %s as %s", (value, max, visible, spoken) => {
    const { container } = render(<BadgeCount value={value} max={max} />)

    expect(shown(container)).toBe(visible)
    expect(
      container.querySelector(".sr-only:not([data-slot=number-flow-text])")!
        .textContent
    ).toBe(spoken)
    expect(slot(container, "number-flow")!.getAttribute("aria-hidden")).toBe(
      "true"
    )
  })

  it("keeps 99+ reading left to right inside RTL", () => {
    const { container } = render(
      <div dir="rtl">
        <BadgeCount value={500} />
      </div>
    )

    expect(slot(container, "badge-count")!.getAttribute("dir")).toBe("ltr")
  })

  it("updates the exact value while the capped text stays the same", () => {
    const { container, rerender } = render(<BadgeCount value={150} />)

    rerender(<BadgeCount value={300} />)

    expect(shown(container)).toBe("99+")
    expect(
      container.querySelector(".sr-only:not([data-slot=number-flow-text])")!
        .textContent
    ).toBe("300")
  })
})
