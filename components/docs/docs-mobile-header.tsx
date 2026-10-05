"use client"

import * as React from "react"
import { IconMenu2 } from "@tabler/icons-react"
import { cn } from "cn"

import { DocsBrand } from "@/components/docs/docs-brand"
import { DocsNav } from "@/components/docs/docs-nav"
import { DocsSearchButton } from "@/components/docs/docs-search"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { DocsNavSection } from "@/lib/docs"

function DocsMobileHeader({
  sections,
  className,
}: {
  sections: DocsNavSection[]
  className?: string
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-14 items-center gap-1 bg-background/90 px-2 backdrop-blur-md",
        className
      )}
    >
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={<Button variant="ghost" size="icon" aria-label="Open menu" />}
        >
          <IconMenu2 />
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>HextaUI</SheetTitle>
          </SheetHeader>
          <SheetBody>
            <DocsNav
              sections={sections}
              onNavigate={() => setOpen(false)}
              className="-mx-4 pb-6"
            />
          </SheetBody>
        </SheetContent>
      </Sheet>
      <DocsBrand />
      <DocsSearchButton className="ms-auto" />
    </header>
  )
}

export { DocsMobileHeader }
