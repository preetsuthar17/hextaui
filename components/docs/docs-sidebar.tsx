import { DocsNav } from "@/components/docs/docs-nav"
import { DocsSearchTrigger } from "@/components/docs/docs-search"
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar"
import type { DocsNavSection } from "@/lib/docs"

function DocsSidebar({
  sections,
  className,
}: {
  sections: DocsNavSection[]
  className?: string
}) {
  return (
    <Sidebar collapsible="none" variant="plain" className={className}>
      <SidebarHeader>
        <DocsSearchTrigger />
      </SidebarHeader>
      <SidebarContent>
        <DocsNav sections={sections} className="pb-6" />
      </SidebarContent>
    </Sidebar>
  )
}

export { DocsSidebar }
