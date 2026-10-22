import * as React from "react"

import { IconArrowRight } from "@tabler/icons-react"

import Link from "@/components/site/link"
import { InfoSection } from "@/components/site/info-page"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { comparisons } from "@/lib/compare"
import { T, t } from "@/lib/i18n/rich"

type CompareRow = { label: string; values: React.ReactNode[] }

function CompareTable({
  caption,
  rowHeader,
  columns,
  rows,
}: {
  caption: string
  rowHeader?: string
  columns: string[]
  rows: CompareRow[]
}) {
  return (
    <div className="mt-6">
      <Table wrap aria-label={t(caption)}>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/4">
              {rowHeader ? (
                t(rowHeader)
              ) : (
                <span className="sr-only">{t(caption)}</span>
              )}
            </TableHead>
            {columns.map((column) => (
              <TableHead key={column}>{t(column)}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.label}>
              <TableHead scope="row">{t(row.label)}</TableHead>
              {row.values.map((value, index) => (
                <TableCell key={columns[index]}>
                  <T>{value}</T>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

type CompareLinkItem = { href: string; title: string }

function CompareLinks({ items }: { items: CompareLinkItem[] }) {
  return (
    <ul className="mt-4 flex flex-col border-t">
      {items.map((item) => (
        <li key={item.href} className="border-b">
          <Link
            href={item.href}
            className="group/link flex items-center justify-between gap-4 rounded-sm py-4 text-base font-medium outline-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden"
          >
            <span>{t(item.title)}</span>
            <IconArrowRight
              aria-hidden="true"
              className="size-4 shrink-0 text-muted-foreground transition duration-150 ease-out-cubic group-hover/link:translate-x-0.5 group-hover/link:text-foreground motion-reduce:transition-none rtl:-scale-x-100 rtl:group-hover/link:-translate-x-0.5"
            />
          </Link>
        </li>
      ))}
    </ul>
  )
}

function CompareLinkGrid({ items }: { items: CompareLinkItem[] }) {
  return (
    <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="rounded-sm text-muted-foreground transition-colors duration-150 outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden motion-reduce:transition-none"
          >
            {t(item.title)}
          </Link>
        </li>
      ))}
    </ul>
  )
}

function MoreComparisons({ current }: { current: string }) {
  return (
    <InfoSection title="More comparisons">
      <CompareLinks
        items={[
          { href: "/compare", title: "All comparisons" },
          ...comparisons.filter((page) => page.href !== current),
        ]}
      />
    </InfoSection>
  )
}

export {
  CompareLinkGrid,
  CompareLinks,
  CompareTable,
  MoreComparisons,
  type CompareLinkItem,
  type CompareRow,
}
