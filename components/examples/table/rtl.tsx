import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const rows = [
  { name: "التصميم", members: 8, budget: "١٢٬٠٠٠" },
  { name: "الهندسة", members: 21, budget: "٤٨٬٥٠٠" },
]

export function TableRtl() {
  return (
    <div dir="rtl" className="w-full">
      <Table variant="surface">
        <TableHeader>
          <TableRow>
            <TableHead>الفريق</TableHead>
            <TableHead align="end">الأعضاء</TableHead>
            <TableHead align="end">الميزانية</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableHead scope="row">{row.name}</TableHead>
              <TableCell align="end">{row.members}</TableCell>
              <TableCell align="end">{row.budget}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
