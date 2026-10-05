import * as React from "react"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Checkbox } from "./checkbox"
import {
  Item,
  ItemChevron,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "./item"

afterEach(() => {
  cleanup()
})

function slot(name: string) {
  return document.querySelector<HTMLElement>(`[data-slot="${name}"]`)!
}

describe("Item", () => {
  it("renders slots, variant and size", () => {
    render(
      <Item variant="outline" size="sm">
        <ItemMedia variant="icon">
          <svg />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Title</ItemTitle>
          <ItemDescription>Description</ItemDescription>
        </ItemContent>
      </Item>
    )

    const item = slot("item")
    expect(item.getAttribute("data-variant")).toBe("outline")
    expect(item.getAttribute("data-size")).toBe("sm")
    expect(item.hasAttribute("data-interactive")).toBe(false)
    expect(slot("item-media").getAttribute("aria-hidden")).toBe("true")
    expect(slot("item-description").tagName).toBe("P")
  })

  it("marks links, buttons and labels as interactive", () => {
    render(
      <>
        <Item render={<a href="/a" />}>Link</Item>
        <Item render={<button type="button" />}>Button</Item>
        <Item render={<label />}>Label</Item>
      </>
    )

    for (const item of document.querySelectorAll("[data-slot=item]")) {
      expect(item.hasAttribute("data-interactive")).toBe(true)
    }
    expect(screen.getByRole("link", { name: "Link" })).toBeTruthy()
  })

  it("forwards refs and toggles a checkbox from anywhere on a label row", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <Item ref={ref} render={<label />}>
        <Checkbox />
        <ItemContent>
          <ItemTitle>Backups</ItemTitle>
        </ItemContent>
      </Item>
    )

    expect(ref.current).toBe(slot("item"))
    fireEvent.click(screen.getByText("Backups"))
    expect(slot("checkbox").hasAttribute("data-checked")).toBe(true)
  })
})

describe("ItemGroup", () => {
  it("is a list of listitems for plain rows", () => {
    render(
      <ItemGroup>
        <Item>One</Item>
        <Item>Two</Item>
      </ItemGroup>
    )

    expect(screen.getByRole("list")).toBe(slot("item-group"))
    expect(screen.getAllByRole("listitem")).toHaveLength(2)
  })

  it("drops the list role when items are links", () => {
    render(
      <ItemGroup>
        <Item render={<a href="/a" />}>One</Item>
      </ItemGroup>
    )

    expect(slot("item-group").hasAttribute("role")).toBe(false)
    expect(screen.getByRole("link", { name: "One" })).toBeTruthy()
  })

  it("moves the highlight to the hovered interactive item", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }))
    render(
      <ItemGroup variant="grouped">
        <Item render={<a href="/a" />}>One</Item>
        <Item render={<a href="/b" />}>Two</Item>
        <Item>Static</Item>
      </ItemGroup>
    )

    const highlight = slot("item-highlight")
    const [one, two] = screen.getAllByRole("link")
    fireEvent.pointerOver(one, { pointerType: "mouse" })
    expect(highlight.hasAttribute("data-visible")).toBe(true)
    expect(one.hasAttribute("data-highlighted")).toBe(true)

    fireEvent.pointerOver(two, { pointerType: "mouse" })
    expect(one.hasAttribute("data-highlighted")).toBe(false)
    expect(two.hasAttribute("data-highlighted")).toBe(true)

    fireEvent.pointerOver(screen.getByText("Static"), { pointerType: "mouse" })
    expect(highlight.hasAttribute("data-visible")).toBe(false)
    vi.unstubAllGlobals()
  })

  it("keeps the highlight while the pointer crosses a gap", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }))
    render(
      <ItemGroup>
        <Item render={<a href="/a" />}>One</Item>
        <Item render={<a href="/b" />}>Two</Item>
      </ItemGroup>
    )

    const group = slot("item-group")
    const highlight = slot("item-highlight")
    const [one, two] = screen.getAllByRole("link")
    fireEvent.pointerOver(one, { pointerType: "mouse" })
    fireEvent.pointerOver(group, { pointerType: "mouse" })
    expect(highlight.hasAttribute("data-visible")).toBe(true)
    expect(one.hasAttribute("data-highlighted")).toBe(true)

    fireEvent.pointerOver(two, { pointerType: "mouse" })
    expect(highlight.hasAttribute("data-instant")).toBe(false)
    expect(two.hasAttribute("data-highlighted")).toBe(true)
    vi.unstubAllGlobals()
  })

  it("slides instead of snapping when re-entered right after leaving", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }))
    render(
      <ItemGroup>
        <Item render={<a href="/a" />}>One</Item>
        <Item render={<a href="/b" />}>Two</Item>
      </ItemGroup>
    )

    const group = slot("item-group")
    const highlight = slot("item-highlight")
    const [one, two] = screen.getAllByRole("link")
    fireEvent.pointerOver(one, { pointerType: "mouse" })
    fireEvent.pointerLeave(group)
    expect(highlight.hasAttribute("data-visible")).toBe(false)
    fireEvent.pointerOver(two, { pointerType: "mouse" })
    expect(highlight.hasAttribute("data-instant")).toBe(false)
    vi.unstubAllGlobals()
  })

  it("ignores touch and can be turned off", () => {
    const { rerender } = render(
      <ItemGroup>
        <Item render={<a href="/a" />}>One</Item>
      </ItemGroup>
    )

    fireEvent.pointerOver(screen.getByRole("link"), { pointerType: "touch" })
    expect(slot("item-highlight").hasAttribute("data-visible")).toBe(false)

    rerender(
      <ItemGroup highlight={false}>
        <Item render={<a href="/a" />}>One</Item>
      </ItemGroup>
    )
    expect(document.querySelector("[data-slot=item-highlight]")).toBeNull()
  })

  it("skips disabled items", () => {
    render(
      <ItemGroup>
        <Item render={<button type="button" disabled />}>Off</Item>
      </ItemGroup>
    )

    fireEvent.pointerOver(screen.getByRole("button"), { pointerType: "mouse" })
    expect(slot("item-highlight").hasAttribute("data-visible")).toBe(false)
  })
})

describe("arrow navigation", () => {
  function Group(props: React.ComponentProps<typeof ItemGroup>) {
    return (
      <ItemGroup {...props}>
        <Item render={<a href="/a" />}>One</Item>
        <Item>Static</Item>
        <Item render={<button type="button" disabled />}>Off</Item>
        <Item render={<a href="/b" />}>Two</Item>
        <Item render={<a href="/c" />}>Three</Item>
      </ItemGroup>
    )
  }

  it("moves between interactive items and skips static and disabled ones", () => {
    render(<Group />)
    const [one, two, three] = screen.getAllByRole("link")
    one.focus()

    fireEvent.keyDown(one, { key: "ArrowDown" })
    expect(document.activeElement).toBe(two)
    fireEvent.keyDown(two, { key: "End" })
    expect(document.activeElement).toBe(three)
    fireEvent.keyDown(three, { key: "ArrowDown" })
    expect(document.activeElement).toBe(three)
    fireEvent.keyDown(three, { key: "Home" })
    expect(document.activeElement).toBe(one)
    fireEvent.keyDown(one, { key: "ArrowUp" })
    expect(document.activeElement).toBe(one)
  })

  it("leaves keys alone inside controls, with modifiers or when off", () => {
    const { rerender } = render(
      <ItemGroup>
        <Item>
          <input aria-label="Inline" />
        </Item>
        <Item render={<a href="/a" />}>One</Item>
        <Item render={<a href="/b" />}>Two</Item>
      </ItemGroup>
    )

    const input = screen.getByRole("textbox")
    input.focus()
    fireEvent.keyDown(input, { key: "ArrowDown" })
    expect(document.activeElement).toBe(input)

    const [one] = screen.getAllByRole("link")
    one.focus()
    fireEvent.keyDown(one, { key: "ArrowDown", shiftKey: true })
    expect(document.activeElement).toBe(one)

    rerender(<Group arrowNavigation={false} />)
    const first = screen.getAllByRole("link")[0]
    first.focus()
    fireEvent.keyDown(first, { key: "ArrowDown" })
    expect(document.activeElement).toBe(first)
  })
})

describe("layout stability", () => {
  it("never gives in-flow parts pseudo-elements that could shift on hover", () => {
    render(
      <ItemGroup variant="grouped">
        <Item render={<a href="/a" />}>
          <ItemMedia variant="icon" tone="blue">
            <svg />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>One</ItemTitle>
            <ItemDescription>Two</ItemDescription>
          </ItemContent>
          <ItemChevron />
        </Item>
      </ItemGroup>
    )

    for (const part of ["item-media", "item-content", "item-title"]) {
      expect(slot(part).className).not.toMatch(/(^|\s|:)before:/)
    }
    expect(slot("item").className).toContain("before:absolute")
  })
})

describe("ItemMedia tone", () => {
  it("only tints icon media", () => {
    render(
      <>
        <ItemMedia variant="icon" tone="blue">
          <svg />
        </ItemMedia>
        <ItemMedia variant="image" tone="red">
          <img alt="" />
        </ItemMedia>
      </>
    )

    const [icon, image] = document.querySelectorAll("[data-slot=item-media]")
    expect(icon.getAttribute("data-tone")).toBe("blue")
    expect(icon.className).toContain("--color-blue-500")
    expect(image.hasAttribute("data-tone")).toBe(false)
  })
})

describe("parts", () => {
  it("renders a hidden chevron and a decorative separator", () => {
    render(
      <ItemGroup>
        <Item>
          One
          <ItemChevron />
        </Item>
        <ItemSeparator />
        <Item>Two</Item>
      </ItemGroup>
    )

    expect(slot("item-chevron").getAttribute("aria-hidden")).toBe("true")
    expect(slot("item-separator").getAttribute("aria-hidden")).toBe("true")
    expect(screen.queryByRole("separator")).toBeNull()
  })

  it("server renders", () => {
    const html = renderToString(
      <ItemGroup variant="grouped">
        <Item render={<a href="/a" />}>
          <ItemMedia variant="image">
            <img alt="" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>One</ItemTitle>
          </ItemContent>
          <ItemChevron />
        </Item>
      </ItemGroup>
    )

    expect(html).toContain('data-slot="item-group"')
    expect(html).toContain('data-slot="item-highlight"')
  })
})
