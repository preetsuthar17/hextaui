import { IconHome, IconInbox, IconSettings } from "@tabler/icons-react"

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
  { title: "الرئيسية", icon: IconHome },
  { title: "البريد الوارد", icon: IconInbox, badge: "٢٤" },
  { title: "الإعدادات", icon: IconSettings },
]

export function SidebarRtl() {
  return (
    <SidebarProvider dir="rtl" className="h-96 min-h-0">
      <Sidebar side="right" collapsible="icon" dir="rtl">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>التطبيق</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item, index) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={index === 0}
                      tooltip={item.title}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                    {item.badge && (
                      <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center px-4">
          <SidebarTrigger className="-ms-1" />
        </header>
      </SidebarInset>
    </SidebarProvider>
  )
}
