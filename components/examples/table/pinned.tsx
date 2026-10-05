import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const quarters = [
  "Q1 2025",
  "Q2 2025",
  "Q3 2025",
  "Q4 2025",
  "Q1 2026",
  "Q2 2026",
  "Q3 2026",
]

const teams = [
  { name: "Design systems", values: [12, 14, 15, 18, 21, 22, 24] },
  { name: "Platform", values: [31, 30, 33, 35, 34, 38, 40] },
  { name: "Growth", values: [8, 9, 11, 10, 12, 15, 16] },
]

export function TablePinned() {
  return (
    <Table variant="surface" className="w-max min-w-full">
      <TableHeader>
        <TableRow>
          <TableHead pinned="start" pinnedEdge>
            Team
          </TableHead>
          {quarters.map((quarter) => (
            <TableHead key={quarter} align="end">
              {quarter}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {teams.map((team) => (
          <TableRow key={team.name}>
            <TableHead scope="row" pinned="start" pinnedEdge>
              {team.name}
            </TableHead>
            {team.values.map((value, index) => (
              <TableCell key={quarters[index]} align="end">
                {value}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
