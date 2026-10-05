import * as React from "react"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Checkbox, CheckboxGroup } from "./checkbox"

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

async function nextFrame() {
  await act(
    () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
  )
}

function Labelled(props: React.ComponentProps<typeof Checkbox>) {
  return (
    <label>
      <Checkbox {...props} />
      Accept
    </label>
  )
}

describe("Checkbox", () => {
  it("renders an accessible checkbox with slots", () => {
    const { container } = render(<Labelled />)
    const box = screen.getByRole("checkbox", { name: "Accept" })

    expect(box.getAttribute("data-slot")).toBe("checkbox")
    expect(box.getAttribute("aria-checked")).toBe("false")
    expect(container.querySelector("[data-slot=checkbox-indicator]")).toBeNull()
  })

  it("toggles exactly once from a label click", () => {
    const onCheckedChange = vi.fn()
    render(<Labelled onCheckedChange={onCheckedChange} />)

    fireEvent.click(screen.getByText("Accept"))

    expect(onCheckedChange).toHaveBeenCalledTimes(1)
    expect(onCheckedChange.mock.calls[0][0]).toBe(true)
    expect(screen.getByRole("checkbox").getAttribute("aria-checked")).toBe(
      "true"
    )
  })

  it("does not draw marks that exist on first paint, even under StrictMode", async () => {
    const { container } = render(
      <React.StrictMode>
        <Labelled defaultChecked />
        <Checkbox indeterminate />
      </React.StrictMode>
    )

    await nextFrame()

    expect(container.querySelectorAll("svg")).toHaveLength(2)
    expect(container.querySelector("[data-draw]")).toBeNull()
  })

  it("draws marks that appear after mount", async () => {
    const { container } = render(<Labelled />)

    await nextFrame()
    fireEvent.click(screen.getByRole("checkbox"))

    const mark = container.querySelector("svg")!
    expect(mark.hasAttribute("data-draw")).toBe(true)
    expect(mark.getAttribute("class")).toContain(
      "motion-safe:data-draw:animate-checkbox-draw"
    )
  })

  it("shows a dash for indeterminate and swaps to a drawn check", async () => {
    const { container, rerender } = render(
      <Checkbox checked={false} indeterminate aria-label="Mixed" />
    )

    expect(screen.getByRole("checkbox").getAttribute("aria-checked")).toBe(
      "mixed"
    )
    await nextFrame()
    expect(container.querySelector("svg")!.getAttribute("class")).toContain(
      "tabler-icon-minus"
    )

    await nextFrame()
    rerender(<Checkbox checked aria-label="Mixed" />)

    const mark = container.querySelector("svg")!
    expect(mark.getAttribute("class")).toContain("tabler-icon-check")
    expect(mark.hasAttribute("data-draw")).toBe(true)
  })

  it("ignores clicks when disabled or read-only", () => {
    const onCheckedChange = vi.fn()
    render(
      <>
        <Checkbox
          disabled
          aria-label="Disabled"
          onCheckedChange={onCheckedChange}
        />
        <Checkbox
          readOnly
          aria-label="Read only"
          onCheckedChange={onCheckedChange}
        />
      </>
    )

    fireEvent.click(screen.getByRole("checkbox", { name: "Disabled" }))
    fireEvent.click(screen.getByRole("checkbox", { name: "Read only" }))

    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  it("respects the controlled checked prop", () => {
    const onCheckedChange = vi.fn()
    render(
      <Checkbox
        checked={false}
        onCheckedChange={onCheckedChange}
        aria-label="Controlled"
      />
    )

    fireEvent.click(screen.getByRole("checkbox"))

    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything())
    expect(screen.getByRole("checkbox").getAttribute("aria-checked")).toBe(
      "false"
    )
  })

  it("forwards object and callback refs", () => {
    const objectRef = React.createRef<HTMLElement>()
    const callbackRef = vi.fn()
    render(
      <>
        <Checkbox ref={objectRef} aria-label="Object" />
        <Checkbox ref={callbackRef} aria-label="Callback" />
      </>
    )

    expect(objectRef.current).toBe(
      screen.getByRole("checkbox", { name: "Object" })
    )
    expect(callbackRef).toHaveBeenCalledWith(
      screen.getByRole("checkbox", { name: "Callback" })
    )
  })

  it("supports string and function class names", () => {
    render(
      <>
        <Checkbox aria-label="String" className="shadow-none" />
        <Checkbox
          aria-label="Function"
          defaultChecked
          className={(state) => (state.checked ? "shadow-none" : undefined)}
        />
      </>
    )

    for (const name of ["String", "Function"]) {
      const box = screen.getByRole("checkbox", { name })
      expect(box.className).toContain("shadow-none")
      expect(box.className).not.toContain("shadow-xs")
      expect(box.className).toContain("rounded-[calc(var(--radius-sm)*0.5)]")
    }
  })

  it("submits its value in a form", () => {
    const { container } = render(
      <form>
        <Checkbox name="news" value="weekly" defaultChecked aria-label="News" />
        <Checkbox name="terms" aria-label="Terms" />
      </form>
    )

    const data = new FormData(container.querySelector("form")!)

    expect(data.get("news")).toBe("weekly")
    expect(data.has("terms")).toBe(false)
  })

  it("server renders without touching the DOM", () => {
    const html = renderToString(<Labelled defaultChecked />)

    expect(html).toContain('data-slot="checkbox"')
    expect(html).not.toContain('data-draw=""')
    expect(html).not.toContain("data-mounted")
  })

  it("cancels the pending frame when unmounted immediately", () => {
    const cancel = vi.spyOn(window, "cancelAnimationFrame")
    const { unmount } = render(<Checkbox aria-label="Quick" />)

    unmount()

    expect(cancel).toHaveBeenCalled()
  })
})

describe("CheckboxGroup", () => {
  const all = ["a", "b", "c"]

  function Group(props: Partial<React.ComponentProps<typeof CheckboxGroup>>) {
    return (
      <CheckboxGroup aria-label="Letters" allValues={all} {...props}>
        <label>
          <Checkbox parent />
          All
        </label>
        {all.map((letter) => (
          <label key={letter}>
            <Checkbox value={letter} />
            {letter.toUpperCase()}
          </label>
        ))}
      </CheckboxGroup>
    )
  }

  function states() {
    return screen
      .getAllByRole("checkbox")
      .map((box) => box.getAttribute("aria-checked")![0])
      .join("")
  }

  it("renders a slotted group with a mixed parent", () => {
    const { container } = render(<Group defaultValue={["b"]} />)

    expect(container.querySelector("[data-slot=checkbox-group]")).not.toBeNull()
    expect(states()).toBe("mftf")
  })

  it("cycles the parent through all, none and the original mix", () => {
    const onValueChange = vi.fn()
    render(<Group defaultValue={["b"]} onValueChange={onValueChange} />)
    const parent = screen.getByRole("checkbox", { name: "All" })

    fireEvent.click(parent)
    expect(states()).toBe("tttt")
    fireEvent.click(parent)
    expect(states()).toBe("ffff")
    fireEvent.click(parent)
    expect(states()).toBe("mftf")
    expect(onValueChange).toHaveBeenCalledTimes(3)
  })

  it("draws the child marks that select all reveals", async () => {
    const { container } = render(<Group defaultValue={["b"]} />)

    await nextFrame()
    fireEvent.click(screen.getByRole("checkbox", { name: "All" }))

    const drawn = container.querySelectorAll("svg[data-draw]")
    expect(drawn.length).toBeGreaterThanOrEqual(3)
  })
})
