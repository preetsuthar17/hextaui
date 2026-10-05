"use client"

import * as React from "react"

import { usePagination } from "@/hooks/use-pagination"

export function UsePaginationDots() {
  const [page, setPage] = React.useState(1)
  const { items } = usePagination({
    page,
    count: 12,
    siblings: 1,
    boundaries: 0,
  })

  return (
    <nav aria-label="Slides" className="flex items-center gap-1">
      {items.map((item) =>
        item.type === "ellipsis" ? (
          <span
            key={item.position}
            aria-hidden="true"
            className="size-1 rounded-full bg-border"
          />
        ) : (
          <button
            key={item.page}
            type="button"
            aria-label={`Slide ${item.page}`}
            aria-current={item.page === page ? "true" : undefined}
            onClick={() => setPage(item.page)}
            className="flex size-6 items-center justify-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden"
          >
            <span className="h-2 w-2 rounded-full bg-muted-foreground/30 transition-all duration-300 ease-out-quint in-aria-[current=true]:w-5 in-aria-[current=true]:bg-foreground motion-reduce:transition-none" />
          </button>
        )
      )}
    </nav>
  )
}
