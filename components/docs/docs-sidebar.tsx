import { cn } from "cn"

import { DocsNav } from "@/components/docs/docs-nav"
import { DocsSearchTrigger } from "@/components/docs/docs-search"
import type { DocsNavSection } from "@/lib/docs"

function DocsSidebar({
  sections,
  className,
}: {
  sections: DocsNavSection[]
  className?: string
}) {
  return (
    <div
      data-slot="sidebar"
      data-side="left"
      data-variant="plain"
      className={cn(
        "group flex h-full w-(--sidebar-width) min-w-0 flex-col text-sidebar-foreground",
        className
      )}
    >
      <div
        data-slot="sidebar-header"
        data-sidebar="header"
        className="flex min-w-0 flex-col gap-2 p-2"
      >
        <DocsSearchTrigger />
      </div>
      <div
        data-slot="sidebar-content"
        data-sidebar="content"
        className="no-scrollbar flex min-h-0 flex-1 flex-col gap-2 overflow-x-hidden overflow-y-auto overscroll-contain supports-[animation-timeline:scroll()]:scroll-fade-y"
      >
        <DocsNav sections={sections} className="pb-6" />
      </div>
    </div>
  )
}

export { DocsSidebar }
