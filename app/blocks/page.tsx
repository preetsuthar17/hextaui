import type { Metadata } from "next"
import Link from "next/link"
import { IconArrowRight, IconArrowUpRight } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Blocks",
  description:
    "Complete flows built from HextaUI components, from sign in to dashboards. Coming soon.",
}

const upcoming = [
  { name: "Sign in", description: "Email, passkeys and a one-time code." },
  { name: "Onboarding", description: "A short questionnaire that adapts." },
  { name: "Pricing", description: "Plans, seats and a live total." },
  { name: "Settings", description: "Profile, billing and preferences." },
  { name: "Dashboard", description: "Charts, tables and filters." },
  { name: "Inbox", description: "Threads, replies and attachments." },
]

export default function Page() {
  return (
    <main className="mx-auto flex w-full max-w-screen-2xl flex-1 flex-col gap-16 px-3 pt-20 pb-24 sm:pt-28">
      <section className="flex flex-col items-start gap-6">
        <Badge variant="info">Coming soon</Badge>
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-medium tracking-tighter sm:text-5xl">
            Blocks
          </h1>
          <p className="max-w-xl text-base text-pretty text-muted-foreground">
            Complete flows built from HextaUI components. Drop one into your
            app, then own and change every line.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href="/components" />}
          >
            Browse components
            <IconArrowRight data-icon="inline-end" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={
              <a
                href="https://twitter.com/preetsuthar17"
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            Get updates
            <IconArrowUpRight data-icon="inline-end" />
          </Button>
        </div>
      </section>
      <ul className="grid gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {upcoming.map((block) => (
          <li key={block.name} className="flex flex-col gap-3">
            <div
              aria-hidden="true"
              className="flex aspect-video flex-col gap-2 rounded-2xl bg-muted/60 p-6 dark:bg-muted/40"
            >
              <span className="h-3 w-1/3 rounded-full bg-foreground/10" />
              <span className="h-3 w-2/3 rounded-full bg-foreground/5" />
              <span className="mt-auto h-8 w-1/4 rounded-md bg-foreground/10" />
            </div>
            <div className="flex flex-col gap-0.5 px-0.5 text-sm">
              <span className="font-medium">{block.name}</span>
              <span className="text-muted-foreground">{block.description}</span>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
