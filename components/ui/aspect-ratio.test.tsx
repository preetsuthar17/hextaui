import * as React from "react"
import { act, cleanup, fireEvent, render } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { AspectRatio, parseAspectRatio } from "./aspect-ratio"

afterEach(() => {
  cleanup()
})

function box(container: HTMLElement) {
  return container.querySelector<HTMLElement>("[data-slot=aspect-ratio]")!
}

function stubImage(
  img: HTMLImageElement,
  { complete, naturalWidth }: { complete: boolean; naturalWidth: number }
) {
  Object.defineProperty(img, "complete", {
    configurable: true,
    get: () => complete,
  })
  Object.defineProperty(img, "naturalWidth", {
    configurable: true,
    get: () => naturalWidth,
  })
}

describe("parseAspectRatio", () => {
  it("accepts numbers and w/h or w:h strings", () => {
    expect(parseAspectRatio(16 / 9)).toBeCloseTo(1.7778)
    expect(parseAspectRatio("16/9")).toBeCloseTo(1.7778)
    expect(parseAspectRatio("4:3")).toBeCloseTo(1.3333)
    expect(parseAspectRatio(" 21 : 9 " as "21:9")).toBeCloseTo(2.3333)
    expect(parseAspectRatio(undefined)).toBe(1)
  })

  it("falls back to 1 and warns for invalid values", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})

    expect(parseAspectRatio(0)).toBe(1)
    expect(parseAspectRatio(-2)).toBe(1)
    expect(parseAspectRatio(Number.NaN)).toBe(1)
    expect(parseAspectRatio(Infinity)).toBe(1)
    expect(parseAspectRatio("abc" as "1/1")).toBe(1)
    expect(parseAspectRatio("16/0")).toBe(1)
    expect(warn).toHaveBeenCalledTimes(6)
  })
})

describe("AspectRatio", () => {
  it("sets the ratio variable and keeps user styles", () => {
    const { container } = render(
      <AspectRatio ratio="16/9" style={{ maxWidth: 320 }} />
    )
    const element = box(container)

    expect(element.style.getPropertyValue("--ratio")).toBe(String(16 / 9))
    expect(element.style.maxWidth).toBe("320px")
  })

  it("supports the render prop", () => {
    const { container } = render(<AspectRatio render={<figure />} />)

    expect(box(container).tagName).toBe("FIGURE")
  })

  it("has no state without media", () => {
    const { container } = render(
      <AspectRatio>
        <p>Text</p>
      </AspectRatio>
    )

    expect(box(container).hasAttribute("data-state")).toBe(false)
  })

  it("goes from loading to loaded", () => {
    const { container } = render(
      <AspectRatio>
        <img src="/photo.jpg" alt="Photo" />
      </AspectRatio>
    )
    const element = box(container)
    const img = container.querySelector("img")!

    expect(element.getAttribute("data-state")).toBe("loading")
    expect(element.getAttribute("aria-busy")).toBe("true")

    fireEvent.load(img)

    expect(element.getAttribute("data-state")).toBe("loaded")
    expect(element.hasAttribute("aria-busy")).toBe(false)
  })

  it("renders a shimmer skeleton only while loading", () => {
    const { container } = render(
      <AspectRatio>
        <img src="/photo.jpg" alt="" />
      </AspectRatio>
    )
    const placeholder = () =>
      container.querySelector("[data-slot=aspect-ratio-placeholder]")

    expect(placeholder()?.getAttribute("data-animation")).toBe("shimmer")

    fireEvent.load(container.querySelector("img")!)

    expect(placeholder()).toBeNull()
  })

  it("keeps a static skeleton behind the error fallback", () => {
    const { container } = render(
      <AspectRatio>
        <img src="/missing.jpg" alt="" />
      </AspectRatio>
    )

    fireEvent.error(container.querySelector("img")!)

    expect(
      container
        .querySelector("[data-slot=aspect-ratio-placeholder]")
        ?.getAttribute("data-animation")
    ).toBe("none")
  })

  it("shows the fallback on error and keeps the alt text", () => {
    const { container } = render(
      <AspectRatio>
        <img src="/missing.jpg" alt="Missing photo" />
      </AspectRatio>
    )

    fireEvent.error(container.querySelector("img")!)

    expect(box(container).getAttribute("data-state")).toBe("error")
    expect(
      container.querySelector("[data-slot=aspect-ratio-fallback]")
    ).not.toBeNull()
    expect(container.querySelector("img")!.getAttribute("alt")).toBe(
      "Missing photo"
    )
  })

  it("hides the fallback when fallback is null", () => {
    const { container } = render(
      <AspectRatio fallback={null}>
        <img src="/missing.jpg" alt="" />
      </AspectRatio>
    )

    fireEvent.error(container.querySelector("img")!)

    expect(
      container.querySelector("[data-slot=aspect-ratio-fallback]")
    ).toBeNull()
  })

  it("starts loaded for an image that already finished loading", () => {
    const img = document.createElement("img")
    img.setAttribute("src", "/cached.jpg")
    stubImage(img, { complete: true, naturalWidth: 800 })

    function Harness() {
      const ref = React.useCallback((node: HTMLDivElement | null) => {
        node?.appendChild(img)
      }, [])
      return <AspectRatio ref={ref} />
    }

    const { container } = render(<Harness />)

    expect(box(container).getAttribute("data-state")).toBe("loaded")
  })

  it("returns to loading when the src changes", async () => {
    const { container, rerender } = render(
      <AspectRatio>
        <img src="/a.jpg" alt="" />
      </AspectRatio>
    )
    fireEvent.load(container.querySelector("img")!)
    expect(box(container).getAttribute("data-state")).toBe("loaded")

    await act(async () => {
      rerender(
        <AspectRatio>
          <img src="/b.jpg" alt="" />
        </AspectRatio>
      )
    })

    expect(box(container).getAttribute("data-state")).toBe("loading")
  })

  it("treats an image without src as loading", () => {
    const { container } = render(
      <AspectRatio>
        <img alt="" />
      </AspectRatio>
    )

    expect(box(container).getAttribute("data-state")).toBe("loading")
  })

  it("ignores load events from nested content", () => {
    const { container } = render(
      <AspectRatio>
        <img src="/a.jpg" alt="" />
        <div>
          <img src="/avatar.jpg" alt="" data-testid="nested" />
        </div>
      </AspectRatio>
    )

    fireEvent.load(container.querySelector("[data-testid=nested]")!)

    expect(box(container).getAttribute("data-state")).toBe("loading")
  })

  it("tracks an image inside picture", () => {
    const { container } = render(
      <AspectRatio>
        <picture>
          <source srcSet="/photo.avif" type="image/avif" />
          <img src="/photo.jpg" alt="" />
        </picture>
      </AspectRatio>
    )

    expect(box(container).getAttribute("data-state")).toBe("loading")
    fireEvent.load(container.querySelector("img")!)
    expect(box(container).getAttribute("data-state")).toBe("loaded")
  })

  it("reports an error when a video source fails", () => {
    const { container } = render(
      <AspectRatio>
        <video>
          <source src="/missing.mp4" type="video/mp4" />
        </video>
      </AspectRatio>
    )

    fireEvent.error(container.querySelector("source")!)

    expect(box(container).getAttribute("data-state")).toBe("error")
  })

  it("returns to loading when srcset changes", async () => {
    const { container, rerender } = render(
      <AspectRatio>
        <img src="/a.jpg" srcSet="/a.jpg 1x" alt="" />
      </AspectRatio>
    )
    fireEvent.load(container.querySelector("img")!)

    await act(async () => {
      rerender(
        <AspectRatio>
          <img src="/a.jpg" srcSet="/a@2x.jpg 2x" alt="" />
        </AspectRatio>
      )
    })

    expect(box(container).getAttribute("data-state")).toBe("loading")
  })

  it("settles on the latest source after rapid swaps", async () => {
    const { container, rerender } = render(
      <AspectRatio>
        <img src="/1.jpg" alt="" />
      </AspectRatio>
    )

    for (const src of ["/2.jpg", "/3.jpg", "/4.jpg"]) {
      await act(async () => {
        rerender(
          <AspectRatio>
            <img src={src} alt="" />
          </AspectRatio>
        )
      })
    }
    expect(box(container).getAttribute("data-state")).toBe("loading")

    fireEvent.load(container.querySelector("img")!)
    expect(box(container).getAttribute("data-state")).toBe("loaded")
  })

  it("forwards the ref to the element", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<AspectRatio ref={ref} />)

    expect(ref.current?.getAttribute("data-slot")).toBe("aspect-ratio")
  })

  it("does nothing with placeholder={false}", () => {
    const { container } = render(
      <AspectRatio placeholder={false}>
        <img src="/photo.jpg" alt="" />
      </AspectRatio>
    )
    fireEvent.error(container.querySelector("img")!)

    expect(box(container).hasAttribute("data-state")).toBe(false)
    expect(
      container.querySelector("[data-slot=aspect-ratio-fallback]")
    ).toBeNull()
  })

  it("removes its listeners on unmount", () => {
    const { container, unmount } = render(
      <AspectRatio>
        <img src="/photo.jpg" alt="" />
      </AspectRatio>
    )
    const element = box(container)
    const remove = vi.spyOn(element, "removeEventListener")

    unmount()

    expect(remove).toHaveBeenCalledWith("load", expect.any(Function), true)
    expect(remove).toHaveBeenCalledWith("error", expect.any(Function), true)
  })
})
