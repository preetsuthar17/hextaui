import * as React from "react"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Slider, SliderLabel, SliderValue } from "./slider"

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

function nameOf(input: Element) {
  const label = input.getAttribute("aria-label")
  if (label) {
    return label
  }
  const id = input.getAttribute("aria-labelledby")
  return id ? document.getElementById(id)?.textContent : undefined
}

function sliders(name?: string) {
  return screen
    .getAllByRole("slider", { hidden: true })
    .filter((input) => name === undefined || nameOf(input) === name)
}

function root(container: HTMLElement) {
  return container.querySelector<HTMLElement>("[data-slot=slider]")!
}

describe("Slider", () => {
  it("names the thumb input from aria-label instead of the root", () => {
    const { container } = render(
      <Slider aria-label="Volume" defaultValue={[40]} />
    )
    const input = sliders("Volume")[0]
    expect(input.getAttribute("aria-valuenow")).toBe("40")
    expect(root(container).hasAttribute("aria-label")).toBe(false)
    expect(root(container).getAttribute("data-size")).toBe("default")
    expect(container.querySelectorAll("[data-slot=slider-thumb]").length).toBe(
      1
    )
  })

  it("renders one thumb per value with per-thumb labels", () => {
    render(
      <Slider
        defaultValue={[20, 80]}
        getAriaLabel={(index) => (index === 0 ? "Minimum" : "Maximum")}
      />
    )
    expect(sliders("Minimum")[0].getAttribute("aria-valuenow")).toBe("20")
    expect(sliders("Maximum")[0].getAttribute("aria-valuenow")).toBe("80")
  })

  it("is named by SliderLabel and shows SliderValue", () => {
    const { container } = render(
      <Slider defaultValue={[20, 80]}>
        <SliderLabel>Price</SliderLabel>
        <SliderValue />
      </Slider>
    )
    expect(sliders("Price")).toHaveLength(2)
    const output = container.querySelector("[data-slot=slider-value]")!
    expect(output.textContent).toBe("20 – 80")
    expect(output.getAttribute("aria-live")).toBe("off")
  })

  it("steps with the keyboard and eases the jump only briefly", () => {
    vi.useFakeTimers()
    const onValueChange = vi.fn()
    const { container } = render(
      <Slider
        aria-label="Volume"
        defaultValue={50}
        onValueChange={onValueChange}
      />
    )
    const input = screen.getByRole("slider", { hidden: true })
    expect(root(container).hasAttribute("data-jump")).toBe(false)
    fireEvent.keyDown(input, { key: "ArrowRight" })
    expect(onValueChange).toHaveBeenLastCalledWith(51, expect.anything())
    expect(input.getAttribute("aria-valuenow")).toBe("51")
    expect(root(container).hasAttribute("data-jump")).toBe(true)
    fireEvent.keyDown(input, { key: "End" })
    expect(input.getAttribute("aria-valuenow")).toBe("100")
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(root(container).hasAttribute("data-jump")).toBe(false)
  })

  it("does not ease on mount", () => {
    const { container } = render(<Slider aria-label="A" value={30} />)
    expect(root(container).hasAttribute("data-jump")).toBe(false)
  })

  it("eases programmatic changes of a controlled value", () => {
    vi.useFakeTimers()
    function Controlled() {
      const [value, setValue] = React.useState(10)
      return (
        <>
          <Slider aria-label="A" value={value} onValueChange={setValue} />
          <button onClick={() => setValue(90)}>Max</button>
        </>
      )
    }
    const { container } = render(<Controlled />)
    fireEvent.click(screen.getByText("Max"))
    expect(
      screen.getByRole("slider", { hidden: true }).getAttribute("aria-valuenow")
    ).toBe("90")
    expect(root(container).hasAttribute("data-jump")).toBe(true)
  })

  it("honours a cancelled change", () => {
    render(
      <Slider
        aria-label="A"
        defaultValue={50}
        onValueChange={(_, details) => details.cancel()}
      />
    )
    const input = screen.getByRole("slider", { hidden: true })
    fireEvent.keyDown(input, { key: "ArrowRight" })
    expect(input.getAttribute("aria-valuenow")).toBe("50")
  })

  it("keeps a parent-refused controlled value", () => {
    render(<Slider aria-label="A" value={50} onValueChange={() => {}} />)
    const input = screen.getByRole("slider", { hidden: true })
    fireEvent.keyDown(input, { key: "ArrowRight" })
    expect(input.getAttribute("aria-valuenow")).toBe("50")
  })

  it("shows a hidden value bubble only when asked", () => {
    const { container, rerender } = render(
      <Slider aria-label="Opacity" defaultValue={0.25} max={1} step={0.01} />
    )
    expect(container.querySelector("[data-slot=slider-thumb-value]")).toBe(null)
    rerender(
      <Slider
        aria-label="Opacity"
        defaultValue={0.25}
        max={1}
        step={0.01}
        showValue
        format={{ style: "percent" }}
      />
    )
    const bubble = container.querySelector("[data-slot=slider-thumb-value]")!
    expect(bubble.textContent).toBe("25%")
    expect(bubble.getAttribute("aria-hidden")).toBe("true")
    expect(sliders("Opacity")[0]).toBeTruthy()
  })

  it("survives an invalid locale", () => {
    render(
      <Slider aria-label="A" defaultValue={5} showValue locale="not a locale" />
    )
    expect(
      document.querySelector("[data-slot=slider-thumb-value]")!.textContent
    ).toBe("5")
  })

  it("flips arrow keys in a right-to-left parent", () => {
    render(
      <div dir="rtl">
        <Slider aria-label="A" defaultValue={50} />
      </div>
    )
    const input = screen.getByRole("slider", { hidden: true })
    fireEvent.keyDown(input, { key: "ArrowRight" })
    expect(input.getAttribute("aria-valuenow")).toBe("49")
  })

  it("supports vertical orientation, sizes and function classNames", () => {
    const { container } = render(
      <Slider
        aria-label="A"
        defaultValue={10}
        orientation="vertical"
        size="lg"
        className={(state) => (state.disabled ? "is-off" : "is-on")}
        disabled
      />
    )
    const element = root(container)
    expect(element.className).toContain("is-off")
    expect(element.className).toContain("flex-col")
    expect(element.getAttribute("data-orientation")).toBe("vertical")
    expect(element.getAttribute("data-size")).toBe("lg")
    expect(
      (screen.getByRole("slider", { hidden: true }) as HTMLInputElement)
        .disabled
    ).toBe(true)
  })

  it("forwards refs and handles odd values", () => {
    const ref = React.createRef<HTMLDivElement>()
    const { container } = render(
      <Slider ref={ref} aria-label="A" defaultValue={[]} />
    )
    expect(ref.current?.getAttribute("data-slot")).toBe("slider")
    expect(container.querySelectorAll("[data-slot=slider-thumb]").length).toBe(
      1
    )
  })

  it("marks the range draggable only when asked and when it is a range", () => {
    const { container, rerender } = render(
      <Slider defaultValue={[20, 80]} aria-label="A" />
    )
    const range = () =>
      container.querySelector("[data-slot=slider-range]")!.className
    expect(range()).not.toContain("cursor-grab")
    rerender(<Slider defaultValue={[20, 80]} aria-label="A" draggableRange />)
    expect(range()).toContain("cursor-grab")
    cleanup()
    const single = render(
      <Slider defaultValue={[20]} aria-label="A" draggableRange />
    )
    expect(
      single.container.querySelector("[data-slot=slider-range]")!.className
    ).not.toContain("cursor-grab")
  })

  it("keeps an uncontrolled value across re-renders", () => {
    const { rerender } = render(<Slider aria-label="A" defaultValue={30} />)
    const input = sliders()[0]
    fireEvent.keyDown(input, { key: "ArrowUp" })
    rerender(<Slider aria-label="A" defaultValue={30} size="lg" />)
    expect(sliders()[0].getAttribute("aria-valuenow")).toBe("31")
  })

  it("renders on the server", () => {
    const html = renderToString(
      <Slider defaultValue={[25, 75]} getAriaLabel={(i) => `Thumb ${i}`}>
        <SliderLabel>Range</SliderLabel>
        <SliderValue />
      </Slider>
    )
    expect(html).toContain('data-slot="slider"')
    expect(html).toContain("25 – 75")
    expect(html.match(/<input/g)).toHaveLength(2)
  })
})
