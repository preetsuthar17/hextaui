"use client"

import * as React from "react"

import { Pagination } from "@/components/ui/pagination"

export function PaginationCompact() {
  const [page, setPage] = React.useState(4)

  return (
    <div className="w-full max-w-72 rounded-xl border p-2">
      <Pagination page={page} count={24} onPageChange={setPage} />
    </div>
  )
}
