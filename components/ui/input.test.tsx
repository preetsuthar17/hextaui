import * as React from "react"
import { Field } from "@base-ui/react/field"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Input, inputVariants } from "./input"

afterEach(() => {
  cleanup()
})

describe("Input", () => {
  it("renders a labelled text input with slot and default size", () => {
    render(
      <label>
        Email
        <Input type="email" />
      </label>
    )
    const input = screen.getByRole("textbox", { name: "Email" })

    expect(input.tagName).toBe("INPUT")
    expect(input.getAttribute("data-slot")).toBe("input")
    expect(input.getAttribute("data-size")).toBe("default")
    expect(input.className).toContain("h-9")
  })

  it("applies each size and keeps the native size attribute separate", () => {
    const { rerender } = render(<Input aria-label="Name" size="sm" />)
    const input = screen.getByRole("textbox")

    expect(input.getAttribute("data-size")).toBe("sm")
    expect(input.className).toContain("h-8")
    expect(input.hasAttribute("size")).toBe(false)

    rerender(<Input aria-label="Name" size="lg" htmlSize={12} />)
    expect(input.className).toContain("h-10")
    expect(input.getAttribute("size")).toBe("12")
  })

  it("falls back to the default size for a null size", () => {
    render(<Input aria-label="Name" size={null} />)

    expect(screen.getByRole("textbox").getAttribute("data-size")).toBe(
      "default"
    )
  })

  it("merges string and function class names", () => {
    const { rerender } = render(<Input aria-label="Name" className="w-40" />)
    const input = screen.getByRole("textbox")

    expect(input.className).toContain("w-40")
    expect(input.className).not.toMatch(/(^| )w-full( |$)/)

    rerender(
      <Input
        aria-label="Name"
        disabled
        className={(state) => (state.disabled ? "is-off" : "is-on")}
      />
    )
    expect(input.className).toContain("is-off")
    expect(input.className).toContain("h-9")
  })

  it("reports the new value as a string and still calls onChange", () => {
    const onValueChange = vi.fn()
    const onChange = vi.fn()
    render(
      <Input
        aria-label="Name"
        onValueChange={onValueChange}
        onChange={onChange}
      />
    )

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Ada" } })

    expect(onValueChange).toHaveBeenCalledTimes(1)
    expect(onValueChange.mock.calls[0][0]).toBe("Ada")
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it("stays on the controlled value when the parent refuses an update", () => {
    function Stubborn() {
      const [value] = React.useState("fixed")
      return <Input aria-label="Name" value={value} onValueChange={() => {}} />
    }
    render(<Stubborn />)
    const input = screen.getByRole<HTMLInputElement>("textbox")

    fireEvent.change(input, { target: { value: "changed" } })

    expect(input.value).toBe("fixed")
  })

  it("updates when controlled", () => {
    function Controlled() {
      const [value, setValue] = React.useState("")
      return (
        <>
          <Input aria-label="Name" value={value} onValueChange={setValue} />
          <output>{value.length}</output>
        </>
      )
    }
    render(<Controlled />)

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Hello" },
    })

    expect(screen.getByRole("status").textContent).toBe("5")
  })

  it("forwards refs and native attributes", () => {
    const ref = React.createRef<HTMLInputElement>()
    render(
      <Input
        ref={ref}
        aria-label="Code"
        name="code"
        required
        pattern="[A-Z]{4}"
        maxLength={4}
        readOnly
        defaultValue="ABCD"
      />
    )
    const input = ref.current!

    expect(input).toBe(screen.getByRole("textbox"))
    expect(input.name).toBe("code")
    expect(input.required).toBe(true)
    expect(input.pattern).toBe("[A-Z]{4}")
    expect(input.maxLength).toBe(4)
    expect(input.readOnly).toBe(true)
    expect(input.value).toBe("ABCD")
  })

  it("marks disabled and invalid states", () => {
    render(<Input aria-label="Name" disabled aria-invalid />)
    const input = screen.getByRole<HTMLInputElement>("textbox")

    expect(input.disabled).toBe(true)
    expect(input.hasAttribute("data-disabled")).toBe(true)
    expect(input.getAttribute("aria-invalid")).toBe("true")
  })

  it("picks up label, description and validity from a Base UI Field", () => {
    render(
      <Field.Root invalid>
        <Field.Label>Username</Field.Label>
        <Input />
        <Field.Description>Shown on your profile.</Field.Description>
      </Field.Root>
    )
    const input = screen.getByRole("textbox", { name: "Username" })
    const description = screen.getByText("Shown on your profile.")

    expect(input.hasAttribute("data-invalid")).toBe(true)
    expect(input.getAttribute("aria-describedby")).toContain(description.id)
  })

  it("renders as another element through render", () => {
    render(<Input aria-label="Notes" render={<textarea />} />)
    const textarea = screen.getByRole("textbox", { name: "Notes" })

    expect(textarea.tagName).toBe("TEXTAREA")
    expect(textarea.getAttribute("data-slot")).toBe("input")
  })

  it("keeps the hover edge off invalid, disabled and read-only inputs", () => {
    const classes = inputVariants()

    expect(classes).toContain(
      "not-aria-invalid:not-data-invalid:not-user-invalid:inset-ring-ring/70"
    )
    expect(classes).toContain("not-disabled")
    expect(classes).toContain("not-[[readonly]]")
  })

  it("keeps a 16px font on touch screens so iOS never zooms", () => {
    expect(inputVariants({ size: "sm" })).toContain(
      "pointer-coarse:text-[max(16px,1rem)]"
    )
  })

  it("server renders without errors", () => {
    const html = renderToString(<Input aria-label="Name" defaultValue="Ada" />)

    expect(html).toContain('data-slot="input"')
    expect(html).toContain('value="Ada"')
  })
})
