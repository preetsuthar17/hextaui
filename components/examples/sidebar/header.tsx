import { IconHome, IconInbox, IconSettings } from "@tabler/icons-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const items = [
  { title: "Home", icon: IconHome },
  { title: "Inbox", icon: IconInbox },
  { title: "Settings", icon: IconSettings },
]

export function SidebarHeaderLayout() {
  return (
    <SidebarProvider className="h-112 min-h-0 flex-col [--sidebar-top:3.5rem]">
      <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
        <SidebarTrigger className="-ms-1" />
        <span className="text-sm font-medium">Acme</span>
      </header>
      <div className="flex min-h-0 flex-1">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton>
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <p className="px-2 text-xs text-muted-foreground">v2.4.0</p>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="min-h-32 flex-1 rounded-xl bg-muted" />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
