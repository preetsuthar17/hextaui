import * as React from "react"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Checkbox } from "./checkbox"
import { Input } from "./input"
import { Label } from "./label"

afterEach(() => {
  cleanup()
})

function label() {
  return document.querySelector<HTMLElement>("[data-slot=label]")!
}

async function flush() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
  })
}

describe("Label", () => {
  it("names its control through htmlFor and through nesting", () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <Input id="email" />
        <Label>
          <Checkbox />
          Remember me
        </Label>
      </>
    )

    expect(screen.getByRole("textbox", { name: "Email" })).toBeTruthy()
    expect(screen.getByRole("checkbox", { name: "Remember me" })).toBeTruthy()
  })

  it("mirrors the control's disabled, required and read-only state", () => {
    render(
      <>
        <Label htmlFor="name">Name</Label>
        <Input id="name" disabled required readOnly />
      </>
    )

    expect(label().hasAttribute("data-disabled")).toBe(true)
    expect(label().hasAttribute("data-required")).toBe(true)
    expect(label().hasAttribute("data-readonly")).toBe(true)
  })

  it("follows changes to the control's attributes", async () => {
    function Toggle() {
      const [disabled, setDisabled] = React.useState(false)
      return (
        <>
          <Label htmlFor="code">Code</Label>
          <Input id="code" disabled={disabled} aria-invalid={disabled} />
          <button type="button" onClick={() => setDisabled(true)}>
            Lock
          </button>
        </>
      )
    }
    render(<Toggle />)
    expect(label().hasAttribute("data-disabled")).toBe(false)

    fireEvent.click(screen.getByRole("button", { name: "Lock" }))
    await flush()
    expect(label().hasAttribute("data-disabled")).toBe(true)
    expect(label().hasAttribute("data-invalid")).toBe(true)
  })

  it("shows an indicator only when asked", () => {
    render(
      <>
        <Label htmlFor="a" indicator="required">
          A
        </Label>
        <Input id="a" required />
        <Label htmlFor="b" indicator="optional" optionalText="Not needed">
          B
        </Label>
        <Input id="b" />
        <Label htmlFor="c">C</Label>
        <Input id="c" required />
      </>
    )

    const marks = document.querySelectorAll("[data-slot=label-indicator]")
    expect(Array.from(marks, (mark) => mark.textContent)).toEqual([
      "*",
      "Not needed",
    ])
    expect(marks[0].getAttribute("aria-hidden")).toBe("true")
    expect(screen.getByRole("textbox", { name: "A" })).toBeTruthy()
  })

  it("stops double-click text selection without blocking controls", () => {
    const onMouseDown = vi.fn()
    render(
      <Label onMouseDown={onMouseDown}>
        <input aria-label="inner" />
        Text
      </Label>
    )

    const text = new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
      detail: 2,
    })
    label().dispatchEvent(text)
    expect(text.defaultPrevented).toBe(true)

    const single = new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
      detail: 1,
    })
    label().dispatchEvent(single)
    expect(single.defaultPrevented).toBe(false)

    const inner = new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
      detail: 2,
    })
    screen.getByRole("textbox").dispatchEvent(inner)
    expect(inner.defaultPrevented).toBe(false)
    expect(onMouseDown).toHaveBeenCalledTimes(3)
  })

  it("forwards refs and renders on the server", () => {
    const ref = React.createRef<HTMLLabelElement>()
    render(<Label ref={ref}>Name</Label>)
    expect(ref.current).toBe(label())

    const html = renderToString(<Label htmlFor="x">Name</Label>)
    expect(html).toContain('data-slot="label"')
    expect(html).toContain('for="x"')
  })

  it("finds a control rendered after the label", async () => {
    function Late() {
      const [show, setShow] = React.useState(false)
      React.useEffect(() => setShow(true), [])
      return (
        <>
          <Label htmlFor="late">Late</Label>
          {show && <Input id="late" disabled />}
        </>
      )
    }
    render(<Late />)
    await act(async () => {
      await new Promise((resolve) => requestAnimationFrame(() => resolve(0)))
    })
    expect(label().hasAttribute("data-disabled")).toBe(true)
  })
})

describe("validation", () => {
  it("marks the label invalid when a submit finds the control invalid", async () => {
    render(
      <form>
        <Label htmlFor="required-email">Email</Label>
        <Input id="required-email" required />
      </form>
    )

    const input = screen.getByRole("textbox") as HTMLInputElement
    input.setAttribute("aria-invalid", "true")
    await flush()
    expect(label().hasAttribute("data-invalid")).toBe(true)

    input.removeAttribute("aria-invalid")
    fireEvent.invalid(input)
    await flush()
    expect(label().hasAttribute("data-invalid")).toBe(false)
  })
})
