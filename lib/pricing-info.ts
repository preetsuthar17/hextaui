import { docsComponents, docsHooks, docsUtilities } from "@/lib/docs"
import { frontmatter } from "@/lib/frontmatter"
import { proBlocks } from "@/lib/pro/catalog"
import { proPrice, proRegularPrice } from "@/lib/pro/pricing"
import { absoluteUrl, siteName } from "@/lib/site"

const pricingUpdated = "2026-10-06"
const pricingCurrency = "USD"

const freePlan = {
  name: `${siteName} components`,
  price: 0,
  summary:
    "Every component, hook and utility, free under the MIT License for personal and commercial work.",
  includes: [
    "All components, hooks and utilities with their full source",
    "Install with the shadcn CLI, no account needed",
    "Docs, Markdown docs, llms.txt and the MCP server",
  ],
}

const proPlan = {
  name: `${siteName} Pro`,
  price: proPrice,
  regularPrice: proRegularPrice,
  summary: `Ready-made blocks for AI chat interfaces and app layouts. One payment of $${proPrice} while blocks are in early access, then $${proRegularPrice}. No subscription.`,
  includes: [
    "Unlimited personal and commercial projects, including client work and products you sell",
    "Every Pro block, installed with the shadcn CLI from a private registry",
    "API tokens for the CLI and scripts",
    "14-day refund, no questions asked",
    "One license per developer who works on Pro code",
  ],
}

function getPricingBlocks() {
  return proBlocks.map((block) => ({
    title: block.title,
    description: block.description,
    url: absoluteUrl(`/blocks/${block.name}`),
  }))
}

function getPricingMarkdown() {
  const bullets = (items: string[]) =>
    items.map((item) => `- ${item}`).join("\n")
  return `${[
    frontmatter({
      title: `${siteName} pricing`,
      description: `${siteName} components are free under the MIT License. ${siteName} Pro is a one-time payment of $${proPrice} (then $${proRegularPrice}).`,
      canonical: absoluteUrl("/pricing"),
      "last-updated": pricingUpdated,
    }),
    `# ${siteName} pricing`,
    `Prices are in ${pricingCurrency}. Payments are handled by Dodo Payments.`,
    `## ${freePlan.name}: free`,
    freePlan.summary,
    bullets(freePlan.includes),
    `## ${proPlan.name}: $${proPlan.price} one-time (early access), then $${proPlan.regularPrice}`,
    proPlan.summary,
    bullets(proPlan.includes),
    "### Blocks included",
    bullets(
      getPricingBlocks().map(
        (block) => `[${block.title}](${block.url}): ${block.description}`
      )
    ),
    "## Compare plans",
    [
      `| | ${freePlan.name} | ${proPlan.name} |`,
      "| --- | --- | --- |",
      `| Price (${pricingCurrency}) | $0 | $${proPlan.price} once, then $${proPlan.regularPrice} |`,
      "| Billing | None | One-time payment, no subscription |",
      "| License | MIT | Pro License, per developer |",
      `| Components, hooks and utilities | All ${docsComponents.length + docsHooks.length + docsUtilities.length} | All, same as free |`,
      `| Pro blocks | None | All ${proBlocks.length} |`,
      "| Install | shadcn CLI, public registry | shadcn CLI, private registry with an API token |",
      "| Commercial use | Yes | Yes, in unlimited end products |",
      "| Client work | Yes | Yes |",
      "| Docs, llms.txt and MCP server | Yes | Yes |",
      "| Refund | Not applicable | 14 days, no questions asked |",
    ].join("\n"),
    "## Common questions",
    bullets([
      "Is there a subscription? No. Pro is a single payment.",
      "Does a team need one license? No. Each developer who installs or works on Pro code needs their own Pro; clients and teammates who only use the finished product don't.",
      "Can Pro blocks go in an open-source project? Yes, in an open-source end product, as long as it isn't a UI library, kit or template collection.",
      "What happens after a refund? Pro access, API tokens for Pro blocks and the Pro License end.",
    ]),
    "## How to buy",
    `Sign in with GitHub or Google at ${absoluteUrl("/account")} and choose Get Pro. Checkout needs a person in a browser; agents cannot buy on a user's behalf through the API.`,
    "## Terms",
    bullets([
      `[Pro License](${absoluteUrl("/legal/license")})`,
      `[Refund Policy](${absoluteUrl("/legal/refunds")})`,
      `[Terms of Service](${absoluteUrl("/legal/terms")})`,
    ]),
  ].join("\n\n")}\n`
}

function getProProductJsonLd() {
  return {
    "@type": "Product",
    "@id": absoluteUrl("/pricing#pro"),
    name: proPlan.name,
    description: proPlan.summary,
    brand: { "@id": absoluteUrl("/#organization") },
    url: absoluteUrl("/pricing"),
    image: absoluteUrl("/hextaui-logo.png"),
    category: "Software > UI component library",
    offers: {
      "@type": "Offer",
      price: proPlan.price,
      priceCurrency: pricingCurrency,
      availability: "https://schema.org/InStock",
      url: absoluteUrl("/pricing"),
      seller: { "@id": absoluteUrl("/#organization") },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 14,
        merchantReturnLink: absoluteUrl("/legal/refunds"),
      },
    },
  }
}

export {
  freePlan,
  getPricingBlocks,
  getProProductJsonLd,
  getPricingMarkdown,
  pricingCurrency,
  pricingUpdated,
  proPlan,
}
