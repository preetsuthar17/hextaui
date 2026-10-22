import type { Metadata } from "next"

import { JsonLd } from "@/components/site/json-ld"
import { SubscribeForm } from "@/components/site/subscribe-form"

import {
  changelog,
  changelogGroups,
  type ChangelogEntry,
} from "@/lib/changelog"
import { pageMetadata } from "@/lib/metadata"
import { pageJsonLd } from "@/lib/structured-data"

export const metadata: Metadata = pageMetadata({
  title: "Changelog",
  description:
    "Every HextaUI and HextaUI Pro release, newest first: new components and blocks, improvements and what was removed.",
  path: "/changelog",
})

const dateFormat = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeZone: "UTC",
})

function Entry({ entry }: { entry: ChangelogEntry }) {
  return (
    <article
      id={entry.date}
      className="grid scroll-mt-24 gap-x-16 gap-y-3 border-t py-12 first:border-t-0 first:pt-0 sm:py-16 md:grid-cols-[12rem_1fr]"
    >
      <div>
        <time
          dateTime={entry.date}
          className="block text-sm text-muted-foreground tabular-nums md:sticky md:top-24"
        >
          {dateFormat.format(new Date(entry.date))}
        </time>
      </div>
      <div className="flex max-w-170 min-w-0 flex-col gap-4">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-balance">
          <a
            href={`#${entry.date}`}
            className="rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-focus-ring"
          >
            {entry.title}
          </a>
        </h2>
        {entry.body.map((paragraph) => (
          <p
            key={paragraph}
            className="text-base/7 text-pretty text-muted-foreground"
          >
            {paragraph}
          </p>
        ))}
        {changelogGroups.map(({ key, heading }) => {
          const items = entry[key]
          if (!items?.length) return null
          return (
            <section key={key} className="flex flex-col gap-2 pt-2">
              <h3 className="text-sm font-medium text-foreground">{heading}</h3>
              <ul className="flex list-disc flex-col gap-2 ps-5 text-base/7 text-pretty text-muted-foreground marker:text-border">
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </article>
  )
}

export default function Page() {
  return (
    <main className="flex w-full flex-1 flex-col">
      <JsonLd
        data={pageJsonLd({
          path: "/changelog",
          name: String(metadata.title),
          description: String(metadata.description),
          breadcrumbs: [{ name: "Changelog", path: "/changelog" }],
          type: "WebPage",
        })}
      />
      <header className="mx-auto flex w-full max-w-252 flex-col items-start px-4 pt-16 pb-14 sm:pt-24 sm:pb-20">
        <p className="text-sm font-medium text-brand-strong">Releases</p>
        <h1 className="marketing-heading mt-3 text-balance">Changelog</h1>
        <p className="marketing-lede mt-4 max-w-xl text-pretty text-muted-foreground">
          What shipped in HextaUI and HextaUI Pro.
        </p>
        <div className="mt-8 w-full">
          <SubscribeForm />
        </div>
      </header>
      <div className="border-t">
        <div className="mx-auto flex w-full max-w-252 flex-col px-4 pt-12 pb-24 sm:pt-16 sm:pb-28">
          {changelog.map((entry) => (
            <Entry key={entry.title} entry={entry} />
          ))}
        </div>
      </div>
    </main>
  )
}
