import type { Metadata } from "next"
import Link from "@/components/site/link"
import { IconCheck, IconMinus } from "@tabler/icons-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { BlockCard } from "@/components/site/block-card"
import { PricingActions } from "@/components/site/pricing-checkout"
import { PricingRuler, type PricingPlan } from "@/components/site/pricing-ruler"
import { JsonLd } from "@/components/site/json-ld"
import {
  Band,
  PageColumn,
  PageHead,
  SectionHead,
} from "@/components/site/pricing-sections"
import { docsComponents, docsHooks, docsUtilities } from "@/lib/docs"
import { metadataTitle, pageMetadata } from "@/lib/metadata"
import {
  getFeaturedBlocks,
  getPricingBlockSections,
  getPricingBlocks,
  getProProductJsonLd,
  pricingCurrency,
  pricingQuestions,
  pricingSteps,
  proSummary,
  refundTerms,
} from "@/lib/pricing-info"
import { proPlans, refundDays } from "@/lib/pro/pricing"
import { faqPageJsonLd, pageJsonLd } from "@/lib/structured-data"

export const metadata: Metadata = pageMetadata({
  title: "Pricing",
  description: `HextaUI components are free under MIT. Pro blocks for AI products are one payment: Solo from $${proPlans.solo.earlyPrice}, or a team of ${proPlans.team.seats} from $${proPlans.team.earlyPrice}.`,
  path: "/pricing",
  markdown: "/pricing.md",
})

const linkClassName =
  "rounded-sm text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors duration-150 outline-none hover:decoration-foreground focus-visible:ring-3 focus-visible:ring-focus-ring motion-reduce:transition-none"

const libraryCount =
  docsComponents.length + docsHooks.length + docsUtilities.length
const blocks = getPricingBlocks()
const freeBlocks = blocks.filter((block) => block.free)
const blockSections = getPricingBlockSections()
const featuredBlocks = getFeaturedBlocks()
const categoryNames = new Intl.ListFormat("en", { type: "conjunction" }).format(
  blockSections.map((section) => section.title)
)

const plans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    seats: "Anyone, any project",
    features: [
      `${libraryCount} components, hooks and utilities under MIT`,
      ...freeBlocks.map((block) => `The ${block.title} Pro block`),
      "Install with the shadcn CLI, no account",
    ],
  },
  {
    id: "solo",
    name: proPlans.solo.name,
    seats: "1 developer",
    recommended: true,
    features: [
      "Everything in Free",
      `All ${blocks.length} Pro blocks and every future category`,
      "A Vercel AI SDK example in every block",
      "Private registry and API tokens",
    ],
  },
  {
    id: "team",
    name: proPlans.team.name,
    seats: `Up to ${proPlans.team.seats} developers`,
    features: [
      "Everything in Solo",
      `Up to ${proPlans.team.seats} developers on one invoice`,
      "Add and remove teammates by email",
      "One shared token allowed in CI",
    ],
  },
]

type Cell = boolean | string

const comparison: { label: string; values: [Cell, Cell, Cell] }[] = [
  {
    label: "Components, hooks and utilities",
    values: [
      `All ${libraryCount}`,
      `All ${libraryCount}`,
      `All ${libraryCount}`,
    ],
  },
  {
    label: "Pro blocks",
    values: [
      freeBlocks.length > 0
        ? freeBlocks.map((block) => block.title).join(", ")
        : false,
      `All ${blocks.length}`,
      `All ${blocks.length}`,
    ],
  },
  { label: "Future block categories", values: [false, true, true] },
  {
    label: "Developers",
    values: ["Anyone", "1", `Up to ${proPlans.team.seats}`],
  },
  { label: "Shared token in CI", values: [false, false, true] },
  {
    label: "Commercial use and client work",
    values: [true, true, true],
  },
  {
    label: "Billing",
    values: ["None", "One payment", "One payment"],
  },
  {
    label: "Refund",
    values: [false, `${refundDays} days`, `${refundDays} days`],
  },
]

function CellValue({ value }: { value: Cell }) {
  if (value === true) {
    return (
      <>
        <IconCheck aria-hidden="true" className="size-4" />
        <span className="sr-only">Included</span>
      </>
    )
  }
  if (value === false) {
    return (
      <>
        <IconMinus
          aria-hidden="true"
          className="size-4 text-muted-foreground/60"
        />
        <span className="sr-only">Not included</span>
      </>
    )
  }
  return value
}

export default function Page() {
  return (
    <main className="flex flex-1 flex-col">
      <JsonLd
        data={pageJsonLd({
          path: "/pricing",
          name: metadataTitle(metadata),
          description: String(metadata.description),
          breadcrumbs: [{ name: "Pricing", path: "/pricing" }],
          type: "WebPage",
          extra: [
            getProProductJsonLd(),
            faqPageJsonLd("/pricing", pricingQuestions),
          ],
        })}
      />
      <section aria-labelledby="pricing-title">
        <PageColumn className="pt-20 pb-20 sm:pt-28 sm:pb-28">
          <PageHead
            id="pricing-title"
            eyebrow="Pricing"
            title="Pay once, ship your AI app faster"
          >
            {proSummary} The component library underneath stays free and open
            source.
          </PageHead>
          <PricingActions className="mt-8" />
          <h2 className="sr-only">Plans</h2>
          <div className="mt-12 sm:mt-16">
            <PricingRuler plans={plans} />
          </div>
          <p className="mt-10 text-sm text-pretty text-muted-foreground">
            Prices in {pricingCurrency}, before any sales tax. Payments are
            handled by Dodo Payments. Pro is covered by the{" "}
            <Link href="/legal/license" className={linkClassName}>
              Pro License
            </Link>{" "}
            and the{" "}
            <Link href="/legal/refunds" className={linkClassName}>
              Refund Policy
            </Link>
            .
          </p>
        </PageColumn>
      </section>

      <Band id="pricing-blocks">
        <SectionHead
          id="pricing-blocks"
          eyebrow="What you get"
          title={`All ${blocks.length} Pro blocks`}
          className="mb-12 sm:mb-16"
        >
          {blocks.length} blocks across {categoryNames}, plus every category
          released later. Every block has a live preview you can open before
          you buy.
        </SectionHead>
        {featuredBlocks.length > 0 ? (
          <ul className="mb-14 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {featuredBlocks.map((block) => (
              <BlockCard
                key={block.name}
                name={block.name}
                title={block.title}
                tile
              />
            ))}
          </ul>
        ) : null}
        <div className="grid gap-x-12 gap-y-10 lg:grid-cols-3">
          {blockSections.map((section) => (
            <section
              key={section.category}
              aria-labelledby={`pricing-blocks-${section.category}`}
            >
              <h3
                id={`pricing-blocks-${section.category}`}
                className="flex items-baseline justify-between gap-4 pb-3 text-sm font-medium"
              >
                {section.title}
                <span className="text-muted-foreground tabular-nums">
                  {section.blocks.length}
                </span>
              </h3>
              <ul className="border-t">
                {section.blocks.map((block) => (
                  <li key={block.name} className="border-b">
                    <Link
                      href={`/blocks/${block.name}`}
                      className="flex items-center justify-between gap-4 rounded-sm py-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-focus-ring [@media(hover:hover)]:hover:text-muted-foreground"
                    >
                      {block.title}
                      {block.free ? (
                        <span className="text-xs text-muted-foreground">
                          Free
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Band>

      <Band id="pricing-after">
        <div className="grid gap-x-12 gap-y-12 lg:grid-cols-2">
          <div className="flex flex-col gap-12">
            <SectionHead
              id="pricing-after"
              eyebrow="After you pay"
              title="From checkout to installed"
            >
              Pro unlocks on your account, and every block installs with the
              same shadcn CLI as the free components.
            </SectionHead>
            <div className="flex flex-col gap-3 border-t pt-6">
              <h3 className="font-medium">Refunds</h3>
              <ul className="flex flex-col gap-2 text-sm text-pretty text-muted-foreground">
                {refundTerms.map((term) => (
                  <li key={term}>{term}</li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground">
                The full terms are in the{" "}
                <Link href="/legal/refunds" className={linkClassName}>
                  Refund Policy
                </Link>
                .
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-10">
            <ol className="flex flex-col border-t">
              {pricingSteps.map((step, index) => (
                <li key={step.title} className="flex gap-4 border-b py-5">
                  <span
                    aria-hidden="true"
                    className="w-5 shrink-0 text-sm text-muted-foreground tabular-nums"
                  >
                    {index + 1}
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-medium">{step.title}</h3>
                    <p className="text-sm text-pretty text-muted-foreground">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <PricingActions />
          </div>
        </div>
      </Band>

      <Band id="pricing-compare">
        <SectionHead
          id="pricing-compare"
          eyebrow="Compare"
          title="Compare plans"
          className="mb-12 sm:mb-16"
        >
          Every plan uses the same components and the same shadcn CLI.
        </SectionHead>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-2/5">
                <span className="sr-only">Feature</span>
              </TableHead>
              {plans.map((plan) => (
                <TableHead key={plan.id}>{plan.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {comparison.map((row) => (
              <TableRow key={row.label}>
                <TableHead scope="row">{row.label}</TableHead>
                {row.values.map((value, index) => (
                  <TableCell key={plans[index].id}>
                    <CellValue value={value} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Band>

      <Band id="pricing-faq">
        <div className="grid gap-x-12 gap-y-8 lg:grid-cols-2">
          <SectionHead id="pricing-faq" eyebrow="FAQ" title="Questions">
            Short answers about plans, seats and refunds.
          </SectionHead>
          <div className="border-t">
            <Accordion>
              {pricingQuestions.map((item) => (
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
