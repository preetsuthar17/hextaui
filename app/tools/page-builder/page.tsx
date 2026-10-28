import type { Metadata } from "next"

import { DocsParagraph } from "@/components/docs/docs-content"
import { PageBuilder } from "@/components/page-builder/builder"
import { factLinkClassName } from "@/components/site/fact-list"
import { InfoSection } from "@/components/site/info-page"
import { JsonLd } from "@/components/site/json-ld"
import Link from "@/components/site/link"
import { ToolBelowFold } from "@/components/tools/shell/tool-app"
import { pageMetadata } from "@/lib/metadata"
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

export default function Page() {
  return (
    <main className="flex flex-1 flex-col">
      <JsonLd
        data={pageJsonLd({
          path: pageBuilderPath,
          name: pageBuilderTitle,
          description: pageBuilderDescription,
          breadcrumbs: [
            { name: "Tools", path: "/tools" },
            { name: "Page builder", path: pageBuilderPath },
          ],
          extra: [faqPageJsonLd(pageBuilderPath, pageBuilderQuestions)],
        })}
      />
      <PageBuilder title={pageBuilderTitle} proBlocks={getProSections()} />
      <ToolBelowFold>
        <InfoSection title="How it works">
          <ol className="flex flex-col divide-y border-y">
            {pageBuilderSteps.map((step, index) => (
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
            Every section is a plain composition of free{" "}
            <Link href="/components" className={factLinkClassName}>
              HextaUI components
            </Link>
            , so the code you export is yours to change. Make a theme in the{" "}
            <Link href="/tools/theme-editor" className={factLinkClassName}>
              theme editor
            </Link>{" "}
            and paste its link into Theme to see the page in your colors. For
            AI chat, settings and e-commerce screens, add{" "}
            <Link href="/blocks" className={factLinkClassName}>
              HextaUI Pro blocks
            </Link>
            .
          </DocsParagraph>
        </InfoSection>
        <InfoSection title="Questions">
          <dl className="flex flex-col divide-y border-y">
            {pageBuilderQuestions.map((item) => (
              <div key={item.question} className="flex flex-col gap-1.5 py-5">
                <dt className="text-base font-semibold tracking-tight">{item.question}</dt>
                <dd className="text-base/7 text-pretty text-muted-foreground">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </InfoSection>
      </ToolBelowFold>
    </main>
  )
}
