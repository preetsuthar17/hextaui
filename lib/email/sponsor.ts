import { renderEmail, type EmailContent } from "@/lib/email/layout"
import { sendEmail, type MailerEnv } from "@/lib/email/send"
import {
  sponsorPrice,
  sponsorReviewDays,
  type SponsorInput,
} from "@/lib/sponsor"
import { siteContactEmail, siteName, siteUrl } from "@/lib/site"

function sponsorWelcomeContent(sponsor: SponsorInput): EmailContent {
  return {
    title: `Thanks for sponsoring ${siteName}`,
    paragraphs: [
      `Your ${siteName} sponsorship for ${sponsor.name} is paid and in review. It goes live on every docs and blocks page within ${sponsorReviewDays} business day, and you’ll get an email when it does.`,
      `The card will read: “${sponsor.headline}” — ${sponsor.description} [${sponsor.cta}] → ${sponsor.url}`,
      `If the card can’t run, you get a full refund. To change the copy, pause or cancel, reply to this email or write to ${siteContactEmail}.`,
    ],
    links: [{ label: "Sponsor page", href: `${siteUrl}/sponsor` }],
    footer: [
      `You’re getting this because ${sponsor.email} started a $${sponsorPrice}/month ${siteName} sponsorship. Your receipt comes separately from Dodo Payments.`,
    ],
  }
}

function sponsorCardSnippet(sponsor: SponsorInput) {
  const { name, headline, description, cta, url } = sponsor
  return JSON.stringify({ name, headline, description, cta, url }, null, 2)
}

function sponsorReviewContent(sponsor: SponsorInput): EmailContent {
  return {
    title: `New sponsor: ${sponsor.name}`,
    paragraphs: [
      `${sponsor.name} (${sponsor.email}) paid for the sponsor slot. Review the card, then set currentSponsor in lib/sponsor.ts and deploy. To decline, cancel and refund the subscription in Dodo Payments.`,
      `Headline: ${sponsor.headline}`,
      `Description: ${sponsor.description}`,
      `Button: ${sponsor.cta} → ${sponsor.url}`,
      sponsorCardSnippet(sponsor),
    ],
    links: [{ label: "Open the link", href: sponsor.url }],
    footer: [`Sent by the ${siteName} Dodo Payments webhook.`],
  }
}

function sponsorEndedContent(
  sponsor: SponsorInput,
  status: string
): EmailContent {
  return {
    title: `Sponsor ${status}: ${sponsor.name}`,
    paragraphs: [
      `The ${sponsor.name} sponsorship is now ${status}. Set currentSponsor in lib/sponsor.ts back to null and deploy, so the slot opens again.`,
    ],
    footer: [`Sent by the ${siteName} Dodo Payments webhook.`],
  }
}

async function deliver(
  env: MailerEnv,
  kind: string,
  to: string,
  subject: string,
  content: EmailContent
) {
  const result = await sendEmail(env, {
    to,
    subject,
    ...renderEmail(content),
  }).catch((error: unknown) => ({ ok: false as const, error: String(error) }))
  if (!result.ok) {
    console.error(`Could not send ${kind} email`, { error: result.error })
  }
}

function sendSponsorStartedEmails(env: MailerEnv, sponsor: SponsorInput) {
  return Promise.all([
    deliver(
      env,
      "sponsor welcome",
      sponsor.email,
      `Your ${siteName} sponsorship is in review`,
      sponsorWelcomeContent(sponsor)
    ),
    deliver(
      env,
      "sponsor review",
      siteContactEmail,
      `New ${siteName} sponsor: ${sponsor.name}`,
      sponsorReviewContent(sponsor)
    ),
  ])
}

function sendSponsorEndedEmail(
  env: MailerEnv,
  sponsor: SponsorInput,
  status: string
) {
  return deliver(
    env,
    "sponsor ended",
    siteContactEmail,
    `${siteName} sponsor ${status}: ${sponsor.name}`,
    sponsorEndedContent(sponsor, status)
  )
}

export {
  sendSponsorEndedEmail,
  sendSponsorStartedEmails,
  sponsorEndedContent,
  sponsorReviewContent,
  sponsorWelcomeContent,
}
