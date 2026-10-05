"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { DocsNavSection } from "@/lib/docs"

function DocsNav({
  sections,
  onNavigate,
  className,
}: {
  sections: DocsNavSection[]
  onNavigate?: () => void
  className?: string
}) {
  const pathname = usePathname()

  return (
    <nav aria-label="Docs" className={className}>
      {sections.map((section) => (
        <SidebarGroup key={section.title}>
          <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {section.items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    className="transition-none"
                    isActive={pathname === item.href}
                    render={<Link href={item.href} onNavigate={onNavigate} />}
                  >
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </nav>
  )
}

export { DocsNav }
