import * as React from "react"

import { DocsMobileHeader } from "@/components/docs/docs-mobile-header"
import { DocsSidebar } from "@/components/docs/docs-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import type { DocsNavSection } from "@/lib/docs"

function DocsShell({
  sections,
  children,
}: {
  sections: DocsNavSection[]
  children: React.ReactNode
}) {
  return (
    <SidebarProvider
      keyboardShortcut={null}
      className="mx-auto max-w-screen-2xl"
    >
      <DocsSidebar
        sections={sections}
        className="sticky top-14 hidden h-[calc(100svh-(--spacing(14)))] w-60 lg:flex"
      />
      <SidebarInset>
        <DocsMobileHeader sections={sections} className="lg:hidden" />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

export { DocsShell }
