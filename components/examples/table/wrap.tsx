import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const terms = [
  {
    term: "Concentric radius",
    meaning:
      "An inner corner radius equal to the outer radius minus the gap between the two edges, so nested shapes look like they belong together.",
  },
  {
    term: "Hairline",
    meaning:
      "The thinnest line the screen can draw: 1px on standard displays and two thirds of a pixel on high-density ones.",
  },
]

export function TableWrap() {
  return (
    <Table variant="surface" wrap className="table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/3">Term</TableHead>
          <TableHead>Meaning</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {terms.map((row) => (
          <TableRow key={row.term}>
            <TableHead scope="row">{row.term}</TableHead>
            <TableCell>
              <span className="text-muted-foreground">{row.meaning}</span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
