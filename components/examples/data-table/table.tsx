import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const invoices = [
  { id: "INV001", status: "Paid", method: "Credit card", amount: 250 },
  { id: "INV002", status: "Pending", method: "PayPal", amount: 150 },
  { id: "INV003", status: "Unpaid", method: "Bank transfer", amount: 350 },
  { id: "INV004", status: "Paid", method: "Credit card", amount: 450 },
]

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

export function TableDemo() {
  const total = invoices.reduce((sum, invoice) => sum + invoice.amount, 0)

  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead align="end">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>{invoice.id}</TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell>{invoice.method}</TableCell>
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
