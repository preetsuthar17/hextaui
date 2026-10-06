"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "cn"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { DocsNavSection } from "@/lib/docs"

const buttonSelector = "[data-sidebar=menu-button]"

function useSharedHighlight(pathname: string) {
  const navRef = React.useRef<HTMLElement>(null)
  const highlightRef = React.useRef<HTMLSpanElement>(null)
  const hovered = React.useRef<HTMLElement | null>(null)
  const placed = React.useRef(false)

  const place = React.useCallback(() => {
    const nav = navRef.current
    const highlight = highlightRef.current
    if (!nav || !highlight) return
    const target =
      hovered.current ??
      nav.querySelector<HTMLElement>(`${buttonSelector}[data-active]`)
    if (!target) {
      highlight.style.opacity = "0"
      placed.current = false
      return
    }
    const box = target.getBoundingClientRect()
    const frame = nav.getBoundingClientRect()
    const instant = !placed.current
    highlight.toggleAttribute("data-instant", instant)
    highlight.style.transform = `translate(${box.left - frame.left}px, ${box.top - frame.top}px)`
    highlight.style.width = `${box.width}px`
    highlight.style.height = `${box.height}px`
    highlight.style.opacity = "1"
    placed.current = true
    if (instant) {
      requestAnimationFrame(() => highlight.removeAttribute("data-instant"))
    }
  }, [])

  React.useLayoutEffect(() => {
    hovered.current = null
    place()
  }, [pathname, place])

  React.useEffect(() => {
    const nav = navRef.current
    if (!nav || typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(() => {
      placed.current = false
      place()
    })
    observer.observe(nav)
    return () => observer.disconnect()
  }, [place])

  const follow = (event: React.SyntheticEvent) => {
    const button = (event.target as HTMLElement).closest<HTMLElement>(
      buttonSelector
    )
    if (!button || button === hovered.current) return
    hovered.current = button
    place()
  }

  const release = () => {
    if (!hovered.current) return
    hovered.current = null
    place()
  }

  return {
    navRef,
    highlightRef,
    handlers: {
      onPointerOver: follow,
      onPointerLeave: release,
      onFocus: (event: React.FocusEvent) => {
        if ((event.target as HTMLElement).matches(":focus-visible")) {
          follow(event)
        }
      },
      onBlur: (event: React.FocusEvent) => {
        if (!navRef.current?.contains(event.relatedTarget as Node)) release()
      },
    },
  }
}

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
  const { navRef, highlightRef, handlers } = useSharedHighlight(pathname)

  return (
    <nav
      ref={navRef}
      aria-label="Docs"
      className={cn(
        "relative isolate [&_[data-sidebar=menu-button]]:bg-transparent! [&_[data-sidebar=menu-button][data-active]]:font-medium",
        className
      )}
      {...handlers}
    >
      <span
        ref={highlightRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 -z-10 rounded-md bg-sidebar-accent opacity-0 transition-all duration-200 ease-out-quint data-instant:transition-none motion-reduce:transition-none forced-colors:hidden"
      />
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
