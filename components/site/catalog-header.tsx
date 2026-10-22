import * as React from "react"
import { cn } from "cn"

function CatalogFrame({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className="frame-width px-4 sm:px-8">
      <div className={cn("mx-auto w-full max-w-252", className)}>
        {children}
      </div>
    </div>
  )
}

function CatalogHeader({
  breadcrumbs,
  eyebrow,
  title,
  lede,
  action,
  children,
}: {
  breadcrumbs?: React.ReactNode
  eyebrow?: React.ReactNode
  title: React.ReactNode
  lede?: React.ReactNode
  action?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <CatalogFrame className="pt-16 pb-12 sm:pt-24 sm:pb-16">
      {breadcrumbs ? <div className="mb-6">{breadcrumbs}</div> : null}
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex max-w-2xl flex-col items-start">
          {eyebrow ? (
            <div className="text-sm font-medium text-brand-strong">{eyebrow}</div>
          ) : null}
          <h1
            className={cn(
              "marketing-heading text-balance",
              eyebrow ? "mt-3" : null
            )}
          >
            {title}
          </h1>
          {lede ? (
            <div className="marketing-lede mt-4 flex max-w-xl flex-col gap-3 text-pretty text-muted-foreground">
              {lede}
            </div>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>
      {children}
    </CatalogFrame>
  )
}

function CatalogBody({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className="border-t">
      <CatalogFrame className={cn("py-12 sm:py-16", className)}>
        {children}
      </CatalogFrame>
    </div>
  )
}

export { CatalogBody, CatalogFrame, CatalogHeader }
