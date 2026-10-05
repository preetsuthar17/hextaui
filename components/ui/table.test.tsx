import * as React from "react"
import { cleanup, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it } from "vitest"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table"

afterEach(() => {
  cleanup()
})

function slot(name: string) {
  return document.querySelector<HTMLElement>(`[data-slot="${name}"]`)!
}

function Example(props: React.ComponentProps<typeof Table>) {
  return (
    <Table {...props}>
      <TableCaption>Invoices</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead align="end">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableHead scope="row">INV-1</TableHead>
          <TableCell align="end">$10</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

describe("Table", () => {
  it("renders native table semantics with row headers", () => {
    render(<Example />)

    expect(screen.getByRole("table", { name: "Invoices" })).toBe(slot("table"))
    expect(screen.getAllByRole("columnheader")).toHaveLength(2)
    expect(screen.getByRole("rowheader", { name: "INV-1" })).toBeTruthy()
    expect(screen.getByRole("cell", { name: "$10" }).dataset.align).toBe("end")
  })

  it("exposes variant, size and wrap on the frame", () => {
    render(<Example variant="surface" size="sm" wrap />)

    const frame = slot("table-frame")
    expect(frame.dataset.variant).toBe("surface")
    expect(frame.dataset.size).toBe("sm")
    expect(frame.hasAttribute("data-wrap")).toBe(true)
    expect(frame.contains(slot("table-container"))).toBe(true)
  })

  it("defaults to the plain variant without wrapping", () => {
    render(<Example />)

    const frame = slot("table-frame")
    expect(frame.dataset.variant).toBe("default")
    expect(frame.hasAttribute("data-wrap")).toBe(false)
  })

  it("only makes the scroll area focusable when it overflows", () => {
    render(<Example />)
    const container = slot("table-container")
    expect(container.hasAttribute("tabindex")).toBe(false)
    expect(container.hasAttribute("data-overflowing")).toBe(false)
  })

  it("can opt out of scroll fades and forwards the container ref", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Example scrollFade={false} containerRef={ref} />)

    expect(ref.current).toBe(slot("table-container"))
    expect(ref.current?.className).not.toContain("mask-")
  })

  it("server renders", () => {
    const html = renderToString(<Example variant="surface" />)
    expect(html).toContain('data-slot="table-frame"')
    expect(html).toContain('scope="row"')
  })
})
