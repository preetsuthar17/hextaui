import * as React from "react"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Field, FieldError, FieldLabel } from "./field"
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "./native-select"

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

function Fruits(props: React.ComponentProps<typeof NativeSelect>) {
  return (
    <NativeSelect aria-label="Fruit" {...props}>
      <NativeSelectOption value="">Select a fruit</NativeSelectOption>
      <NativeSelectOptGroup label="Citrus">
        <NativeSelectOption value="orange">Orange</NativeSelectOption>
        <NativeSelectOption value="lemon">Lemon</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOption value="apple">Apple</NativeSelectOption>
    </NativeSelect>
  )
}

describe("NativeSelect", () => {
  it("renders a real select with slots, size and className on the wrapper", () => {
    render(<Fruits size="sm" className="w-full" />)

    const select = screen.getByRole("combobox", { name: "Fruit" })
    const wrapper = select.closest("[data-slot=native-select-wrapper]")!
    expect(select.tagName).toBe("SELECT")
    expect(select.getAttribute("data-slot")).toBe("native-select")
    expect(select.getAttribute("data-size")).toBe("sm")
    expect(wrapper.className).toContain("w-full")
    expect(
      wrapper
        .querySelector("[data-slot=native-select-icon]")
        ?.getAttribute("aria-hidden")
    ).toBe("true")
    expect(screen.getAllByRole("option")).toHaveLength(4)
  })

  it("is controllable and forwards refs", () => {
    const ref = React.createRef<HTMLSelectElement>()
    function Controlled() {
      const [value, setValue] = React.useState("apple")
      return (
        <Fruits
          ref={ref}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      )
    }
    render(<Controlled />)

    const select = screen.getByRole("combobox") as HTMLSelectElement
    expect(ref.current).toBe(select)
    expect(select.value).toBe("apple")
    fireEvent.change(select, { target: { value: "lemon" } })
    expect(select.value).toBe("lemon")
  })

  it("is labelled by a Field and reflects its invalid state", () => {
    render(
      <Field invalid>
        <FieldLabel>Department</FieldLabel>
        <NativeSelect>
          <NativeSelectOption value="design">Design</NativeSelectOption>
        </NativeSelect>
        <FieldError>Pick a department.</FieldError>
      </Field>
    )

    const select = screen.getByRole("combobox", { name: "Department" })
    expect(select.hasAttribute("data-invalid")).toBe(true)
  })

  it("shakes the frame when a submit finds it invalid", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }))
    render(
      <form onSubmit={(event) => event.preventDefault()}>
        <Fruits required />
        <button type="submit">Save</button>
      </form>
    )

    const select = screen.getByRole("combobox")
    fireEvent.click(screen.getByRole("button", { name: "Save" }))
    fireEvent.invalid(select)
    expect(select.hasAttribute("data-shake")).toBe(true)
  })

  it("server renders", () => {
    const html = renderToString(<Fruits defaultValue="apple" />)
    expect(html).toContain('data-slot="native-select"')
    expect(html).toContain("<select")
  })
})
