"use client"

import * as React from "react"
import {
  IconArchive,
  IconArrowLeft,
  IconArrowRight,
  IconChevronDown,
  IconDotsVertical,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"

const pages = [1, 2, 3]

export function ButtonGroupRtl() {
  const [page, setPage] = React.useState(1)

  return (
    <div dir="rtl" className="flex flex-col items-center gap-3">
      <ButtonGroup aria-label="إجراءات">
        <Button variant="outline">
          <IconArchive data-icon="inline-start" />
          أرشفة
        </Button>
        <Button variant="outline">إبلاغ</Button>
        <Button variant="outline" size="icon" aria-label="المزيد">
          <IconDotsVertical />
        </Button>
      </ButtonGroup>
      <ButtonGroup aria-label="نشر">
        <Button>نشر الآن</Button>
        <ButtonGroupSeparator />
        <Button size="icon" aria-label="خيارات">
          <IconChevronDown />
        </Button>
      </ButtonGroup>
      <ButtonGroup aria-label="الصفحات">
        <ButtonGroup>
          <Button
            variant="outline"
            size="icon"
            aria-label="السابق"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            <IconArrowLeft className="rtl:-scale-x-100" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="التالي"
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
    </div>
  )
}
