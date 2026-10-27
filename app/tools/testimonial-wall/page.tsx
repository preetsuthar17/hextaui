import type { Metadata } from "next"

import { DocsParagraph } from "@/components/docs/docs-content"
import { LegalLink } from "@/components/legal/legal-page"
import { InfoSection } from "@/components/site/info-page"
import { JsonLd } from "@/components/site/json-ld"
import { TestimonialWallBuilder } from "@/components/tools/testimonial-wall/testimonial-wall-builder"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { pageMetadata } from "@/lib/metadata"
import { faqPageJsonLd, pageJsonLd } from "@/lib/structured-data"
import {
  testimonialWallAbout,
  testimonialWallDescription,
  testimonialWallLead,
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
            { name: "Testimonial wall builder", path: testimonialWallPath },
          ],
          extra: [faqPageJsonLd(testimonialWallPath, testimonialWallQuestions)],
        })}
      />
      <div className="frame-width px-4 pb-16 sm:px-8 sm:pb-24">
        <header className="flex max-w-2xl flex-col items-start pt-16 pb-12 sm:pt-24 sm:pb-16">
          <p className="text-sm font-medium text-brand-strong">Free tool</p>
          <h1 className="marketing-heading mt-3 text-balance">
            {testimonialWallTitle}
          </h1>
          <p className="marketing-lede mt-4 max-w-xl text-pretty text-muted-foreground">
            {testimonialWallLead}
          </p>
        </header>
        <TestimonialWallBuilder />
        <p className="mt-8 text-sm text-pretty text-muted-foreground">
          Built with HextaUI components.{" "}
          <LegalLink href="/components">Browse components</LegalLink> or{" "}
          <LegalLink href="/blocks">see Pro blocks</LegalLink>.
        </p>
      </div>

      <InfoSection title="What a testimonial wall is">
        {testimonialWallAbout.map((paragraph) => (
          <DocsParagraph key={paragraph}>{paragraph}</DocsParagraph>
        ))}
      </InfoSection>

      <InfoSection title="How to add it to your site">
        <ol className="flex list-decimal flex-col gap-2 ps-5 text-base/7 text-pretty text-muted-foreground marker:text-muted-foreground">
          {testimonialWallSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </InfoSection>

      <InfoSection title="Questions">
        <div className="border-t">
          <Accordion>
            {testimonialWallQuestions.map((item) => (
              <AccordionItem key={item.question} value={item.question}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </InfoSection>
    </main>
  )
}
