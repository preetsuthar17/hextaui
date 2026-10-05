import * as React from "react"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Toggle, toggleVariants } from "./toggle"

afterEach(() => {
  cleanup()
})

describe("Toggle", () => {
  it("toggles on click and reports the new state", () => {
    const onPressedChange = vi.fn()
    render(
      <Toggle aria-label="Bold" onPressedChange={onPressedChange}>
        B
      </Toggle>
    )
    const toggle = screen.getByRole("button", { name: "Bold" })
    expect(toggle.getAttribute("data-slot")).toBe("toggle")
    expect(toggle.getAttribute("aria-pressed")).toBe("false")
    expect(toggle.hasAttribute("data-pressed")).toBe(false)
    fireEvent.click(toggle)
    expect(toggle.getAttribute("aria-pressed")).toBe("true")
    expect(toggle.hasAttribute("data-pressed")).toBe(true)
    expect(onPressedChange).toHaveBeenLastCalledWith(true, expect.anything())
    fireEvent.click(toggle)
    expect(toggle.getAttribute("aria-pressed")).toBe("false")
    expect(onPressedChange).toHaveBeenLastCalledWith(false, expect.anything())
  })

  it("starts pressed with defaultPressed", () => {
    render(<Toggle aria-label="Bold" defaultPressed />)
    const toggle = screen.getByRole("button", { name: "Bold" })
    expect(toggle.getAttribute("aria-pressed")).toBe("true")
  })

  it("stays controlled when the parent refuses the change", () => {
    const onPressedChange = vi.fn()
    render(
      <Toggle
        aria-label="Mute"
        pressed={false}
        onPressedChange={onPressedChange}
      />
    )
    const toggle = screen.getByRole("button", { name: "Mute" })
    fireEvent.click(toggle)
    expect(onPressedChange).toHaveBeenCalledWith(true, expect.anything())
    expect(toggle.getAttribute("aria-pressed")).toBe("false")
  })

  it("follows a controlled value", () => {
    function Controlled() {
      const [pressed, setPressed] = React.useState(false)
      return (
        <>
          <Toggle
            aria-label="Mute"
            pressed={pressed}
            onPressedChange={setPressed}
          />
          <output>{pressed ? "on" : "off"}</output>
        </>
      )
    }
    render(<Controlled />)
    fireEvent.click(screen.getByRole("button", { name: "Mute" }))
    expect(screen.getByText("on")).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: "Mute" }))
    expect(screen.getByText("off")).toBeTruthy()
  })

  it("ignores presses while disabled", () => {
    const onPressedChange = vi.fn()
    render(
      <Toggle aria-label="Bold" disabled onPressedChange={onPressedChange} />
    )
    const toggle = screen.getByRole("button", { name: "Bold" })
    expect(toggle.hasAttribute("disabled")).toBe(true)
    expect(toggle.hasAttribute("data-disabled")).toBe(true)
    fireEvent.click(toggle)
    expect(onPressedChange).not.toHaveBeenCalled()
    expect(toggle.getAttribute("aria-pressed")).toBe("false")
  })

  it("runs the user's onClick first and lets it skip the toggle", () => {
    const onClick = vi.fn((event: { preventBaseUIHandler: () => void }) =>
      event.preventBaseUIHandler()
    )
    const onPressedChange = vi.fn()
    render(
      <Toggle
        aria-label="Bold"
        onClick={onClick}
        onPressedChange={onPressedChange}
      />
    )
    const toggle = screen.getByRole("button", { name: "Bold" })
    fireEvent.click(toggle)
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onPressedChange).not.toHaveBeenCalled()
    expect(toggle.getAttribute("aria-pressed")).toBe("false")
  })

  it("stays off when onPressedChange cancels", () => {
    render(
      <Toggle
        aria-label="Bold"
        onPressedChange={(_, details) => details.cancel()}
      />
    )
    const toggle = screen.getByRole("button", { name: "Bold" })
    fireEvent.click(toggle)
    expect(toggle.getAttribute("aria-pressed")).toBe("false")
  })

  it("exposes variant and size", () => {
    render(<Toggle aria-label="Bold" variant="outline" size="sm" />)
    const toggle = screen.getByRole("button", { name: "Bold" })
    expect(toggle.getAttribute("data-variant")).toBe("outline")
    expect(toggle.getAttribute("data-size")).toBe("sm")
    expect(toggle.className).toContain("inset-ring-border")
    expect(toggle.className).toContain("h-8")
  })

  it("defaults variant and size", () => {
    render(<Toggle aria-label="Bold" />)
    const toggle = screen.getByRole("button", { name: "Bold" })
    expect(toggle.getAttribute("data-variant")).toBe("default")
    expect(toggle.getAttribute("data-size")).toBe("default")
    expect(toggle.className).toContain("h-9")
  })

  it("lets className override base classes", () => {
    render(<Toggle aria-label="Bold" className="h-12" />)
    const toggle = screen.getByRole("button", { name: "Bold" })
    expect(toggle.className).toContain("h-12")
    expect(toggle.className).not.toContain("h-9")
  })

  it("supports a function className that sees the state", () => {
    render(
      <Toggle
        aria-label="Bold"
        className={(state) => (state.pressed ? "is-on" : "is-off")}
      />
    )
    const toggle = screen.getByRole("button", { name: "Bold" })
    expect(toggle.className).toContain("is-off")
    expect(toggle.className).toContain("h-9")
    fireEvent.click(toggle)
    expect(toggle.className).toContain("is-on")
  })

  it("keeps data-slot fixed", () => {
    render(<Toggle aria-label="Bold" {...{ "data-slot": "other" }} />)
    const toggle = screen.getByRole("button", { name: "Bold" })
    expect(toggle.getAttribute("data-slot")).toBe("toggle")
  })

  it("forwards refs", () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Toggle aria-label="Bold" ref={ref} />)
    expect(ref.current?.tagName).toBe("BUTTON")
  })

  it("renders as another element", () => {
    render(<Toggle aria-label="Bold" nativeButton={false} render={<span />} />)
    const toggle = screen.getByRole("button", { name: "Bold" })
    expect(toggle.tagName).toBe("SPAN")
    expect(toggle.getAttribute("tabindex")).toBe("0")
    fireEvent.click(toggle)
    expect(toggle.getAttribute("aria-pressed")).toBe("true")
  })

  it("toggles with Enter and Space when rendered as a non-button", () => {
    render(<Toggle aria-label="Bold" nativeButton={false} render={<span />} />)
    const toggle = screen.getByRole("button", { name: "Bold" })
    fireEvent.keyDown(toggle, { key: "Enter" })
    expect(toggle.getAttribute("aria-pressed")).toBe("true")
    fireEvent.keyDown(toggle, { key: " " })
    fireEvent.keyUp(toggle, { key: " " })
    expect(toggle.getAttribute("aria-pressed")).toBe("false")
  })

  it("survives rapid repeated clicks", () => {
    const onPressedChange = vi.fn()
    render(<Toggle aria-label="Bold" onPressedChange={onPressedChange} />)
    const toggle = screen.getByRole("button", { name: "Bold" })
    for (let index = 0; index < 7; index++) {
      fireEvent.click(toggle)
    }
    expect(onPressedChange).toHaveBeenCalledTimes(7)
    expect(toggle.getAttribute("aria-pressed")).toBe("true")
  })

  it("renders on the server with its pressed state", () => {
    const html = renderToString(<Toggle aria-label="Bold" defaultPressed />)
    expect(html).toContain('data-slot="toggle"')
    expect(html).toContain('aria-pressed="true"')
    expect(html).toContain("data-pressed")
  })

  it("exports toggleVariants for composition", () => {
    expect(toggleVariants()).toContain("h-9")
    expect(toggleVariants({ variant: "outline", size: "lg" })).toContain("h-10")
  })
})
