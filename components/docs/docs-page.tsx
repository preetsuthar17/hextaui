import * as React from "react"
import { cn } from "cn"

import { DocsPageActions } from "@/components/docs/docs-page-actions"
import { DocsPageNav } from "@/components/docs/docs-page-nav"
import { DocsPager } from "@/components/docs/docs-pager"
import { DocsToc } from "@/components/docs/docs-toc"
import type { DocsNavItem, DocsTocItem } from "@/lib/docs"

function DocsPage({
  href,
  title,
  description,
  markdownHref,
  registryHref,
  toc,
  navItems,
  className,
  children,
}: {
  href: string
  title: string
  description?: React.ReactNode
  markdownHref?: string
  registryHref?: string
  toc?: DocsTocItem[]
  navItems?: DocsNavItem[]
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div
      data-docs-page=""
      className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_13rem] xl:gap-10"
    >
      <article
        className={cn(
          "mx-auto flex w-full max-w-2xl min-w-0 flex-col px-4 pt-8 pb-16 sm:px-6 lg:pt-14",
          className
        )}
      >
        <header className="flex flex-col gap-2">
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
            <h1 className="min-w-0 text-3xl font-semibold tracking-tight text-balance wrap-break-word">
              {title}
            </h1>
            <div className="mt-0.5 flex shrink-0 items-center gap-2">
              {markdownHref ? (
                <DocsPageActions
                  markdownHref={markdownHref}
                  registryHref={registryHref}
                />
              ) : null}
              <DocsPageNav
                href={href}
                items={navItems}
                className="max-sm:hidden"
              />
            </div>
          </div>
          {description ? (
            <p className="text-base/6 text-pretty text-muted-foreground">
              {description}
            </p>
          ) : null}
        </header>
        <div data-docs-content="" className="flex flex-col">
          {children}
        </div>
        <DocsPager href={href} items={navItems} className="mt-16" />
      </article>
      <div className="hidden xl:block">
        <DocsToc items={toc} className="sticky top-14 pe-4 pt-10 pb-14" />
      </div>
    </div>
  )
}

export { DocsPage }
