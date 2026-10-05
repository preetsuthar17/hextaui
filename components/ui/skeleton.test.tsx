import * as React from "react"
import { act, cleanup, render } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { Skeleton, SkeletonText } from "./skeleton"

afterEach(() => {
  cleanup()
})

function skeleton(container: HTMLElement) {
  return container.querySelector<HTMLElement>("[data-slot=skeleton]")!
}

describe("Skeleton", () => {
  it("renders a hidden shimmer shape by default", () => {
    const { container } = render(<Skeleton className="h-4 w-32" />)
    const element = skeleton(container)

    expect(element.getAttribute("data-animation")).toBe("shimmer")
    expect(element.getAttribute("aria-hidden")).toBe("true")
    expect(element.className).toContain("bg-muted")
    expect(element.className).toContain("h-4")
  })

  it.each(["pulse", "none"] as const)(
    "supports the %s animation",
    (animation) => {
      const { container } = render(<Skeleton animation={animation} />)

      expect(skeleton(container).getAttribute("data-animation")).toBe(animation)
      expect(skeleton(container).className.includes("animate-shimmer")).toBe(
        false
      )
    }
  )

  it("supports the render prop", () => {
    const { container } = render(<Skeleton render={<span />} />)

    expect(skeleton(container).tagName).toBe("SPAN")
  })

  it("hides and disables wrapped content while loading", () => {
    const { container } = render(
      <Skeleton loading>
        <button type="button">Follow</button>
      </Skeleton>
    )
    const element = skeleton(container)
    const content = container.querySelector<HTMLElement>(
      "[data-slot=skeleton-content]"
    )!

    expect(element.getAttribute("aria-busy")).toBe("true")
    expect(element.hasAttribute("aria-hidden")).toBe(false)
    expect(element.className).toContain("bg-muted")
    expect(content.hasAttribute("inert")).toBe(true)
    expect(content.getAttribute("aria-hidden")).toBe("true")
    expect(content.className).toContain("invisible")
  })

  it("shows content without animation when first rendered loaded", () => {
    const { container } = render(
      <Skeleton loading={false}>
        <p>Ready</p>
      </Skeleton>
    )
    const element = skeleton(container)

    expect(element.className.includes("bg-muted")).toBe(false)
    expect(element.className.includes("fade-in-0")).toBe(false)
    expect(element.hasAttribute("aria-busy")).toBe(false)
    expect(element.hasAttribute("data-animation")).toBe(false)
  })

  it("fades content in only when loading ends", async () => {
    const { container, rerender } = render(
      <Skeleton loading>
        <p>Ready</p>
      </Skeleton>
    )

    await act(async () => {
      rerender(
        <Skeleton loading={false}>
          <p>Ready</p>
        </Skeleton>
      )
    })

    expect(skeleton(container).className).toContain("fade-in-0")
    expect(skeleton(container).className.includes("bg-muted")).toBe(false)
  })

  it("keeps the same content element across loading changes", async () => {
    const { container, rerender } = render(
      <Skeleton loading>
        <p>Ready</p>
      </Skeleton>
    )
    const before = container.querySelector("p")

    await act(async () => {
      rerender(
        <Skeleton loading={false}>
          <p>Ready</p>
        </Skeleton>
      )
    })

    expect(container.querySelector("p")).toBe(before)
  })
})

describe("Skeleton hostile usage", () => {
  it("survives rapid loading toggles and ends in the right state", async () => {
    const { container, rerender } = render(
      <Skeleton loading>
        <p>Ready</p>
      </Skeleton>
    )

    for (const loading of [false, true, false, true, true, false]) {
      await act(async () => {
        rerender(
          <Skeleton loading={loading}>
            <p>Ready</p>
          </Skeleton>
        )
      })
    }

    const element = skeleton(container)
    expect(element.getAttribute("data-loading")).toBe("false")
    expect(element.className).toContain("fade-in-0")
    expect(element.className.includes("bg-muted")).toBe(false)

    await act(async () => {
      rerender(
        <Skeleton loading>
          <p>Ready</p>
        </Skeleton>
      )
    })
    expect(skeleton(container).className).toContain("bg-muted")
    expect(skeleton(container).getAttribute("data-loading")).toBe("true")
  })

  it("clips its shimmer when rendered inline", () => {
    const { container } = render(
      <p>
        Balance{" "}
        <Skeleton loading render={<span />}>
          <strong>$12,480.00</strong>
        </Skeleton>
      </p>
    )

    expect(skeleton(container).className).toContain(
      "[&:where(span)]:inline-block"
    )
  })

  it("renders an empty wrap without crashing", () => {
    const { container } = render(<Skeleton loading />)

    expect(skeleton(container).getAttribute("aria-busy")).toBe("true")
  })

  it("never leaks transition timing into the element", () => {
    const { container } = render(<Skeleton />)
    const className = skeleton(container).className

    expect(/(^|\s|:)(duration|delay)-\d/.test(className)).toBe(false)
  })
})

describe("SkeletonText", () => {
  it("renders the requested lines with a shorter last line", () => {
    const { container } = render(<SkeletonText lines={4} />)
    const bars = container.querySelectorAll("[data-slot=skeleton]")

    expect(bars).toHaveLength(4)
    expect(bars[3].className).toContain("w-3/5")
    expect(bars[0].className).toContain("w-full")
  })

  it("clamps invalid line counts to one full line", () => {
    const { container } = render(<SkeletonText lines={-3} />)
    const bars = container.querySelectorAll("[data-slot=skeleton]")

    expect(bars).toHaveLength(1)
    expect(bars[0].className).toContain("w-full")
  })

  it("caps huge line counts so rendering stays bounded", () => {
    const { container } = render(<SkeletonText lines={1_000_000} />)

    expect(container.querySelectorAll("[data-slot=skeleton]")).toHaveLength(50)
  })

  it("passes the animation to every line", () => {
    const { container } = render(<SkeletonText lines={2} animation="pulse" />)

    container.querySelectorAll("[data-slot=skeleton]").forEach((bar) => {
      expect(bar.getAttribute("data-animation")).toBe("pulse")
    })
  })
})
