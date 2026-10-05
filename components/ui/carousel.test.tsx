import * as React from "react"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  Carousel,
  CarouselAutoplayToggle,
  CarouselContent,
  CarouselCounter,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselThumbnail,
  CarouselThumbnails,
  type CarouselApi,
} from "./carousel"

const width = 300
const scroll = new WeakMap<Element, number>()
let reducedMotion = false
let hiddenLayout = false

function viewportOf(node: Element) {
  return node.closest("[data-slot=carousel-content]")
}

function rectFor(node: Element): DOMRect {
  if (hiddenLayout) {
    return DOMRect.fromRect({ x: 0, y: 0, width: 0, height: 0 })
  }
  const slot = (node as HTMLElement).dataset?.slot
  if (slot === "carousel-item") {
    const viewport = viewportOf(node)!
    const index = Array.from(node.parentElement!.children).indexOf(node)
    const left = index * width - (scroll.get(viewport) ?? 0)
    return DOMRect.fromRect({ x: left, y: 0, width, height: 100 })
  }
  if (slot === "carousel-content") {
    return DOMRect.fromRect({ x: 0, y: 0, width, height: 100 })
  }
  return DOMRect.fromRect({ x: 0, y: 0, width: 0, height: 0 })
}

function slideCount(viewport: Element) {
  return viewport.querySelectorAll(
    ":scope > [data-slot=carousel-container] > [data-slot=carousel-item]"
  ).length
}

beforeEach(() => {
  reducedMotion = false
  hiddenLayout = false
  vi.useFakeTimers()
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
    function (this: Element) {
      return rectFor(this)
    }
  )
  Object.defineProperty(HTMLElement.prototype, "clientWidth", {
    configurable: true,
    get(this: HTMLElement) {
      return this.dataset.slot === "carousel-content" && !hiddenLayout
        ? width
        : 0
    },
  })
  Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
    configurable: true,
    get(this: HTMLElement) {
      return this.dataset.slot === "carousel-content" && !hiddenLayout
        ? slideCount(this) * width
        : 0
    },
  })
  Object.defineProperty(HTMLElement.prototype, "scrollLeft", {
    configurable: true,
    get(this: HTMLElement) {
      return scroll.get(this) ?? 0
    },
    set(this: HTMLElement, value: number) {
      scroll.set(this, value)
    },
  })
  Element.prototype.scrollTo = function (
    this: Element,
    options?: ScrollToOptions | number
  ) {
    if (typeof options === "object" && options.left !== undefined) {
      scroll.set(this, Math.abs(options.left))
      this.dispatchEvent(new Event("scroll"))
      setTimeout(() => this.dispatchEvent(new Event("scrollend")), 300)
    }
  } as Element["scrollTo"]
  Element.prototype.scrollBy = function () {} as Element["scrollBy"]
  window.matchMedia = ((query: string) => ({
    matches: query.includes("reduce") ? reducedMotion : false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

function flush(ms = 1000) {
  act(() => {
    vi.advanceTimersByTime(ms)
  })
}

function Basic(props: React.ComponentProps<typeof Carousel>) {
  return (
    <Carousel aria-label="Numbers" {...props}>
      <CarouselContent>
        {[1, 2, 3, 4, 5].map((value) => (
          <CarouselItem key={value}>Slide {value}</CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots />
      <CarouselCounter />
    </Carousel>
  )
}

function current() {
  return screen
    .getAllByRole("button", { name: /Go to slide/ })
    .findIndex((dot) => dot.getAttribute("aria-current") === "true")
}

describe("Carousel", () => {
  it("renders a labelled carousel region with numbered slides", () => {
    render(<Basic />)
    const region = screen.getByRole("region", { name: "Numbers" })

    expect(region.getAttribute("aria-roledescription")).toBe("carousel")
    const slides = screen.getAllByRole("group", { name: /of 5/ })
    expect(slides).toHaveLength(5)
    expect(slides[0].getAttribute("aria-roledescription")).toBe("slide")
    expect(slides[2].getAttribute("aria-label")).toBe("3 of 5")
  })

  it("keeps a custom slide label", () => {
    render(
      <Carousel aria-label="Custom">
        <CarouselContent>
          <CarouselItem aria-label="Cover">A</CarouselItem>
          <CarouselItem>B</CarouselItem>
        </CarouselContent>
      </Carousel>
    )

    expect(screen.getByRole("group", { name: "Cover" })).toBeTruthy()
    expect(screen.getByRole("group", { name: "2 of 2" })).toBeTruthy()
  })

  it("moves with Next and Previous and disables them at the ends without losing focus", () => {
    render(<Basic />)
    const previous = screen.getByRole("button", { name: "Previous slide" })
    const next = screen.getByRole("button", { name: "Next slide" })

    expect(previous.getAttribute("aria-disabled")).toBe("true")
    next.focus()
    for (let step = 0; step < 4; step += 1) {
      fireEvent.click(next)
      flush()
    }
    expect(current()).toBe(4)
    expect(next.getAttribute("aria-disabled")).toBe("true")
    expect(document.activeElement).toBe(next)
    fireEvent.click(next)
    flush()
    expect(current()).toBe(4)
    fireEvent.click(previous)
    flush()
    expect(current()).toBe(3)
  })

  it("announces the settled slide", () => {
    render(<Basic />)
    fireEvent.click(screen.getByRole("button", { name: "Next slide" }))
    flush()

    expect(screen.getByRole("status").textContent).toBe("Slide 2 of 5")
  })

  it("wraps around with rewind", () => {
    render(<Basic rewind />)
    const previous = screen.getByRole("button", { name: "Previous slide" })

    expect(previous.getAttribute("aria-disabled")).not.toBe("true")
    fireEvent.click(previous)
    flush()
    expect(current()).toBe(4)
    fireEvent.click(screen.getByRole("button", { name: "Next slide" }))
    flush()
    expect(current()).toBe(0)
  })

  it("honours preventDefault in a user onClick", () => {
    render(
      <Carousel aria-label="Blocked">
        <CarouselContent>
          <CarouselItem>A</CarouselItem>
          <CarouselItem>B</CarouselItem>
        </CarouselContent>
        <CarouselNext onClick={(event) => event.preventDefault()} />
        <CarouselDots />
      </Carousel>
    )
    fireEvent.click(screen.getByRole("button", { name: "Next slide" }))
    flush()

    expect(current()).toBe(0)
  })

  it("uses arrow keys, flips them in RTL and ignores inputs and modifiers", () => {
    const { container } = render(
      <div>
        <Basic />
        <input aria-label="outside" />
      </div>
    )
    const region = screen.getByRole("region", { name: "Numbers" })

    fireEvent.keyDown(region, { key: "ArrowRight" })
    flush()
    expect(current()).toBe(1)
    fireEvent.keyDown(region, { key: "ArrowRight", shiftKey: true })
    flush()
    expect(current()).toBe(1)
    fireEvent.keyDown(region, { key: "ArrowLeft" })
    flush()
    expect(current()).toBe(0)

    region.setAttribute("dir", "rtl")
    region.style.direction = "rtl"
    fireEvent.keyDown(region, { key: "ArrowLeft" })
    flush()
    expect(current()).toBe(1)
    region.removeAttribute("dir")
    region.style.direction = ""

    const input = document.createElement("input")
    region.querySelector("[data-slot=carousel-item]")!.append(input)
    fireEvent.keyDown(input, { key: "ArrowRight" })
    flush()
    expect(current()).toBe(1)
    expect(container).toBeTruthy()
  })

  it("only moves the innermost carousel with arrow keys", () => {
    render(
      <Carousel aria-label="Outer">
        <CarouselContent>
          <CarouselItem>
            <Carousel aria-label="Inner">
              <CarouselContent>
                <CarouselItem>1</CarouselItem>
                <CarouselItem>2</CarouselItem>
              </CarouselContent>
              <CarouselCounter data-testid="inner" />
            </Carousel>
          </CarouselItem>
          <CarouselItem>B</CarouselItem>
        </CarouselContent>
        <CarouselCounter data-testid="outer" />
      </Carousel>
    )
    fireEvent.keyDown(screen.getByRole("region", { name: "Inner" }), {
      key: "ArrowRight",
    })
    flush()

    expect(screen.getByTestId("inner").textContent).toContain("2")
    expect(screen.getByTestId("outer").textContent).toMatch(/^1/)
  })

  it("opens on defaultIndex without reporting a change", () => {
    const onIndexChange = vi.fn()
    render(<Basic defaultIndex={3} onIndexChange={onIndexChange} />)

    expect(current()).toBe(3)
    expect(onIndexChange).not.toHaveBeenCalled()
  })

  it("follows a controlled index and snaps back when the parent refuses", () => {
    function Controlled({ refuse }: { refuse?: boolean }) {
      const [index, setIndex] = React.useState(1)
      return (
        <>
          <button type="button" onClick={() => setIndex(3)}>
            jump
          </button>
          <Basic index={index} onIndexChange={refuse ? undefined : setIndex} />
        </>
      )
    }
    const { unmount } = render(<Controlled />)
    expect(current()).toBe(1)
    fireEvent.click(screen.getByRole("button", { name: "jump" }))
    flush()
    expect(current()).toBe(3)
    fireEvent.click(screen.getByRole("button", { name: "Next slide" }))
    flush()
    expect(current()).toBe(4)
    unmount()

    render(<Controlled refuse />)
    fireEvent.click(screen.getByRole("button", { name: "Next slide" }))
    flush()
    expect(current()).toBe(1)
  })

  it("keeps the slide when the browser moves the scroll position on its own", () => {
    const onIndexChange = vi.fn()
    const { container } = render(
      <Basic defaultIndex={2} onIndexChange={onIndexChange} />
    )
    const viewport = container.querySelector<HTMLElement>(
      "[data-slot=carousel-content]"
    )!
    flush(2000)

    act(() => {
      viewport.scrollLeft = 110
      viewport.dispatchEvent(new Event("scroll"))
    })
    flush()
    expect(current()).toBe(2)
    expect(viewport.scrollLeft).toBe(600)
    expect(onIndexChange).not.toHaveBeenCalled()

    fireEvent.pointerDown(viewport, { pointerType: "touch" })
    act(() => {
      viewport.scrollLeft = 900
      viewport.dispatchEvent(new Event("scroll"))
    })
    flush()
    expect(current()).toBe(3)
    expect(onIndexChange).toHaveBeenLastCalledWith(3)
  })

  it("queues rapid clicks instead of dropping them", () => {
    render(<Basic />)
    const next = screen.getByRole("button", { name: "Next slide" })

    fireEvent.click(next)
    fireEvent.click(next)
    fireEvent.click(next)
    expect(current()).toBe(3)
    flush()
    expect(current()).toBe(3)
  })

  it("keeps its slide while hidden with display none", () => {
    let api: CarouselApi | undefined
    render(<Basic defaultIndex={3} setApi={(value) => (api = value)} />)
    const viewport = api!.viewportNode()!
    flush(2000)

    hiddenLayout = true
    act(() => {
      viewport.scrollLeft = 0
      fireEvent.keyDown(viewport, { key: "Tab" })
      viewport.dispatchEvent(new Event("scroll"))
    })
    flush()
    hiddenLayout = false
    act(() => {
      viewport.dispatchEvent(new Event("scroll"))
    })
    flush()
    expect(current()).toBe(3)
    expect(viewport.scrollLeft).toBe(900)
  })

  it("renders no dots and no counter without slides", () => {
    const { container } = render(
      <Carousel aria-label="Empty">
        <CarouselContent />
        <CarouselDots />
        <CarouselCounter />
      </Carousel>
    )

    expect(screen.queryAllByRole("button", { name: /Go to slide/ })).toEqual([])
    expect(
      container.querySelector("[data-slot=carousel-counter]")!.textContent
    ).toBe("")
  })

  it("exposes an api with events", () => {
    let api: CarouselApi | undefined
    const onSelect = vi.fn()
    render(<Basic setApi={(value) => (api = value)} />)

    expect(api!.scrollSnapList()).toHaveLength(5)
    api!.on("select", onSelect)
    act(() => api!.scrollTo(2))
    flush()
    expect(api!.selectedScrollSnap()).toBe(2)
    expect(onSelect).toHaveBeenCalled()
    expect(api!.canScrollPrev()).toBe(true)
    expect(api!.slidesInView()).toEqual([2])
    expect(api!.slideNodes()).toHaveLength(5)
    api!.off("select", onSelect)
    onSelect.mockClear()
    act(() => api!.scrollNext())
    flush()
    expect(onSelect).not.toHaveBeenCalled()
  })

  it("renders one dot per snap with a single tab stop and focus that follows", () => {
    render(<Basic />)
    const dots = screen.getAllByRole("button", { name: /Go to slide/ })

    expect(dots).toHaveLength(5)
    expect(dots.filter((dot) => dot.tabIndex === 0)).toHaveLength(1)
    fireEvent.click(dots[3])
    flush()
    expect(current()).toBe(3)

    const active = screen.getAllByRole("button", { name: /Go to slide/ })[3]
    active.focus()
    fireEvent.keyDown(active, { key: "ArrowRight" })
    flush()
    expect(document.activeElement?.getAttribute("aria-label")).toBe(
      "Go to slide 5"
    )
  })

  it("shows a counter", () => {
    const { container } = render(<Basic defaultIndex={1} />)
    const counter = container.querySelector("[data-slot=carousel-counter]")!

    expect(counter.textContent).toContain("2")
    expect(counter.textContent).toContain("5")
  })

  it("adds and removes slides", async () => {
    function Dynamic() {
      const [count, setCount] = React.useState(2)
      return (
        <>
          <button type="button" onClick={() => setCount((c) => c + 1)}>
            add
          </button>
          <Carousel aria-label="Dynamic">
            <CarouselContent>
              {Array.from({ length: count }, (_, index) => (
                <CarouselItem key={index}>{index}</CarouselItem>
              ))}
            </CarouselContent>
            <CarouselDots />
          </Carousel>
        </>
      )
    }
    render(<Dynamic />)
    expect(screen.getAllByRole("button", { name: /Go to slide/ })).toHaveLength(
      2
    )
    fireEvent.click(screen.getByRole("button", { name: "add" }))
    await act(async () => {
      await Promise.resolve()
    })
    expect(screen.getAllByRole("button", { name: /Go to slide/ })).toHaveLength(
      3
    )
    expect(screen.getByRole("group", { name: "3 of 3" })).toBeTruthy()
  })

  it("navigates with thumbnails", () => {
    render(
      <Carousel aria-label="Gallery">
        <CarouselContent>
          {[0, 1, 2].map((value) => (
            <CarouselItem key={value}>{value}</CarouselItem>
          ))}
        </CarouselContent>
        <CarouselThumbnails>
          {[0, 1, 2].map((value) => (
            <CarouselThumbnail key={value}>{value}</CarouselThumbnail>
          ))}
        </CarouselThumbnails>
      </Carousel>
    )
    const thumbs = screen.getAllByRole("button", { name: /Go to slide/ })

    expect(thumbs[0].getAttribute("aria-current")).toBe("true")
    fireEvent.click(thumbs[2])
    flush()
    expect(thumbs[2].hasAttribute("data-active")).toBe(true)
    expect(thumbs[0].hasAttribute("data-active")).toBe(false)
    expect(thumbs[2].tabIndex).toBe(0)
  })

  it("throws a helpful error outside a carousel", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})

    expect(() => render(<CarouselDots />)).toThrow(
      "<CarouselDots> must be used within <Carousel>."
    )
  })

  it("renders on the server", () => {
    const html = renderToString(<Basic />)

    expect(html).toContain('aria-roledescription="carousel"')
    expect(html).toContain('data-slot="carousel-item"')
  })
})

describe("Carousel autoplay", () => {
  it("advances after the delay and rewinds at the end", () => {
    render(<Basic autoplay={{ delay: 2000 }} />)
    flush(0)

    flush(2000)
    expect(current()).toBe(1)
    for (let step = 0; step < 4; step += 1) {
      flush(2000)
    }
    expect(current()).toBe(0)
  })

  it("pauses while hovered and while the tab is hidden", () => {
    render(<Basic autoplay={{ delay: 2000 }} />)
    const region = screen.getByRole("region", { name: "Numbers" })

    fireEvent.pointerEnter(region, { pointerType: "mouse" })
    flush(5000)
    expect(current()).toBe(0)
    fireEvent.pointerLeave(region, { pointerType: "mouse" })

    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "hidden",
    })
    fireEvent(document, new Event("visibilitychange"))
    flush(5000)
    expect(current()).toBe(0)
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "visible",
    })
    fireEvent(document, new Event("visibilitychange"))
    flush(2000)
    expect(current()).toBe(1)
  })

  it("keeps the remaining time across a pause", () => {
    render(<Basic autoplay={{ delay: 2000 }} />)
    const region = screen.getByRole("region", { name: "Numbers" })

    flush(1500)
    fireEvent.pointerEnter(region, { pointerType: "mouse" })
    flush(3000)
    fireEvent.pointerLeave(region, { pointerType: "mouse" })
    flush(499)
    expect(current()).toBe(0)
    flush(2)
    expect(current()).toBe(1)
  })

  it("can be paused and resumed with the toggle", () => {
    render(
      <Carousel autoplay={{ delay: 2000 }} aria-label="Toggle">
        <CarouselContent>
          <CarouselItem>A</CarouselItem>
          <CarouselItem>B</CarouselItem>
        </CarouselContent>
        <CarouselAutoplayToggle />
        <CarouselDots />
      </Carousel>
    )
    const toggle = screen.getByRole("button", { name: "Pause slideshow" })

    fireEvent.click(toggle)
    expect(toggle.getAttribute("aria-label")).toBe("Play slideshow")
    flush(5000)
    expect(current()).toBe(0)
    fireEvent.click(toggle)
    fireEvent.blur(toggle)
    flush(2000)
    expect(current()).toBe(1)
  })

  it("does not start under reduced motion", () => {
    reducedMotion = true
    render(<Basic autoplay />)
    flush(12000)

    expect(current()).toBe(0)
  })

  it("stops its timers on unmount", () => {
    const { unmount } = render(<Basic autoplay={{ delay: 2000 }} />)
    flush(1000)
    unmount()

    expect(() => flush(5000)).not.toThrow()
    expect(vi.getTimerCount()).toBe(0)
  })
})

describe("CarouselDots progress", () => {
  function dots() {
    return screen.getAllByRole("button", { name: /Go to slide/ })
  }

  function amounts() {
    return dots().map((dot) =>
      Number(dot.style.getPropertyValue("--dot-active") || "0")
    )
  }

  function swipeTo(position: number) {
    const viewport = document.querySelector("[data-slot=carousel-content]")!
    act(() => {
      viewport.dispatchEvent(new Event("wheel"))
      scroll.set(viewport, position)
      viewport.dispatchEvent(new Event("scroll"))
      vi.advanceTimersByTime(20)
    })
  }

  it("fills only the selected dot at rest", () => {
    render(<Basic />)
    flush()

    expect(amounts()).toEqual([1, 0, 0, 0, 0])
  })

  it("splits the pill between neighbours mid-swipe", () => {
    render(<Basic defaultIndex={1} />)
    flush()

    swipeTo(450)

    expect(amounts()).toEqual([0, 0.5, 0.5, 0, 0])
  })

  it("follows a slow swipe continuously and always sums to one", () => {
    render(<Basic defaultIndex={1} />)
    flush()

    const seen: number[][] = []
    for (const position of [270, 210, 150, 90, 30]) {
      swipeTo(position)
      seen.push(amounts())
    }

    const first = seen.map((values) => values[0])
    const second = seen.map((values) => values[1])
    expect(first).toEqual([...first].sort((a, b) => a - b))
    expect(second).toEqual([...second].sort((a, b) => b - a))
    seen.forEach((values) =>
      expect(values.reduce((sum, value) => sum + value, 0)).toBeCloseTo(1)
    )
    expect(seen[2][0]).toBeCloseTo(0.5)
  })

  it("lands exactly on the settled dot", () => {
    render(<Basic defaultIndex={1} />)
    flush()

    swipeTo(10)
    act(() => {
      scroll.set(document.querySelector("[data-slot=carousel-content]")!, 0)
      document
        .querySelector("[data-slot=carousel-content]")!
        .dispatchEvent(new Event("scrollend"))
      vi.advanceTimersByTime(20)
    })

    expect(amounts()).toEqual([1, 0, 0, 0, 0])
    expect(current()).toBe(0)
  })

  it("animates discrete jumps briefly, then goes back to tracking", () => {
    let api: CarouselApi | undefined
    render(<Basic setApi={(value) => (api = value)} />)
    flush()
    const container = document.querySelector("[data-slot=carousel-dots]")!

    act(() => {
      api!.scrollTo(3, true)
      vi.advanceTimersByTime(20)
    })

    expect(container.hasAttribute("data-jumping")).toBe(true)
    expect(amounts()[3]).toBe(1)

    flush(250)

    expect(container.hasAttribute("data-jumping")).toBe(false)
  })

  it("renders dots only once layout is known, already filled on the first client frame", () => {
    expect(renderToString(<Basic />)).not.toContain('data-slot="carousel-dot"')

    render(<Basic defaultIndex={2} />)

    const active = dots().find((dot) => dot.getAttribute("aria-current"))!
    expect(active.style.getPropertyValue("--dot-active")).toBe("1")
    expect(active.className).toContain("aria-[current=true]:[--dot-active:1]")
  })

  it("stops listening after unmount", () => {
    let api: CarouselApi | undefined
    const { unmount } = render(<Basic setApi={(value) => (api = value)} />)
    flush()

    unmount()

    expect(() => {
      api!.scrollTo(2, true)
      vi.advanceTimersByTime(500)
    }).not.toThrow()
  })
})
