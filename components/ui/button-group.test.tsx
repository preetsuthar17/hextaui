import * as React from "react"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Button } from "./button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
} from "./button-group"

afterEach(() => {
  cleanup()
})

function slot(container: HTMLElement, name: string) {
  return container.querySelector<HTMLElement>(`[data-slot=${name}]`)
}

describe("ButtonGroup", () => {
  it("renders a labelled horizontal group by default", () => {
    render(
      <ButtonGroup aria-label="Text alignment">
        <Button variant="outline">Left</Button>
        <Button variant="outline">Right</Button>
      </ButtonGroup>
    )
    const group = screen.getByRole("group", { name: "Text alignment" })

    expect(group.getAttribute("data-slot")).toBe("button-group")
    expect(group.getAttribute("data-orientation")).toBe("horizontal")
    expect(group.className).toContain("flex-row")
    expect(screen.getAllByRole("button")).toHaveLength(2)
  })

  it("supports vertical orientation", () => {
    const { container } = render(
      <ButtonGroup orientation="vertical">
        <Button>A</Button>
      </ButtonGroup>
    )
    const group = slot(container, "button-group")!

    expect(group.getAttribute("data-orientation")).toBe("vertical")
    expect(group.className).toContain("flex-col")
    expect(group.className).not.toContain("flex-row")
  })

  it("uses logical properties so segments flip in RTL", () => {
    const horizontal = buttonGroupVariants({ orientation: "horizontal" })

    expect(horizontal).toContain(":rounded-s-none")
    expect(horizontal).toContain(":rounded-e-none")
    expect(horizontal).toContain(":-ms-(--hairline)")
    expect(horizontal).not.toMatch(/rounded-[lr]-none|border-[lr]-0/)
  })

  it("ignores the button status live region when joining segments", () => {
    expect(buttonGroupVariants()).toContain(
      ":not([data-slot=button-status],[data-base-ui-focus-guard],span[aria-owns],input[aria-hidden=true],select[aria-hidden=true])"
    )
  })

  it("keeps the last segment's corners when a popup inserts focus guards after it", () => {
    const classes = buttonGroupVariants()
    expect(classes).toContain("[data-base-ui-focus-guard]")
    expect(classes).toContain("span[aria-owns]")
  })

  it("renders as another element and merges props", () => {
    const onClick = vi.fn()
    render(
      <ButtonGroup
        render={<fieldset />}
        aria-label="Actions"
        className="w-full"
        onClick={onClick}
      >
        <Button>Save</Button>
      </ButtonGroup>
    )
    const group = screen.getByRole("group", { name: "Actions" })

    expect(group.tagName).toBe("FIELDSET")
    expect(group.getAttribute("data-slot")).toBe("button-group")
    expect(group.className).toContain("w-full")
    fireEvent.click(screen.getByRole("button", { name: "Save" }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("keeps the fixed slot even when a user passes one", () => {
    const { container } = render(
      <ButtonGroup {...{ "data-slot": "custom" }}>
        <Button>A</Button>
      </ButtonGroup>
    )

    expect(slot(container, "button-group")).not.toBeNull()
  })

  it("keeps feedback buttons working inside a group", async () => {
    render(
      <ButtonGroup>
        <Button feedback onClick={() => Promise.resolve()}>
          Save
        </Button>
        <Button>Cancel</Button>
      </ButtonGroup>
    )

    expect(screen.getByRole("status").getAttribute("data-slot")).toBe(
      "button-status"
    )
    expect(screen.getByRole("group").children).toHaveLength(3)
  })

  it("renders on the server without errors", () => {
    const html = renderToString(
      <ButtonGroup aria-label="Pager">
        <Button variant="outline">Previous</Button>
        <ButtonGroupSeparator />
        <ButtonGroupText>1 / 9</ButtonGroupText>
      </ButtonGroup>
    )

    expect(html).toContain('data-slot="button-group"')
    expect(html).toContain('role="group"')
  })
})

describe("ButtonGroupSeparator", () => {
  it("is perpendicular to a horizontal group", () => {
    render(
      <ButtonGroup>
        <Button>A</Button>
        <ButtonGroupSeparator />
        <Button>B</Button>
      </ButtonGroup>
    )
    const separator = screen.getByRole("separator")

    expect(separator.getAttribute("data-slot")).toBe("button-group-separator")
    expect(separator.getAttribute("aria-orientation")).toBe("vertical")
  })

  it("is perpendicular to a vertical group", () => {
    render(
      <ButtonGroup orientation="vertical">
        <Button>A</Button>
        <ButtonGroupSeparator />
        <Button>B</Button>
      </ButtonGroup>
    )

    expect(screen.getByRole("separator").getAttribute("data-orientation")).toBe(
      "horizontal"
    )
  })

  it("follows the nearest group when nested", () => {
    render(
      <ButtonGroup orientation="vertical">
        <ButtonGroup>
          <Button>A</Button>
          <ButtonGroupSeparator />
          <Button>B</Button>
        </ButtonGroup>
      </ButtonGroup>
    )

    expect(screen.getByRole("separator").getAttribute("data-orientation")).toBe(
      "vertical"
    )
  })

  it("respects an explicit orientation and a function className", () => {
    render(
      <ButtonGroup>
        <ButtonGroupSeparator
          orientation="horizontal"
          className={(state) => `sep-${state.orientation}`}
        />
      </ButtonGroup>
    )
    const separator = screen.getByRole("separator")

    expect(separator.getAttribute("data-orientation")).toBe("horizontal")
    expect(separator.className).toContain("sep-horizontal")
    expect(separator.className).toContain("self-stretch")
  })

  it("draws a hairline inset from the group's edges", () => {
    render(
      <>
        <ButtonGroup>
          <Button>A</Button>
          <ButtonGroupSeparator />
          <Button>B</Button>
        </ButtonGroup>
        <ButtonGroup orientation="vertical">
          <Button>C</Button>
          <ButtonGroupSeparator />
          <Button>D</Button>
        </ButtonGroup>
      </>
    )
    const [vertical, horizontal] = screen.getAllByRole("separator")

    expect(vertical.className).toContain("w-(--hairline)")
    expect(vertical.className).toContain("my-px")
    expect(vertical.className).toContain("z-1")
    expect(vertical.className).toContain("bg-input")
    expect(vertical.className).not.toContain("bg-border")
    expect(horizontal.className).toContain("h-(--hairline)")
    expect(horizontal.className).toContain("mx-px")
    expect(horizontal.className).toContain("w-auto")
    expect(horizontal.className).not.toContain("w-full")
  })

  it("can be decorative", () => {
    render(
      <ButtonGroup>
        <ButtonGroupSeparator decorative />
      </ButtonGroup>
    )

    expect(screen.queryByRole("separator")).toBeNull()
    expect(
      document
        .querySelector("[data-slot=button-group-separator]")
        ?.getAttribute("role")
    ).toBe("none")
  })

  it("defaults to vertical outside a group", () => {
    render(<ButtonGroupSeparator />)

    expect(screen.getByRole("separator").getAttribute("data-orientation")).toBe(
      "vertical"
    )
  })
})

describe("ButtonGroupText", () => {
  it("renders a div with its slot", () => {
    const { container } = render(<ButtonGroupText>https://</ButtonGroupText>)
    const text = slot(container, "button-group-text")!

    expect(text.tagName).toBe("DIV")
    expect(text.textContent).toBe("https://")
  })

  it("renders as a label linked to an input", () => {
    render(
      <ButtonGroup>
        <ButtonGroupText render={<label htmlFor="url" />}>
          https://
        </ButtonGroupText>
        <input id="url" />
      </ButtonGroup>
    )

    expect(screen.getByLabelText("https://").id).toBe("url")
  })
})
