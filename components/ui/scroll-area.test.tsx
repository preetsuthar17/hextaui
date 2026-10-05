import * as React from "react"
import { cleanup, render } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { getPeekHeight, ScrollArea, type PeekItem } from "./scroll-area"

afterEach(() => {
  cleanup()
})

function list(count: number, height: number, gap = 0): PeekItem[] {
  return Array.from({ length: count }, (_, index) => ({
    top: index * (height + gap),
    height,
  }))
}

describe("getPeekHeight", () => {
  it("returns null without overflow", () => {
    expect(getPeekHeight(list(5, 40), 400)).toBeNull()
    expect(getPeekHeight([], 400)).toBeNull()
    expect(getPeekHeight(list(5, 40), 0)).toBeNull()
  })

  it("keeps a height that already cuts an item near the middle", () => {
    expect(getPeekHeight(list(20, 40), 420)).toBeNull()
    expect(getPeekHeight(list(20, 40), 417)).toBeNull()
  })

  it("treats a thin sliver as a bad peek", () => {
    expect(getPeekHeight(list(20, 40), 414)).toEqual({
      height: 384,
      visible: 24,
    })
  })

  it("cuts through the middle when the edge lands on an item boundary", () => {
    expect(getPeekHeight(list(20, 40), 400)).toEqual({
      height: 384,
      visible: 24,
    })
  })

  it("cuts the previous item when the next is barely visible", () => {
    expect(getPeekHeight(list(20, 40), 405)).toEqual({
      height: 384,
      visible: 24,
    })
  })

  it("cuts the crossing item when it is almost fully visible", () => {
    expect(getPeekHeight(list(20, 40), 435)).toEqual({
      height: 424,
      visible: 24,
    })
  })

  it("handles an edge that falls in the gap between items", () => {
    expect(getPeekHeight(list(20, 40, 12), 410)).toEqual({
      height: 388,
      visible: 24,
    })
  })

  it("never shrinks below half the height", () => {
    expect(getPeekHeight([{ top: 0, height: 900 }], 400)).toBeNull()
    expect(
      getPeekHeight(
        [
          { top: 0, height: 100 },
          { top: 100, height: 900 },
        ],
        400
      )
    ).toBeNull()
  })

  it("only ever shrinks", () => {
    const result = getPeekHeight(list(50, 37, 8), 500)
    expect(result).not.toBeNull()
    expect(result!.height).toBeLessThanOrEqual(500)
  })
})

describe("ScrollArea", () => {
  it("renders the parts with slots and fades on by default", () => {
    const { container } = render(
      <ScrollArea className="h-40">
        <p>Content</p>
      </ScrollArea>
    )

    expect(container.querySelector("[data-slot=scroll-area]")).not.toBeNull()
    const viewport = container.querySelector(
      "[data-slot=scroll-area-viewport]"
    )!
    expect(viewport.className).toContain("mask-image")
    expect(
      container.querySelector("[data-slot=scroll-area-content]")!.textContent
    ).toBe("Content")
  })

  it("removes the fade mask with fade={false}", () => {
    const { container } = render(
      <ScrollArea fade={false}>
        <p>Content</p>
      </ScrollArea>
    )

    expect(
      container
        .querySelector("[data-slot=scroll-area-viewport]")!
        .className.includes("mask-image")
    ).toBe(false)
  })

  it("forwards the viewport ref", () => {
    const viewportRef = React.createRef<HTMLDivElement>()
    render(
      <ScrollArea viewportRef={viewportRef}>
        <p>Content</p>
      </ScrollArea>
    )

    expect(viewportRef.current?.getAttribute("data-slot")).toBe(
      "scroll-area-viewport"
    )
  })

  it("supports a function className", () => {
    const { container } = render(
      <ScrollArea className={() => "custom-root"}>
        <p>Content</p>
      </ScrollArea>
    )

    expect(
      container.querySelector("[data-slot=scroll-area]")!.className
    ).toContain("custom-root")
  })

  it("marks peek and cleans up the inline height on unmount", () => {
    const { container, unmount } = render(
      <ScrollArea peek>
        <p>Content</p>
      </ScrollArea>
    )
    const root = container.querySelector<HTMLElement>(
      "[data-slot=scroll-area]"
    )!

    expect(root.hasAttribute("data-peek")).toBe(true)
    unmount()
    expect(root.style.height).toBe("")
  })
})
