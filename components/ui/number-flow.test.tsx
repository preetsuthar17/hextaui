import * as React from "react"
import { cleanup, render } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it } from "vitest"

import { formatChars, getSpinDelta, NumberFlow } from "./number-flow"

afterEach(() => {
  cleanup()
})

function root(container: HTMLElement) {
  return container.querySelector<HTMLElement>("[data-slot=number-flow]")!
}

function readable(container: HTMLElement) {
  const clone = root(container).cloneNode(true) as HTMLElement
  clone
    .querySelectorAll(
      "[data-slot=number-flow-column], [data-slot=number-flow-text]"
    )
    .forEach((column) => column.remove())
  return clone.textContent
}

function cell(container: HTMLElement, key: string) {
  return root(container).querySelector<HTMLElement>(
    `[data-number-flow-key="${key}"]`
  )
}

function digitOf(container: HTMLElement, key: string) {
  return cell(container, key)
    ?.querySelector("[data-slot=number-flow-column]")
    ?.getAttribute("data-digit")
}

describe("NumberFlow", () => {
  it.each([
    [22, 23],
    [14, 19],
  ])("keeps unchanged digits in place for %s → %s", (from, to) => {
    const { container, rerender } = render(<NumberFlow value={from} />)
    const tens = cell(container, "i1")
    const ones = cell(container, "i0")

    rerender(<NumberFlow value={to} />)

    expect(cell(container, "i1")).toBe(tens)
    expect(cell(container, "i0")).toBe(ones)
    expect(digitOf(container, "i1")).toBe(String(Math.floor(from / 10)))
    expect(digitOf(container, "i0")).toBe(String(to % 10))
  })

  it("adds and removes places by value", () => {
    const { container, rerender } = render(<NumberFlow value={99} />)

    expect(cell(container, "i2")).toBeNull()

    rerender(<NumberFlow value={100} />)
    expect(digitOf(container, "i2")).toBe("1")
    expect(readable(container)).toBe("100")

    rerender(<NumberFlow value={99} />)
    expect(cell(container, "i2")).toBeNull()
    expect(readable(container)).toBe("99")
  })

  it("renders the formatted text for copy and screen readers", () => {
    const { container } = render(
      <NumberFlow
        value={1234567.891}
        locales="en-US"
        format={{ style: "currency", currency: "USD" }}
        prefix="≈ "
        suffix=" total"
      />
    )

    expect(readable(container)).toBe("≈ $1,234,567.89 total")
  })

  it.each([
    [0.426, { style: "percent" }, "en-US", "43%"],
    [1234.5, { maximumFractionDigits: 2 }, "de-DE", "1.234,5"],
    [-42, undefined, "en-US", "-42"],
    [1250000, { notation: "compact" }, "en-US", "1.3M"],
    [1234, undefined, "ar-EG", "١٬٢٣٤"],
  ] as const)("formats %s as %s in %s", (value, format, locales, expected) => {
    const { container } = render(
      <NumberFlow value={value} format={format} locales={locales} />
    )

    expect(readable(container)).toBe(expected)
  })

  it("uses locale digits in the spinning column", () => {
    const { container } = render(<NumberFlow value={7} locales="ar-EG" />)
    const rows = Array.from(
      cell(container, "i0")!.querySelectorAll(
        "[data-slot=number-flow-column] > span"
      )
    ).map((row) => row.textContent)

    expect(rows.slice(0, 10).join("")).toBe("٠١٢٣٤٥٦٧٨٩")
    expect(rows).toHaveLength(30)
  })

  it("keys group separators by place", () => {
    const keys = formatChars(1234567, "en-US", undefined, undefined, undefined)
      .map((char) => char.key)
      .join(" ")

    expect(keys).toBe("i6 g5 i5 i4 i3 g2 i2 i1 i0")
  })

  it.each([Number.NaN, Infinity, -Infinity, 1e21])(
    "renders %s without crashing",
    (value) => {
      const { container } = render(<NumberFlow value={value} />)

      expect(readable(container)).toBe(
        new Intl.NumberFormat("en-US").format(value)
      )
    }
  )

  it("hides the columns from assistive tech and selection", () => {
    const { container } = render(<NumberFlow value={5} />)
    const column = container.querySelector("[data-slot=number-flow-column]")!

    expect(column.getAttribute("aria-hidden")).toBe("true")
    expect(column.className).toContain("select-none")
  })

  it("server renders the resting frame", () => {
    const html = renderToString(<NumberFlow value={42} />)

    expect(html).toContain('data-digit="4"')
    expect(html).toContain('data-digit="2"')
  })

  it("passes props through", () => {
    const { container } = render(
      <NumberFlow value={1} id="count" className="text-5xl" />
    )

    expect(root(container).id).toBe("count")
    expect(root(container).className).toContain("text-5xl")
  })
})

describe("getSpinDelta", () => {
  it.each([
    [9, 1, "up", 2],
    [1, 9, "down", -2],
    [1, 9, "up", 8],
    [9, 1, "down", -8],
    [2, 3, "shortest", 1],
    [0, 9, "shortest", -1],
    [9, 0, "shortest", 1],
    [0, 5, "shortest", 5],
    [3.5, 4, "up", 0.5],
  ] as const)("%s → %s %s is %s", (from, to, trend, expected) => {
    expect(getSpinDelta(from, to, trend)).toBeCloseTo(expected)
  })

  it("keeps digits in reading order inside right-to-left text", () => {
    const { container } = render(
      <div dir="rtl">
        <NumberFlow value={1250} locales="ar-EG" />
      </div>
    )
    const root = container.querySelector("[data-slot=number-flow]")!
    expect(root.getAttribute("dir")).toBe("ltr")
  })

  it("lets callers override the direction", () => {
    const { container } = render(<NumberFlow value={5} dir="auto" />)
    expect(
      container.querySelector("[data-slot=number-flow]")!.getAttribute("dir")
    ).toBe("auto")
  })
})
