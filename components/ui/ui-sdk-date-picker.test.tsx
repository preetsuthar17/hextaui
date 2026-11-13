import * as React from "react"
import { act, cleanup, fireEvent, render } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, beforeAll, describe, expect, it } from "vitest"

import {
  createDatePickerController,
  DatePicker,
  DatePickerClear,
  DatePickerContent,
  DatePickerControl,
  DatePickerHint,
  DatePickerInput,
  DatePickerPreset,
  DatePickerSeparator,
  DatePickerTrigger,
} from "./ui-sdk-date-picker"

beforeAll(() => {
  if (!Element.prototype.getAnimations) {
    Element.prototype.getAnimations = () => []
  }
})

afterEach(cleanup)

function Picker(props: Partial<React.ComponentProps<typeof DatePicker>>) {
  return (
    <DatePicker locale="en-US" {...props}>
      <DatePickerControl>
        <DatePickerInput aria-label="Due date" />
        <DatePickerClear />
        <DatePickerTrigger />
      </DatePickerControl>
      <DatePickerHint />
      <DatePickerContent />
    </DatePicker>
  )
}

describe("UI SDK DatePicker", () => {
  it("formats the value for the locale and shows the format as a hint", () => {
    const { getByLabelText, container } = render(
      <Picker defaultValue="2026-11-20" />
    )
    expect((getByLabelText("Due date") as HTMLInputElement).value).toBe(
      "11/20/2026"
    )
    expect(
      container.querySelector("[data-slot=date-picker-hint]")?.textContent
    ).toBe("MM/DD/YYYY")
  })

  it("labels the icon buttons and hides Clear when empty", () => {
    const { getByRole, container } = render(<Picker />)
    expect(getByRole("button", { name: "Choose date" })).toBeTruthy()
    const clear = container.querySelector("[data-slot=date-picker-clear]")!
    expect(clear.getAttribute("aria-label")).toBe("Clear")
    expect(clear.className).toContain("data-empty:hidden")
  })

  it("commits a typed date on Enter as an ISO value", () => {
    const changes: unknown[] = []
    const { getByLabelText } = render(
      <Picker onValueChange={(value) => changes.push(value)} />
    )
    const input = getByLabelText("Due date") as HTMLInputElement
    fireEvent.change(input, { target: { value: "3/14/2027" } })
    fireEvent.keyDown(input, { key: "Enter" })
    expect(changes.at(-1)).toBe("2027-03-14")
  })

  it("opens the calendar on the selected month with styled days", () => {
    const { container, getByRole } = render(
      <Picker defaultValue="2026-11-20" />
    )
    act(() => {
      getByRole("button", { name: /^Choose date/ }).click()
    })
    const popup = document.querySelector("[data-slot=date-picker-content]")!
    expect(popup).toBeTruthy()
    expect(
      popup.querySelector("[data-slot=calendar-heading]")?.textContent
    ).toBe("November 2026")
    const selected = popup.querySelector(
      "[data-slot=calendar-day][data-selected]"
    )!
    expect(selected.textContent).toBe("20")
    expect(selected.className).toContain("data-[selected]:bg-primary")
    expect(container).toBeTruthy()
  })

  it("renders a range with a separator and presets", () => {
    const { getByRole } = render(
      <DatePicker mode="range" locale="en-US" defaultOpen>
        <DatePickerControl>
          <DatePickerInput aria-label="From" />
          <DatePickerSeparator />
          <DatePickerInput end aria-label="To" />
        </DatePickerControl>
        <DatePickerContent>
          <DatePickerPreset value={["2026-11-01", "2026-11-07"]}>
            First week
          </DatePickerPreset>
        </DatePickerContent>
      </DatePicker>
    )
    const preset = getByRole("button", { name: "First week", hidden: true })
    act(() => {
      preset.click()
    })
    expect(
      (document.querySelector("[aria-label=From]") as HTMLInputElement).value
    ).toBe("11/01/2026")
    expect(
      (document.querySelector("[aria-label=To]") as HTMLInputElement).value
    ).toBe("11/07/2026")
  })

  it("sets the value from a controller", () => {
    const picker = createDatePickerController()
    const { getByLabelText } = render(<Picker controller={picker} />)
    act(() => {
      picker.setValue("2026-12-25")
    })
    expect((getByLabelText("Due date") as HTMLInputElement).value).toBe(
      "12/25/2026"
    )
  })

  it("disables the input and trigger", () => {
    const { getByLabelText, getByRole } = render(
      <Picker disabled defaultValue="2026-11-20" />
    )
    expect(getByLabelText("Due date")).toHaveProperty("disabled", true)
    expect(getByRole("button", { name: /^Choose date/ })).toHaveProperty(
      "disabled",
      true
    )
  })

  it("renders on the server", () => {
    const html = renderToString(
      <DatePicker locale="en-US" defaultValue="2026-11-20">
        <DatePickerControl>
          <DatePickerInput aria-label="Due date" />
          <DatePickerTrigger />
        </DatePickerControl>
      </DatePicker>
    )
    expect(html).toContain('data-slot="date-picker-control"')
    expect(html).toContain('value="11/20/2026"')
  })
})
