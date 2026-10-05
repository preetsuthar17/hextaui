import * as React from "react"
import { act, cleanup, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Spinner } from "./spinner"

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe("Spinner", () => {
  it("is a labelled status by default", () => {
    render(<Spinner />)
    const spinner = screen.getByRole("status", { name: "Loading" })
    expect(spinner.getAttribute("data-slot")).toBe("spinner")
    expect(spinner.getAttribute("data-variant")).toBe("ticks")
    expect(spinner.querySelectorAll("line")).toHaveLength(8)
  })

  it("drops its role when hidden and renders the ring", () => {
    const { container } = render(<Spinner aria-hidden variant="ring" />)
    expect(screen.queryByRole("status")).toBeNull()
    expect(container.querySelectorAll("circle")).toHaveLength(2)
  })

  it("leaves sizing to the parent with size null", () => {
    const { container } = render(<Spinner size={null} />)
    expect(container.querySelector("svg")?.getAttribute("class")).not.toMatch(
      /size-/
    )
  })

  it("waits before showing and stays long enough", () => {
    vi.useFakeTimers()
    const { rerender } = render(<Spinner loading label="Fetching" />)
    expect(screen.queryByRole("status")).toBeNull()
    act(() => {
      vi.advanceTimersByTime(160)
    })
    expect(screen.getByRole("status", { name: "Fetching" })).toBeTruthy()

    rerender(<Spinner loading={false} label="Fetching" />)
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(screen.getByRole("status", { name: "Fetching" })).toBeTruthy()
    act(() => {
      vi.advanceTimersByTime(250)
    })
    expect(screen.queryByRole("status")).toBeNull()
  })

  it("never shows for fast loads", () => {
    vi.useFakeTimers()
    const { rerender } = render(<Spinner loading />)
    act(() => {
      vi.advanceTimersByTime(100)
    })
    rerender(<Spinner loading={false} />)
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(screen.queryByRole("status")).toBeNull()
  })

  it("server renders", () => {
    expect(renderToString(<Spinner />)).toContain('data-slot="spinner"')
  })
})
