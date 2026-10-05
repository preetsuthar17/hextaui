import * as React from "react"
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest"

import {
  createDataTableColumns,
  DataTable,
  DataTableColumnHeader,
  DataTableContent,
  DataTablePagination,
  DataTableSearch,
  DataTableSelectAll,
  DataTableSelectRow,
  DataTableToolbar,
  useDataTable,
  useDataTableContext,
} from "./data-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table"

beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

type Payment = { id: string; email: string; amount: number; status: string }

const payments: Payment[] = Array.from({ length: 23 }, (_, index) => ({
  id: `p${index + 1}`,
  email: `user${String(index + 1).padStart(2, "0")}@example.com`,
  amount: (index * 37) % 100,
  status: index % 3 === 0 ? "failed" : "paid",
}))

const helper = createDataTableColumns<Payment>()

const columns = helper.columns([
  helper.display({
    id: "select",
    header: ({ table }) => <DataTableSelectAll table={table} />,
    cell: ({ row }) => <DataTableSelectRow row={row} />,
    enableSorting: false,
    enableHiding: false,
  }),
  helper.accessor("email", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  }),
  helper.accessor("amount", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
  }),
  helper.accessor("status", { header: "Status" }),
])

function HideStatus() {
  const table = useDataTableContext()
  return (
    <button
      type="button"
      onClick={() => table.getColumn("status")?.toggleVisibility(false)}
    >
      hide status
    </button>
  )
}

function Payments({
  data = payments,
  loading,
}: {
  data?: Payment[]
  loading?: boolean
}) {
  const table = useDataTable({ data, columns, getRowId: (row) => row.id })
  return (
    <DataTable table={table}>
      <DataTableToolbar>
        <DataTableSearch />
        <HideStatus />
      </DataTableToolbar>
      <DataTableContent loading={loading} emptyMessage="Nothing here." />
      <DataTablePagination />
    </DataTable>
  )
}

function bodyRows() {
  return screen.getAllByRole("row").filter((row) => row.closest("tbody"))
}

function emails() {
  return bodyRows().map(
    (row) => within(row).getAllByRole("cell")[1].textContent
  )
}

describe("Table", () => {
  it("renders slotted parts with alignment and pinning hooks", () => {
    const { container } = render(
      <Table stickyHeader>
        <TableHeader>
          <TableRow>
            <TableHead pinned="start" pinnedEdge>
              Name
            </TableHead>
            <TableHead align="end">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell pinned="start">Ada</TableCell>
            <TableCell align="end">$10</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    const tableContainer = container.querySelector(
      "[data-slot=table-container]"
    )!
    expect(tableContainer.hasAttribute("data-sticky-header")).toBe(true)
    expect(container.querySelector("[data-slot=table]")!.tagName).toBe("TABLE")
    const head = screen.getByText("Name")
    expect(head.getAttribute("data-pinned")).toBe("start")
    expect(head.hasAttribute("data-pinned-edge")).toBe(true)
    expect(screen.getByText("$10").getAttribute("data-align")).toBe("end")
  })
})

describe("DataTable", () => {
  it("renders the first page of rows with a pinned first data column", () => {
    render(<Payments />)

    expect(bodyRows()).toHaveLength(10)
    const emailHead = screen.getByRole("columnheader", { name: /Email/ })
    expect(emailHead.getAttribute("data-pinned")).toBe("start")
    expect(emailHead.hasAttribute("data-pinned-edge")).toBe(true)
    expect(screen.getByText("Page 1 of 3")).toBeTruthy()
  })

  it("sorts from the header button and sets aria-sort", () => {
    render(<Payments />)
    const header = screen.getByRole("columnheader", { name: /Amount/ })

    expect(header.getAttribute("aria-sort")).toBe("none")
    fireEvent.click(within(header).getByRole("button"))
    expect(header.getAttribute("aria-sort")).toBe("descending")

    const amounts = bodyRows().map((row) =>
      Number(within(row).getAllByRole("cell")[2].textContent)
    )
    expect(amounts).toEqual([...amounts].sort((a, b) => b - a))

    fireEvent.click(within(header).getByRole("button"))
    expect(header.getAttribute("aria-sort")).toBe("ascending")
  })

  it("filters with search, returns to page one and clears with Escape", () => {
    render(<Payments />)
    fireEvent.click(screen.getByRole("button", { name: "Next page" }))
    expect(screen.getByText("Page 2 of 3")).toBeTruthy()

    const search = screen.getByRole("searchbox", { name: "Search table" })
    fireEvent.change(search, { target: { value: "user2" } })

    expect(emails()).toEqual([
      "user20@example.com",
      "user21@example.com",
      "user22@example.com",
      "user23@example.com",
    ])
    expect(screen.getByText("Page 1 of 1")).toBeTruthy()

    fireEvent.keyDown(search, { key: "Escape" })
    expect((search as HTMLInputElement).value).toBe("")
    expect(bodyRows()).toHaveLength(10)
  })

  it("pages and changes page size", () => {
    render(<Payments />)

    expect(
      (
        screen.getByRole("button", {
          name: "Previous page",
        }) as HTMLButtonElement
      ).disabled
    ).toBe(true)
    fireEvent.click(screen.getByRole("button", { name: "Last page" }))
    expect(screen.getByText("Page 3 of 3")).toBeTruthy()
    expect(bodyRows()).toHaveLength(3)

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "50" } })
    expect(bodyRows()).toHaveLength(23)
  })

  it("selects rows, a page at once, and ranges with Shift", () => {
    render(<Payments />)
    const boxes = () => screen.getAllByRole("checkbox", { name: "Select row" })

    fireEvent.click(boxes()[1])
    expect(screen.getByText("1 of 23 rows selected")).toBeTruthy()
    expect(bodyRows()[1].getAttribute("data-state")).toBe("selected")

    fireEvent.click(boxes()[4], { shiftKey: true })
    expect(screen.getByText("4 of 23 rows selected")).toBeTruthy()

    const all = screen.getByRole("checkbox", {
      name: "Select all rows on this page",
    })
    expect(all.getAttribute("aria-checked")).toBe("mixed")
    fireEvent.click(all)
    expect(screen.getByText("10 of 23 rows selected")).toBeTruthy()
    expect(all.getAttribute("aria-checked")).toBe("true")
  })

  it("hides columns", () => {
    render(<Payments />)
    expect(screen.getByRole("columnheader", { name: "Status" })).toBeTruthy()

    fireEvent.click(screen.getByText("hide status"))

    expect(screen.queryByRole("columnheader", { name: "Status" })).toBeNull()
  })

  it("never strands you past the last page when the data shrinks", () => {
    const { rerender } = render(<Payments />)
    fireEvent.click(screen.getByRole("button", { name: "Last page" }))
    expect(screen.getByText("Page 3 of 3")).toBeTruthy()

    rerender(<Payments data={payments.slice(0, 12)} />)

    expect(screen.getByText("Page 2 of 2")).toBeTruthy()
    expect(bodyRows()).toHaveLength(2)
  })

  it("shows an empty message spanning every column", () => {
    render(<Payments data={[]} />)
    const cell = screen.getByText("Nothing here.")

    expect(cell.getAttribute("colspan")).toBe("4")
    expect(screen.getByText("Page 1 of 1")).toBeTruthy()
  })

  it("renders skeleton rows and aria-busy while loading", () => {
    const { container } = render(<Payments loading />)

    expect(container.querySelector("table")!.getAttribute("aria-busy")).toBe(
      "true"
    )
    expect(
      container.querySelectorAll("[data-slot=data-table-loading-row]")
    ).toHaveLength(5)
  })

  it("announces sorting and search results", () => {
    vi.useFakeTimers()
    const { container } = render(<Payments />)
    const status = container.querySelector("[data-slot=data-table-announcer]")!

    fireEvent.click(
      within(screen.getByRole("columnheader", { name: /Amount/ })).getByRole(
        "button"
      )
    )
    expect(status.textContent).toBe("Sorted by Amount, descending")

    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "user1" },
    })
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(status.textContent).toBe("10 results")
  })

  it("server renders", () => {
    const html = renderToString(<Payments />)

    expect(html).toContain('data-slot="data-table"')
    expect(html).toContain("user01@example.com")
  })
})

describe("DataTablePagination labels", () => {
  function Labelled() {
    const table = useDataTable({
      data: payments,
      columns,
      getRowId: (row) => row.id,
    })
    return (
      <DataTable table={table}>
        <DataTableContent />
        <DataTablePagination
          labels={{ nextPage: "التالي", rowsPerPage: "صفوف" }}
          formatSelection={(selected, total) => `${selected} / ${total}`}
          formatPage={(page, count) => `صفحة ${page} من ${count}`}
        />
      </DataTable>
    )
  }

  it("uses custom labels and formatters, keeping defaults for the rest", () => {
    render(<Labelled />)

    expect(screen.getByRole("button", { name: "التالي" })).toBeTruthy()
    expect(screen.getByRole("button", { name: "Previous page" })).toBeTruthy()
    expect(screen.getByText("صفوف")).toBeTruthy()
    expect(screen.getByText("0 / 23")).toBeTruthy()
    expect(screen.getByText("صفحة 1 من 3")).toBeTruthy()
  })
})

describe("Shift + swipe selection", () => {
  const original = document.elementFromPoint

  afterEach(() => {
    document.elementFromPoint = original
  })

  function rowCheckbox(index: number) {
    return bodyRows()[index].querySelector<HTMLElement>("[data-slot=checkbox]")!
  }

  function hoverRow(index: number) {
    const cell = bodyRows()[index].querySelector("td")!
    document.elementFromPoint = () => cell
  }

  function selectedIndexes() {
    return bodyRows()
      .map((row, index) =>
        row.getAttribute("data-state") === "selected" ? index : -1
      )
      .filter((index) => index !== -1)
  }

  function press(index: number, init: PointerEventInit = {}) {
    fireEvent.pointerDown(rowCheckbox(index), {
      button: 0,
      pointerType: "mouse",
      shiftKey: true,
      ...init,
    })
  }

  function move() {
    fireEvent.pointerMove(window, { clientX: 1, clientY: 1 })
  }

  it("paints the range from the pressed row and follows the pointer back", () => {
    render(<Payments />)

    press(1)
    hoverRow(4)
    move()
    expect(selectedIndexes()).toEqual([1, 2, 3, 4])

    hoverRow(2)
    move()
    expect(selectedIndexes()).toEqual([1, 2])

    fireEvent.pointerUp(window)
    fireEvent.click(rowCheckbox(2))
    expect(selectedIndexes()).toEqual([1, 2])
    expect(screen.getByText("2 of 23 rows selected")).toBeTruthy()
  })

  it("deselects when the swipe starts on a selected row", () => {
    render(<Payments />)
    fireEvent.click(
      screen.getByRole("checkbox", { name: "Select all rows on this page" })
    )

    press(3)
    hoverRow(6)
    move()
    fireEvent.pointerUp(window)

    expect(selectedIndexes()).toEqual([0, 1, 2, 7, 8, 9])
  })

  it("does nothing special without Shift or with touch", () => {
    render(<Payments />)

    press(1, { shiftKey: false })
    hoverRow(4)
    move()
    fireEvent.pointerUp(window)
    expect(selectedIndexes()).toEqual([])

    press(1, { pointerType: "touch" })
    hoverRow(4)
    move()
    fireEvent.pointerUp(window)
    expect(selectedIndexes()).toEqual([])
  })
})
