import * as React from "react"
import { act, cleanup, fireEvent, render } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  PasswordInput,
  PasswordInputCapsLock,
  PasswordInputControl,
  PasswordInputGroup,
  PasswordInputStrength,
  PasswordInputToggle,
  createPasswordInputController,
  scorePassword,
} from "./ui-sdk-password-input"

afterEach(cleanup)

function Example(props: React.ComponentProps<typeof PasswordInput>) {
  return (
    <PasswordInput {...props}>
      <PasswordInputGroup>
        <PasswordInputControl aria-label="Password" />
        <PasswordInputToggle />
      </PasswordInputGroup>
      <PasswordInputCapsLock />
      <PasswordInputStrength />
    </PasswordInput>
  )
}

describe("UI SDK Password Input", () => {
  it("renders a password field with a named toggle", () => {
    const { getByLabelText, getByRole } = render(<Example />)
    const input = getByLabelText("Password") as HTMLInputElement
    expect(input.type).toBe("password")
    expect(input.getAttribute("autocomplete")).toBe("current-password")
    const toggle = getByRole("button", { name: "Show password" })
    expect(toggle.getAttribute("aria-pressed")).toBe("false")
  })

  it("shows and hides the password and keeps the toggle's name", () => {
    const { getByLabelText, getByRole } = render(<Example />)
    const toggle = getByRole("button", { name: "Show password" })
    fireEvent.click(toggle)
    expect((getByLabelText("Password") as HTMLInputElement).type).toBe("text")
    expect(toggle.getAttribute("aria-pressed")).toBe("true")
    expect(toggle.getAttribute("aria-label")).toBe("Show password")
    fireEvent.click(toggle)
    expect((getByLabelText("Password") as HTMLInputElement).type).toBe(
      "password"
    )
  })

  it("passes autoComplete for a new password", () => {
    const { getByLabelText } = render(<Example autoComplete="new-password" />)
    expect(getByLabelText("Password").getAttribute("autocomplete")).toBe(
      "new-password"
    )
  })

  it("never writes the password into data attributes", () => {
    const { container } = render(<Example defaultValue="hunter2-secret" />)
    for (const element of container.querySelectorAll("*")) {
      for (const attribute of element.attributes) {
        if (attribute.name.startsWith("data-")) {
          expect(attribute.value).not.toContain("hunter2")
        }
      }
    }
  })

  it("scores the password in the strength meter", () => {
    const controller = createPasswordInputController()
    const { getByRole } = render(<Example controller={controller} />)
    const meter = getByRole("meter", { name: "Password strength" })
    expect(meter.getAttribute("aria-valuenow")).toBe("0")
    act(() => {
      controller.setValue("plum-kettle-orbit-42")
    })
    expect(meter.getAttribute("aria-valuenow")).toBe("4")
    expect(meter.getAttribute("aria-valuetext")).toBe("Strong")
  })

  it("scores common and short passwords low", () => {
    expect(scorePassword("")).toBe(0)
    expect(scorePassword("abc")).toBe(1)
    expect(scorePassword("password1")).toBeLessThanOrEqual(2)
    expect(scorePassword("aaaaaaaaaaaa")).toBe(1)
    expect(scorePassword("Tr0ub4dour&3x!")).toBeGreaterThanOrEqual(3)
  })

  it("shows the caps lock hint while caps lock is on", () => {
    const { getByLabelText, container } = render(<Example />)
    const input = getByLabelText("Password")
    const hint = container.querySelector(
      "[data-slot=password-input-capslock]"
    )!
    expect(hint.hasAttribute("data-active")).toBe(false)
    input.focus()
    const event = new KeyboardEvent("keydown", { key: "A", bubbles: true })
    Object.defineProperty(event, "getModifierState", {
      value: (key: string) => key === "CapsLock",
    })
    act(() => {
      input.dispatchEvent(event)
    })
    expect(hint.hasAttribute("data-active")).toBe(true)
    expect(hint.querySelector("[role=status]")!.textContent).toBe(
      "Caps Lock is on"
    )
  })

  it("marks invalid and disabled states", () => {
    const { getByLabelText, getByRole, container, rerender } = render(
      <Example invalid />
    )
    expect(getByLabelText("Password").getAttribute("aria-invalid")).toBe(
      "true"
    )
    expect(
      container
        .querySelector("[data-slot=password-input]")!
        .hasAttribute("data-invalid")
    ).toBe(true)
    rerender(<Example disabled />)
    expect((getByLabelText("Password") as HTMLInputElement).disabled).toBe(
      true
    )
    expect(
      (getByRole("button", { name: "Show password" }) as HTMLButtonElement)
        .disabled
    ).toBe(true)
  })

  it("follows onValueChange and a controller", () => {
    const onValueChange = vi.fn()
    const controller = createPasswordInputController()
    render(<Example controller={controller} onValueChange={onValueChange} />)
    act(() => {
      controller.setValue("abc")
    })
    expect(onValueChange.mock.calls[0][0]).toBe("abc")
    act(() => {
      controller.setVisible(true)
    })
    expect(controller.isVisible()).toBe(true)
  })

  it("renders on the server", () => {
    const html = renderToString(<Example />)
    expect(html).toContain('data-slot="password-input-control"')
    expect(html).toContain('type="password"')
  })
})
