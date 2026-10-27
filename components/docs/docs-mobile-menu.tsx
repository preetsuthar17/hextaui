"use client"

import * as React from "react"

import { DocsNav } from "@/components/docs/docs-nav"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { DocsNavSection } from "@/lib/docs"

function DocsMobileMenu({
  sections,
  open,
  onOpenChange,
  finalFocus,
}: {
  sections: DocsNavSection[]
  open: boolean
  onOpenChange: (open: boolean) => void
  finalFocus: React.RefObject<HTMLButtonElement | null>
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" finalFocus={finalFocus}>
        <SheetHeader>
          <SheetTitle>HextaUI</SheetTitle>
        </SheetHeader>
        <SheetBody>
          <DocsNav
            sections={sections}
            onNavigate={() => onOpenChange(false)}
            className="-mx-4 pb-6"
          />
        </SheetBody>
      </SheetContent>
    </Sheet>
  )
}

export { DocsMobileMenu }
