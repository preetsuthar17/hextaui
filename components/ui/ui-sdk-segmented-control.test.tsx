import * as React from "react"
import {
  act,
  cleanup,
  fireEvent,
  render,
  waitFor,
} from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  SegmentedControl,
  SegmentedControlItem,
  createSegmentedControlController,
} from "./ui-sdk-segmented-control"

afterEach(cleanup)

function Example(props: React.ComponentProps<typeof SegmentedControl>) {
  return (
    <SegmentedControl aria-label="View" {...props}>
      <SegmentedControlItem value="list">List</SegmentedControlItem>
      <SegmentedControlItem value="grid">Grid</SegmentedControlItem>
      <SegmentedControlItem value="board" disabled>
        Board
      </SegmentedControlItem>
    </SegmentedControl>
  )
}

describe("UI SDK Segmented Control", () => {
  it("renders a radio group with one indicator", () => {
    const { getByRole, getAllByRole, container } = render(
      <Example defaultValue="grid" />
    )
    expect(getByRole("radiogroup", { name: "View" })).toBeTruthy()
    const radios = getAllByRole("radio")
    expect(radios).toHaveLength(3)
    expect(radios[1].getAttribute("aria-checked")).toBe("true")
    expect(radios[1].hasAttribute("data-checked")).toBe(true)
    expect(
      container.querySelectorAll('[data-slot="segmented-control-indicator"]')
    ).toHaveLength(1)
  })

  it("checks an item on click and skips disabled ones", () => {
    const onValueChange = vi.fn()
    const { getByRole } = render(
      <Example defaultValue="list" onValueChange={onValueChange} />
    )
    fireEvent.click(getByRole("radio", { name: "Grid" }))
    expect(onValueChange.mock.calls.at(-1)?.[0]).toBe("grid")
    fireEvent.click(getByRole("radio", { name: "Board" }))
    expect(onValueChange.mock.calls.at(-1)?.[0]).toBe("grid")
  })

  it("moves with the arrow keys", () => {
    const onValueChange = vi.fn()
    const { getByRole } = render(
      <Example defaultValue="list" onValueChange={onValueChange} />
    )
    const list = getByRole("radio", { name: "List" })
    list.focus()
    fireEvent.keyDown(list, { key: "ArrowRight" })
    expect(onValueChange.mock.calls.at(-1)?.[0]).toBe("grid")
  })

  it("sets the size and marks icon-only items", () => {
    const { getByRole } = render(
      <SegmentedControl aria-label="Layout" size="sm" defaultValue="list">
        <SegmentedControlItem value="list" aria-label="List">
          <svg />
        </SegmentedControlItem>
        <SegmentedControlItem value="grid">
          <svg />
          Grid
        </SegmentedControlItem>
      </SegmentedControl>
    )
    expect(getByRole("radiogroup").getAttribute("data-size")).toBe("sm")
    expect(
      getByRole("radio", { name: "List" }).hasAttribute("data-icon-only")
    ).toBe(true)
    expect(
      getByRole("radio", { name: "Grid" }).hasAttribute("data-icon-only")
    ).toBe(false)
  })

  it("submits under its name and resets with its form", async () => {
    const { container, getByRole } = render(
      <form>
        <Example name="view" defaultValue="list" />
      </form>
    )
    const form = container.querySelector("form") as HTMLFormElement
    expect(new FormData(form).get("view")).toBe("list")
    fireEvent.click(getByRole("radio", { name: "Grid" }))
    expect(new FormData(form).get("view")).toBe("grid")
    act(() => form.reset())
    await waitFor(() => expect(new FormData(form).get("view")).toBe("list"))
  })

  it("checks an item from a controller", () => {
    const controller = createSegmentedControlController()
    const { getByRole } = render(
      <Example defaultValue="list" controller={controller} />
    )
    act(() => {
      controller.setValue("grid")
    })
    expect(
      getByRole("radio", { name: "Grid" }).getAttribute("aria-checked")
    ).toBe("true")
  })

  it("renders on the server", () => {
    const html = renderToString(<Example defaultValue="list" />)
    expect(html).toContain('data-slot="segmented-control"')
    expect(html).toContain('data-slot="segmented-control-indicator"')
  })
})
