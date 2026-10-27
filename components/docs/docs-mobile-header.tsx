"use client"

import * as React from "react"
import { IconMenu2 } from "@tabler/icons-react"
import { cn } from "cn"

import { DocsBrand } from "@/components/docs/docs-brand"
import { DocsSearchButton } from "@/components/docs/docs-search"
import { Button } from "@/components/ui/button"
import type { DocsNavSection } from "@/lib/docs"

const loadMenu = () => import("@/components/docs/docs-mobile-menu")

const DocsMobileMenu = React.lazy(() =>
  loadMenu().then((module) => ({ default: module.DocsMobileMenu }))
)

function prefetchMenu() {
  loadMenu().catch(() => {})
}

function DocsMobileHeader({
  sections,
  className,
}: {
  sections: DocsNavSection[]
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-14 items-center gap-1 bg-background/90 px-2 backdrop-blur-md",
        className
      )}
    >
      <Button
        ref={triggerRef}
        variant="ghost"
        size="icon"
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        onPointerDown={prefetchMenu}
        onFocus={prefetchMenu}
        onClick={() => {
          setMounted(true)
          setOpen(true)
        }}
      >
        <IconMenu2 />
      </Button>
      {mounted ? (
        <React.Suspense fallback={null}>
          <DocsMobileMenu
            sections={sections}
            open={open}
            onOpenChange={setOpen}
            finalFocus={triggerRef}
          />
        </React.Suspense>
      ) : null}
      <DocsBrand />
      <DocsSearchButton className="ms-auto" />
    </header>
  )
}

export { DocsMobileHeader }
