import * as React from "react"
import { DirectionProvider } from "@base-ui/react/direction-provider"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import { ToggleGroup, ToggleGroupItem } from "./toggle-group"

afterEach(() => {
  cleanup()
})

function Range(props: Partial<React.ComponentProps<typeof ToggleGroup>>) {
  return (
    <ToggleGroup aria-label="Range" {...props}>
      <ToggleGroupItem value="day">Day</ToggleGroupItem>
      <ToggleGroupItem value="week">Week</ToggleGroupItem>
      <ToggleGroupItem value="month">Month</ToggleGroupItem>
    </ToggleGroup>
  )
}

function button(name: string) {
  return screen.getByRole("button", { name })
}

function pressed() {
  return screen
    .getAllByRole("button")
    .filter((item) => item.getAttribute("aria-pressed") === "true")
    .map((item) => item.textContent)
}

async function settle() {
  await act(async () => {})
}

async function press(element: HTMLElement, key: string) {
  await act(async () => {
    fireEvent.keyDown(element, { key })
  })
}

function keyboardModality() {
  const matches = Element.prototype.matches
  vi.spyOn(Element.prototype, "matches").mockImplementation(function (
    this: Element,
    selector: string
  ) {
    return selector === ":focus-visible" ? true : matches.call(this, selector)
  })
}

function indicator(group: HTMLElement) {
  return group.querySelector("[data-slot=toggle-group-indicator]")
}

describe("ToggleGroup", () => {
  it("renders a labelled group with slots and data attributes", () => {
    render(<Range defaultValue={["week"]} />)
    const group = screen.getByRole("group", { name: "Range" })
    expect(group.getAttribute("data-slot")).toBe("toggle-group")
    expect(group.getAttribute("data-variant")).toBe("default")
    expect(group.getAttribute("data-size")).toBe("default")
    expect(group.getAttribute("data-spacing")).toBe("0")
    expect(group.getAttribute("data-orientation")).toBe("horizontal")
    for (const item of screen.getAllByRole("button")) {
      expect(item.getAttribute("data-slot")).toBe("toggle-group-item")
    }
    expect(pressed()).toEqual(["Week"])
  })

  it("keeps one item pressed and lets the pressed item turn off", () => {
    const onValueChange = vi.fn()
    render(<Range defaultValue={["week"]} onValueChange={onValueChange} />)
    fireEvent.click(button("Month"))
    expect(pressed()).toEqual(["Month"])
    expect(onValueChange.mock.calls[0][0]).toEqual(["month"])
    fireEvent.click(button("Month"))
    expect(pressed()).toEqual([])
    expect(onValueChange.mock.calls[1][0]).toEqual([])
  })

  it("presses many items with multiple", () => {
    render(<Range multiple defaultValue={["day"]} />)
    fireEvent.click(button("Month"))
    expect(pressed()).toEqual(["Day", "Month"])
    expect(
      screen.getByRole("group").getAttribute("data-multiple")
    ).not.toBeNull()
  })

  it("shows the sliding indicator only for single groups that can slide", () => {
    const { rerender } = render(<Range defaultValue={["week"]} />)
    const group = screen.getByRole("group")
    expect(indicator(group)?.hasAttribute("data-visible")).toBe(true)
    expect(indicator(group)?.getAttribute("aria-hidden")).toBe("true")

    rerender(<Range multiple defaultValue={["week"]} />)
    expect(indicator(group)).toBeNull()

    rerender(<Range variant="outline" spacing={2} defaultValue={["week"]} />)
    expect(indicator(group)).toBeNull()

    rerender(<Range variant="outline" defaultValue={["week"]} />)
    expect(indicator(group)?.hasAttribute("data-visible")).toBe(true)

    rerender(<Range spacing={2} defaultValue={["week"]} />)
    expect(indicator(group)).not.toBeNull()
  })

  it("moves the indicator with the pressed item and hides it when none is pressed", async () => {
    render(<Range defaultValue={["week"]} />)
    const group = screen.getByRole("group")
    fireEvent.click(button("Week"))
    await act(async () => {})
    expect(indicator(group)?.hasAttribute("data-visible")).toBe(false)
    fireEvent.click(button("Day"))
    await act(async () => {})
    expect(indicator(group)?.hasAttribute("data-visible")).toBe(true)
  })

  it("does not render the indicator as visible on the server", () => {
    const html = renderToString(<Range defaultValue={["week"]} />)
    expect(html).toContain('data-slot="toggle-group-indicator"')
    expect(html).not.toContain('data-visible=""')
    expect(html).toMatch(/data-pressed=""[^>]*aria-pressed="true"/)
  })

  it("passes variant and size from the group to every item", () => {
    render(<Range variant="outline" size="sm" defaultValue={["day"]} />)
    for (const item of screen.getAllByRole("button")) {
      expect(item.getAttribute("data-variant")).toBe("outline")
      expect(item.getAttribute("data-size")).toBe("sm")
    }
    expect(screen.getByRole("group").getAttribute("data-size")).toBe("sm")
  })

  it("uses an item's own variant and size when the group sets none", () => {
    render(
      <ToggleGroup aria-label="Mixed">
        <ToggleGroupItem value="a" variant="outline" size="lg">
          A
        </ToggleGroupItem>
      </ToggleGroup>
    )
    expect(button("A").getAttribute("data-variant")).toBe("outline")
    expect(button("A").getAttribute("data-size")).toBe("lg")
  })

  it("throws a clear error outside a group", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() =>
      render(<ToggleGroupItem value="a">A</ToggleGroupItem>)
    ).toThrow("ToggleGroupItem must be used within ToggleGroup.")
  })

  it("keeps the value when a controlled parent refuses the change", () => {
    function Controlled() {
      const [value, setValue] = React.useState(["week"])
      return (
        <Range
          value={value}
          onValueChange={(next) => {
            if (next.length > 0) {
              setValue(next)
            }
          }}
        />
      )
    }
    render(<Controlled />)
    fireEvent.click(button("Week"))
    expect(pressed()).toEqual(["Week"])
    fireEvent.click(button("Day"))
    expect(pressed()).toEqual(["Day"])
  })

  it("follows controlled value changes from outside", async () => {
    const { rerender } = render(<Range value={["day"]} />)
    rerender(<Range value={["month"]} />)
    await act(async () => {})
    expect(pressed()).toEqual(["Month"])
    expect(
      indicator(screen.getByRole("group"))?.hasAttribute("data-visible")
    ).toBe(true)
  })

  it("supports function class names on the group and items", () => {
    render(
      <ToggleGroup
        aria-label="Fn"
        defaultValue={["a"]}
        className={(state) => (state.multiple ? "is-multiple" : "is-single")}
      >
        <ToggleGroupItem
          value="a"
          className={(state) => (state.pressed ? "is-on" : "is-off")}
        >
          A
        </ToggleGroupItem>
        <ToggleGroupItem
          value="b"
          className={(state) => (state.pressed ? "is-on" : "is-off")}
        >
          B
        </ToggleGroupItem>
      </ToggleGroup>
    )
    expect(screen.getByRole("group").className).toContain("is-single")
    expect(screen.getByRole("group").className).toContain("group/toggle-group")
    expect(button("A").className).toContain("is-on")
    expect(button("B").className).toContain("is-off")
    expect(button("B").className).toContain("group/toggle")
  })

  it("disables every item with disabled", () => {
    const onValueChange = vi.fn()
    render(
      <Range disabled defaultValue={["day"]} onValueChange={onValueChange} />
    )
    expect(screen.getByRole("group").hasAttribute("data-disabled")).toBe(true)
    for (const item of screen.getAllByRole("button")) {
      expect(item.hasAttribute("disabled")).toBe(true)
    }
    fireEvent.click(button("Week"))
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it("moves focus with arrow keys, Home and End, skipping disabled items", async () => {
    render(
      <ToggleGroup aria-label="Keys" defaultValue={["a"]}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b" disabled>
          B
        </ToggleGroupItem>
        <ToggleGroupItem value="c">C</ToggleGroupItem>
        <ToggleGroupItem value="d">D</ToggleGroupItem>
      </ToggleGroup>
    )
    await settle()
    act(() => button("A").focus())
    await press(button("A"), "ArrowRight")
    expect(document.activeElement).toBe(button("C"))
    await press(button("C"), "End")
    expect(document.activeElement).toBe(button("D"))
    await press(button("D"), "ArrowRight")
    expect(document.activeElement).toBe(button("A"))
    await press(button("A"), "ArrowLeft")
    expect(document.activeElement).toBe(button("D"))
    await press(button("D"), "Home")
    expect(document.activeElement).toBe(button("A"))
  })

  it("uses up and down keys when vertical", async () => {
    render(<Range orientation="vertical" defaultValue={["day"]} />)
    await settle()
    act(() => button("Day").focus())
    await press(button("Day"), "ArrowDown")
    expect(document.activeElement).toBe(button("Week"))
    await press(button("Week"), "ArrowUp")
    expect(document.activeElement).toBe(button("Day"))
  })

  it("flips arrow keys in right-to-left", async () => {
    render(
      <DirectionProvider direction="rtl">
        <Range defaultValue={["day"]} />
      </DirectionProvider>
    )
    await settle()
    act(() => button("Day").focus())
    await press(button("Day"), "ArrowLeft")
    expect(document.activeElement).toBe(button("Week"))
  })

  it("moves focus entering from outside to the pressed item", () => {
    keyboardModality()
    const onFocus = vi.fn()
    render(
      <>
        <button type="button">Before</button>
        <Range defaultValue={["month"]} onFocus={onFocus} />
      </>
    )
    act(() => button("Before").focus())
    act(() => button("Day").focus())
    expect(onFocus).toHaveBeenCalled()
    expect(document.activeElement).toBe(button("Month"))
  })

  it("keeps focus where it lands with multiple", () => {
    keyboardModality()
    render(
      <>
        <button type="button">Before</button>
        <Range multiple defaultValue={["month"]} />
      </>
    )
    act(() => button("Before").focus())
    act(() => button("Day").focus())
    expect(document.activeElement).toBe(button("Day"))
  })

  it("passes refs and cleans up on unmount", () => {
    const ref = React.createRef<HTMLDivElement>()
    const { unmount } = render(<Range ref={ref} defaultValue={["day"]} />)
    expect(ref.current?.getAttribute("data-slot")).toBe("toggle-group")
    unmount()
    expect(ref.current).toBeNull()
  })

  it("renders items as other elements", () => {
    render(
      <ToggleGroup aria-label="Links" defaultValue={["a"]}>
        <ToggleGroupItem value="a" nativeButton={false} render={<span />}>
          A
        </ToggleGroupItem>
      </ToggleGroup>
    )
    const item = screen.getByText("A")
    expect(item.tagName).toBe("SPAN")
    expect(item.getAttribute("data-slot")).toBe("toggle-group-item")
    expect(item.getAttribute("aria-pressed")).toBe("true")
  })
})
