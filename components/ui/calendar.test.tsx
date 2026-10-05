import * as React from "react"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { hydrateRoot } from "react-dom/client"
import { renderToString } from "react-dom/server"
import { DirectionProvider } from "@base-ui/react/direction-provider"
import { type DateRange } from "react-day-picker"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Calendar, useToday } from "./calendar"

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  document.body.innerHTML = ""
})

function day(container: HTMLElement, iso: string) {
  return container.querySelector<HTMLElement>(`td[data-day="${iso}"]`)!
}

function dayButton(container: HTMLElement, iso: string) {
  return day(container, iso).querySelector("button")!
}

function RangeCalendar(
  props: Partial<React.ComponentProps<typeof Calendar>> & {
    initial?: DateRange
  }
) {
  const [range, setRange] = React.useState<DateRange | undefined>(props.initial)

  return (
    <Calendar
      {...(props as object)}
      mode="range"
      today={new Date(2026, 1, 11)}
      defaultMonth={new Date(2026, 1)}
      selected={range}
      onSelect={setRange}
    />
  )
}

describe("Calendar", () => {
  it("renders parts with data slots and marks today", () => {
    const { container } = render(
      <Calendar
        mode="single"
        today={new Date(2026, 1, 11)}
        defaultMonth={new Date(2026, 1)}
      />
    )

    for (const slot of [
      "calendar",
      "calendar-months",
      "calendar-month",
      "calendar-month-caption",
      "calendar-weeks",
      "calendar-day",
      "calendar-day-button",
    ]) {
      expect(container.querySelector(`[data-slot=${slot}]`)).not.toBeNull()
    }

    expect(dayButton(container, "2026-02-11").hasAttribute("data-today")).toBe(
      true
    )
    expect(
      container
        .querySelector("[data-slot=calendar]")!
        .hasAttribute("data-today")
    ).toBe(false)
  })

  it("marks today and selection only on the day in its own month", () => {
    const { container } = render(
      <Calendar
        mode="single"
        numberOfMonths={2}
        today={new Date(2026, 8, 28)}
        defaultMonth={new Date(2026, 8)}
        selected={new Date(2026, 8, 28)}
      />
    )
    const buttons = container.querySelectorAll<HTMLElement>(
      "td[data-day='2026-09-28'] button"
    )
    const [own] = Array.from(buttons)

    expect(buttons).toHaveLength(1)
    expect(own.hasAttribute("data-today")).toBe(true)
    expect(own.hasAttribute("data-selected-single")).toBe(true)
    expect(own.className).toContain(
      "data-[today]:data-[selected-single]:bg-info"
    )
    expect(container.querySelector("[data-today] [class*='after:']")).toBeNull()
  })

  it("hides outside days that another visible month already shows", () => {
    const { container } = render(
      <Calendar
        mode="range"
        numberOfMonths={2}
        defaultMonth={new Date(2026, 8)}
        selected={{ from: new Date(2026, 8, 17), to: new Date(2026, 9, 1) }}
      />
    )
    const duplicates =
      container.querySelectorAll<HTMLElement>("td[data-duplicate]")
    const days = Array.from(duplicates, (cell) => cell.dataset.day)

    expect(days).toEqual([
      "2026-10-01",
      "2026-10-02",
      "2026-10-03",
      "2026-09-27",
      "2026-09-28",
      "2026-09-29",
      "2026-09-30",
    ])
    for (const cell of duplicates) {
      expect(cell.getAttribute("aria-hidden")).toBe("true")
      expect(cell.querySelector("button")).toBeNull()
    }
    expect(
      container.querySelector("td[data-day='2026-08-31'] button")
    ).not.toBeNull()
  })

  it("flags single selection and range ends on the day button", () => {
    const { container } = render(
      <Calendar
        mode="single"
        defaultMonth={new Date(2026, 1)}
        selected={new Date(2026, 1, 5)}
      />
    )

    expect(
      dayButton(container, "2026-02-05").hasAttribute("data-selected-single")
    ).toBe(true)

    cleanup()
    const { container: rangeContainer } = render(
      <Calendar
        mode="range"
        defaultMonth={new Date(2026, 1)}
        selected={{ from: new Date(2026, 1, 5), to: new Date(2026, 1, 8) }}
      />
    )

    expect(
      dayButton(rangeContainer, "2026-02-05").hasAttribute("data-range-start")
    ).toBe(true)
    expect(
      dayButton(rangeContainer, "2026-02-06").hasAttribute("data-range-middle")
    ).toBe(true)
    expect(
      day(rangeContainer, "2026-02-06").hasAttribute("data-range-middle")
    ).toBe(true)
    expect(
      dayButton(rangeContainer, "2026-02-08").hasAttribute("data-range-end")
    ).toBe(true)
  })

  it("follows the Base UI direction when no dir prop is given", () => {
    const { container } = render(
      <DirectionProvider direction="rtl">
        <Calendar mode="single" />
      </DirectionProvider>
    )

    expect(
      container.querySelector("[data-slot=calendar]")!.getAttribute("dir")
    ).toBe("rtl")
  })

  it("flips horizontal chevrons in RTL and keeps DOM order equal to visual order", () => {
    const { container } = render(
      <Calendar
        mode="single"
        captionLayout="dropdown"
        defaultMonth={new Date(2026, 1)}
      />
    )
    const month = container.querySelector("[data-slot=calendar-month]")!
    const order = Array.from(
      month.querySelectorAll<HTMLElement>("button:not([data-day]), select")
    ).map((node) => node.getAttribute("aria-label") ?? "")

    expect(order[0]).toMatch(/previous month/i)
    expect(order.at(-1)).toMatch(/next month/i)
    expect(month.querySelectorAll("select")).toHaveLength(2)
    month
      .querySelectorAll("button:not([data-day]) svg")
      .forEach((icon) =>
        expect(icon.getAttribute("class")).toContain("rtl:-scale-x-100")
      )
  })

  it("does not double-flip chevrons DayPicker already mirrored for dir=rtl", () => {
    const { container } = render(<Calendar mode="single" dir="rtl" />)
    const previous = container.querySelector(".rdp-button_previous svg")!
    const next = container.querySelector(".rdp-button_next svg")!

    expect(previous.getAttribute("class")).not.toContain("rtl:-scale-x-100")
    expect(previous.getAttribute("class")).toContain("chevron-right")
    expect(next.getAttribute("class")).toContain("chevron-left")
  })

  it("composes className and keeps default layout classes", () => {
    const { container } = render(
      <Calendar mode="single" className="shadow-sm" />
    )
    const root = container.querySelector("[data-slot=calendar]")!

    expect(root.className).toContain("shadow-sm")
    expect(root.className).toContain("p-3")
  })
})

describe("Range preview", () => {
  it("previews the range the next click would select", () => {
    const { container } = render(
      <RangeCalendar
        initial={{ from: new Date(2026, 1, 9), to: new Date(2026, 1, 9) }}
      />
    )

    fireEvent.mouseEnter(dayButton(container, "2026-02-13"))

    expect(day(container, "2026-02-09").getAttribute("data-preview")).toBe(
      "start"
    )
    expect(day(container, "2026-02-11").getAttribute("data-preview")).toBe(
      "middle"
    )
    expect(day(container, "2026-02-13").getAttribute("data-preview")).toBe(
      "end"
    )
    expect(day(container, "2026-02-14").hasAttribute("data-preview")).toBe(
      false
    )

    fireEvent.mouseLeave(dayButton(container, "2026-02-13"))

    expect(container.querySelector("[data-preview]")).toBeNull()
  })

  it("previews backwards when hovering before the start", () => {
    const { container } = render(
      <RangeCalendar
        initial={{ from: new Date(2026, 1, 9), to: new Date(2026, 1, 9) }}
      />
    )

    fireEvent.mouseEnter(dayButton(container, "2026-02-04"))

    expect(day(container, "2026-02-04").getAttribute("data-preview")).toBe(
      "start"
    )
    expect(day(container, "2026-02-09").getAttribute("data-preview")).toBe(
      "end"
    )
  })

  it("follows keyboard focus", () => {
    const { container } = render(
      <RangeCalendar
        initial={{ from: new Date(2026, 1, 9), to: new Date(2026, 1, 9) }}
      />
    )

    fireEvent.focus(dayButton(container, "2026-02-12"))

    expect(day(container, "2026-02-12").getAttribute("data-preview")).toBe(
      "end"
    )

    fireEvent.blur(dayButton(container, "2026-02-12"))

    expect(container.querySelector("[data-preview]")).toBeNull()
  })

  it("does not preview once the range is complete, or with nothing selected", () => {
    const { container } = render(
      <RangeCalendar
        initial={{ from: new Date(2026, 1, 9), to: new Date(2026, 1, 12) }}
      />
    )

    fireEvent.mouseEnter(dayButton(container, "2026-02-20"))
    expect(container.querySelector("[data-preview]")).toBeNull()

    cleanup()
    const empty = render(<RangeCalendar />)
    fireEvent.mouseEnter(dayButton(empty.container, "2026-02-20"))
    expect(empty.container.querySelector("[data-preview]")).toBeNull()
  })

  it("ignores disabled days and respects the range max", () => {
    const { container } = render(
      <RangeCalendar
        initial={{ from: new Date(2026, 1, 9), to: new Date(2026, 1, 9) }}
        disabled={{ dayOfWeek: [0, 6] }}
        max={3}
      />
    )

    fireEvent.mouseEnter(dayButton(container, "2026-02-14"))
    expect(container.querySelector("[data-preview]")).toBeNull()

    fireEvent.mouseEnter(dayButton(container, "2026-02-20"))
    expect(container.querySelector("[data-preview]")).toBeNull()

    fireEvent.mouseEnter(dayButton(container, "2026-02-11"))
    expect(day(container, "2026-02-11").getAttribute("data-preview")).toBe(
      "end"
    )
  })

  it("calls the user's handler first and skips the preview when prevented", () => {
    const onDayMouseEnter = vi.fn((_date, _modifiers, event) =>
      event.preventDefault()
    )
    const { container } = render(
      <RangeCalendar
        initial={{ from: new Date(2026, 1, 9), to: new Date(2026, 1, 9) }}
        onDayMouseEnter={onDayMouseEnter}
      />
    )

    fireEvent.mouseEnter(dayButton(container, "2026-02-13"))

    expect(onDayMouseEnter).toHaveBeenCalledTimes(1)
    expect(container.querySelector("[data-preview]")).toBeNull()
  })

  it("does not track hover outside range mode", () => {
    const onDayMouseEnter = vi.fn()
    const { container } = render(
      <Calendar
        mode="single"
        defaultMonth={new Date(2026, 1)}
        onDayMouseEnter={onDayMouseEnter}
      />
    )

    fireEvent.mouseEnter(dayButton(container, "2026-02-13"))

    expect(onDayMouseEnter).toHaveBeenCalledTimes(1)
    expect(container.querySelector("[data-preview]")).toBeNull()
  })
})

describe("Month animation", () => {
  function mockAnimate() {
    const calls: { slot: string | undefined; keyframes: Keyframe[] }[] = []
    const cancel = vi.fn()

    Object.defineProperty(Element.prototype, "animate", {
      configurable: true,
      value: function (this: HTMLElement, keyframes: Keyframe[]) {
        calls.push({ slot: this.dataset.slot, keyframes })
        return { cancel, playState: "running" } as unknown as Animation
      },
    })

    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: () => ({ matches: false }),
    })
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
      width: 280,
      height: 300,
    } as DOMRect)

    return { calls, cancel }
  }

  afterEach(() => {
    delete (Element.prototype as { animate?: unknown }).animate
    delete (window as { matchMedia?: unknown }).matchMedia
  })

  it("slides forward and backward and cancels on interrupt and unmount", () => {
    const { calls, cancel } = mockAnimate()
    const { container, unmount } = render(
      <Calendar mode="single" defaultMonth={new Date(2026, 1)} />
    )

    expect(calls).toHaveLength(0)

    fireEvent.click(screen.getByRole("button", { name: /next month/i }))

    const weeksForward = calls.find((c) => c.slot === "calendar-weeks")!
    expect(String(weeksForward.keyframes[0].translate)).toBe("28px 0")
    expect(weeksForward.keyframes[0].opacity).toBe(0)

    calls.length = 0
    fireEvent.click(screen.getByRole("button", { name: /previous month/i }))

    expect(cancel).toHaveBeenCalled()
    const weeksBack = calls.find((c) => c.slot === "calendar-weeks")!
    expect(String(weeksBack.keyframes[0].translate)).toBe("-28px 0")

    expect(
      container.querySelector("[data-slot=calendar-month-caption]")!.textContent
    ).toBe("February 2026")

    cancel.mockClear()
    unmount()
    expect(cancel).toHaveBeenCalled()
  })

  it("falls back to an opacity fade with reduced motion", () => {
    const { calls } = mockAnimate()
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: () => ({ matches: true }),
    })
    render(<Calendar mode="single" defaultMonth={new Date(2026, 1)} />)

    fireEvent.click(screen.getByRole("button", { name: /next month/i }))

    const weeks = calls.find((c) => c.slot === "calendar-weeks")!
    expect(weeks.keyframes[0].translate).toBeUndefined()
    expect(weeks.keyframes[0].opacity).toBe(0)
  })

  it("fades without sliding when the month changes from the keyboard", () => {
    const { calls } = mockAnimate()
    const { container } = render(
      <Calendar mode="single" defaultMonth={new Date(2026, 1)} />
    )
    const next = screen.getByRole("button", { name: /next month/i })

    fireEvent.keyDown(container.querySelector("[data-slot=calendar]")!, {
      key: "Enter",
    })
    fireEvent.click(next)

    const weeks = calls.find((c) => c.slot === "calendar-weeks")!
    expect(weeks.keyframes[0].translate).toBeUndefined()
    expect(weeks.keyframes[0].opacity).toBe(0)
  })

  it("does not animate when animate is false", () => {
    const { calls } = mockAnimate()
    render(
      <Calendar
        mode="single"
        defaultMonth={new Date(2026, 1)}
        animate={false}
      />
    )

    fireEvent.click(screen.getByRole("button", { name: /next month/i }))

    expect(calls).toHaveLength(0)
  })
})

describe("Today", () => {
  it("replays the server date during hydration, then moves to the client date", async () => {
    vi.useFakeTimers({ toFake: ["Date"] })
    vi.setSystemTime(new Date(2026, 0, 31, 23, 59))

    const html = renderToString(<Calendar mode="single" />)
    const host = document.createElement("div")
    host.innerHTML = html
    document.body.append(host)

    expect(
      host.querySelector("[data-slot=calendar]")!.getAttribute("data-today")
    ).toBe("2026-01-31")

    vi.setSystemTime(new Date(2026, 1, 1, 0, 1))

    const onRecoverableError = vi.fn()
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})

    await act(async () => {
      hydrateRoot(host, <Calendar mode="single" />, { onRecoverableError })
    })

    expect(onRecoverableError).not.toHaveBeenCalled()
    expect(consoleError).not.toHaveBeenCalled()
    expect(
      host.querySelector("[data-slot=calendar-month-caption]")!.textContent
    ).toBe("February 2026")
    expect(
      host
        .querySelector("td[data-day='2026-02-01'] button")!
        .hasAttribute("data-today")
    ).toBe(true)
  })

  it("updates today at midnight without resetting the visible month", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 1, 11, 23, 59, 30))

    const { container } = render(<Calendar mode="single" />)

    fireEvent.click(screen.getByRole("button", { name: /next month/i }))
    expect(
      container.querySelector("[data-slot=calendar-month-caption]")!.textContent
    ).toBe("March 2026")

    act(() => {
      vi.advanceTimersByTime(60_000)
    })

    expect(
      container
        .querySelector("[data-slot=calendar]")!
        .getAttribute("data-today")
    ).toBe("2026-02-12")
    expect(
      container.querySelector("[data-slot=calendar-month-caption]")!.textContent
    ).toBe("March 2026")
  })

  it("leaves today to DayPicker when a time zone is set", () => {
    const { container } = render(
      <Calendar mode="single" timeZone="Asia/Tokyo" />
    )

    expect(
      container
        .querySelector("[data-slot=calendar]")!
        .hasAttribute("data-today")
    ).toBe(false)
  })
})

describe("useToday", () => {
  function Probe({
    onRender,
  }: {
    onRender?: (today: Date | undefined) => void
  }) {
    const today = useToday()
    onRender?.(today)
    return (
      <span data-testid="today">{today ? today.toDateString() : "none"}</span>
    )
  }

  it("is undefined in server HTML and hydrates without a mismatch", async () => {
    vi.useFakeTimers({ toFake: ["Date"] })
    vi.setSystemTime(new Date(2026, 8, 29, 12))

    const html = renderToString(<Probe />)
    expect(html).toContain("none")

    const host = document.createElement("div")
    host.innerHTML = html
    document.body.append(host)
    vi.setSystemTime(new Date(2026, 10, 3, 9))

    const onRecoverableError = vi.fn()
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})

    await act(async () => {
      hydrateRoot(host, <Probe />, { onRecoverableError })
    })

    expect(onRecoverableError).not.toHaveBeenCalled()
    expect(consoleError).not.toHaveBeenCalled()
    expect(host.textContent).toBe(new Date(2026, 10, 3).toDateString())
  })

  it("has a value on the first client-only render", () => {
    const seen: (Date | undefined)[] = []
    render(<Probe onRender={(today) => seen.push(today)} />)

    expect(seen[0]).toBeInstanceOf(Date)
  })

  it("keeps the same Date object until the day changes, then rolls over at midnight", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 8, 29, 23, 59, 30))

    const seen: (Date | undefined)[] = []
    const { rerender } = render(<Probe onRender={(t) => seen.push(t)} />)
    rerender(<Probe onRender={(t) => seen.push(t)} />)

    expect(seen[0]).toBe(seen[1])
    expect(seen[0]!.getHours()).toBe(0)

    act(() => {
      vi.advanceTimersByTime(60_000)
    })

    expect(screen.getByTestId("today").textContent).toBe(
      new Date(2026, 8, 30).toDateString()
    )
  })
})
