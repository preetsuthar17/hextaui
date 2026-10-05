"use client"

import * as React from "react"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const pages = [1, 2, 3]

export function PaginationComposable() {
  const [page, setPage] = React.useState(2)

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            render={<button type="button" />}
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          />
        </PaginationItem>
        {pages.map((item) => (
          <PaginationItem key={item}>
            <PaginationLink
              render={<button type="button" />}
              isActive={item === page}
              onClick={() => setPage(item)}
            >
              {item}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            render={<button type="button" />}
            disabled={page === pages.length}
            onClick={() => setPage(page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
