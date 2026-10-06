import type { Metadata } from "next"

import { DocsList, DocsParagraph } from "@/components/docs/docs-content"
import {
  ContactEmail,
  LegalLink,
  LegalPage,
  LegalSection,
} from "@/components/legal/legal-page"

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "HextaUI Pro comes with a 14-day, no-questions-asked refund.",
}

export default function Page() {
  return (
    <LegalPage href="/legal/refunds" title="Refund Policy" updated="2026-10-06">
      <DocsParagraph>
        If HextaUI Pro isn’t right for you, you can get a full refund within 14
        days of your purchase. No questions asked.
      </DocsParagraph>

      <LegalSection title="How to ask for a refund">
        <DocsParagraph>
          Email <ContactEmail /> within 14 days of buying. Send it from, or
          mention, the email you used at checkout, and include the order or
          payment ID from your receipt if you have it.
        </DocsParagraph>
        <DocsParagraph>
          Refunds are issued through Dodo Payments to your original payment
          method. Once approved, they usually arrive within 5 to 10 business
          days, depending on your bank.
        </DocsParagraph>
      </LegalSection>

      <LegalSection title="What happens after a refund">
        <DocsList>
          <li>Your HextaUI Pro access ends.</li>
          <li>Your API tokens stop working for Pro blocks.</li>
          <li>
            Your <LegalLink href="/legal/license">Pro License</LegalLink> ends,
            so please remove Pro code from your projects.
          </li>
        </DocsList>
      </LegalSection>

      <LegalSection title="After 14 days">
        <DocsParagraph>
          Purchases are final after 14 days, except for duplicate charges,
          billing errors, or where the law gives you a right to a refund.
        </DocsParagraph>
      </LegalSection>

      <LegalSection title="Chargebacks">
        <DocsParagraph>
          Please email me before disputing a charge with your bank. It’s faster
          for you. A chargeback ends Pro access while the dispute is open, and
          for good if the dispute is lost.
        </DocsParagraph>
      </LegalSection>

      <LegalSection title="Your consumer rights">
        <DocsParagraph>
          This policy doesn’t limit any rights you have under the consumer law
          where you live. See also the{" "}
          <LegalLink href="/legal/terms">Terms of Service</LegalLink>.
        </DocsParagraph>
      </LegalSection>
    </LegalPage>
  )
}
