"use client"

import * as React from "react"

import { Pagination } from "@/components/ui/pagination"

export function PaginationLong() {
  const [page, setPage] = React.useState(480)

  return <Pagination page={page} count={1000} onPageChange={setPage} />
}
