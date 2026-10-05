"use client"

import * as React from "react"
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"

const pages = [1, 2, 3, 4]

export function ButtonGroupNested() {
  const [page, setPage] = React.useState(1)

  return (
    <ButtonGroup aria-label="Pagination">
      <ButtonGroup>
        <Button
          variant="outline"
          size="icon"
          aria-label="Previous page"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          <IconArrowLeft className="rtl:-scale-x-100" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Next page"
          disabled={page === pages.length}
          onClick={() => setPage(page + 1)}
        >
          <IconArrowRight className="rtl:-scale-x-100" />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        {pages.map((value) => (
          <Button
            key={value}
            variant={value === page ? "secondary" : "outline"}
            size="icon"
            aria-current={value === page ? "page" : undefined}
            onClick={() => setPage(value)}
          >
            {value}
          </Button>
        ))}
      </ButtonGroup>
    </ButtonGroup>
  )
}
