"use client"

import * as React from "react"

import { Pagination } from "@/components/ui/pagination"

export function PaginationLinks() {
  const [page, setPage] = React.useState(3)

  return (
    <Pagination
      page={page}
      count={12}
      getPageHref={(target) => `#page-${target}`}
      onPageChange={setPage}
    />
  )
}
