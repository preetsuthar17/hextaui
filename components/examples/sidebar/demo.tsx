import {
  IconBook,
  IconChartBar,
  IconChevronRight,
  IconDots,
  IconFolder,
  IconHome,
  IconInbox,
  IconLayoutDashboard,
  IconLogout,
  IconSelector,
  IconSettings,
  IconShare,
  IconTrash,
} from "@tabler/icons-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const projects = [
  { name: "Design engineering", icon: IconFolder },
  { name: "Sales & marketing", icon: IconChartBar },
  { name: "Travel", icon: IconBook },
]

export function SidebarDemo() {
  return (
    <SidebarProvider className="h-128 min-h-0">
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger render={<SidebarMenuButton size="lg" />}>
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
                    A
                  </div>
                  <div className="grid min-w-0 flex-1 leading-tight">
                    <span className="truncate font-medium">Acme Inc</span>
                    <span className="truncate text-xs text-muted-foreground">
                      Enterprise
                    </span>
                  </div>
                  <IconSelector className="ms-auto" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem>Acme Inc</DropdownMenuItem>
                  <DropdownMenuItem>Acme Corp.</DropdownMenuItem>
                  <DropdownMenuItem>Evil Corp.</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={<a href="#" />}
                    isActive
                    tooltip="Home"
                  >
                    <IconHome />
                    <span>Home</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<a href="#" />} tooltip="Inbox">
                    <IconInbox />
                    <span>Inbox</span>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>24</SidebarMenuBadge>
                </SidebarMenuItem>
                <Collapsible
                  defaultOpen
                  render={<SidebarMenuItem />}
                  className="group/collapsible"
                >
                  <CollapsibleTrigger
                    render={<SidebarMenuButton tooltip="Dashboards" />}
                  >
                    <IconLayoutDashboard />
                    <span>Dashboards</span>
                    <IconChevronRight className="ms-auto duration-200 group-data-open/collapsible:rotate-90 motion-safe:transition-transform rtl:-scale-x-100" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="#">
                          <span>Overview</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="#">
                          <span>Revenue</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<a href="#" />} tooltip="Settings">
                    <IconSettings />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {projects.map((project) => (
                  <SidebarMenuItem key={project.name}>
                    <SidebarMenuButton
                      render={<a href="#" />}
                      tooltip={project.name}
                    >
                      <project.icon />
                      <span>{project.name}</span>
                    </SidebarMenuButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={<SidebarMenuAction showOnHover />}
                      >
                        <IconDots />
                        <span className="sr-only">More</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="start">
                        <DropdownMenuItem>
                          <IconShare />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive">
                          <IconTrash />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger render={<SidebarMenuButton size="lg" />}>
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                    OM
                  </div>
                  <div className="grid min-w-0 flex-1 leading-tight">
                    <span className="truncate font-medium">Olivia Martin</span>
                    <span className="truncate text-xs text-muted-foreground">
                      olivia@acme.com
                    </span>
                  </div>
                  <IconSelector className="ms-auto" />
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="start" className="w-56">
                  <DropdownMenuItem>
                    <IconSettings />
                    Account
                  </DropdownMenuItem>
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
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ms-1" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Platform</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Home</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted" />
            <div className="aspect-video rounded-xl bg-muted" />
            <div className="aspect-video rounded-xl bg-muted" />
          </div>
          <div className="min-h-32 flex-1 rounded-xl bg-muted" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
