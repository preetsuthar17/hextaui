import * as React from "react"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Field, FieldLabel } from "./field"
import { Textarea } from "./textarea"

afterEach(() => {
  cleanup()
})

describe("Textarea", () => {
  it("renders an auto-growing textarea with row limits", () => {
    render(<Textarea aria-label="Notes" minRows={2} maxRows={6} />)
    const textarea = screen.getByRole("textbox", { name: "Notes" })
    expect(textarea.tagName).toBe("TEXTAREA")
    expect(textarea.getAttribute("data-slot")).toBe("textarea")
    expect(textarea.hasAttribute("data-autoresize")).toBe(true)
    expect(textarea.getAttribute("rows")).toBe("2")
    expect(textarea.style.getPropertyValue("--textarea-min-rows")).toBe("2")
    expect(textarea.style.getPropertyValue("--textarea-max-rows")).toBe("6")
  })

  it("clamps hostile row values", () => {
    render(<Textarea aria-label="Notes" minRows={-4} maxRows={Number.NaN} />)
    const textarea = screen.getByRole("textbox", { name: "Notes" })
    expect(textarea.getAttribute("rows")).toBe("1")
    expect(textarea.style.getPropertyValue("--textarea-max-rows")).toBe("10")
  })

  it("can be a fixed, resizable box", () => {
    render(<Textarea aria-label="Notes" autoResize={false} />)
    expect(
      screen
        .getByRole("textbox", { name: "Notes" })
        .hasAttribute("data-autoresize")
    ).toBe(false)
  })

  it("submits its form with the shortcut only when asked", () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault())
    const { rerender } = render(
      <form onSubmit={onSubmit}>
        <Textarea aria-label="Comment" />
      </form>
    )
    const textarea = screen.getByRole("textbox", { name: "Comment" })
    fireEvent.keyDown(textarea, { key: "Enter", metaKey: true })
    expect(onSubmit).not.toHaveBeenCalled()

    rerender(
      <form onSubmit={onSubmit}>
        <Textarea aria-label="Comment" submitOnShortcut />
      </form>
    )
    fireEvent.keyDown(textarea, { key: "Enter" })
    expect(onSubmit).not.toHaveBeenCalled()
    fireEvent.keyDown(textarea, {
      key: "Enter",
      isComposing: true,
      ctrlKey: true,
    })
    expect(onSubmit).not.toHaveBeenCalled()
    fireEvent.keyDown(textarea, { key: "Enter", ctrlKey: true })
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it("lets onKeyDown cancel the shortcut", () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault())
    render(
      <form onSubmit={onSubmit}>
        <Textarea
          aria-label="Comment"
          submitOnShortcut
          onKeyDown={(event) => event.preventDefault()}
        />
      </form>
    )
    fireEvent.keyDown(screen.getByRole("textbox"), {
      key: "Enter",
      metaKey: true,
    })
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it("is labelled inside a Field", () => {
    render(
      <Field>
        <FieldLabel>Feedback</FieldLabel>
        <Textarea />
      </Field>
    )
    expect(screen.getByRole("textbox", { name: "Feedback" })).toBeTruthy()
  })

  it("server renders", () => {
    expect(renderToString(<Textarea aria-label="x" />)).toContain(
      'data-slot="textarea"'
    )
  })
})
