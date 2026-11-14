import * as React from "react"
import {
  act,
  cleanup,
  fireEvent,
  render,
  waitFor,
} from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import { DateInput, createDateInputController } from "./ui-sdk-date-input"

afterEach(cleanup)

const labels = (root: HTMLElement) =>
  [...root.querySelectorAll("[role=spinbutton]")].map((segment) =>
    segment.getAttribute("aria-label")
  )

describe("UI SDK Date Input", () => {
  it("orders the segments by locale", () => {
    const { getByRole, rerender } = render(
      <DateInput aria-label="Date" defaultValue="2026-11-02" locale="en-US" />
    )
    expect(labels(getByRole("group"))).toEqual(["month", "day", "year"])
    rerender(
      <DateInput aria-label="Date" defaultValue="2026-11-02" locale="de-DE" />
    )
    expect(labels(getByRole("group")).length).toBe(3)
    expect(
      (getByRole("group").querySelector("[data-type=year]") as HTMLInputElement)
        .value
    ).toBe("2026")
  })

  it("adds the time with a time granularity", () => {
    const { getByRole } = render(
      <DateInput
        aria-label="Departure"
        defaultValue="2026-11-02T14:30"
        granularity="minute"
        hourCycle={24}
        locale="en-US"
      />
    )
    expect(
      getByRole("group").querySelectorAll("[role=spinbutton]")
    ).toHaveLength(5)
  })

  it("steps the day and reports an ISO date", () => {
    const onValueChange = vi.fn()
    const { getByRole } = render(
      <DateInput
        aria-label="Date"
        defaultValue="2026-11-02"
        locale="en-US"
        onValueChange={onValueChange}
      />
    )
    const day = getByRole("group").querySelector(
      "[data-type=day]"
    ) as HTMLInputElement
    fireEvent.keyDown(day, { key: "ArrowUp" })
    expect(onValueChange.mock.calls.at(-1)?.[0]).toBe("2026-11-03")
  })

  it("marks unavailable dates invalid", () => {
    const { getByRole } = render(
      <DateInput
        aria-label="Date"
        defaultValue="2026-11-01"
        unavailable={{ weekday: [0, 6] }}
      />
    )
    expect(getByRole("group").hasAttribute("data-invalid")).toBe(true)
  })

  it("submits the ISO value and resets with its form", async () => {
    const { container, getByRole } = render(
      <form>
        <DateInput aria-label="Date" name="date" defaultValue="2026-11-02" />
      </form>
    )
    const form = container.querySelector("form") as HTMLFormElement
    expect(new FormData(form).get("date")).toBe("2026-11-02")
    const day = getByRole("group").querySelector(
      "[data-type=day]"
    ) as HTMLInputElement
    fireEvent.keyDown(day, { key: "ArrowUp" })
    expect(new FormData(form).get("date")).toBe("2026-11-03")
    act(() => form.reset())
    await waitFor(() =>
      expect(new FormData(form).get("date")).toBe("2026-11-02")
    )
  })

  it("sets a value with a controller", () => {
    const controller = createDateInputController()
    const { getByRole } = render(
      <DateInput aria-label="Date" locale="en-US" controller={controller} />
    )
    act(() => {
      controller.setValue("2026-12-25")
    })
    expect(
      (
        getByRole("group").querySelector(
          "[data-type=month]"
        ) as HTMLInputElement
      ).value
    ).toBe("12")
  })

  it("renders on the server", () => {
    const html = renderToString(
      <DateInput aria-label="Date" defaultValue="2026-11-02" locale="en-US" />
    )
    expect(html).toContain('data-slot="date-input"')
    expect(html).toContain('value="2026"')
  })
})
