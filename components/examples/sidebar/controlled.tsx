"use client"

import * as React from "react"
import { IconHome, IconInbox, IconSettings } from "@tabler/icons-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"

const items = [
  { title: "Home", icon: IconHome },
  { title: "Inbox", icon: IconInbox },
  { title: "Settings", icon: IconSettings },
]

export function SidebarControlled() {
  const [open, setOpen] = React.useState(true)

  return (
    <SidebarProvider
      open={open}
      onOpenChange={setOpen}
      className="h-96 min-h-0"
    >
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton tooltip={item.title}>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex items-center gap-3 p-4">
          <Switch
            id="sidebar-controlled-open"
            checked={open}
            onCheckedChange={setOpen}
          />
          <label htmlFor="sidebar-controlled-open" className="text-sm">
            Sidebar {open ? "expanded" : "collapsed"}
          </label>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
