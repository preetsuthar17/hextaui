"use client"

import * as React from "react"
import { cn } from "cn"

const PortalContainer = React.createContext<
  React.RefObject<HTMLElement | null> | undefined
>(undefined)

function usePortalContainer() {
  return React.useContext(PortalContainer)
}

function PreviewFrame({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "@container relative flex h-[max(30rem,calc(100svh-11rem))] w-full max-w-[80rem] overflow-hidden rounded-xl bg-background text-sm text-foreground ring-(length:--hairline) ring-foreground/10 sm:h-[max(32rem,calc(100svh-13rem))] forced-colors:border",
        className
      )}
    >
      {children}
    </div>
  )
}

function NavItem({
  icon,
  active,
  count,
  children,
}: {
  icon?: React.ReactNode
  active?: boolean
  count?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      className="flex h-8 w-full min-w-0 items-center gap-2 rounded-md px-2 text-start text-sm text-sidebar-foreground/75 outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-3 focus-visible:ring-sidebar-ring aria-[current=page]:bg-sidebar-accent aria-[current=page]:font-medium aria-[current=page]:text-sidebar-accent-foreground forced-colors:aria-[current=page]:outline-1 forced-colors:aria-[current=page]:outline-solid [&_svg]:size-4 [&_svg]:shrink-0"
    >
      {icon}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {count !== undefined ? (
        <span className="text-xs text-sidebar-foreground/60 tabular-nums">{count}</span>
      ) : null}
    </button>
  )
}

function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-7 shrink-0 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground",
        className
      )}
    >
      <svg viewBox="0 0 16 16" className="size-4 fill-current">
        <path d="M8 1.5 14 5v6l-6 3.5L2 11V5l6-3.5Zm0 2.3L4 6.1v3.8l4 2.3 4-2.3V6.1L8 3.8Z" />
      </svg>
    </span>
  )
}

export { BrandMark, NavItem, PortalContainer, PreviewFrame, usePortalContainer }
