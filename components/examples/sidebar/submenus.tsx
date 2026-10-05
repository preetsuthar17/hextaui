import {
  IconChevronDown,
  IconChevronRight,
  IconFile,
  IconFolder,
} from "@tabler/icons-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const sections = [
  {
    title: "Getting started",
    items: ["Installation", "Project structure", "Deploying"],
  },
  {
    title: "Building your app",
    items: ["Routing", "Data fetching", "Rendering", "Caching", "Styling"],
  },
  {
    title: "API reference",
    items: ["Components", "File conventions", "Functions"],
  },
]

export function SidebarSubmenus() {
  return (
    <SidebarProvider className="h-128 min-h-0">
      <Sidebar>
        <SidebarContent>
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel render={<CollapsibleTrigger />}>
                Documentation
                <IconChevronDown className="ms-auto duration-200 group-data-open/collapsible:rotate-180 motion-safe:transition-transform" />
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {sections.map((section, index) => (
                      <Collapsible
                        key={section.title}
                        defaultOpen={index === 1}
                        render={<SidebarMenuItem />}
                        className="group/section"
                      >
                        <CollapsibleTrigger render={<SidebarMenuButton />}>
                          <IconFolder />
                          <span>{section.title}</span>
                          <IconChevronRight className="ms-auto duration-200 group-data-open/section:rotate-90 motion-safe:transition-transform rtl:-scale-x-100" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {section.items.map((item) => (
                              <SidebarMenuSubItem key={item}>
                                <SidebarMenuSubButton
                                  href="#"
                                  isActive={item === "Data fetching"}
                                >
                                  <IconFile />
                                  <span>{item}</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center px-4">
          <SidebarTrigger className="-ms-1" />
        </header>
      </SidebarInset>
    </SidebarProvider>
  )
}
