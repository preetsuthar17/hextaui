import fs from "node:fs"
import path from "node:path"
import * as React from "react"
import { cleanup, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it } from "vitest"

import { Separator } from "./separator"

afterEach(() => {
  cleanup()
})

function separator() {
  return document.querySelector<HTMLElement>("[data-slot=separator]")!
}

describe("Separator", () => {
  it("is a horizontal separator by default", () => {
    render(<Separator />)

    const element = screen.getByRole("separator")
    expect(element.getAttribute("aria-orientation")).toBe("horizontal")
    expect(element.getAttribute("data-orientation")).toBe("horizontal")
    expect(element.hasAttribute("data-content")).toBe(false)
    expect(element.hasAttribute("data-align")).toBe(false)
    expect(element.childElementCount).toBe(0)
  })

  it("exposes the vertical orientation", () => {
    render(<Separator orientation="vertical" />)

    const element = screen.getByRole("separator")
    expect(element.getAttribute("aria-orientation")).toBe("vertical")
    expect(element.getAttribute("data-orientation")).toBe("vertical")
  })

  it("hides decorative separators from assistive technology", () => {
    render(<Separator decorative orientation="vertical" />)

    expect(screen.queryByRole("separator")).toBeNull()
    expect(separator().getAttribute("role")).toBe("none")
    expect(separator().hasAttribute("aria-orientation")).toBe(false)
    expect(separator().getAttribute("data-orientation")).toBe("vertical")
  })

  it("keeps a label readable instead of making it presentational", () => {
    render(<Separator>Or continue with</Separator>)

    expect(screen.queryByRole("separator")).toBeNull()
    expect(separator().hasAttribute("role")).toBe(false)
    expect(separator().hasAttribute("aria-orientation")).toBe(false)
    expect(separator().hasAttribute("data-content")).toBe(true)
    expect(separator().getAttribute("data-align")).toBe("center")
    const label = separator().querySelector("[data-slot=separator-label]")!
    expect(label.textContent).toBe("Or continue with")
    expect(screen.getByText("Or continue with")).toBeTruthy()
  })

  it("aligns the label", () => {
    render(<Separator align="start">Today</Separator>)

    expect(separator().getAttribute("data-align")).toBe("start")
    expect(
      separator()
        .querySelector("[data-slot=separator-label]")!
        .className.includes("text-start")
    ).toBe(true)
  })

  it("treats empty and whitespace children as a plain line", () => {
    render(
      <>
        <Separator>{null}</Separator>
        <Separator>{false}</Separator>
        <Separator> </Separator>
        <Separator>{[]}</Separator>
      </>
    )

    expect(screen.getAllByRole("separator")).toHaveLength(4)
    for (const element of document.querySelectorAll("[data-slot=separator]")) {
      expect(element.childElementCount).toBe(0)
    }
  })

  it("lets callers override the role and data-slot", () => {
    render(<Separator role="presentation" data-slot="menu-rule" />)

    const element = document.querySelector("[data-slot=menu-rule]")!
    expect(element.getAttribute("role")).toBe("presentation")
  })

  it("merges string and function class names", () => {
    render(
      <>
        <Separator className="my-4" />
        <Separator
          orientation="vertical"
          className={(state) => `rule-${state.orientation}`}
        />
      </>
    )

    const [horizontal, vertical] = document.querySelectorAll<HTMLElement>(
      "[data-slot=separator]"
    )
    expect(horizontal.className).toContain("my-4")
    expect(horizontal.className).toContain("bg-border")
    expect(vertical.className).toContain("rule-vertical")
    expect(vertical.className).toContain("bg-border")
  })

  it("lets size and color overrides replace the defaults", () => {
    render(
      <>
        <Separator className="h-0.5 w-24 bg-primary" />
        <Separator orientation="vertical" className="h-6 w-px" />
      </>
    )

    const [horizontal, vertical] = document.querySelectorAll<HTMLElement>(
      "[data-slot=separator]"
    )
    expect(horizontal.className).not.toContain("h-(--hairline)")
    expect(horizontal.className).not.toContain("w-full")
    expect(horizontal.className).not.toContain("bg-border")
    expect(horizontal.className).toContain("h-0.5")
    expect(vertical.className).not.toContain("w-(--hairline)")
    expect(vertical.className).toContain("w-px")
    expect(vertical.className).toContain("h-6")
  })

  it("falls back to horizontal styles for an unknown orientation", () => {
    render(<Separator orientation={"diagonal" as unknown as "horizontal"} />)

    expect(separator().className).toContain("w-full")
  })

  it("is a client component so undefined role overrides survive the server boundary", () => {
    const source = fs.readFileSync(
      path.join(import.meta.dirname, "separator.tsx"),
      "utf8"
    )

    expect(source.startsWith('"use client"')).toBe(true)
  })

  it("renders as another element and forwards refs", () => {
    const ref = React.createRef<HTMLElement>()
    render(<Separator ref={ref as React.Ref<HTMLDivElement>} render={<li />} />)

    expect(ref.current?.tagName).toBe("LI")
    expect(ref.current?.getAttribute("role")).toBe("separator")
  })

  it("renders on the server", () => {
    const html = renderToString(
      <>
        <Separator />
        <Separator>Or</Separator>
      </>
    )

    expect(html).toContain('role="separator"')
    expect(html).toContain('data-slot="separator-label"')
  })
})
