import * as React from "react"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  usePagination,
  type UsePaginationOptions,
} from "./pagination"

afterEach(() => {
  cleanup()
})

function useItems(options: UsePaginationOptions) {
  const ref = { current: null as ReturnType<typeof usePagination> | null }
  function Probe() {
    ref.current = usePagination(options)
    return null
  }
  render(<Probe />)
  return ref.current!
}

function labels(result: ReturnType<typeof usePagination>) {
  return result.items.map((item) =>
    item.type === "page" ? String(item.page) : "…"
  )
}

describe("usePagination", () => {
  it("keeps the same number of slots on every page", () => {
    for (let count = 1; count <= 60; count++) {
      const sizes = new Set<number>()
      for (let page = 1; page <= count; page++) {
        const result = useItems({ page, count })
        cleanup()
        sizes.add(result.items.length)
        const pages = result.items.flatMap((item) =>
          item.type === "page" ? [item.page] : []
        )
        expect(pages).toContain(page)
        expect(pages).toContain(1)
        expect(pages).toContain(count)
      }
      expect(sizes.size).toBe(1)
    }
  })

  it("places ellipses around the current page", () => {
    expect(labels(useItems({ page: 10, count: 20 }))).toEqual([
      "1",
      "…",
      "9",
      "10",
      "11",
      "…",
      "20",
    ])
  })

  it("survives hostile input", () => {
    expect(useItems({ page: 5, count: Number.NaN }).items).toEqual([])
    cleanup()
    expect(useItems({ page: 5, count: -3 }).items).toEqual([])
    cleanup()
    expect(useItems({ page: Number.NaN, count: 5 }).page).toBe(1)
    cleanup()
    expect(useItems({ page: 99, count: 5 }).page).toBe(5)
    cleanup()
    expect(useItems({ page: 3, count: Infinity }).items).toEqual([])
    cleanup()
    const huge = useItems({ page: 5e11, count: 1e12 })
    expect(huge.items).toHaveLength(7)
    cleanup()
    expect(
      labels(useItems({ page: 6, count: 12, siblings: 0, boundaries: 0 }))
    ).toEqual(["…", "6", "…"])
  })
})

describe("Pagination", () => {
  it("renders a labelled nav and changes page uncontrolled", () => {
    const onPageChange = vi.fn()
    render(
      <Pagination count={10} onPageChange={onPageChange} compact={false} />
    )

    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeTruthy()
    expect(
      screen
        .getByRole("button", { name: "Page 1" })
        .getAttribute("aria-current")
    ).toBe("page")

    fireEvent.click(screen.getByRole("button", { name: "Go to next page" }))
    expect(onPageChange).toHaveBeenCalledWith(2)
    expect(
      screen
        .getByRole("button", { name: "Page 2" })
        .getAttribute("aria-current")
    ).toBe("page")
  })

  it("keeps the ends focusable but inert", () => {
    const onPageChange = vi.fn()
    render(
      <Pagination
        page={1}
        count={3}
        onPageChange={onPageChange}
        compact={false}
      />
    )
    const previous = screen.getByRole("button", { name: "Go to previous page" })
    expect(previous.getAttribute("aria-disabled")).toBe("true")
    expect(previous.hasAttribute("disabled")).toBe(false)
    fireEvent.click(previous)
    expect(onPageChange).not.toHaveBeenCalled()
  })

  it("follows a controlled page", () => {
    const { rerender } = render(
      <Pagination page={2} count={5} compact={false} />
    )
    rerender(<Pagination page={4} count={5} compact={false} />)
    expect(
      screen
        .getByRole("button", { name: "Page 4" })
        .getAttribute("aria-current")
    ).toBe("page")
  })

  it("renders real links and ignores modifier clicks", () => {
    const onPageChange = vi.fn()
    render(
      <Pagination
        page={2}
        count={5}
        compact={false}
        getPageHref={(page) => `?page=${page}`}
        onPageChange={onPageChange}
      />
    )
    const link = screen.getByRole("link", { name: "Page 3" })
    expect(link.getAttribute("href")).toBe("?page=3")
    link.addEventListener("click", (event) => event.preventDefault())
    fireEvent.click(link, { metaKey: true })
    expect(onPageChange).not.toHaveBeenCalled()
    fireEvent.click(link)
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it("jumps from the ellipsis", async () => {
    const onPageChange = vi.fn()
    render(
      <Pagination
        page={1}
        count={50}
        compact={false}
        onPageChange={onPageChange}
      />
    )
    fireEvent.click(
      screen.getByRole("button", { name: "More pages, go to page" })
    )
    const field = screen.getByRole("textbox", { name: "Go to page, 1 to 50" })
    expect(document.activeElement).toBe(field)

    fireEvent.change(field, { target: { value: "80" } })
    fireEvent.keyDown(field, { key: "Enter" })
    expect(field.getAttribute("aria-invalid")).toBe("true")
    expect(onPageChange).not.toHaveBeenCalled()

    fireEvent.change(field, { target: { value: "42" } })
    await act(async () => {
      fireEvent.keyDown(field, { key: "Enter" })
    })
    expect(onPageChange).toHaveBeenCalledWith(42)
  })

  it("accepts Arabic-Indic and full-width digits", async () => {
    const onPageChange = vi.fn()
    render(
      <Pagination
        page={1}
        count={50}
        compact={false}
        onPageChange={onPageChange}
      />
    )
    fireEvent.click(
      screen.getByRole("button", { name: "More pages, go to page" })
    )
    const field = screen.getByRole("textbox")
    fireEvent.change(field, { target: { value: "٤٢" } })
    await act(async () => {
      fireEvent.keyDown(field, { key: "Enter" })
    })
    expect(onPageChange).toHaveBeenCalledWith(42)
  })

  it("closes the field on Escape and returns focus", () => {
    render(<Pagination page={1} count={50} compact={false} />)
    fireEvent.click(
      screen.getByRole("button", { name: "More pages, go to page" })
    )
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Escape" })
    expect(screen.queryByRole("textbox")).toBeNull()
    expect(document.activeElement?.getAttribute("aria-label")).toBe(
      "More pages, go to page"
    )
  })

  it("renders the compact layout", () => {
    render(<Pagination page={3} count={12} compact />)
    expect(
      screen.getByRole("button", { name: "Page 3 of 12, go to page" })
    ).toBeTruthy()
  })

  it("supports composition", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#2" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    expect(
      screen.getByRole("link", { name: "2" }).getAttribute("aria-current")
    ).toBe("page")
    expect(screen.getByText("More pages")).toBeTruthy()
  })

  it("server renders both layouts", () => {
    const html = renderToString(<Pagination page={3} count={30} />)
    expect(html).toContain('data-slot="pagination-full"')
    expect(html).toContain('data-slot="pagination-compact"')
    expect(html).toContain("--pagination-needed")
  })
})
