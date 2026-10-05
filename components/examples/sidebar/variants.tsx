"use client"

import * as React from "react"
import {
  IconHome,
  IconInbox,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react"

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
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type Variant = "sidebar" | "floating" | "inset"

const items = [
  { title: "Home", icon: IconHome },
  { title: "Inbox", icon: IconInbox },
  { title: "Search", icon: IconSearch },
  { title: "Settings", icon: IconSettings },
]

export function SidebarVariants() {
  const [variant, setVariant] = React.useState<Variant>("inset")
  const [active, setActive] = React.useState("Home")

  return (
    <SidebarProvider className="h-112 min-h-0">
      <Sidebar variant={variant}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={active === item.title}
                      onClick={() => setActive(item.title)}
                    >
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
        <header className="flex h-14 items-center gap-2 px-4">
          <SidebarTrigger className="-ms-1" />
          <ToggleGroup
            aria-label="Variant"
            value={[variant]}
            onValueChange={(value) => {
              if (value[0]) {
                setVariant(value[0] as Variant)
              }
            }}
          >
            <ToggleGroupItem value="sidebar">Sidebar</ToggleGroupItem>
            <ToggleGroupItem value="floating">Floating</ToggleGroupItem>
            <ToggleGroupItem value="inset">Inset</ToggleGroupItem>
          </ToggleGroup>
        </header>
      </SidebarInset>
    </SidebarProvider>
  )
}
