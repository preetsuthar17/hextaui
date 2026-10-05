"use client"

import * as React from "react"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { usePagination } from "@/hooks/use-pagination"

export function UsePaginationDemo() {
  const [page, setPage] = React.useState(6)
  const [siblings, setSiblings] = React.useState(1)
  const pagination = usePagination({ page, count: 20, siblings })

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <nav aria-label="Pagination" className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Previous page"
          disabled={!pagination.hasPrevious}
          onClick={() => setPage(pagination.page - 1)}
        >
          <IconChevronLeft className="rtl:rotate-180" />
        </Button>
        {pagination.items.map((item) =>
          item.type === "ellipsis" ? (
            <span
              key={item.position}
              aria-hidden="true"
              className="w-8 text-center text-sm text-muted-foreground"
            >
              …
            </span>
          ) : (
            <Button
              key={item.page}
              variant={item.page === pagination.page ? "secondary" : "ghost"}
              size="icon-sm"
              aria-current={item.page === pagination.page ? "page" : undefined}
              onClick={() => setPage(item.page)}
            >
              {item.page}
            </Button>
          )
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Next page"
          disabled={!pagination.hasNext}
          onClick={() => setPage(pagination.page + 1)}
        >
          <IconChevronRight className="rtl:rotate-180" />
        </Button>
      </nav>
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        siblings
        <ToggleGroup
          size="sm"
          variant="outline"
          value={[String(siblings)]}
          onValueChange={(value) => {
            if (value[0]) {
              setSiblings(Number(value[0]))
            }
          }}
        >
          <ToggleGroupItem value="0">0</ToggleGroupItem>
          <ToggleGroupItem value="1">1</ToggleGroupItem>
          <ToggleGroupItem value="2">2</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <code className="font-mono text-xs text-muted-foreground">
        {pagination.items.length} items
      </code>
    </div>
  )
}
