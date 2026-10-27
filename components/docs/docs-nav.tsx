"use client"

import * as React from "react"
import Link from "@/components/site/link"
import { cn } from "cn"

import { useSharedHighlight } from "@/components/site/use-shared-highlight"
import type { DocsNavSection } from "@/lib/docs"
import { useSitePathname } from "@/lib/i18n/client"

const buttonSelector = "[data-sidebar=menu-button]"

const menuButtonClassName =
  "peer/menu-button group/menu-button flex h-8 w-full min-w-0 items-center gap-2 overflow-hidden rounded-md p-2 text-start text-sm inset-ring-(length:--hairline) inset-ring-transparent outline-none hover:text-sidebar-accent-foreground focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:inset-ring-sidebar-ring focus-visible:outline-hidden active:text-sidebar-accent-foreground pointer-coarse:h-10 forced-colors:border data-active:text-sidebar-accent-foreground forced-colors:data-active:outline-2 forced-colors:data-active:-outline-offset-2 forced-colors:data-active:outline-solid [&>span:last-child]:truncate"

function DocsNav({
  sections,
  onNavigate,
  className,
}: {
  sections: DocsNavSection[]
  onNavigate?: () => void
  className?: string
}) {
  const pathname = useSitePathname()
  const { navRef, highlightRef, handlers } = useSharedHighlight<HTMLElement>(
    pathname,
    buttonSelector,
    `${buttonSelector}[data-active]`
  )

  return (
    <nav
      ref={navRef}
      aria-label="Docs"
      className={cn(
        "relative isolate [&_[data-sidebar=menu-button]]:bg-transparent! [&_[data-sidebar=menu-button]]:transition-none [&_[data-sidebar=menu-button][data-active]]:font-medium",
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
        <div
          key={section.title}
          data-slot="sidebar-group"
          data-sidebar="group"
          className="relative flex w-full min-w-0 flex-col p-2"
        >
          <div
            data-slot="sidebar-group-label"
            data-sidebar="group-label"
            className="flex h-8 min-w-0 shrink-0 items-center gap-2 overflow-hidden rounded-md px-2 text-start text-xs font-medium whitespace-nowrap text-sidebar-foreground/70"
          >
            {section.title}
          </div>
          <div
            data-slot="sidebar-group-content"
            data-sidebar="group-content"
            className="w-full min-w-0 text-sm"
          >
            <ul
              data-slot="sidebar-menu"
              data-sidebar="menu"
              data-gap="default"
              className="flex w-full min-w-0 flex-col gap-1 group-data-[variant=plain]:gap-0"
            >
              {section.items.map((item) => {
                const active = pathname === item.href
                return (
                  <li
                    key={item.href}
                    data-slot="sidebar-menu-item"
                    data-sidebar="menu-item"
                    className="group/menu-item relative min-w-0"
                  >
                    <Link
                      href={item.href}
                      onNavigate={onNavigate}
                      aria-current={active ? "page" : undefined}
                      data-slot="sidebar-menu-button"
                      data-sidebar="menu-button"
                      data-size="default"
                      data-active={active ? "" : undefined}
                      className={menuButtonClassName}
                    >
                      <span>{item.title}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      ))}
    </nav>
  )
}

export { DocsNav }
