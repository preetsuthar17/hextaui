import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const events = Array.from({ length: 24 }, (_, index) => ({
  id: `evt_${(1024 + index).toString(16)}`,
  type: ["deploy", "rollback", "scale", "restart"][index % 4],
  minutes: index * 7 + 2,
}))

export function TableSticky() {
  return (
    <Table variant="surface" stickyHeader containerClassName="max-h-72">
      <TableHeader>
        <TableRow>
          <TableHead>Event</TableHead>
          <TableHead>Type</TableHead>
          <TableHead align="end">When</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow key={event.id}>
            <TableCell>
              <span className="font-mono text-xs">{event.id}</span>
            </TableCell>
            <TableCell>{event.type}</TableCell>
            <TableCell align="end">{event.minutes} min ago</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
