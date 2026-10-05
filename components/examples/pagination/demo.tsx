"use client"

import * as React from "react"

import { Pagination } from "@/components/ui/pagination"

const perPage = 10
const total = 248

export function PaginationDemo() {
  const [page, setPage] = React.useState(1)
  const first = (page - 1) * perPage + 1
  const last = Math.min(page * perPage, total)

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Pagination
        page={page}
        count={Math.ceil(total / perPage)}
        onPageChange={setPage}
      />
      <p className="text-sm text-muted-foreground tabular-nums">
        Showing {first}–{last} of {total} results
      </p>
    </div>
  )
}
