import type { Metadata } from "next"

import { DocsList, DocsParagraph } from "@/components/docs/docs-content"
import { LegalLink, LegalSection } from "@/components/legal/legal-page"
import { InfoPage } from "@/components/site/info-page"
import { pageMetadata } from "@/lib/metadata"
import {
  freePlan,
  getPricingBlocks,
  pricingCurrency,
  proPlan,
} from "@/lib/pricing-info"

export const metadata: Metadata = pageMetadata({
  title: "Pricing",
  description: `HextaUI components are free under the MIT License. HextaUI Pro is a one-time payment of $${proPlan.price}.`,
  path: "/pricing",
  markdown: "/pricing.md",
})

export default function Page() {
  return (
    <InfoPage
      title="HextaUI pricing"
      lead={`The component library is free. HextaUI Pro is one payment, not a subscription. Prices are in ${pricingCurrency}.`}
    >
      <LegalSection title={`${freePlan.name}: free`}>
        <DocsParagraph>{freePlan.summary}</DocsParagraph>
        <DocsList>
          {freePlan.includes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </DocsList>
      </LegalSection>

      <LegalSection
        title={`${proPlan.name}: $${proPlan.price} once, then $${proPlan.regularPrice}`}
      >
        <DocsParagraph>{proPlan.summary}</DocsParagraph>
        <DocsList>
          {proPlan.includes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </DocsList>
        <DocsParagraph>
          Get it from your <LegalLink href="/account">account</LegalLink>. The{" "}
          <LegalLink href="/legal/license">Pro License</LegalLink> and{" "}
          <LegalLink href="/legal/refunds">Refund Policy</LegalLink> have the
          details.
        </DocsParagraph>
      </LegalSection>

      <LegalSection title="Blocks in HextaUI Pro">
        <DocsList>
          {getPricingBlocks().map((block) => (
            <li key={block.url}>
              <LegalLink href={new URL(block.url).pathname}>
                {block.title}
              </LegalLink>
              : {block.description}
            </li>
          ))}
        </DocsList>
      </LegalSection>
    </InfoPage>
  )
}
