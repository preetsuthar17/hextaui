"use client"

import * as React from "react"
import {
  IconHome,
  IconLogout,
  IconPackage,
  IconReceipt,
  IconSelector,
  IconSettings,
  IconUserCircle,
} from "@tabler/icons-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarCard,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuCollapsible,
  SidebarMenuCollapsibleContent,
  SidebarMenuCollapsibleTrigger,
  SidebarMenuFlyout,
  SidebarMenuFlyoutItem,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const sections = [
  { id: "home", label: "Home", icon: IconHome, children: [] as string[] },
  { id: "orders", label: "Orders", icon: IconReceipt, count: 12, children: ["Drafts", "Abandoned checkouts"] },
  { id: "products", label: "Products", icon: IconPackage, children: ["Collections", "Inventory", "Gift cards"] },
]

export function SidebarAppShell() {
  const [active, setActive] = React.useState("Inventory")
  const [showCard, setShowCard] = React.useState(true)

  return (
    <SidebarProvider className="h-160 min-h-0">
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger render={<SidebarMenuButton size="lg" tooltip="Acme Store" />}>
                  <Avatar shape="square">
                    <AvatarFallback>AS</AvatarFallback>
                  </Avatar>
                  <span className="flex min-w-0 flex-1 flex-col text-start">
                    <span className="truncate font-medium">Acme Store</span>
                    <span className="truncate text-xs text-muted-foreground">acme.com</span>
                  </span>
                  <IconSelector className="text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                  <DropdownMenuItem>Acme Store</DropdownMenuItem>
                  <DropdownMenuItem>Acme Outlet</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Add store</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {sections.map((section) => {
                  const button = (
                    <SidebarMenuButton
                      isActive={active === section.label}
                      tooltip={section.children.length ? undefined : section.label}
                      onClick={() => setActive(section.label)}
                    >
                      <section.icon />
                      <span>{section.label}</span>
                    </SidebarMenuButton>
                  )
                  const badge = section.count ? (
                    <SidebarMenuBadge count={section.count} label="unfulfilled" />
                  ) : null
                  if (!section.children.length) {
                    return (
                      <SidebarMenuItem key={section.id}>
                        {button}
                        {badge}
                      </SidebarMenuItem>
                    )
                  }
                  return (
                    <SidebarMenuCollapsible key={section.id} defaultOpen={section.id === "products"}>
                      <SidebarMenuFlyout
                        label={section.label}
                        content={section.children.map((child) => (
                          <SidebarMenuFlyoutItem
                            key={child}
                            isActive={active === child}
                            onClick={() => setActive(child)}
                          >
                            {child}
                          </SidebarMenuFlyoutItem>
                        ))}
                      >
                        {button}
                      </SidebarMenuFlyout>
                      {badge}
                      <SidebarMenuCollapsibleTrigger aria-label={`${section.label} pages`} />
                      <SidebarMenuCollapsibleContent>
                        <SidebarMenuSub>
                          {section.children.map((child) => (
                            <SidebarMenuSubItem key={child}>
                              <SidebarMenuSubButton
                                render={<button type="button" />}
                                isActive={active === child}
                                onClick={() => setActive(child)}
                              >
                                <span>{child}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </SidebarMenuCollapsibleContent>
                    </SidebarMenuCollapsible>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          {showCard ? (
            <SidebarCard aria-label="Set up your store" onDismiss={() => setShowCard(false)} dismissLabel="Dismiss setup">
              <div className="flex flex-col gap-1 p-1.5">
                <p className="pe-6 font-medium">Set up your store</p>
                <p className="text-xs text-muted-foreground">3 of 5 done · Next: add a payment provider</p>
                <div className="pt-1">
                  <Button variant="outline" size="xs">
                    Continue
                  </Button>
                </div>
              </div>
            </SidebarCard>
          ) : null}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Settings">
                <IconSettings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger render={<SidebarMenuButton size="lg" tooltip="Maya Chen" />}>
                  <Avatar>
                    <AvatarFallback>MC</AvatarFallback>
                  </Avatar>
                  <span className="flex min-w-0 flex-1 flex-col text-start">
                    <span className="truncate font-medium">Maya Chen</span>
                    <span className="truncate text-xs text-muted-foreground">maya@acme.com</span>
                  </span>
                  <IconSelector className="text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="end" className="w-56">
                  <DropdownMenuItem>
                    <IconUserCircle />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <IconLogout />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 px-4">
          <SidebarTrigger />
          <span className="text-sm font-medium">{active}</span>
        </header>
      </SidebarInset>
    </SidebarProvider>
  )
}
