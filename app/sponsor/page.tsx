import type { Metadata } from "next"
import { IconCheck } from "@tabler/icons-react"

import { JsonLd } from "@/components/site/json-ld"

import { ContactEmail } from "@/components/legal/legal-page"
import {
  Band,
  PageColumn,
  PageHead,
  SectionHead,
} from "@/components/site/pricing-sections"
import { SponsorForm } from "@/components/site/sponsor-form"
import { metadataTitle, pageMetadata } from "@/lib/metadata"
import { pageJsonLd } from "@/lib/structured-data"
import { currentSponsor, sponsorPrice, sponsorReviewDays } from "@/lib/sponsor"

export const metadata: Metadata = pageMetadata({
  title: "Sponsor",
  description: `Put your product beside every HextaUI docs and blocks page. One sponsor at a time, $${sponsorPrice} a month, cancel anytime.`,
  path: "/sponsor",
})

const offer = [
  "A card under the table of contents on every docs and blocks page, on desktop.",
  "The only sponsor on the site. No rotation, no other ads.",
  "A headline, a short description and a button to your site, marked as sponsored, with UTM tags so you can measure clicks.",
  `$${sponsorPrice} a month, billed by Dodo Payments. Cancel anytime; the card stays up until the end of the paid month.`,
  `Every card is reviewed by hand and goes live within ${sponsorReviewDays} business day. If it can’t run, you get a full refund.`,
]

export default function Page() {
  return (
    <main className="flex flex-1 flex-col">
      <JsonLd
        data={pageJsonLd({
          path: "/sponsor",
          name: metadataTitle(metadata),
          description: String(metadata.description),
          breadcrumbs: [{ name: "Sponsor", path: "/sponsor" }],
          type: "WebPage",
        })}
      />
      <section aria-labelledby="sponsor-title">
        <PageColumn className="pt-20 pb-20 sm:pt-28 sm:pb-28">
          <PageHead
            id="sponsor-title"
            eyebrow="Sponsor"
            title="Sponsor HextaUI"
          >
            Put your product in front of developers building with shadcn/ui and
            React, right beside the docs they’re reading.
          </PageHead>
          <div className="mt-12 grid gap-(--hairline) overflow-hidden rounded-2xl border bg-border sm:mt-16 md:grid-cols-3 forced-colors:gap-px">
            <div className="flex flex-col gap-1 bg-background p-6 sm:p-8">
              <p className="flex items-baseline gap-2 tabular-nums">
                <span className="marketing-number">${sponsorPrice}</span>
                <span className="text-sm text-muted-foreground">a month</span>
              </p>
              <p className="text-sm text-pretty text-muted-foreground">
                One sponsor at a time. Cancel anytime.
              </p>
            </div>
            <div className="flex flex-col gap-6 bg-background p-6 sm:p-8 md:col-span-2">
              <h2 id="sponsor-offer" className="font-medium">
                What you get
              </h2>
              <ul
                aria-labelledby="sponsor-offer"
                className="flex flex-col gap-2.5 text-sm"
              >
                {offer.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <IconCheck
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                    />
                    <span className="text-pretty">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </PageColumn>
      </section>

      <Band id="sponsor-card">
        <SectionHead
          id="sponsor-card"
          eyebrow={currentSponsor ? "Booked" : "Book the slot"}
          title={currentSponsor ? "The slot is booked" : "Your card"}
          className="mb-12 sm:mb-16"
        >
          {currentSponsor ? (
            <>
              {currentSponsor.name} holds the sponsor slot right now. Email{" "}
              <ContactEmail /> to get the next opening.
            </>
          ) : (
            <>
              Write the card the way it should appear. You can change the copy
              later by email. Products for developers fit best; gambling, crypto
              trading and adult products aren’t accepted.
            </>
          )}
        </SectionHead>
        {currentSponsor ? null : <SponsorForm />}
      </Band>
    </main>
  )
}
