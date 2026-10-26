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
import { PricingRuler, type PricingPlan } from "@/components/site/pricing-ruler"
import { JsonLd } from "@/components/site/json-ld"
import {
  Band,
  PageColumn,
  PageHead,
  SectionHead,
} from "@/components/site/pricing-sections"
import { docsComponents, docsHooks, docsUtilities } from "@/lib/docs"
import { pageMetadata } from "@/lib/metadata"
import {
  getPricingBlocks,
  getProProductJsonLd,
  pricingCurrency,
  pricingQuestions,
  proSummary,
} from "@/lib/pricing-info"
import { proPlans, refundDays } from "@/lib/pro/pricing"
import { faqPageJsonLd, pageJsonLd } from "@/lib/structured-data"

export const metadata: Metadata = pageMetadata({
  title: "Pricing",
  description: `HextaUI components are free and MIT licensed. HextaUI Pro blocks for AI products are one payment: Solo from $${proPlans.solo.earlyPrice}, a team of ${proPlans.team.seats} from $${proPlans.team.earlyPrice}, unlimited seats from $${proPlans.unlimited.earlyPrice}.`,
  path: "/pricing",
  markdown: "/pricing.md",
})

const linkClassName =
  "rounded-sm text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors duration-150 outline-none hover:decoration-foreground focus-visible:ring-3 focus-visible:ring-focus-ring motion-reduce:transition-none"

const libraryCount =
  docsComponents.length + docsHooks.length + docsUtilities.length
const blocks = getPricingBlocks()
const freeBlocks = blocks.filter((block) => block.free)

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
  {
    id: "unlimited",
    name: proPlans.unlimited.name,
    seats: "Every developer",
    features: [
      "Everything in Team",
      "No seat limit, for one company",
      "One invoice for the whole company",
    ],
  },
]

type Cell = boolean | string

const comparison: { label: string; values: [Cell, Cell, Cell, Cell] }[] = [
  {
    label: "Components, hooks and utilities",
    values: [
      `All ${libraryCount}`,
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
      `All ${blocks.length}`,
    ],
  },
  { label: "Future block categories", values: [false, true, true, true] },
  {
    label: "Developers",
    values: ["Anyone", "1", `Up to ${proPlans.team.seats}`, "Unlimited"],
  },
  { label: "Shared token in CI", values: [false, false, true, true] },
  {
    label: "Commercial use and client work",
    values: [true, true, true, true],
  },
  {
    label: "Billing",
    values: ["None", "One payment", "One payment", "One payment"],
  },
  {
    label: "Refund",
    values: [
      false,
      `${refundDays} days`,
      `${refundDays} days`,
      `${refundDays} days`,
    ],
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
          name: String(metadata.title),
          description: String(metadata.description),
          breadcrumbs: [{ name: "Pricing", path: "/pricing" }],
          type: "WebPage",
        })}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            getProProductJsonLd(),
            faqPageJsonLd("/pricing", pricingQuestions),
          ],
        }}
      />
      <section aria-labelledby="pricing-title">
        <PageColumn className="pt-20 pb-20 sm:pt-28 sm:pb-28">
          <PageHead
            id="pricing-title"
            eyebrow="Pricing"
            title="Pay once, keep every block"
          >
            {proSummary} The component library underneath stays free and open
            source.
          </PageHead>
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

      <Band id="pricing-blocks">
        <SectionHead
          id="pricing-blocks"
          eyebrow="HextaUI Pro"
          title="What’s in Pro"
          className="mb-12 sm:mb-16"
        >
          Every block has a live preview you can open before you buy.
        </SectionHead>
        <ul className="grid gap-x-12 border-t sm:grid-cols-2 lg:grid-cols-3">
          {blocks.map((block) => (
            <li key={block.url} className="border-b">
              <Link
                href={new URL(block.url).pathname}
                className="flex items-center justify-between gap-4 rounded-sm py-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-focus-ring [@media(hover:hover)]:hover:text-muted-foreground"
              >
                <span className="font-medium">{block.title}</span>
                {block.free ? (
                  <span className="text-xs text-muted-foreground">Free</span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
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
