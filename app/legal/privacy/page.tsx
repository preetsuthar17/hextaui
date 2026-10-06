import type { Metadata } from "next"

import {
  DocsCode,
  DocsList,
  DocsParagraph,
} from "@/components/docs/docs-content"
import {
  ContactEmail,
  LegalLink,
  LegalPage,
  LegalSection,
} from "@/components/legal/legal-page"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What data HextaUI collects, why, who processes it and the choices you have.",
}

export default function Page() {
  return (
    <LegalPage
      href="/legal/privacy"
      title="Privacy Policy"
      updated="2026-10-06"
    >
      <DocsParagraph>
        HextaUI (hextaui.com) is run by Preet Suthar, an individual based in
        India. This policy explains what data the site collects, why, who else
        handles it and what you can ask for. Questions go to <ContactEmail />.
      </DocsParagraph>

      <LegalSection title="The short version">
        <DocsList>
          <li>
            You can read the docs and use every free component without an
            account or tracking cookies.
          </li>
          <li>
            If you sign in, I keep your name, email and profile picture from
            GitHub or Google so your account and HextaUI Pro work.
          </li>
          <li>
            Payments go through Dodo Payments. I never see your full card
            details.
          </li>
          <li>I don’t sell your data, show ads or track you across sites.</li>
        </DocsList>
      </LegalSection>

      <LegalSection title="When you browse">
        <DocsParagraph>
          Reading the site needs no account. Two things still happen on every
          visit:
        </DocsParagraph>
        <DocsList>
          <li>
            <strong className="font-medium text-foreground">Analytics.</strong>{" "}
            OneDollarStats records aggregate statistics: the page you came from,
            the pages you view, how long you stay, and your device type,
            operating system, browser and country. It doesn’t collect personally
            identifiable data from browsing.
          </li>
          <li>
            <strong className="font-medium text-foreground">Hosting.</strong>{" "}
            Cloudflare serves the site and, like any web host, processes your IP
            address and browser details to deliver pages and block abuse.
          </li>
        </DocsList>
      </LegalSection>

      <LegalSection title="When you sign in">
        <DocsParagraph>
          You sign in with GitHub or Google. With your permission on their
          screen, they share the following, which I store:
        </DocsParagraph>
        <DocsList>
          <li>Your name, email address and profile picture URL.</li>
          <li>
            Your account ID with that provider and whether your email is
            verified.
          </li>
          <li>
            The access tokens the provider issues. They’re encrypted in the
            database and only used to complete sign-in.
          </li>
          <li>
            For each session: a session token, the IP address and browser you
            signed in from, and when the session expires.
          </li>
        </DocsList>
        <DocsParagraph>
          If you sign in with both GitHub and Google using the same verified
          email, both connect to one account, so your purchase follows you.
        </DocsParagraph>
      </LegalSection>

      <LegalSection title="When you buy HextaUI Pro">
        <DocsParagraph>
          Dodo Payments is the merchant of record. It collects your payment
          details, billing address and tax information, processes the payment
          and issues the invoice, under its own privacy policy. From Dodo I
          receive and keep the payment ID, its customer ID for you, the product,
          amount, currency, status and date.
        </DocsParagraph>
      </LegalSection>

      <LegalSection title="When you create API tokens">
        <DocsParagraph>
          Tokens let the shadcn CLI install Pro blocks. I store only a hash of
          each token, the name you give it, a short hint like{" "}
          <DocsCode>hxt_abcd…wxyz</DocsCode>, and when it was created and last
          used. The full token is shown to you once and can’t be recovered.
        </DocsParagraph>
      </LegalSection>

      <LegalSection title="How the data is used">
        <DocsList>
          <li>To sign you in and keep you signed in.</li>
          <li>To check your HextaUI Pro access and deliver Pro blocks.</li>
          <li>To process purchases, refunds and disputes.</li>
          <li>To prevent fraud and abuse, such as shared or leaked tokens.</li>
          <li>To answer you when you email me.</li>
          <li>To understand, in aggregate, which pages are useful.</li>
        </DocsList>
      </LegalSection>

      <LegalSection title="Cookies and browser storage">
        <DocsParagraph>
          The only cookies are the ones that make sign-in work, set by the
          authentication system (their names start with{" "}
          <DocsCode>better-auth</DocsCode>):
        </DocsParagraph>
        <DocsList>
          <li>A session cookie that keeps you signed in for up to 30 days.</li>
          <li>
            A short-lived copy of your session, refreshed every few minutes.
          </li>
          <li>
            A sign-in state cookie that lasts a few minutes while GitHub or
            Google redirects you back.
          </li>
        </DocsList>
        <DocsParagraph>
          The site also saves a few preferences in your browser’s storage: your
          theme, your package manager, recent searches, the layout of resizable
          examples, whether you’ve signed in before, and a cached GitHub star
          count. These never leave your device.
        </DocsParagraph>
      </LegalSection>

      <LegalSection title="Who else handles data">
        <DocsList>
          <li>
            <strong className="font-medium text-foreground">Cloudflare</strong>{" "}
            hosts the site, its functions and the database.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              GitHub and Google
            </strong>{" "}
            handle sign-in under their own privacy policies.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              Dodo Payments
            </strong>{" "}
            processes payments, taxes and refunds.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              OneDollarStats
            </strong>{" "}
            provides analytics, hosted in Finland.
          </li>
        </DocsList>
        <DocsParagraph>
          Some pages also load content straight from other services, which then
          receive your IP address and browser details: the GitHub API for the
          star count, profile pictures from GitHub and Google, sample images and
          videos in docs examples (Unsplash, W3C and MDN), and site icons in the
          Thinking block preview through DuckDuckGo’s icon service.
        </DocsParagraph>
        <DocsParagraph>
          These providers may process data outside India.
        </DocsParagraph>
      </LegalSection>

      <LegalSection title="How long data is kept">
        <DocsList>
          <li>Account data: until you ask me to delete your account.</li>
          <li>
            Sessions: they expire after 30 days without use, or when you sign
            out.
          </li>
          <li>API tokens: until you revoke them or delete your account.</li>
          <li>
            Purchase records: kept for as long as tax, accounting and fraud
            rules require, even after the account is deleted.
          </li>
        </DocsList>
      </LegalSection>

      <LegalSection title="Your rights">
        <DocsParagraph>
          Under India’s Digital Personal Data Protection Act, 2023, and, where
          it applies to you, the GDPR, you can ask to access, correct or delete
          your data, withdraw consent, or raise a grievance. Email{" "}
          <ContactEmail /> from the address on your account and I’ll respond
          within 30 days. Deleting your account removes your profile, linked
          sign-ins, sessions and API tokens, and ends Pro access.
        </DocsParagraph>
      </LegalSection>

      <LegalSection title="Children">
        <DocsParagraph>
          HextaUI accounts and purchases are meant for people 18 or older. If
          you’re younger, ask a parent or guardian before signing in or buying.
        </DocsParagraph>
      </LegalSection>

      <LegalSection title="Security">
        <DocsParagraph>
          Traffic is encrypted with HTTPS, API tokens are stored only as hashes
          and provider tokens are encrypted. No system is perfectly secure, so
          please keep your tokens private and revoke any you think have leaked.
        </DocsParagraph>
      </LegalSection>

      <LegalSection title="Changes">
        <DocsParagraph>
          If this policy changes, the date at the top changes too. Material
          changes will be announced on the site. See also the{" "}
          <LegalLink href="/legal/terms">Terms of Service</LegalLink>.
        </DocsParagraph>
      </LegalSection>
    </LegalPage>
  )
}
