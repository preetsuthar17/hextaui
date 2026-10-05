import { IconReceipt } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function EmptyInTable() {
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={3}>
              <Empty size="sm">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <IconReceipt />
                  </EmptyMedia>
                  <EmptyTitle>No invoices</EmptyTitle>
                  <EmptyDescription>
                    Invoices you send will show up here.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button size="sm">Create invoice</Button>
                </EmptyContent>
              </Empty>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
