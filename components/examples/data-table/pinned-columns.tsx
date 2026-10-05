"use client"

import { Badge, BadgeDot } from "@/components/ui/badge"
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
  DataTableViewOptions,
  useDataTable,
} from "@/components/ui/data-table"

type Payment = {
  id: string
  email: string
  status: "paid" | "pending" | "failed"
  amount: number
  method: string
  country: string
  date: string
}

const statuses = ["paid", "pending", "failed"] as const
const methods = ["Card", "PayPal", "Bank", "Apple Pay"]
const countries = ["United States", "Germany", "India", "Japan", "Brazil"]
const names = ["olivia", "jackson", "isabella", "william", "sofia", "liam"]

function makePayments(count: number): Payment[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `pay_${String(index + 1).padStart(4, "0")}`,
    email: `${names[index % names.length]}.${Math.floor(index / names.length) + 1}@example.com`,
    status: statuses[(index * 7) % 3],
    amount: Math.round(((index * 7919) % 100000) / 10) / 10 + 5,
    method: methods[index % methods.length],
    country: countries[(index * 3) % countries.length],
    date: `2026-${String((index % 9) + 1).padStart(2, "0")}-${String((index % 27) + 1).padStart(2, "0")}`,
  }))
}

const payments = makePayments(12)

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

const statusVariant = {
  paid: "success",
  pending: "warning",
  failed: "destructive",
} as const

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
  helper.accessor("status", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ getValue }) => {
      const status = getValue()
      return (
        <Badge variant={statusVariant[status]}>
          <BadgeDot />
          <span className="capitalize">{status}</span>
        </Badge>
      )
    },
  }),
  helper.accessor("method", { header: "Method" }),
  helper.accessor("country", { header: "Country" }),
  helper.accessor("date", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
  }),
  helper.accessor("amount", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ getValue }) => currency.format(getValue()),
    meta: { align: "end" },
  }),
])

export function DataTablePinnedColumns() {
  const table = useDataTable({
    data: payments,
    columns,
    getRowId: (row) => row.id,
  })

  return (
    <div className="w-full max-w-md">
      <DataTable table={table}>
        <DataTableToolbar>
          <DataTableSearch placeholder="Search payments…" />
          <DataTableViewOptions />
        </DataTableToolbar>
        <DataTableContent pinStart={["select", "email", "status"]} />
        <DataTablePagination />
      </DataTable>
    </div>
  )
}
