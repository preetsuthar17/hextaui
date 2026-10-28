import type { Metadata } from "next"

import { DocsParagraph } from "@/components/docs/docs-content"
import { factLinkClassName } from "@/components/site/fact-list"
import { InfoSection } from "@/components/site/info-page"
import { JsonLd } from "@/components/site/json-ld"
import Link from "@/components/site/link"
import { ToolBelowFold } from "@/components/tools/shell/tool-app"
import { TestimonialWallBuilder } from "@/components/tools/testimonial-wall/testimonial-wall-builder"
import { pageMetadata } from "@/lib/metadata"
import { faqPageJsonLd, pageJsonLd } from "@/lib/structured-data"
import {
  testimonialWallAbout,
  testimonialWallDescription,
  testimonialWallPath,
  testimonialWallQuestions,
  testimonialWallSteps,
  testimonialWallTitle,
} from "@/lib/testimonial-wall/content"

export const metadata: Metadata = pageMetadata({
  title: testimonialWallTitle,
  description: testimonialWallDescription,
  path: testimonialWallPath,
  markdown: `${testimonialWallPath}.md`,
})

export default function Page() {
  return (
    <main className="flex flex-1 flex-col">
      <JsonLd
        data={pageJsonLd({
          path: testimonialWallPath,
          name: testimonialWallTitle,
          description: testimonialWallDescription,
          breadcrumbs: [
            { name: "Tools", path: "/tools" },
            { name: "Testimonial wall", path: testimonialWallPath },
          ],
          extra: [faqPageJsonLd(testimonialWallPath, testimonialWallQuestions)],
        })}
      />
      <TestimonialWallBuilder title={testimonialWallTitle} />
      <ToolBelowFold>
        <InfoSection title="How it works">
          <ol className="flex flex-col divide-y border-y">
            {testimonialWallSteps.map((step, index) => (
              <li key={step.title} className="flex gap-4 py-5">
                <span className="w-5 shrink-0 pt-0.5 text-sm text-muted-foreground tabular-nums">
                  {index + 1}
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-base font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-base/7 text-pretty text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </InfoSection>
        <InfoSection title="What a testimonial wall is">
          {testimonialWallAbout.map((paragraph) => (
            <DocsParagraph key={paragraph}>{paragraph}</DocsParagraph>
          ))}
          <DocsParagraph>
            The wall renders with free{" "}
            <Link href="/components" className={factLinkClassName}>
              HextaUI components
            </Link>
            , so it follows your theme. Want more finished sections like it?{" "}
            <Link href="/blocks" className={factLinkClassName}>
              See HextaUI Pro blocks
            </Link>
            .
          </DocsParagraph>
        </InfoSection>
        <InfoSection title="Questions">
          <dl className="flex flex-col divide-y border-y">
            {testimonialWallQuestions.map((item) => (
              <div key={item.question} className="flex flex-col gap-1.5 py-5">
                <dt className="text-base font-semibold tracking-tight">
                  {item.question}
                </dt>
                <dd className="text-base/7 text-pretty text-muted-foreground">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </InfoSection>
      </ToolBelowFold>
    </main>
  )
}
