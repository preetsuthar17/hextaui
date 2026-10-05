import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const releases = [
  { version: "2.4.0", date: "Oct 2, 2026", changes: 18 },
  { version: "2.3.1", date: "Sep 21, 2026", changes: 4 },
  { version: "2.3.0", date: "Sep 12, 2026", changes: 23 },
]

export function TablePlain() {
  return (
    <Table>
      <TableCaption>Recent releases.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Version</TableHead>
          <TableHead>Released</TableHead>
          <TableHead align="end">Changes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {releases.map((release) => (
          <TableRow key={release.version}>
            <TableHead scope="row">{release.version}</TableHead>
            <TableCell>{release.date}</TableCell>
            <TableCell align="end">{release.changes}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
