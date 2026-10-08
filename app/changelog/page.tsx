import type { Metadata } from "next"

import { changelog, upcoming, type ChangelogEntry } from "@/lib/changelog"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Changelog",
  description: "What shipped in HextaUI and HextaUI Pro, and what ships next.",
  path: "/changelog",
})

const dateFormat = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeZone: "UTC",
})

function Entry({ entry }: { entry: ChangelogEntry }) {
  return (
    <article
      id={entry.label ? undefined : entry.date}
      className="grid scroll-mt-20 gap-x-10 gap-y-3 border-t py-12 first:border-t-0 first:pt-0 md:grid-cols-[12rem_1fr]"
    >
      <div>
        <time
          dateTime={entry.date}
          className="block text-sm text-muted-foreground tabular-nums md:sticky md:top-20"
        >
          {entry.label ?? dateFormat.format(new Date(entry.date))}
        </time>
      </div>
      <div className="flex max-w-2xl flex-col gap-4">
        {entry.label ? (
          <p className="text-sm text-muted-foreground">Coming next</p>
        ) : null}
        <h2 className="text-2xl font-semibold tracking-tight text-balance">
          {entry.title}
        </h2>
        {entry.body.map((paragraph) => (
          <p key={paragraph} className="text-base/7 text-pretty">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  )
}

export default function Page() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pt-16 pb-24 sm:pt-24">
      <header className="grid gap-x-10 pb-16 md:grid-cols-[12rem_1fr]">
        <div className="flex max-w-2xl flex-col gap-3 md:col-start-2">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Changelog
          </h1>
          <p className="text-base/7 text-pretty text-muted-foreground">
            What shipped in HextaUI and HextaUI Pro, and what ships next.
          </p>
        </div>
      </header>
      <div className="flex flex-col">
        {[...upcoming, ...changelog].map((entry) => (
          <Entry key={entry.title} entry={entry} />
        ))}
      </div>
    </main>
  )
}
