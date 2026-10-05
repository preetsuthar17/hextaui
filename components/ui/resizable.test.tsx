import * as React from "react"
import { cleanup, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  useDefaultLayout,
} from "./resizable"

beforeAll(() => {
  if (typeof globalThis.ResizeObserver === "undefined") {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver
  }
})

afterEach(() => {
  cleanup()
  globalThis.localStorage?.clear()
})

function Layout(props: React.ComponentProps<typeof ResizableHandle>) {
  return (
    <ResizablePanelGroup>
      <ResizablePanel id="a" defaultSize="30%">
        A
      </ResizablePanel>
      <ResizableHandle {...props} />
      <ResizablePanel id="b">B</ResizablePanel>
    </ResizablePanelGroup>
  )
}

function Persisted() {
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({ id: "test" })
  return (
    <ResizablePanelGroup
      defaultLayout={defaultLayout}
      onLayoutChanged={onLayoutChanged}
    >
      <ResizablePanel id="a">A</ResizablePanel>
      <ResizableHandle />
      <ResizablePanel id="b">B</ResizablePanel>
    </ResizablePanelGroup>
  )
}

describe("Resizable", () => {
  it("renders slots and a focusable separator", () => {
    render(<Layout />)
    const separator = screen.getByRole("separator")
    expect(separator.getAttribute("data-slot")).toBe("resizable-handle")
    expect(separator.tabIndex).toBe(0)
    expect(
      separator.querySelector("[data-slot=resizable-handle-grip]")
    ).toBeTruthy()
    expect(separator.hasAttribute("data-with-handle")).toBe(false)
  })

  it("marks an always-visible grip and renders the size readout", () => {
    render(<Layout withHandle showSize="pixels" />)
    const separator = screen.getByRole("separator")
    expect(separator.hasAttribute("data-with-handle")).toBe(true)
    expect(
      separator.querySelector("[data-slot=resizable-handle-size]")
    ).toBeTruthy()
  })

  it("server renders with a persisted layout without touching storage", () => {
    vi.stubGlobal("localStorage", undefined)
    try {
      expect(() => renderToString(<Persisted />)).not.toThrow()
    } finally {
      vi.unstubAllGlobals()
    }
  })
})
