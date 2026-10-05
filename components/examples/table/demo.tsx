import { Badge, BadgeDot } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const invoices = [
  { id: "INV-0418", client: "Northwind", status: "Paid", amount: 2400 },
  { id: "INV-0419", client: "Globex", status: "Pending", amount: 860 },
  { id: "INV-0420", client: "Initech", status: "Paid", amount: 1320.5 },
  { id: "INV-0421", client: "Umbrella", status: "Overdue", amount: 415 },
]

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

const tones = {
  Paid: "success",
  Pending: "info",
  Overdue: "destructive",
} as const

export function TableDemo() {
  const total = invoices.reduce((sum, invoice) => sum + invoice.amount, 0)

  return (
    <Table variant="surface" className="min-w-md">
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Status</TableHead>
          <TableHead align="end">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableHead scope="row">{invoice.id}</TableHead>
            <TableCell>{invoice.client}</TableCell>
            <TableCell>
              <Badge variant={tones[invoice.status as keyof typeof tones]}>
                <BadgeDot />
                {invoice.status}
              </Badge>
            </TableCell>
            <TableCell align="end">{currency.format(invoice.amount)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell align="end">{currency.format(total)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
