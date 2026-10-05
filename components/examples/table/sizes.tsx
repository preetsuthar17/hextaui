import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const rows = [
  { region: "us-east-1", latency: "42 ms", uptime: "99.99%" },
  { region: "eu-west-2", latency: "38 ms", uptime: "99.98%" },
  { region: "ap-south-1", latency: "71 ms", uptime: "99.95%" },
]

export function TableSizes() {
  return (
    <Table variant="surface" size="sm">
      <TableHeader>
        <TableRow>
          <TableHead>Region</TableHead>
          <TableHead align="end">Latency</TableHead>
          <TableHead align="end">Uptime</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.region}>
            <TableCell>
              <span className="font-mono text-xs">{row.region}</span>
            </TableCell>
            <TableCell align="end">{row.latency}</TableCell>
            <TableCell align="end">{row.uptime}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
