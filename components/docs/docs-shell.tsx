import * as React from "react"

import { DocsMobileHeader } from "@/components/docs/docs-mobile-header"
import { DocsSidebar } from "@/components/docs/docs-sidebar"
import type { DocsNavSection } from "@/lib/docs"

function DocsShell({
  sections,
  children,
}: {
  sections: DocsNavSection[]
  children: React.ReactNode
}) {
  return (
    <div
      data-slot="sidebar-wrapper"
      className="group/sidebar-wrapper mx-auto flex min-h-svh w-full max-w-screen-2xl [--sidebar-top:0px] [--sidebar-width-icon:3rem] [--sidebar-width-mobile:18rem] [--sidebar-width:16rem]"
    >
      <DocsSidebar
        sections={sections}
        className="sticky top-14 hidden h-[calc(100svh-(--spacing(14)))] w-60 lg:flex"
      />
      <main
        data-slot="sidebar-inset"
        className="relative flex w-full min-w-0 flex-1 flex-col bg-background"
      >
        <DocsMobileHeader sections={sections} className="lg:hidden" />
        {children}
      </main>
    </div>
  )
}

export { DocsShell }
