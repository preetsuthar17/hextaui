import * as React from "react"
import { act, cleanup, fireEvent, render } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  TimeInput,
  TimeInputSegment,
  createTimeInputController,
} from "./ui-sdk-time-input"

afterEach(cleanup)

describe("UI SDK Time Input", () => {
  it("renders a spinbutton for each part of the time", () => {
    const { getByRole, getAllByRole } = render(
      <TimeInput aria-label="Start" defaultValue="18:45" locale="en-US" />
    )
    expect(getByRole("group", { name: "Start" })).toBeTruthy()
    const segments = getAllByRole("spinbutton")
    expect(
      segments.map((segment) => segment.getAttribute("aria-label"))
    ).toEqual(["hour", "minute", "AM/PM"])
    expect(
      segments.map((segment) => (segment as HTMLInputElement).value)
    ).toEqual(["06", "45", "PM"])
  })

  it("uses a 24-hour clock with seconds", () => {
    const { getAllByRole } = render(
      <TimeInput
        aria-label="Start"
        defaultValue="18:45:30"
        hourCycle={24}
        granularity="second"
        locale="en-US"
      />
    )
    expect(
      getAllByRole("spinbutton").map((segment) =>
        segment.getAttribute("aria-label")
      )
    ).toEqual(["hour", "minute", "second"])
  })

  it("steps a segment with the arrow keys", () => {
    const onValueChange = vi.fn()
    const { getAllByRole } = render(
      <TimeInput
        aria-label="Start"
        defaultValue="09:30"
        hourCycle={24}
        locale="en-US"
        onValueChange={onValueChange}
      />
    )
    fireEvent.keyDown(getAllByRole("spinbutton")[1], { key: "ArrowUp" })
    expect(onValueChange.mock.calls.at(-1)?.[0]).toBe("09:31")
  })

  it("marks the field invalid outside min and max, or when told", () => {
    const { getByRole, rerender } = render(
      <TimeInput aria-label="Start" defaultValue="20:00" max="17:00" />
    )
    expect(getByRole("group").hasAttribute("data-invalid")).toBe(true)
    rerender(<TimeInput aria-label="Start" defaultValue="20:00" invalid />)
    const group = getByRole("group")
    expect(group.hasAttribute("data-invalid")).toBe(true)
    for (const segment of group.querySelectorAll("[role=spinbutton]")) {
      expect(segment.getAttribute("aria-invalid")).toBe("true")
    }
    for (const literal of group.querySelectorAll("[data-type=literal]")) {
      expect(literal.hasAttribute("aria-invalid")).toBe(false)
    }
  })

  it("submits a 24-hour value under its name", () => {
    const { container } = render(
      <form>
        <TimeInput aria-label="Start" name="start" defaultValue="18:45" />
      </form>
    )
    const form = container.querySelector("form") as HTMLFormElement
    expect(new FormData(form).get("start")).toBe("18:45")
  })

  it("renders custom children around the segments", () => {
    const { getByTestId, getAllByRole } = render(
      <TimeInput aria-label="Start" defaultValue="09:30" hourCycle={24}>
        {(state) => (
          <>
            <span data-testid="icon" />
            {state.segments.map((segment) => (
              <TimeInputSegment key={segment.key} segment={segment} />
            ))}
          </>
        )}
      </TimeInput>
    )
    expect(getByTestId("icon")).toBeTruthy()
    expect(getAllByRole("spinbutton")).toHaveLength(2)
  })

  it("sets and clears the value with a controller", () => {
    const controller = createTimeInputController()
    const { getAllByRole } = render(
      <TimeInput aria-label="Start" hourCycle={24} controller={controller} />
    )
    act(() => {
      controller.setValue("07:05")
    })
    expect(controller.getValue()).toBe("07:05")
    expect((getAllByRole("spinbutton")[0] as HTMLInputElement).value).toBe("07")
    act(() => {
      controller.clear()
    })
    expect(controller.getValue()).toBe(null)
  })

  it("renders on the server", () => {
    const html = renderToString(
      <TimeInput aria-label="Start" defaultValue="09:30" locale="en-US" />
    )
    expect(html).toContain('data-slot="time-input"')
    expect(html).toContain('value="09"')
  })
})
