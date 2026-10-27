import type { Metadata } from "next"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { JsonLd } from "@/components/site/json-ld"
import Link from "@/components/site/link"
import {
  Band,
  PageColumn,
  SectionHead,
} from "@/components/site/pricing-sections"
import { PageBuilderLoader } from "@/components/page-builder/page-builder-loader"
import { metadataTitle, pageMetadata } from "@/lib/metadata"
import {
  pageBuilderDescription,
  pageBuilderPath,
  pageBuilderQuestions,
  pageBuilderSteps,
  pageBuilderTitle,
} from "@/lib/page-builder/content"
import { getProSections } from "@/lib/page-builder/pro"
import { faqPageJsonLd, pageJsonLd } from "@/lib/structured-data"

export const metadata: Metadata = pageMetadata({
  title: pageBuilderTitle,
  description: pageBuilderDescription,
  path: pageBuilderPath,
  markdown: `${pageBuilderPath}.md`,
})

const linkClassName =
  "rounded-sm text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors duration-150 outline-none hover:decoration-foreground focus-visible:ring-3 focus-visible:ring-focus-ring motion-reduce:transition-none"

export default function Page() {
  return (
    <main className="flex flex-1 flex-col">
      <JsonLd
        data={pageJsonLd({
          path: pageBuilderPath,
          name: metadataTitle(metadata),
          description: pageBuilderDescription,
          breadcrumbs: [{ name: "Page builder", path: pageBuilderPath }],
          extra: [faqPageJsonLd(pageBuilderPath, pageBuilderQuestions)],
        })}
      />
      <PageColumn className="flex flex-col gap-3 pt-10 pb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
        <div className="flex max-w-2xl flex-col items-start">
          <p className="text-sm font-medium text-brand-strong">Free tool</p>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            Page builder
          </h1>
          <p className="mt-2 text-base/7 text-pretty text-muted-foreground">
            Compose a landing page from free shadcn/ui sections, edit it live
            and export clean Next.js code.
          </p>
        </div>
        <p className="text-sm text-muted-foreground sm:pb-1">
          <a href="#how-it-works" className={linkClassName}>
            How it works
          </a>
        </p>
      </PageColumn>
      <PageBuilderLoader proBlocks={getProSections()} />
      <Band id="how-it-works">
        <SectionHead
          id="how-it-works"
          eyebrow="How it works"
          title="From blank page to code in three steps"
        >
          Every section is built from free HextaUI components, so what you
          export is code you own and can change.
        </SectionHead>
        <ol className="mt-12 grid gap-(--hairline) overflow-hidden rounded-2xl border bg-border sm:mt-16 md:grid-cols-3 forced-colors:gap-px">
          {pageBuilderSteps.map((step, index) => (
            <li
              key={step.title}
              className="flex flex-col gap-2 bg-background p-6 sm:p-8"
            >
              <span className="text-sm text-muted-foreground tabular-nums">
                0{index + 1}
              </span>
              <h3 className="font-medium">{step.title}</h3>
              <p className="text-sm/6 text-pretty text-muted-foreground">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
        <p className="mt-8 max-w-2xl text-sm/6 text-pretty text-muted-foreground">
          Need more than marketing pages?{" "}
          <Link href="/blocks" className={linkClassName}>
            HextaUI Pro blocks
          </Link>{" "}
          cover AI chat, settings and e-commerce screens, and the{" "}
          <Link href="/components" className={linkClassName}>
            component library
          </Link>{" "}
          is free.
        </p>
      </Band>
      <Band id="page-builder-faq">
        <div className="grid gap-x-12 gap-y-8 lg:grid-cols-2">
          <SectionHead id="page-builder-faq" eyebrow="FAQ" title="Questions">
            How the builder, the share link and the install command work.
          </SectionHead>
          <div className="border-t">
            <Accordion>
              {pageBuilderQuestions.map((item) => (
                <AccordionItem key={item.question} value={item.question}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Band>
    </main>
  )
}
