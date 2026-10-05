import { IconAt, IconBell, IconMessage, IconUsers } from "@tabler/icons-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const items = [
  { title: "Mentions", icon: IconAt, count: 3 },
  { title: "Comments", icon: IconMessage, count: 12 },
  { title: "Reminders", icon: IconBell, count: 0 },
  { title: "Followers", icon: IconUsers, count: 128 },
]

export function SidebarRight() {
  return (
    <SidebarProvider className="h-112 min-h-0">
      <SidebarInset>
        <header className="flex h-14 items-center justify-end px-4">
          <SidebarTrigger className="-me-1" />
        </header>
      </SidebarInset>
      <Sidebar side="right">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Activity</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                    {item.count > 0 && (
                      <SidebarMenuBadge>{item.count}</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  )
}
