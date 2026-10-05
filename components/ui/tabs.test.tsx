import * as React from "react"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"

afterEach(() => {
  cleanup()
})

function Demo(
  props: Partial<React.ComponentProps<typeof Tabs>> & {
    variant?: "default" | "line"
  }
) {
  const { variant, ...rest } = props
  return (
    <Tabs defaultValue="a" {...rest}>
      <TabsList variant={variant} aria-label="Sections">
        <TabsTrigger value="a">Alpha</TabsTrigger>
        <TabsTrigger value="b">Beta</TabsTrigger>
        <TabsTrigger value="c" disabled>
          Gamma
        </TabsTrigger>
      </TabsList>
      <TabsContent value="a">Alpha panel</TabsContent>
      <TabsContent value="b">Beta panel</TabsContent>
      <TabsContent value="c">Gamma panel</TabsContent>
    </Tabs>
  )
}

describe("Tabs", () => {
  it("renders a tablist with an indicator and the default panel", () => {
    render(<Demo variant="line" />)
    const list = screen.getByRole("tablist", { name: "Sections" })
    expect(list.getAttribute("data-variant")).toBe("line")
    expect(list.querySelector("[data-slot=tabs-indicator]")).toBeTruthy()
    expect(
      screen.getByRole("tab", { name: "Alpha" }).getAttribute("aria-selected")
    ).toBe("true")
    expect(screen.getByRole("tabpanel").textContent).toBe("Alpha panel")
  })

  it("switches panels on click and skips disabled tabs", () => {
    const onValueChange = vi.fn()
    render(<Demo onValueChange={onValueChange} />)
    fireEvent.click(screen.getByRole("tab", { name: "Beta" }))
    expect(onValueChange).toHaveBeenCalledWith("b", expect.anything())
    expect(screen.getByRole("tabpanel").textContent).toBe("Beta panel")
    fireEvent.click(screen.getByRole("tab", { name: "Gamma" }))
    expect(screen.getByRole("tabpanel").textContent).toBe("Beta panel")
  })

  it("follows a controlled value", () => {
    const { rerender } = render(<Demo value="a" />)
    rerender(<Demo value="b" />)
    expect(screen.getByRole("tabpanel").textContent).toBe("Beta panel")
  })

  it("server renders the indicator before hydration", () => {
    const html = renderToString(<Demo />)
    expect(html).toContain('data-slot="tabs-indicator"')
    expect(html).toContain('data-slot="tabs-list"')
  })
})
