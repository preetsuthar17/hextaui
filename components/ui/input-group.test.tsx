import * as React from "react"
import { Field } from "@base-ui/react/field"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupClear,
  InputGroupCount,
  InputGroupInput,
  InputGroupPasswordToggle,
  InputGroupText,
  InputGroupTextarea,
} from "./input-group"

afterEach(() => {
  cleanup()
})

function slot(container: HTMLElement, name: string) {
  return container.querySelector<HTMLElement>(`[data-slot=${name}]`)!
}

describe("InputGroup", () => {
  it("renders a labelled group with its size", () => {
    const { container } = render(
      <InputGroup size="lg" aria-label="Search">
        <InputGroupInput aria-label="Query" />
      </InputGroup>
    )

    const group = slot(container, "input-group")
    expect(group.getAttribute("role")).toBe("group")
    expect(group.getAttribute("data-size")).toBe("lg")
    expect(screen.getByRole("group", { name: "Search" })).toBe(group)
  })

  it("passes the group size to the input and marks it as the control", () => {
    const { container } = render(
      <InputGroup size="sm">
        <InputGroupInput aria-label="Query" />
      </InputGroup>
    )

    const input = slot(container, "input-group-control")
    expect(input.tagName).toBe("INPUT")
    expect(input.getAttribute("data-size")).toBe("sm")
    expect(container.querySelector("[data-slot=input]")).toBeNull()
  })

  it("lets an explicit input size win over the group size", () => {
    const { container } = render(
      <InputGroup size="sm">
        <InputGroupInput size="lg" aria-label="Query" />
      </InputGroup>
    )

    expect(
      slot(container, "input-group-control").getAttribute("data-size")
    ).toBe("lg")
  })

  it("forwards input props, refs and events", () => {
    const ref = React.createRef<HTMLInputElement>()
    const onChange = vi.fn()
    render(
      <InputGroup>
        <InputGroupInput
          ref={ref}
          aria-label="Email"
          aria-invalid
          onChange={onChange}
        />
      </InputGroup>
    )

    const input = screen.getByRole("textbox", { name: "Email" })
    expect(ref.current).toBe(input)
    expect(input.getAttribute("aria-invalid")).toBe("true")
    fireEvent.change(input, { target: { value: "a" } })
    expect(onChange).toHaveBeenCalledTimes(1)
  })
})

describe("InputGroupAddon", () => {
  it("defaults to inline-start and exposes its alignment", () => {
    const { container } = render(
      <InputGroup>
        <InputGroupInput aria-label="Query" />
        <InputGroupAddon>$</InputGroupAddon>
        <InputGroupAddon align="block-end" separator>
          Footer
        </InputGroupAddon>
      </InputGroup>
    )

    const [start, end] = Array.from(
      container.querySelectorAll<HTMLElement>("[data-slot=input-group-addon]")
    )
    expect(start.getAttribute("data-align")).toBe("inline-start")
    expect(start.hasAttribute("data-separator")).toBe(false)
    expect(end.getAttribute("data-align")).toBe("block-end")
    expect(end.hasAttribute("data-separator")).toBe(true)
  })

  it("focuses the field when a non-interactive part of the addon is pressed", () => {
    const { container } = render(
      <InputGroup>
        <InputGroupInput aria-label="Query" />
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    )

    fireEvent.mouseDown(slot(container, "input-group-text"))
    expect(document.activeElement).toBe(
      screen.getByRole("textbox", { name: "Query" })
    )
  })

  it("focuses a textarea control too", () => {
    const { container } = render(
      <InputGroup>
        <InputGroupTextarea aria-label="Message" />
        <InputGroupAddon align="block-end">Footer</InputGroupAddon>
      </InputGroup>
    )

    fireEvent.mouseDown(slot(container, "input-group-addon"))
    expect(document.activeElement).toBe(
      screen.getByRole("textbox", { name: "Message" })
    )
  })

  it("leaves focus alone when a button inside the addon is pressed", () => {
    render(
      <InputGroup>
        <InputGroupInput aria-label="Query" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton>Go</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    )

    const event = fireEvent.mouseDown(
      screen.getByRole("button", { name: "Go" })
    )
    expect(event).toBe(true)
    expect(document.activeElement).not.toBe(
      screen.getByRole("textbox", { name: "Query" })
    )
  })

  it("does not focus a disabled field", () => {
    const { container } = render(
      <InputGroup>
        <InputGroupInput aria-label="Query" disabled />
        <InputGroupAddon>Icon</InputGroupAddon>
      </InputGroup>
    )

    fireEvent.mouseDown(slot(container, "input-group-addon"))
    expect(document.activeElement).toBe(document.body)
  })

  it("honours a handler that prevents the default", () => {
    const onMouseDown = vi.fn((event: React.MouseEvent) =>
      event.preventDefault()
    )
    const { container } = render(
      <InputGroup>
        <InputGroupInput aria-label="Query" />
        <InputGroupAddon onMouseDown={onMouseDown}>Icon</InputGroupAddon>
      </InputGroup>
    )

    fireEvent.mouseDown(slot(container, "input-group-addon"))
    expect(onMouseDown).toHaveBeenCalledTimes(1)
    expect(document.activeElement).toBe(document.body)
  })

  it("only focuses its own group's field", () => {
    render(
      <>
        <InputGroup>
          <InputGroupInput aria-label="First" />
          <InputGroupAddon>A</InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput aria-label="Second" />
          <InputGroupAddon>B</InputGroupAddon>
        </InputGroup>
      </>
    )

    fireEvent.mouseDown(screen.getByText("B"))
    expect(document.activeElement).toBe(
      screen.getByRole("textbox", { name: "Second" })
    )
  })
})

describe("InputGroupButton", () => {
  it("is a ghost xs button that never submits a form", () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault())
    render(
      <form onSubmit={onSubmit}>
        <InputGroup>
          <InputGroupInput aria-label="Query" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton>Clear</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>
    )

    const button = screen.getByRole("button", { name: "Clear" })
    expect(button.getAttribute("type")).toBe("button")
    expect(button.getAttribute("data-slot")).toBe("input-group-button")
    expect(button.getAttribute("data-size")).toBe("xs")
    fireEvent.click(button)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it("can still submit when asked to", () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault())
    render(
      <form onSubmit={onSubmit}>
        <InputGroupButton type="submit" size="icon-sm" aria-label="Send">
          →
        </InputGroupButton>
      </form>
    )

    const button = screen.getByRole("button", { name: "Send" })
    expect(button.getAttribute("data-size")).toBe("icon-sm")
    fireEvent.click(button)
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })
})

describe("InputGroupTextarea", () => {
  it("renders a textarea control sized to its content", () => {
    const { container } = render(
      <InputGroup>
        <InputGroupTextarea aria-label="Message" rows={2} />
      </InputGroup>
    )

    const textarea = slot(container, "input-group-control")
    expect(textarea.tagName).toBe("TEXTAREA")
    expect(textarea.getAttribute("rows")).toBe("2")
    expect(textarea.style.height).not.toBe("")
  })

  it("can opt out of growing", () => {
    const { container } = render(
      <InputGroupTextarea aria-label="Message" autoResize={false} />
    )

    expect(slot(container, "input-group-control").style.height).toBe("")
  })

  it("measures its height as the content changes", () => {
    const { container } = render(<InputGroupTextarea aria-label="Message" />)
    const textarea = slot(container, "input-group-control")
    Object.defineProperty(textarea, "scrollHeight", {
      configurable: true,
      value: 120,
    })

    fireEvent.input(textarea, { target: { value: "a\nb\nc" } })
    expect(textarea.style.height).toBe("120px")
  })

  it("forwards refs and stays controllable", () => {
    const ref = React.createRef<HTMLTextAreaElement>()
    function Controlled() {
      const [value, setValue] = React.useState("hi")
      return (
        <InputGroupTextarea
          ref={ref}
          aria-label="Message"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      )
    }
    render(<Controlled />)

    const textarea = screen.getByRole("textbox", { name: "Message" })
    expect(ref.current).toBe(textarea)
    fireEvent.change(textarea, { target: { value: "hello" } })
    expect((textarea as HTMLTextAreaElement).value).toBe("hello")
  })

  it("is labelled by a surrounding Field", () => {
    render(
      <Field.Root>
        <Field.Label>Bio</Field.Label>
        <InputGroup>
          <InputGroupTextarea />
        </InputGroup>
      </Field.Root>
    )

    expect(screen.getByRole("textbox", { name: "Bio" }).tagName).toBe(
      "TEXTAREA"
    )
  })
})

describe("Field integration", () => {
  it("marks the control invalid when the Field is invalid", () => {
    const { container } = render(
      <Field.Root invalid>
        <Field.Label>Email</Field.Label>
        <InputGroup>
          <InputGroupInput />
        </InputGroup>
      </Field.Root>
    )

    const control = slot(container, "input-group-control")
    expect(control.hasAttribute("data-invalid")).toBe(true)
    expect(screen.getByRole("textbox", { name: "Email" })).toBe(control)
  })
})

describe("InputGroupClear", () => {
  it("only shows once there is a value and clears it", () => {
    const onClear = vi.fn()
    const onChange = vi.fn()
    render(
      <InputGroup>
        <InputGroupInput aria-label="Search" onChange={onChange} />
        <InputGroupAddon align="inline-end">
          <InputGroupClear onClear={onClear} />
        </InputGroupAddon>
      </InputGroup>
    )

    const input = screen.getByRole("textbox", {
      name: "Search",
    }) as HTMLInputElement
    const clear = document.querySelector<HTMLElement>(
      "[data-slot=input-group-clear]"
    )!
    expect(clear.hasAttribute("data-visible")).toBe(false)
    expect(clear.getAttribute("aria-hidden")).toBe("true")
    expect(clear.getAttribute("tabindex")).toBe("-1")

    fireEvent.input(input, { target: { value: "hexta" } })
    expect(clear.hasAttribute("data-visible")).toBe(true)

    fireEvent.click(clear)
    expect(input.value).toBe("")
    expect(onClear).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalled()
    expect(document.activeElement).toBe(input)
    expect(clear.hasAttribute("data-visible")).toBe(false)
  })

  it("clears on Escape and lets the second Escape through", () => {
    const onKeyDown = vi.fn()
    render(
      <div onKeyDown={onKeyDown}>
        <InputGroup>
          <InputGroupInput aria-label="Search" defaultValue="query" />
          <InputGroupAddon align="inline-end">
            <InputGroupClear />
          </InputGroupAddon>
        </InputGroup>
      </div>
    )

    const input = screen.getByRole("textbox") as HTMLInputElement
    fireEvent.keyDown(input, { key: "Escape" })
    expect(input.value).toBe("")
    expect(onKeyDown).not.toHaveBeenCalled()

    fireEvent.keyDown(input, { key: "Escape" })
    expect(onKeyDown).toHaveBeenCalledTimes(1)
  })

  it("follows a controlled value set from outside", () => {
    function Controlled() {
      const [value, setValue] = React.useState("")
      return (
        <>
          <button type="button" onClick={() => setValue("filled")}>
            Fill
          </button>
          <InputGroup>
            <InputGroupInput
              aria-label="Search"
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupClear />
            </InputGroupAddon>
          </InputGroup>
        </>
      )
    }
    render(<Controlled />)

    const clear = document.querySelector<HTMLElement>(
      "[data-slot=input-group-clear]"
    )!
    fireEvent.click(screen.getByRole("button", { name: "Fill" }))
    expect(clear.hasAttribute("data-visible")).toBe(true)

    fireEvent.click(clear)
    expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("")
  })

  it("stays hidden while the field is read-only or disabled", () => {
    render(
      <InputGroup>
        <InputGroupInput aria-label="Search" defaultValue="x" readOnly />
        <InputGroupAddon align="inline-end">
          <InputGroupClear />
        </InputGroupAddon>
      </InputGroup>
    )

    const clear = document.querySelector("[data-slot=input-group-clear]")!
    expect(clear.hasAttribute("data-visible")).toBe(false)
  })

  it("throws a clear error outside a group", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<InputGroupClear />)).toThrow(
      "<InputGroupClear> must be used within <InputGroup>."
    )
  })
})

describe("InputGroupPasswordToggle", () => {
  it("reveals and hides the password with a stable name", () => {
    render(
      <InputGroup>
        <InputGroupInput aria-label="Password" type="password" />
        <InputGroupAddon align="inline-end">
          <InputGroupPasswordToggle />
        </InputGroupAddon>
      </InputGroup>
    )

    const input = screen.getByLabelText("Password")
    const toggle = screen.getByRole("button", { name: "Show password" })
    expect(input.getAttribute("type")).toBe("password")
    expect(toggle.getAttribute("aria-pressed")).toBe("false")

    fireEvent.click(toggle)
    expect(input.getAttribute("type")).toBe("text")
    expect(toggle.getAttribute("aria-pressed")).toBe("true")

    fireEvent.click(toggle)
    expect(input.getAttribute("type")).toBe("password")
  })

  it("hides the password again when the form submits", () => {
    render(
      <form onSubmit={(event) => event.preventDefault()}>
        <InputGroup>
          <InputGroupInput aria-label="Password" type="password" />
          <InputGroupAddon align="inline-end">
            <InputGroupPasswordToggle />
          </InputGroupAddon>
        </InputGroup>
        <button type="submit">Sign in</button>
      </form>
    )

    fireEvent.click(screen.getByRole("button", { name: "Show password" }))
    expect(screen.getByLabelText("Password").getAttribute("type")).toBe("text")
    fireEvent.submit(screen.getByRole("button", { name: "Sign in" }))
    expect(screen.getByLabelText("Password").getAttribute("type")).toBe(
      "password"
    )
  })

  it("can be controlled", () => {
    const onRevealedChange = vi.fn()
    render(
      <InputGroup>
        <InputGroupInput aria-label="Password" type="password" />
        <InputGroupAddon align="inline-end">
          <InputGroupPasswordToggle
            revealed
            onRevealedChange={onRevealedChange}
          />
        </InputGroupAddon>
      </InputGroup>
    )

    expect(screen.getByLabelText("Password").getAttribute("type")).toBe("text")
    fireEvent.click(screen.getByRole("button", { name: "Show password" }))
    expect(onRevealedChange).toHaveBeenCalledWith(false)
    expect(screen.getByLabelText("Password").getAttribute("type")).toBe("text")
  })

  it("never changes inputs that aren't passwords", () => {
    render(
      <InputGroup>
        <InputGroupInput aria-label="Email" type="email" />
        <InputGroupAddon align="inline-end">
          <InputGroupPasswordToggle revealed />
        </InputGroupAddon>
      </InputGroup>
    )

    expect(screen.getByLabelText("Email").getAttribute("type")).toBe("email")
  })
})

describe("InputGroupCount", () => {
  it("counts characters against maxLength and flags the limit", () => {
    render(
      <InputGroup>
        <InputGroupInput aria-label="Handle" maxLength={10} />
        <InputGroupAddon align="inline-end">
          <InputGroupCount />
        </InputGroupAddon>
      </InputGroup>
    )

    const input = screen.getByRole("textbox")
    const count = document.querySelector<HTMLElement>(
      "[data-slot=input-group-count]"
    )!
    expect(count.textContent).toContain("/10")
    expect(count.hasAttribute("data-state")).toBe(false)

    fireEvent.input(input, { target: { value: "123456789" } })
    expect(count.getAttribute("data-state")).toBe("near")
    expect(screen.getByRole("status").textContent).toBe("1 character left")

    fireEvent.input(input, { target: { value: "1234567890" } })
    expect(count.getAttribute("data-state")).toBe("limit")
    expect(screen.getByRole("status").textContent).toBe(
      "Character limit reached"
    )

    fireEvent.input(input, { target: { value: "1" } })
    expect(count.hasAttribute("data-state")).toBe(false)
    expect(screen.getByRole("status").textContent).toBe("")
  })

  it("shows a plain count without maxLength", () => {
    render(
      <InputGroup>
        <InputGroupTextarea aria-label="Bio" defaultValue="hey" />
        <InputGroupAddon align="block-end">
          <InputGroupCount />
        </InputGroupAddon>
      </InputGroup>
    )

    const count = document.querySelector("[data-slot=input-group-count]")!
    expect(count.textContent).not.toContain("/")
    expect(count.querySelector("[aria-hidden]")?.textContent).toContain("3")
  })
})

describe("typing", () => {
  it("never sets state from a listener on the control itself", () => {
    const spy = vi.spyOn(HTMLTextAreaElement.prototype, "addEventListener")
    function Controlled() {
      const [value, setValue] = React.useState("")
      return (
        <InputGroup>
          <InputGroupTextarea
            aria-label="Reply"
            maxLength={20}
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
          <InputGroupAddon align="block-end">
            <InputGroupCount />
            <InputGroupClear />
          </InputGroupAddon>
        </InputGroup>
      )
    }
    render(<Controlled />)

    expect(spy.mock.calls.some(([type]) => type === "input")).toBe(false)
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement
    for (const value of ["a", "ab", "abc"]) {
      fireEvent.input(textarea, { target: { value } })
    }
    expect(textarea.value).toBe("abc")
    expect(
      document.querySelector("[data-slot=input-group-count]")?.textContent
    ).toContain("/20")
  })
})

describe("invalid shake", () => {
  it("shakes the group when a submit finds the field invalid", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }))
    render(
      <form onSubmit={(event) => event.preventDefault()}>
        <InputGroup>
          <InputGroupInput aria-label="Email" required />
        </InputGroup>
        <button type="submit">Save</button>
      </form>
    )

    const input = screen.getByRole("textbox")
    fireEvent.click(screen.getByRole("button", { name: "Save" }))
    fireEvent.invalid(input)
    const group = document.querySelector("[data-slot=input-group]")!
    expect(group.hasAttribute("data-shake")).toBe(true)
    expect(input.hasAttribute("data-shake")).toBe(false)
    vi.unstubAllGlobals()
  })

  it("doesn't shake on validity checks outside a submit", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }))
    render(
      <form>
        <InputGroup>
          <InputGroupInput aria-label="Email" required />
        </InputGroup>
      </form>
    )

    fireEvent.invalid(screen.getByRole("textbox"))
    expect(
      document
        .querySelector("[data-slot=input-group]")!
        .hasAttribute("data-shake")
    ).toBe(false)
    vi.unstubAllGlobals()
  })
})

describe("server rendering", () => {
  it("renders every part without errors", () => {
    const html = renderToString(
      <InputGroup>
        <InputGroupInput aria-label="Query" />
        <InputGroupAddon>
          <InputGroupText>$</InputGroupText>
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupButton>Go</InputGroupButton>
          <kbd>⌘K</kbd>
        </InputGroupAddon>
        <InputGroupTextarea aria-label="Note" />
      </InputGroup>
    )

    expect(html).toContain('data-slot="input-group"')
    expect(html).toContain('data-slot="input-group-control"')
    expect(html).toContain("<textarea")
  })
})
