import * as React from "react"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerEyeDropper,
  ColorPickerInput,
  ColorPickerSlider,
  ColorPickerSwatches,
  ColorPickerSwatchItem,
} from "./ui-sdk-color-picker"

afterEach(cleanup)

function Picker(props: React.ComponentProps<typeof ColorPicker>) {
  return (
    <ColorPicker aria-label="Brand color" {...props}>
      <ColorPickerArea />
      <ColorPickerSlider channel="hue" />
      <ColorPickerInput aria-label="Hex" />
      <ColorPickerSwatches aria-label="Presets">
        <ColorPickerSwatchItem value="#ff0000" />
        <ColorPickerSwatchItem value="#0000ff" />
      </ColorPickerSwatches>
    </ColorPicker>
  )
}

describe("UI SDK ColorPicker", () => {
  it("renders the default thumbs inside the area and the slider", () => {
    const { container } = render(<Picker defaultValue="#0ea5e9" />)
    expect(
      container.querySelector(
        "[data-slot=color-picker-area] > [data-slot=color-picker-area-thumb]"
      )
    ).not.toBeNull()
    expect(
      container.querySelector(
        "[data-slot=color-picker-slider] > [data-slot=color-picker-slider-thumb]"
      )
    ).not.toBeNull()
  })

  it("keeps a caller's thumb instead of adding a second one", () => {
    const { container } = render(
      <ColorPicker aria-label="Brand color">
        <ColorPickerSlider channel="hue">
          <span data-testid="custom" />
        </ColorPickerSlider>
      </ColorPicker>
    )
    expect(screen.getByTestId("custom")).not.toBeNull()
    expect(
      container.querySelector("[data-slot=color-picker-slider-thumb]")
    ).toBeNull()
  })

  it("merges a function className with the base classes", () => {
    const { container } = render(
      <ColorPicker
        aria-label="Brand color"
        disabled
        className={(state) => (state.disabled ? "is-off" : "is-on")}
      />
    )
    const root = container.querySelector<HTMLElement>(
      "[data-slot=color-picker]"
    )!
    expect(root.className).toContain("is-off")
    expect(root.className).toContain("flex")
  })

  it("selects a preset and reports the change", () => {
    const onValueChange = vi.fn()
    render(<Picker defaultValue="#0ea5e9" onValueChange={onValueChange} />)
    const presets = screen.getAllByRole("option")
    fireEvent.click(presets[0])
    expect(onValueChange).toHaveBeenCalled()
    expect(String(onValueChange.mock.calls.at(-1)?.[0]).toLowerCase()).toBe(
      "#ff0000"
    )
    expect(presets[0].hasAttribute("data-selected")).toBe(true)
  })

  it("commits a typed color on Enter", () => {
    const onValueCommit = vi.fn()
    render(<Picker defaultValue="#0ea5e9" onValueCommit={onValueCommit} />)
    const input = screen.getByLabelText("Hex") as HTMLInputElement
    fireEvent.change(input, { target: { value: "rebeccapurple" } })
    fireEvent.keyDown(input, { key: "Enter" })
    expect(String(onValueCommit.mock.calls.at(-1)?.[0]).toLowerCase()).toBe(
      "#663399"
    )
  })

  it("marks the eyedropper unsupported where the browser has none", () => {
    const { container } = render(
      <ColorPicker aria-label="Brand color">
        <ColorPickerEyeDropper aria-label="Pick" />
      </ColorPicker>
    )
    const button = container.querySelector(
      "[data-slot=color-picker-eye-dropper]"
    )!
    expect(button.hasAttribute("data-unsupported")).toBe(true)
    expect(button.querySelector("svg")).not.toBeNull()
  })

  it("renders on the server with the color variable in place", () => {
    const html = renderToString(<Picker defaultValue="#22c55e" />)
    expect(html).toContain("--color-picker-color")
    expect(html).toContain('data-slot="color-picker-area-thumb"')
  })
})
