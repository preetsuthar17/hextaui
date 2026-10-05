"use client"

import * as React from "react"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  usePagination,
} from "@/components/ui/pagination"

export function PaginationRtl() {
  const [page, setPage] = React.useState(2)
  const { items, hasPrevious, hasNext } = usePagination({ page, count: 3 })

  return (
    <div dir="rtl">
      <Pagination aria-label="التنقل بين الصفحات">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              text="السابق"
              aria-label="الصفحة السابقة"
              render={<button type="button" />}
              disabled={!hasPrevious}
              onClick={() => setPage(page - 1)}
            />
          </PaginationItem>
          {items.map((item) =>
            item.type === "page" ? (
              <PaginationItem key={item.page}>
                <PaginationLink
                  render={<button type="button" />}
                  isActive={item.page === page}
                  onClick={() => setPage(item.page)}
                >
                  {item.page.toLocaleString("ar-EG")}
                </PaginationLink>
              </PaginationItem>
            ) : null
          )}
          <PaginationItem>
            <PaginationNext
              text="التالي"
              aria-label="الصفحة التالية"
              render={<button type="button" />}
              disabled={!hasNext}
              onClick={() => setPage(page + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
