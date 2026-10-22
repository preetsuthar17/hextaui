import * as React from "react"
import { cn } from "cn"

import { JsonLd } from "@/components/site/json-ld"
import { t } from "@/lib/i18n/rich"
import { pageJsonLd, type Crumb } from "@/lib/structured-data"

function sectionId(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function InfoSection({
  title,
  wide = false,
  children,
}: {
  title: string
  wide?: boolean
  children: React.ReactNode
}) {
  const id = sectionId(title)

  return (
    <section aria-labelledby={id} className="border-t">
      <div
        className={cn(
          "mx-auto grid w-full max-w-5xl gap-x-12 gap-y-2 px-4 py-12 sm:py-16",
          !wide && "lg:grid-cols-3"
        )}
      >
        <h2
          id={id}
          className="scroll-mt-20 font-display text-xl font-semibold tracking-tight text-balance lg:pt-0.5"
        >
          {t(title)}
        </h2>
        <div
          className={cn(
            "flex min-w-0 flex-col",
            wide ? "[&>p]:max-w-2xl" : "lg:col-span-2 lg:*:first:mt-0"
          )}
        >
          {children}
        </div>
      </div>
    </section>
  )
}

function InfoPage({
  title,
  lead,
  eyebrow,
  nav,
  breadcrumbs,
  pageType,
  children,
}: {
  title: string
  lead: string
  eyebrow?: React.ReactNode
  nav?: React.ReactNode
  breadcrumbs?: Crumb[]
  pageType?: "WebPage" | "AboutPage" | "ContactPage"
  children: React.ReactNode
}) {
  return (
    <main className="flex flex-1 flex-col">
      {breadcrumbs?.length ? (
        <JsonLd
          data={pageJsonLd({
            path: breadcrumbs[breadcrumbs.length - 1].path,
            name: title,
            description: lead,
            breadcrumbs,
            type: pageType,
          })}
        />
      ) : null}
      <header className="mx-auto flex w-full max-w-5xl flex-col items-start px-4 pt-20 pb-16 sm:pt-28 sm:pb-20">
        {nav ? <div className="mb-8">{nav}</div> : null}
        {typeof eyebrow === "string" ? (
          <p className="text-sm font-medium text-brand-strong">{t(eyebrow)}</p>
        ) : (
          eyebrow
        )}
        <h1 className="marketing-heading mt-3 max-w-3xl text-balance">
          {t(title)}
        </h1>
        <p className="marketing-lede mt-4 max-w-2xl text-pretty text-muted-foreground">
          {t(lead)}
        </p>
      </header>
      <div className="flex flex-col pb-8">
        {React.Children.map(children, (child) =>
          child == null ||
          typeof child === "boolean" ||
          (React.isValidElement(child) && typeof child.type !== "string") ? (
            child
          ) : (
            <div className="mx-auto w-full max-w-5xl px-4">{child}</div>
          )
        )}
      </div>
    </main>
  )
}

export { InfoPage, InfoSection }
