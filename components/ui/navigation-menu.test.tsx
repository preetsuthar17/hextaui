import * as React from "react"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it } from "vitest"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./navigation-menu"

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

function Menu(props: React.ComponentProps<typeof NavigationMenu>) {
  return (
    <NavigationMenu aria-label="Main" {...props}>
      <NavigationMenuList>
        <NavigationMenuItem value="products">
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="/components">
              Components
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/pricing" active>
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

describe("NavigationMenu", () => {
  it("renders a labelled nav with the variant and a hidden highlight", () => {
    render(<Menu variant="panel" />)

    expect(screen.getByRole("navigation", { name: "Main" })).toBe(
      slot("navigation-menu")
    )
    expect(slot("navigation-menu")?.dataset.variant).toBe("panel")
    expect(slot("navigation-menu-highlight")?.getAttribute("aria-hidden")).toBe(
      "true"
    )
  })

  it("defaults to the dropdown variant", () => {
    render(<Menu />)
    expect(slot("navigation-menu")?.dataset.variant).toBe("dropdown")
  })

  it("opens content from its trigger and marks the active page", async () => {
    render(<Menu variant="panel" />)

    fireEvent.click(screen.getByRole("button", { name: "Products" }))
    await flush()

    const content = slot("navigation-menu-content")
    expect(content?.dataset.variant).toBe("panel")
    expect(screen.getByRole("link", { name: "Components" })).toBeTruthy()
    expect(
      screen
        .getByRole("button", { name: "Products" })
        .hasAttribute("data-popup-open")
    ).toBe(true)
    expect(
      screen.getByRole("link", { name: "Pricing" }).getAttribute("aria-current")
    ).toBe("page")
  })

  it("supports a controlled value", async () => {
    render(<Menu value="products" />)
    await flush()
    expect(slot("navigation-menu-content")).toBeTruthy()
  })

  it("draws the safe area only when asked and open", async () => {
    const { rerender } = render(<Menu value="products" />)
    await flush()
    expect(slot("safe-area-overlay")).toBeNull()

    rerender(<Menu value="products" showSafeArea />)
    await flush()
    expect(slot("safe-area-overlay")?.getAttribute("aria-hidden")).toBe("true")

    rerender(<Menu value={null} showSafeArea />)
    await flush()
    expect(slot("safe-area-overlay")).toBeNull()
  })

  it("server renders", () => {
    const html = renderToString(<Menu variant="panel" />)
    expect(html).toContain('data-slot="navigation-menu"')
    expect(html).toContain("<nav")
  })
})
