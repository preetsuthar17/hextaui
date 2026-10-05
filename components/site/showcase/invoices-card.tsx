"use client"

import * as React from "react"

import { Badge, BadgeDot } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Pagination } from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const statuses = ["Paid", "Pending", "Paid", "Overdue", "Paid"] as const
const clients = ["Northwind", "Globex", "Initech", "Umbrella", "Hooli", "Acme"]

const invoices = Array.from({ length: 20 }, (_, index) => ({
  id: `INV-${String(418 + index).padStart(4, "0")}`,
  client: clients[index % clients.length],
  status: statuses[index % statuses.length],
  amount: 240 + ((index * 379) % 2400),
}))

const tones = {
  Paid: "success",
  Pending: "info",
  Overdue: "destructive",
} as const

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

const perPage = 4

function InvoicesCard() {
  const [page, setPage] = React.useState(1)
  const rows = invoices.slice((page - 1) * perPage, page * perPage)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoices</CardTitle>
        <CardDescription>{invoices.length} this quarter</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead align="end">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <span className="flex flex-col">
                      <span className="font-medium">{invoice.client}</span>
                      <span className="text-xs text-muted-foreground">
                        {invoice.id}
                      </span>
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={tones[invoice.status]}>
                      <BadgeDot />
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell align="end">
                    {currency.format(invoice.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            page={page}
            count={Math.ceil(invoices.length / perPage)}
            onPageChange={setPage}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export { InvoicesCard }
