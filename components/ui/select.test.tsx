import * as React from "react"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"

afterEach(() => {
  cleanup()
})

const fonts = [
  { value: "inter", label: "Inter" },
  { value: "geist", label: "Geist" },
]

function Demo(props: Partial<React.ComponentProps<typeof Select>>) {
  return (
    <Select items={fonts} defaultValue="geist" {...props}>
      <SelectTrigger aria-label="Font" size="sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {fonts.map((font) => (
          <SelectItem key={font.value} value={font.value}>
            {font.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

async function flush() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 20))
  })
}

describe("Select", () => {
  it("renders the trigger with the label of the value", () => {
    render(<Demo />)
    const trigger = screen.getByRole("combobox", { name: "Font" })
    expect(trigger.getAttribute("data-slot")).toBe("select-trigger")
    expect(trigger.getAttribute("data-size")).toBe("sm")
    expect(trigger.textContent).toContain("Geist")
  })

  it("opens and picks an option", async () => {
    const onValueChange = vi.fn()
    render(<Demo onValueChange={onValueChange} />)
    fireEvent.click(screen.getByRole("combobox", { name: "Font" }))
    await flush()
    const option = await screen.findByRole("option", { name: "Inter" })
    fireEvent.pointerDown(option, { pointerType: "mouse" })
    fireEvent.mouseDown(option)
    fireEvent.pointerUp(option, { pointerType: "mouse" })
    fireEvent.mouseUp(option)
    fireEvent.click(option)
    await flush()
    expect(onValueChange).toHaveBeenCalledWith("inter", expect.anything())
    expect(
      screen.getByRole("combobox", { name: "Font" }).textContent
    ).toContain("Inter")
  })

  it("copies the trigger's direction to the popup", async () => {
    render(
      <div dir="rtl">
        <Demo />
      </div>
    )
    fireEvent.click(screen.getByRole("combobox", { name: "Font" }))
    await flush()
    const positioner = document.querySelector("[data-slot=select-positioner]")
    expect(positioner?.getAttribute("dir")).toBe("rtl")
  })

  it("shows a placeholder", () => {
    render(
      <Select>
        <SelectTrigger aria-label="Role">
          <SelectValue placeholder="Choose a role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>
    )
    const trigger = screen.getByRole("combobox", { name: "Role" })
    expect(trigger.textContent).toContain("Choose a role")
    expect(trigger.hasAttribute("data-placeholder")).toBe(true)
  })

  it("server renders", () => {
    const html = renderToString(<Demo />)
    expect(html).toContain('data-slot="select-trigger"')
  })
})
