import * as React from "react"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Switch } from "./switch"

afterEach(() => {
  cleanup()
})

function flush() {
  return act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
  })
}

describe("Switch", () => {
  it("toggles from its label", () => {
    const onCheckedChange = vi.fn()
    render(
      <label>
        <Switch onCheckedChange={onCheckedChange} size="sm" />
        Wi-Fi
      </label>
    )
    const control = screen.getByRole("switch", { name: "Wi-Fi" })
    expect(control.getAttribute("data-slot")).toBe("switch")
    expect(control.getAttribute("data-size")).toBe("sm")
    fireEvent.click(control)
    expect(control.getAttribute("aria-checked")).toBe("true")
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything())
  })

  it("shows a pending state while a returned promise runs", async () => {
    let finish: () => void = () => {}
    render(
      <Switch
        aria-label="Sync"
        onCheckedChange={() =>
          new Promise<void>((resolve) => (finish = resolve))
        }
      />
    )
    const control = screen.getByRole("switch", { name: "Sync" })
    fireEvent.click(control)
    expect(control.getAttribute("aria-checked")).toBe("true")
    expect(control.getAttribute("aria-busy")).toBe("true")
    expect(control.querySelector("[data-slot=spinner]")).toBeTruthy()

    fireEvent.click(control)
    expect(control.getAttribute("aria-checked")).toBe("true")

    finish()
    await flush()
    expect(control.hasAttribute("aria-busy")).toBe(false)
    expect(control.getAttribute("aria-checked")).toBe("true")
  })

  it("flips back when the promise rejects", async () => {
    vi.stubGlobal("matchMedia", () => ({
      matches: false,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    }))
    let fail: () => void = () => {}
    render(
      <Switch
        aria-label="Public"
        defaultChecked
        onCheckedChange={() =>
          new Promise<void>((_, reject) => (fail = () => reject(new Error())))
        }
      />
    )
    const control = screen.getByRole("switch", { name: "Public" })
    fireEvent.click(control)
    expect(control.getAttribute("aria-checked")).toBe("false")
    fail()
    await flush()
    expect(control.getAttribute("aria-checked")).toBe("true")
    expect(control.hasAttribute("data-shake")).toBe(true)
    vi.unstubAllGlobals()
  })

  it("renders the iOS variant", () => {
    render(<Switch aria-label="Wi-Fi" variant="ios" />)
    const control = screen.getByRole("switch", { name: "Wi-Fi" })
    expect(control.getAttribute("data-variant")).toBe("ios")
    fireEvent.click(control)
    expect(control.getAttribute("aria-checked")).toBe("true")
  })

  it("renders on and off marks", () => {
    const { container } = render(<Switch aria-label="Captions" icons />)
    expect(container.querySelector("[data-slot=switch-icons]")).toBeTruthy()
  })

  it("submits its value with a form", () => {
    let value: FormDataEntryValue | null = null
    render(
      <form
        onSubmit={(event) => {
          event.preventDefault()
          value = new FormData(event.currentTarget).get("wifi")
        }}
      >
        <Switch name="wifi" defaultChecked aria-label="Wi-Fi" />
        <button type="submit">Save</button>
      </form>
    )
    fireEvent.click(screen.getByText("Save"))
    expect(value).toBe("on")
  })

  it("server renders", () => {
    expect(renderToString(<Switch aria-label="x" />)).toContain(
      'data-slot="switch"'
    )
  })
})
