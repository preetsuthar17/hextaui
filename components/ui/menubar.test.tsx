import * as React from "react"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "./menubar"

afterEach(() => {
  cleanup()
  document.body.innerHTML = ""
})

function slot(name: string) {
  return document.querySelector<HTMLElement>(`[data-slot="${name}"]`)
}

async function flush() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
  })
}

function App({ onNew }: { onNew?: () => void }) {
  return (
    <Menubar aria-label="Editor">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={onNew}>
            New tab
            <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Share</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Email link</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem defaultChecked>Show ruler</MenubarCheckboxItem>
          <MenubarRadioGroup defaultValue="comfortable">
            <MenubarRadioItem value="compact">Compact</MenubarRadioItem>
            <MenubarRadioItem value="comfortable">Comfortable</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

describe("Menubar", () => {
  it("renders a labelled menubar with triggers", () => {
    render(<App />)

    expect(screen.getByRole("menubar", { name: "Editor" })).toBe(
      slot("menubar")
    )
    const triggers = screen.getAllByRole("menuitem")
    expect(triggers.map((trigger) => trigger.textContent)).toEqual([
      "File",
      "View",
    ])
    expect(triggers[0].getAttribute("data-slot")).toBe("menubar-trigger")
    expect(slot("menubar-highlight")?.getAttribute("aria-hidden")).toBe("true")
  })

  it("opens a menu with menubar slots and runs items", async () => {
    const onNew = vi.fn()
    render(<App onNew={onNew} />)

    fireEvent.click(screen.getByRole("menuitem", { name: "File" }))
    await flush()

    expect(slot("menubar-content")).toBeTruthy()
    expect(slot("menubar-item")?.textContent).toContain("New tab")
    expect(slot("menubar-shortcut")?.textContent).toBe("⌘T")
    expect(slot("menubar-sub-trigger")).toBeTruthy()

    fireEvent.click(screen.getByRole("menuitem", { name: /New tab/ }))
    expect(onNew).toHaveBeenCalledTimes(1)
  })

  it("moves the open highlight to the open trigger", async () => {
    render(<App />)
    const highlight = slot("menubar-highlight")!
    expect(highlight.hasAttribute("data-visible")).toBe(false)

    fireEvent.click(screen.getByRole("menuitem", { name: "View" }))
    await flush()
    expect(highlight.hasAttribute("data-visible")).toBe(true)
    expect(
      screen
        .getByRole("menuitem", { name: "View" })
        .hasAttribute("data-popup-open")
    ).toBe(true)
    expect(slot("menubar-checkbox-item")).toBeTruthy()
    expect(
      document.querySelectorAll("[data-slot=menubar-radio-item]")
    ).toHaveLength(2)
  })

  it("marks icon-only triggers but not icon and label triggers", () => {
    render(
      <Menubar aria-label="Tools">
        <MenubarMenu>
          <MenubarTrigger aria-label="More">
            <svg />
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>
            <svg />
            Edit
          </MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    )

    const [more, edit] = screen.getAllByRole("menuitem")
    expect(more.hasAttribute("data-icon-only")).toBe(true)
    expect(edit.hasAttribute("data-icon-only")).toBe(false)
  })

  it("server renders", () => {
    const html = renderToString(<App />)
    expect(html).toContain('data-slot="menubar"')
    expect(html).toContain('role="menubar"')
  })
})
