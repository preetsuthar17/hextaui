import * as React from "react"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  RadioGroup,
  RadioGroupCard,
  RadioGroupCardTitle,
  RadioGroupItem,
} from "./radio-group"

afterEach(() => {
  cleanup()
})

function Plain(props: React.ComponentProps<typeof RadioGroup>) {
  return (
    <RadioGroup aria-label="Size" {...props}>
      <label>
        <RadioGroupItem value="s" />
        Small
      </label>
      <label>
        <RadioGroupItem value="m" />
        Medium
      </label>
    </RadioGroup>
  )
}

describe("RadioGroup", () => {
  it("renders a labelled radio group with slots", () => {
    render(<Plain defaultValue="m" />)
    const group = screen.getByRole("radiogroup", { name: "Size" })
    expect(group.getAttribute("data-slot")).toBe("radio-group")
    expect(group.getAttribute("data-variant")).toBe("default")
    expect(
      screen.getByRole("radio", { name: "Medium" }).getAttribute("aria-checked")
    ).toBe("true")
    expect(group.querySelector("[data-slot=radio-group-highlight]")).toBeNull()
  })

  it("changes value from the label", () => {
    const onValueChange = vi.fn()
    render(<Plain defaultValue="m" onValueChange={onValueChange} />)
    fireEvent.click(screen.getByText("Small"))
    expect(onValueChange).toHaveBeenCalledWith("s", expect.anything())
    expect(
      screen.getByRole("radio", { name: "Small" }).getAttribute("aria-checked")
    ).toBe("true")
  })

  it("follows a controlled value", () => {
    const { rerender } = render(<Plain value="s" />)
    rerender(<Plain value="m" />)
    expect(
      screen.getByRole("radio", { name: "Medium" }).getAttribute("aria-checked")
    ).toBe("true")
  })

  it("ignores clicks when read-only", () => {
    render(<Plain defaultValue="m" readOnly />)
    fireEvent.click(screen.getByText("Small"))
    expect(
      screen.getByRole("radio", { name: "Medium" }).getAttribute("aria-checked")
    ).toBe("true")
  })

  it("selects cards and renders the sliding ring", () => {
    render(
      <RadioGroup variant="card" aria-label="Plan" defaultValue="pro">
        <RadioGroupCard value="free">
          <RadioGroupCardTitle>Free</RadioGroupCardTitle>
        </RadioGroupCard>
        <RadioGroupCard value="pro">
          <RadioGroupCardTitle>Pro</RadioGroupCardTitle>
        </RadioGroupCard>
        <RadioGroupCard value="team" disabled>
          <RadioGroupCardTitle>Team</RadioGroupCardTitle>
        </RadioGroupCard>
      </RadioGroup>
    )
    const group = screen.getByRole("radiogroup", { name: "Plan" })
    expect(
      group.querySelector("[data-slot=radio-group-highlight]")
    ).toBeTruthy()
    fireEvent.click(screen.getByText("Free"))
    expect(
      screen.getByRole("radio", { name: "Free" }).getAttribute("aria-checked")
    ).toBe("true")
    fireEvent.click(screen.getByText("Team"))
    expect(
      screen.getByRole("radio", { name: "Team" }).getAttribute("aria-checked")
    ).toBe("false")
  })

  it("submits its value with a form", () => {
    let submitted: FormDataEntryValue | null = null
    render(
      <form
        onSubmit={(event) => {
          event.preventDefault()
          submitted = new FormData(event.currentTarget).get("size")
        }}
      >
        <Plain name="size" defaultValue="s" />
        <button type="submit">Send</button>
      </form>
    )
    fireEvent.click(screen.getByText("Send"))
    expect(submitted).toBe("s")
  })

  it("server renders", () => {
    const html = renderToString(<Plain defaultValue="m" />)
    expect(html).toContain('data-slot="radio-group-item"')
  })
})
