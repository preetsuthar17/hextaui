import type { Metadata } from "next"
import Link from "next/link"

import { blocksNav, proBlocks } from "@/lib/pro/catalog"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Blocks",
  description:
    "Complete flows built from HextaUI components, ready to drop into your app. Part of HextaUI Pro.",
  path: "/blocks",
})

export default function Page() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-4 py-16">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight">Blocks</h1>
        <p className="text-sm text-muted-foreground">
          {proBlocks.length > 0
            ? `${proBlocks.length} ${proBlocks.length === 1 ? "block" : "blocks"}, with more on the way. `
            : "The first blocks are on the way. "}
          Every block is part of{" "}
          <Link
            href="/account"
            className="text-foreground underline underline-offset-4"
          >
            HextaUI Pro
          </Link>
          .
        </p>
      </header>
      {blocksNav.map((section) => (
        <section key={section.title} className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-muted-foreground">
            {section.title}
          </h2>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {section.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex rounded-lg border px-4 py-3 text-sm font-medium transition-colors duration-150 outline-none hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden motion-reduce:transition-none"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  )
}
