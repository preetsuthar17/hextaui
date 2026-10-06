import type { Metadata } from "next"
import Link from "next/link"

import { docsComponents as components } from "@/lib/docs"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Components",
  description: "Every HextaUI component, with a live preview of each state.",
  path: "/components",
})

export default function Page() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-4 py-16">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight">Components</h1>
        <p className="text-sm text-muted-foreground">
          {components.length} components. Open one to see every state live.
        </p>
      </header>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {components.map((component) => (
          <li key={component.slug}>
            <Link
              href={`/docs/${component.slug}`}
              className="flex rounded-lg border px-4 py-3 text-sm font-medium transition-colors duration-150 outline-none hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden motion-reduce:transition-none"
            >
              {component.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
