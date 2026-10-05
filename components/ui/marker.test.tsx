import * as React from "react"
import { act, cleanup, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Marker, MarkerContent, MarkerIcon, MarkerTime } from "./marker"

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

function slot(name: string) {
  return document.querySelector<HTMLElement>(`[data-slot="${name}"]`)!
}

describe("Marker", () => {
  it("renders parts with variant and a hidden icon", () => {
    render(
      <Marker variant="separator">
        <MarkerIcon>
          <svg />
        </MarkerIcon>
        <MarkerContent>Mira joined</MarkerContent>
      </Marker>
    )

    expect(slot("marker").dataset.variant).toBe("separator")
    expect(slot("marker-icon").getAttribute("aria-hidden")).toBe("true")
    expect(screen.getByText("Mira joined")).toBe(slot("marker-content"))
  })

  it("supports render and forwards refs", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <Marker ref={ref} render={<li />}>
        <MarkerContent>Item</MarkerContent>
      </Marker>
    )
    expect(ref.current?.tagName).toBe("LI")
  })

  it("marks itself stuck from the observer", () => {
    let callback: IntersectionObserverCallback = () => {}
    const observe = vi.fn()
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(cb: IntersectionObserverCallback) {
          callback = cb
        }
        observe = observe
        disconnect() {}
      }
    )
    render(
      <Marker variant="separator" sticky>
        <MarkerContent>Today</MarkerContent>
      </Marker>
    )

    const marker = slot("marker")
    expect(marker.hasAttribute("data-sticky")).toBe(true)
    expect(observe).toHaveBeenCalledWith(marker)

    act(() => {
      callback(
        [
          {
            isIntersecting: false,
            intersectionRatio: 0.9,
            boundingClientRect: { top: -1 },
            rootBounds: { top: 0 },
          } as unknown as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver
      )
    })
    expect(marker.hasAttribute("data-stuck")).toBe(true)

    act(() => {
      callback(
        [
          {
            isIntersecting: true,
            intersectionRatio: 1,
            boundingClientRect: { top: 200 },
            rootBounds: { top: 0 },
          } as unknown as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver
      )
    })
    expect(marker.hasAttribute("data-stuck")).toBe(false)
  })
})

describe("MarkerTime", () => {
  function at(now: string) {
    vi.useFakeTimers({ toFake: ["Date", "setTimeout", "clearTimeout"] })
    vi.setSystemTime(new Date(now))
  }

  it("says Today, Yesterday, a weekday, then a date", () => {
    at("2026-10-04T15:00:00")
    render(
      <>
        <MarkerTime date={new Date("2026-10-04T09:00:00")} />
        <MarkerTime date={new Date("2026-10-03T23:00:00")} />
        <MarkerTime date={new Date("2026-09-30T10:00:00")} />
        <MarkerTime date={new Date("2026-08-12T10:00:00")} />
        <MarkerTime date={new Date("2025-08-12T10:00:00")} />
      </>
    )

    const times = Array.from(
      document.querySelectorAll("[data-slot=marker-time]"),
      (time) => time.textContent
    )
    expect(times).toEqual([
      "Today",
      "Yesterday",
      "Wednesday",
      "Aug 12",
      "Aug 12, 2025",
    ])
    expect(slot("marker-time").getAttribute("dateTime")).toContain("2026-10-04")
  })

  it("rolls over at midnight", () => {
    at("2026-10-04T23:59:59")
    render(<MarkerTime date={new Date("2026-10-04T12:00:00")} />)
    expect(slot("marker-time").textContent).toBe("Today")

    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(slot("marker-time").textContent).toBe("Yesterday")
  })

  it("handles invalid dates, custom formats and locales", () => {
    at("2026-10-04T12:00:00")
    render(
      <>
        <MarkerTime date="not a date" />
        <MarkerTime
          date={new Date("2026-10-04T08:30:00")}
          format={(date) => `${date.getHours()}h`}
        />
        <MarkerTime date={new Date("2026-10-04T08:30:00")} locale="fr-FR" />
      </>
    )

    const [invalid, custom, french] = Array.from(
      document.querySelectorAll("[data-slot=marker-time]")
    )
    expect(invalid.textContent).toBe("")
    expect(invalid.hasAttribute("dateTime")).toBe(false)
    expect(custom.textContent).toBe("8h")
    expect(french.textContent).toBe("Aujourd’hui")
  })

  it("server renders an absolute date", () => {
    const html = renderToString(
      <MarkerTime date={new Date("2026-03-04T12:00:00")} />
    )
    expect(html).toContain("Mar 4, 2026")
  })
})
