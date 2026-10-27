import type { Metadata } from "next"

import { DocsParagraph } from "@/components/docs/docs-content"
import { factLinkClassName } from "@/components/site/fact-list"
import { InfoSection } from "@/components/site/info-page"
import { JsonLd } from "@/components/site/json-ld"
import Link from "@/components/site/link"
import { ThemeEditor } from "@/components/tools/theme-editor/theme-editor"
import { pageMetadata } from "@/lib/metadata"
import { getProBlock } from "@/lib/pro/catalog"
import { faqPageJsonLd, pageJsonLd } from "@/lib/structured-data"
import {
  themeEditorDescription,
  themeEditorFaq,
  themeEditorLead,
  themeEditorSteps,
  themeEditorTitle,
} from "@/lib/theme-editor/content"

const path = "/tools/theme-editor"

export const metadata: Metadata = pageMetadata({
  title: themeEditorTitle,
  description: themeEditorDescription,
  path,
})

const previewBlockNames = ["settings", "commerce-dashboard", "chat-thread", "checkout"]

function previewBlocks() {
  return previewBlockNames.flatMap((name) => {
    const block = getProBlock(name)
    return block && !block.free
      ? [{ name: block.name, title: block.title, category: block.category }]
      : []
  })
}

export default function Page() {
  return (
    <main className="flex flex-1 flex-col">
      <JsonLd
        data={pageJsonLd({
          path,
          name: themeEditorTitle,
          description: themeEditorDescription,
          breadcrumbs: [
            { name: "Tools", path: "/tools" },
            { name: "Theme editor", path },
          ],
          extra: [faqPageJsonLd(path, themeEditorFaq)],
        })}
      />
      <header className="frame-width flex flex-col items-start pt-10 pb-6 sm:px-8 sm:pt-14">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <Link href="/tools" className="hover:text-foreground">
            Tools
          </Link>
        </nav>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          {themeEditorTitle}
        </h1>
        <p className="mt-2 max-w-2xl text-base/7 text-pretty text-muted-foreground">
          {themeEditorLead}
        </p>
      </header>
      <section
        aria-label="Theme editor"
        className="frame-width pb-16 sm:px-8"
      >
        <ThemeEditor blocks={previewBlocks()} />
      </section>
      <div className="flex flex-col pb-8">
        <InfoSection title="How it works">
          <ol className="flex flex-col divide-y border-y">
            {themeEditorSteps.map((step, index) => (
              <li key={step.title} className="flex gap-4 py-5">
                <span className="w-5 shrink-0 pt-0.5 text-sm text-muted-foreground tabular-nums">
                  {index + 1}
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-base font-semibold tracking-tight">{step.title}</h3>
                  <p className="text-base/7 text-pretty text-muted-foreground">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </InfoSection>
        <InfoSection title="Use it with HextaUI">
          <DocsParagraph>
            Every{" "}
            <Link href="/components" className={factLinkClassName}>
              HextaUI component
            </Link>{" "}
            reads these tokens, so a theme you make here restyles the whole
            library. The same goes for{" "}
            <Link href="/blocks" className={factLinkClassName}>
              HextaUI Pro blocks
            </Link>
            : open the On Pro blocks tab to see your theme on a chat thread,
            settings pages and a commerce dashboard before you buy.
          </DocsParagraph>
        </InfoSection>
        <InfoSection title="Questions">
          <dl className="flex flex-col divide-y border-y">
            {themeEditorFaq.map((item) => (
              <div key={item.question} className="flex flex-col gap-1.5 py-5">
                <dt className="text-base font-semibold tracking-tight">{item.question}</dt>
                <dd className="text-base/7 text-pretty text-muted-foreground">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </InfoSection>
      </div>
    </main>
  )
}
