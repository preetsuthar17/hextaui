import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

const series = [
  {
    name: "Visitors",
    values: [
      812, 904, 1021, 990, 1203, 1340, 1288, 1410, 1502, 1622, 1590, 1711,
    ],
  },
  {
    name: "Sign-ups",
    values: [41, 52, 66, 59, 71, 83, 80, 92, 97, 110, 104, 121],
  },
]

export function TableScroll() {
  return (
    <Table variant="surface" className="w-max min-w-full">
      <TableHeader>
        <TableRow>
          <TableHead>Metric</TableHead>
          {months.map((month) => (
            <TableHead key={month} align="end">
              {month}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {series.map((row) => (
          <TableRow key={row.name}>
            <TableHead scope="row">{row.name}</TableHead>
            {row.values.map((value, index) => (
              <TableCell key={months[index]} align="end">
                {value.toLocaleString("en-US")}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
