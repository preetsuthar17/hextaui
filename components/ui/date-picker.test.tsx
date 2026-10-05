import * as React from "react"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import { DatePicker, DateRangePicker } from "@/components/ui/date-picker"

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

async function flush() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
  })
}

function trigger() {
  return document.querySelector<HTMLButtonElement>(
    "[data-slot=date-picker-trigger]"
  )!
}

async function open() {
  fireEvent.click(trigger())
  await flush()
}

function day(label: RegExp) {
  return screen.getByRole("button", { name: label })
}

function stubPhone(matches: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }))
}

describe("DatePicker", () => {
  it("shows the placeholder, then the picked date, and closes", async () => {
    const onValueChange = vi.fn()
    render(
      <DatePicker
        defaultValue={null}
        onValueChange={onValueChange}
        calendarProps={{ defaultMonth: new Date(2026, 9, 1) }}
      />
    )

    expect(trigger().textContent).toBe("Pick a date")
    expect(trigger().hasAttribute("data-empty")).toBe(true)

    await open()
    expect(
      document.querySelector("[data-slot=date-picker-content]")
    ).toBeTruthy()

    fireEvent.click(day(/October 14th, 2026/))
    await flush()

    expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 9, 14))
    expect(trigger().textContent).toBe("Oct 14, 2026")
    expect(trigger().hasAttribute("data-empty")).toBe(false)
    expect(trigger().getAttribute("aria-expanded")).toBe("false")
  })

  it("opens on the selected month and keeps the day selected when picked again", async () => {
    const onValueChange = vi.fn()
    render(
      <DatePicker
        defaultValue={new Date(2024, 1, 29)}
        onValueChange={onValueChange}
      />
    )
    await open()

    const selected = day(/February 29th, 2024/)
    expect(selected.closest("[data-selected]")).toBeTruthy()

    fireEvent.click(selected)
    await flush()
    expect(onValueChange).toHaveBeenLastCalledWith(new Date(2024, 1, 29))
    expect(trigger().textContent).toBe("Feb 29, 2024")
  })

  it("is fully controlled when value is passed", async () => {
    function Controlled() {
      const [value, setValue] = React.useState<Date | null>(
        new Date(2026, 0, 1)
      )
      return (
        <>
          <DatePicker value={value} onValueChange={setValue} clearable />
          <button onClick={() => setValue(new Date(2026, 5, 15))}>set</button>
        </>
      )
    }
    render(<Controlled />)
    expect(trigger().textContent).toBe("Jan 1, 2026")

    fireEvent.click(screen.getByText("set"))
    expect(trigger().textContent).toBe("Jun 15, 2026")

    await open()
    fireEvent.click(screen.getByRole("button", { name: "Clear" }))
    await flush()
    expect(trigger().textContent).toBe("Pick a date")
  })

  it("ignores picks when the parent rejects the value", async () => {
    render(<DatePicker value={new Date(2026, 0, 1)} onValueChange={() => {}} />)
    await open()
    fireEvent.click(day(/January 20th, 2026/))
    await flush()
    expect(trigger().textContent).toBe("Jan 1, 2026")
  })

  it("supports controlled open", async () => {
    const onOpenChange = vi.fn()
    const { rerender } = render(
      <DatePicker open={false} onOpenChange={onOpenChange} />
    )
    fireEvent.click(trigger())
    await flush()
    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(document.querySelector("[data-slot=date-picker-content]")).toBeNull()

    rerender(<DatePicker open onOpenChange={onOpenChange} />)
    await flush()
    expect(
      document.querySelector("[data-slot=date-picker-content]")
    ).toBeTruthy()
  })

  it("hides Clear unless clearable and set", async () => {
    render(<DatePicker clearable />)
    await open()
    expect(screen.queryByRole("button", { name: "Clear" })).toBeNull()
  })

  it("submits an ISO date through a hidden input", () => {
    render(
      <form data-testid="form">
        <DatePicker name="due" defaultValue={new Date(2026, 2, 5)} />
        <DatePicker name="empty" />
      </form>
    )
    const data = new FormData(screen.getByTestId("form") as HTMLFormElement)
    expect(data.get("due")).toBe("2026-03-05")
    expect(data.get("empty")).toBe("")
  })

  it("does not open when disabled", async () => {
    render(<DatePicker disabled />)
    expect(trigger().disabled).toBe(true)
    await open()
    expect(document.querySelector("[data-slot=date-picker-content]")).toBeNull()
  })

  it("passes trigger props and labels through", () => {
    render(
      <>
        <label htmlFor="dob">Date of birth</label>
        <DatePicker id="dob" className="w-full" />
      </>
    )
    expect(screen.getByLabelText("Date of birth")).toBe(trigger())
    expect(trigger().className).toContain("w-full")
    expect(trigger().className).not.toContain("w-60")
  })

  it("formats with the locale", () => {
    render(<DatePicker locale="de-DE" defaultValue={new Date(2026, 9, 2)} />)
    expect(trigger().textContent).toBe("02.10.2026")
  })

  it("uses a bottom sheet on phones", async () => {
    stubPhone(true)
    render(<DatePicker title="Due date" />)
    await open()
    expect(screen.getByRole("dialog").textContent).toContain("Due date")
    expect(document.querySelector("[data-slot=sheet-content]")).toBeTruthy()
    expect(document.querySelector("[data-slot=popover-content]")).toBeNull()
  })

  it("keeps the overlay data-slot so nested parts can react to it", async () => {
    render(<DatePicker />)
    await open()
    expect(
      document
        .querySelector("[data-slot=date-picker-content]")
        ?.closest("[data-slot=popover-content]")
    ).toBeTruthy()
  })

  it("renders on the server without a window", () => {
    const html = renderToString(
      <DatePicker defaultValue={new Date(2026, 9, 2)} name="d" />
    )
    expect(html).toContain("Oct 2, 2026")
    expect(html).toContain('value="2026-10-02"')
  })
})

describe("DateRangePicker", () => {
  const october = { defaultMonth: new Date(2026, 9, 1) }

  it("needs two clicks and orders them", async () => {
    const onValueChange = vi.fn()
    render(
      <DateRangePicker onValueChange={onValueChange} calendarProps={october} />
    )
    await open()

    fireEvent.click(day(/October 20th, 2026/))
    await flush()
    expect(onValueChange).not.toHaveBeenCalled()
    expect(trigger().getAttribute("aria-expanded")).toBe("true")

    fireEvent.click(day(/October 12th, 2026/))
    await flush()
    expect(onValueChange).toHaveBeenCalledWith({
      from: new Date(2026, 9, 12),
      to: new Date(2026, 9, 20),
    })
    expect(trigger().getAttribute("aria-expanded")).toBe("false")
  })

  it("starts a fresh range on reopen instead of extending the old one", async () => {
    const onValueChange = vi.fn()
    render(
      <DateRangePicker
        defaultValue={{ from: new Date(2026, 9, 5), to: new Date(2026, 9, 9) }}
        onValueChange={onValueChange}
      />
    )
    await open()
    fireEvent.click(day(/October 20th, 2026/))
    await flush()
    expect(onValueChange).not.toHaveBeenCalled()
    fireEvent.click(day(/October 22nd, 2026/))
    await flush()
    expect(onValueChange).toHaveBeenCalledWith({
      from: new Date(2026, 9, 20),
      to: new Date(2026, 9, 22),
    })
  })

  it("allows a one-day range", async () => {
    const onValueChange = vi.fn()
    render(
      <DateRangePicker onValueChange={onValueChange} calendarProps={october} />
    )
    await open()
    fireEvent.click(day(/October 7th, 2026/))
    await flush()
    fireEvent.click(day(/October 7th, 2026/))
    await flush()
    expect(onValueChange).toHaveBeenCalledWith({
      from: new Date(2026, 9, 7),
      to: new Date(2026, 9, 7),
    })
    expect(trigger().textContent).toBe("Oct 7, 2026")
  })

  it("drops an unfinished range when closed", async () => {
    render(<DateRangePicker calendarProps={october} />)
    await open()
    fireEvent.click(day(/October 7th, 2026/))
    await flush()
    fireEvent.keyDown(document.activeElement ?? document.body, {
      key: "Escape",
    })
    await flush()
    expect(trigger().textContent).toBe("Pick a date range")
    await open()
    expect(document.querySelector("[data-selected]")).toBeNull()
  })

  it("shows two months, or one on phones", async () => {
    render(<DateRangePicker />)
    await open()
    expect(screen.getAllByRole("grid")).toHaveLength(2)
    cleanup()

    stubPhone(true)
    render(<DateRangePicker />)
    await open()
    expect(screen.getAllByRole("grid")).toHaveLength(1)
  })

  it("uses plain spaces so server and browser labels match", () => {
    render(
      <DateRangePicker
        defaultValue={{
          from: new Date(2026, 9, 20),
          to: new Date(2026, 9, 24),
        }}
      />
    )
    expect(trigger().textContent).toBe("Oct 20 – 24, 2026")
    expect(trigger().textContent).not.toMatch(/[   ]/)
  })

  it("submits start/end", () => {
    render(
      <form data-testid="form">
        <DateRangePicker
          name="stay"
          defaultValue={{
            from: new Date(2026, 9, 20),
            to: new Date(2026, 9, 24),
          }}
        />
      </form>
    )
    const data = new FormData(screen.getByTestId("form") as HTMLFormElement)
    expect(data.get("stay")).toBe("2026-10-20/2026-10-24")
  })
})
