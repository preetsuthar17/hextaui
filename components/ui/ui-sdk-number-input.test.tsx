import * as React from "react"
import { act, cleanup, fireEvent, render } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
  NumberInputScrubArea,
  NumberInputStepper,
  createNumberInputController,
} from "./ui-sdk-number-input"

afterEach(cleanup)

function Example(props: React.ComponentProps<typeof NumberInput>) {
  return (
    <NumberInput {...props}>
      <NumberInputGroup>
        <NumberInputDecrement />
        <NumberInputControl aria-label="Quantity" />
        <NumberInputIncrement />
      </NumberInputGroup>
    </NumberInput>
  )
}

describe("UI SDK Number Input", () => {
  it("renders a text input with named step buttons", () => {
    const { getByLabelText, getByRole } = render(<Example defaultValue={2} />)
    const input = getByLabelText("Quantity") as HTMLInputElement
    expect(input.value).toBe("2")
    expect(getByRole("button", { name: "Increase" }).tabIndex).toBe(-1)
    expect(getByRole("button", { name: "Decrease" })).toBeTruthy()
  })

  it("steps with the arrow keys and stops at the bounds", () => {
    const onValueChange = vi.fn()
    const { getByLabelText, getByRole } = render(
      <Example defaultValue={7} max={8} onValueChange={onValueChange} />
    )
    const input = getByLabelText("Quantity") as HTMLInputElement
    fireEvent.keyDown(input, { key: "ArrowUp" })
    fireEvent.keyUp(input, { key: "ArrowUp" })
    expect(onValueChange.mock.calls.at(-1)?.[0]).toBe(8)
    expect(input.value).toBe("8")
    const increment = getByRole("button", { name: "Increase" })
    expect(increment.hasAttribute("data-at-bound")).toBe(true)
    expect(increment.hasAttribute("data-disabled")).toBe(true)
  })

  it("formats currency for a locale", () => {
    const { getByLabelText } = render(
      <Example
        defaultValue={1234.5}
        locale="de-DE"
        format={{ style: "currency", currency: "EUR" }}
      />
    )
    expect((getByLabelText("Quantity") as HTMLInputElement).value).toBe(
      "1.234,50\u00a0€"
    )
  })

  it("marks invalid, disabled and read-only states", () => {
    const { getByLabelText, container, rerender } = render(
      <Example invalid />
    )
    expect(getByLabelText("Quantity").getAttribute("aria-invalid")).toBe(
      "true"
    )
    expect(
      container
        .querySelector("[data-slot=number-input]")!
        .hasAttribute("data-invalid")
    ).toBe(true)
    rerender(<Example disabled />)
    expect((getByLabelText("Quantity") as HTMLInputElement).disabled).toBe(true)
    rerender(<Example readOnly />)
    expect((getByLabelText("Quantity") as HTMLInputElement).readOnly).toBe(
      true
    )
  })

  it("follows a controller", () => {
    const controller = createNumberInputController()
    const { getByLabelText } = render(
      <Example controller={controller} defaultValue={5} step={5} />
    )
    act(() => {
      controller.increment()
    })
    expect((getByLabelText("Quantity") as HTMLInputElement).value).toBe("10")
  })

  it("sets the group variant for the stacked layout", () => {
    const { container } = render(
      <NumberInput defaultValue={1}>
        <NumberInputGroup variant="stacked">
          <NumberInputControl aria-label="Quantity" />
          <NumberInputStepper>
            <NumberInputIncrement />
            <NumberInputDecrement />
          </NumberInputStepper>
        </NumberInputGroup>
      </NumberInput>
    )
    expect(
      container
        .querySelector("[data-slot=number-input-group]")!
        .getAttribute("data-variant")
    ).toBe("stacked")
  })

  it("renders on the server with a scrub area", () => {
    const html = renderToString(
      <NumberInput defaultValue={3} name="qty">
        <NumberInputScrubArea>Qty</NumberInputScrubArea>
        <NumberInputGroup>
          <NumberInputControl aria-label="Quantity" />
        </NumberInputGroup>
      </NumberInput>
    )
    expect(html).toContain('data-slot="number-input-scrub-area"')
    expect(html).toContain('value="3"')
  })
})
