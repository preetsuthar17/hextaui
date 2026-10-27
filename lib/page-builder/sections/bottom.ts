import type { ListField } from "@/lib/page-builder/fields"
import { h } from "@/lib/page-builder/node"
import {
  actionFields,
  actions,
  brand,
  brandDefaults,
  brandFields,
  eyebrow,
  flag,
  headFields,
  heading,
  href,
  lede,
  linkButton,
  lines,
  list,
  sectionHead,
  text,
  type SectionDefinition,
} from "@/lib/page-builder/sections/shared"

const planItems = [
  {
    name: "Starter",
    price: "$0",
    period: "per month",
    description: "For individuals exploring their first data source.",
    features: "1 data source\n100 questions a month\nShared dashboards",
    cta: "Start for free",
    href: "/signup",
    featured: false,
  },
  {
    name: "Team",
    price: "$24",
    period: "per seat / month",
    description: "For teams that make decisions from data every day.",
    features:
      "Unlimited data sources\nUnlimited questions\nScheduled reports\nAlerts in Slack",
    cta: "Start a free trial",
    href: "/signup?plan=team",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For companies with security and scale requirements.",
    features:
      "SSO and SCIM\nRow-level permissions\nAudit log\nDedicated support",
    cta: "Contact sales",
    href: "/contact",
    featured: false,
  },
]

const planField: ListField = {
  key: "plans",
  label: "Plans",
  type: "list",
  itemLabel: "Plan",
  titleKey: "name",
  min: 1,
  max: 4,
  item: [
    { key: "name", label: "Name", type: "text", max: 40 },
    { key: "price", label: "Price", type: "text", max: 20 },
    { key: "period", label: "Period", type: "text", max: 40 },
    { key: "description", label: "Description", type: "textarea", max: 200 },
    {
      key: "features",
      label: "Features (one per line)",
      type: "textarea",
      max: 600,
    },
    { key: "cta", label: "Button", type: "text", max: 40 },
    { key: "href", label: "Button link", type: "url" },
    { key: "featured", label: "Highlight this plan", type: "toggle" },
  ],
}

function checkList(value: string) {
  return h(
    "ul",
    { className: "flex flex-col gap-2.5 text-sm" },
    lines(value).map((line) =>
      h(
        "li",
        { className: "flex items-start gap-2.5" },
        h("IconCheck", {
          className: "mt-0.5 size-4 shrink-0 text-muted-foreground",
          "aria-hidden": "true",
        }),
        line
      )
    )
  )
}

const pricingTiers: SectionDefinition = {
  id: "pricing-tiers",
  kind: "pricing",
  variant: "Tiers",
  description: "Plans side by side, one highlighted.",
  fields: [...headFields, planField],
  defaults: {
    eyebrow: "Pricing",
    headline: "Simple pricing that grows with you",
    subhead: "Start free. Upgrade when your team needs more.",
    plans: planItems,
  },
  build: (props) => {
    const plans = list(props, "plans")
    return h(
      "section",
      { id: "pricing", className: "px-6 py-16 sm:py-24" },
      h(
        "div",
        { className: "mx-auto flex max-w-6xl flex-col gap-14 sm:gap-16" },
        sectionHead(props),
        h(
          "div",
          {
            className:
              plans.length >= 3
                ? "grid items-start gap-4 lg:grid-cols-3"
                : "mx-auto grid w-full max-w-4xl items-start gap-4 md:grid-cols-2",
          },
          plans.map((plan) =>
            h(
              "div",
              {
                className: flag(plan, "featured")
                  ? "flex flex-col gap-8 rounded-2xl border border-foreground/20 bg-muted/40 p-8"
                  : "flex flex-col gap-8 rounded-2xl border p-8",
              },
              h(
                "div",
                { className: "flex flex-col gap-4" },
                h(
                  "div",
                  { className: "flex items-center justify-between gap-2" },
                  h(
                    "h3",
                    { className: "text-base font-semibold" },
                    String(plan.name)
                  ),
                  flag(plan, "featured")
                    ? h(
                        "Badge",
                        { appearance: "outline", shape: "pill" },
                        "Most popular"
                      )
                    : null
                ),
                h(
                  "p",
                  { className: "flex items-baseline gap-1.5" },
                  h(
                    "span",
                    {
                      className:
                        "text-4xl font-semibold tracking-tight tabular-nums",
                    },
                    String(plan.price)
                  ),
                  String(plan.period).trim()
                    ? h(
                        "span",
                        { className: "text-sm text-muted-foreground" },
                        String(plan.period)
                      )
                    : null
                ),
                h(
                  "p",
                  { className: "text-sm/6 text-pretty text-muted-foreground" },
                  String(plan.description)
                )
              ),
              linkButton(String(plan.cta), String(plan.href), {
                variant: flag(plan, "featured") ? undefined : "outline",
                className: "w-full",
              }),
              checkList(String(plan.features))
            )
          )
        )
      )
    )
  },
}

const pricingSingle: SectionDefinition = {
  id: "pricing-single",
  kind: "pricing",
  variant: "Single plan",
  description: "One price with everything it includes.",
  fields: [
    ...headFields,
    { key: "price", label: "Price", type: "text", max: 20 },
    { key: "period", label: "Period", type: "text", max: 40 },
    { key: "note", label: "Note", type: "text", max: 120 },
    {
      key: "features",
      label: "Features (one per line)",
      type: "textarea",
      max: 600,
    },
    ...actionFields.slice(0, 2),
  ],
  defaults: {
    eyebrow: "Pricing",
    headline: "One plan. Everything included.",
    subhead: "No seats to count and no features held back. Cancel anytime.",
    price: "$49",
    period: "per month",
    note: "14-day free trial, no card required.",
    features:
      "Unlimited data sources\nUnlimited questions\nScheduled reports\nAlerts in Slack and email\nSSO and audit log\nPriority support",
    primaryLabel: "Start your trial",
    primaryHref: "/signup",
  },
  build: (props) =>
    h(
      "section",
      { id: "pricing", className: "px-6 py-16 sm:py-24" },
      h(
        "div",
        {
          className:
            "mx-auto grid max-w-5xl overflow-hidden rounded-2xl border lg:grid-cols-[3fr_2fr]",
        },
        h(
          "div",
          { className: "flex flex-col gap-4 p-8 sm:p-10" },
          eyebrow(text(props, "eyebrow")),
          heading(
            text(props, "headline"),
            "text-3xl font-semibold tracking-tight text-balance"
          ),
          lede(
            text(props, "subhead"),
            "text-base/7 text-pretty text-muted-foreground"
          ),
          h("div", { className: "mt-4" }, checkList(text(props, "features")))
        ),
        h(
          "div",
          {
            className:
              "flex flex-col justify-center gap-6 border-t bg-muted/40 p-8 sm:p-10 lg:border-t-0 lg:border-s",
          },
          h(
            "p",
            { className: "flex items-baseline gap-1.5" },
            h(
              "span",
              {
                className: "text-5xl font-semibold tracking-tight tabular-nums",
              },
              text(props, "price")
            ),
            h(
              "span",
              { className: "text-sm text-muted-foreground" },
              text(props, "period")
            )
          ),
          linkButton(text(props, "primaryLabel"), text(props, "primaryHref"), {
            className: "w-full",
          }),
          text(props, "note").trim()
            ? h(
                "p",
                { className: "text-sm text-muted-foreground" },
                text(props, "note")
              )
            : null
        )
      )
    ),
}

const faqItems = [
  {
    question: "How long does setup take?",
    answer:
      "Most teams connect a data source and ask their first question in under ten minutes.",
  },
  {
    question: "Does Northwind store my data?",
    answer:
      "No. Queries run against your warehouse with read-only credentials, and only results are cached, encrypted, for up to 24 hours.",
  },
  {
    question: "Can I try it before paying?",
    answer:
      "Yes. The Starter plan is free forever, and the Team plan has a 14-day trial with no card required.",
  },
  {
    question: "What happens if I cancel?",
    answer:
      "You keep access until the end of the billing period, and you can export every dashboard and saved question.",
  },
]

const faqField: ListField = {
  key: "items",
  label: "Questions",
  type: "list",
  itemLabel: "Question",
  titleKey: "question",
  min: 1,
  max: 12,
  item: [
    { key: "question", label: "Question", type: "text", max: 160 },
    { key: "answer", label: "Answer", type: "textarea", max: 600 },
  ],
}

function faqAccordion(items: ReturnType<typeof list>) {
  return h(
    "Accordion",
    { className: "w-full" },
    items.map((item) =>
      h(
        "AccordionItem",
        null,
        h(
          "AccordionTrigger",
          { className: "text-base" },
          String(item.question)
        ),
        h(
          "AccordionContent",
          { className: "text-pretty text-muted-foreground" },
          String(item.answer)
        )
      )
    )
  )
}

const faqCentered: SectionDefinition = {
  id: "faq-centered",
  kind: "faq",
  variant: "Centered",
  description: "A heading over a single accordion.",
  fields: [...headFields, faqField],
  defaults: {
    eyebrow: "FAQ",
    headline: "Questions, answered",
    subhead: "",
    items: faqItems,
  },
  build: (props) =>
    h(
      "section",
      { id: "faq", className: "px-6 py-16 sm:py-24" },
      h(
        "div",
        { className: "mx-auto flex max-w-2xl flex-col gap-12" },
        sectionHead(props),
        faqAccordion(list(props, "items"))
      )
    ),
}

const faqSplit: SectionDefinition = {
  id: "faq-split",
  kind: "faq",
  variant: "Two column",
  description: "Heading and contact link beside the questions.",
  fields: [...headFields, faqField],
  defaults: {
    eyebrow: "FAQ",
    headline: "Frequently asked questions",
    subhead:
      "Can’t find what you’re looking for? Write to support@northwind.dev and a person will reply.",
    items: faqItems,
  },
  build: (props) =>
    h(
      "section",
      { id: "faq", className: "px-6 py-16 sm:py-24" },
      h(
        "div",
        {
          className:
            "mx-auto grid max-w-6xl gap-12 lg:grid-cols-[2fr_3fr] lg:gap-20",
        },
        h(
          "div",
          { className: "flex flex-col gap-4" },
          eyebrow(text(props, "eyebrow")),
          heading(text(props, "headline")),
          lede(
            text(props, "subhead"),
            "text-base/7 text-pretty text-muted-foreground"
          )
        ),
        faqAccordion(list(props, "items"))
      )
    ),
}

const ctaDefaults = {
  headline: "Start answering your own questions today",
  subhead: "Free for individuals. Set up in minutes, with no credit card.",
  primaryLabel: "Get started",
  primaryHref: "/signup",
  secondaryLabel: "Talk to sales",
  secondaryHref: "/contact",
}

const ctaFields = [
  { key: "headline", label: "Headline", type: "textarea", max: 140 },
  { key: "subhead", label: "Subhead", type: "textarea", max: 320 },
  ...actionFields,
] satisfies SectionDefinition["fields"]

const ctaPanel: SectionDefinition = {
  id: "cta-panel",
  kind: "cta",
  variant: "Panel",
  description: "A centered call to action on a muted panel.",
  fields: ctaFields,
  defaults: ctaDefaults,
  build: (props) =>
    h(
      "section",
      { className: "px-6 py-16 sm:py-24" },
      h(
        "div",
        {
          className:
            "mx-auto flex max-w-6xl flex-col items-center gap-6 rounded-3xl border bg-muted/40 px-6 py-16 text-center sm:py-24",
        },
        heading(
          text(props, "headline"),
          "max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl"
        ),
        lede(
          text(props, "subhead"),
          "max-w-xl text-lg/8 text-pretty text-muted-foreground"
        ),
        actions(props, "mt-2 flex flex-wrap items-center justify-center gap-3")
      )
    ),
}

const ctaInline: SectionDefinition = {
  id: "cta-inline",
  kind: "cta",
  variant: "Inline",
  description: "Text and actions on one line, between hairlines.",
  fields: ctaFields,
  defaults: ctaDefaults,
  build: (props) =>
    h(
      "section",
      { className: "px-6 py-16 sm:py-20" },
      h(
        "div",
        {
          className:
            "mx-auto flex max-w-6xl flex-col gap-8 border-y py-12 md:flex-row md:items-center md:justify-between",
        },
        h(
          "div",
          { className: "flex max-w-xl flex-col gap-3" },
          heading(
            text(props, "headline"),
            "text-2xl font-semibold tracking-tight text-balance sm:text-3xl"
          ),
          lede(
            text(props, "subhead"),
            "text-base/7 text-pretty text-muted-foreground"
          )
        ),
        actions(props, "flex shrink-0 flex-wrap items-center gap-3")
      )
    ),
}

const footerColumns = [
  { title: "Product", links: "Features\nPricing\nChangelog\nDocs" },
  { title: "Company", links: "About\nCustomers\nCareers\nContact" },
  { title: "Legal", links: "Privacy\nTerms\nSecurity" },
]

function slugLink(label: string) {
  return `/${label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`
}

const footerColumnsSection: SectionDefinition = {
  id: "footer-columns",
  kind: "footer",
  variant: "Columns",
  description: "Brand, tagline and link columns.",
  fields: [
    ...brandFields,
    { key: "tagline", label: "Tagline", type: "textarea", max: 200 },
    {
      key: "columns",
      label: "Columns",
      type: "list",
      itemLabel: "Column",
      titleKey: "title",
      min: 0,
      max: 4,
      item: [
        { key: "title", label: "Title", type: "text", max: 40 },
        {
          key: "links",
          label: "Links (one per line)",
          type: "textarea",
          max: 400,
        },
      ],
    },
    { key: "copyright", label: "Copyright", type: "text", max: 120 },
  ],
  defaults: {
    ...brandDefaults,
    tagline: "The analytics workspace your whole team can read.",
    columns: footerColumns,
    copyright: "© 2026 Northwind, Inc. All rights reserved.",
  },
  build: (props) =>
    h(
      "footer",
      { className: "border-t px-6 pt-16 pb-10" },
      h(
        "div",
        { className: "mx-auto flex max-w-6xl flex-col gap-16" },
        h(
          "div",
          { className: "grid gap-12 lg:grid-cols-[2fr_3fr]" },
          h(
            "div",
            { className: "flex flex-col items-start gap-4" },
            brand(props),
            lede(
              text(props, "tagline"),
              "max-w-xs text-sm/6 text-pretty text-muted-foreground"
            )
          ),
          h(
            "div",
            { className: "grid grid-cols-2 gap-8 sm:grid-cols-3" },
            list(props, "columns").map((column) =>
              h(
                "div",
                { className: "flex flex-col gap-3" },
                h(
                  "h3",
                  { className: "text-sm font-medium" },
                  String(column.title)
                ),
                h(
                  "ul",
                  { className: "flex flex-col gap-2.5" },
                  lines(String(column.links)).map((label) =>
                    h(
                      "li",
                      null,
                      h(
                        "a",
                        {
                          href: slugLink(label),
                          className:
                            "text-sm text-muted-foreground transition-colors hover:text-foreground",
                        },
                        label
                      )
                    )
                  )
                )
              )
            )
          )
        ),
        h(
          "p",
          { className: "border-t pt-8 text-sm text-muted-foreground" },
          text(props, "copyright")
        )
      )
    ),
}

const footerSimple: SectionDefinition = {
  id: "footer-simple",
  kind: "footer",
  variant: "Simple",
  description: "Brand, a few links and the copyright on one row.",
  fields: [
    ...brandFields,
    {
      key: "links",
      label: "Links",
      type: "list",
      itemLabel: "Link",
      titleKey: "label",
      min: 0,
      max: 6,
      item: [
        { key: "label", label: "Label", type: "text", max: 30 },
        { key: "href", label: "Link", type: "url" },
      ],
    },
    { key: "copyright", label: "Copyright", type: "text", max: 120 },
  ],
  defaults: {
    ...brandDefaults,
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Contact", href: "/contact" },
    ],
    copyright: "© 2026 Northwind, Inc.",
  },
  build: (props) =>
    h(
      "footer",
      { className: "border-t px-6 py-10" },
      h(
        "div",
        {
          className:
            "mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between",
        },
        brand(props),
        h(
          "nav",
          {
            "aria-label": "Footer",
            className: "flex flex-wrap gap-x-6 gap-y-2",
          },
          list(props, "links").map((link) =>
            h(
              "a",
              {
                href: href(String(link.href)),
                className:
                  "text-sm text-muted-foreground transition-colors hover:text-foreground",
              },
              String(link.label)
            )
          )
        ),
        h(
          "p",
          { className: "text-sm text-muted-foreground" },
          text(props, "copyright")
        )
      )
    ),
}

export {
  ctaInline,
  ctaPanel,
  faqCentered,
  faqSplit,
  footerColumnsSection as footerColumns,
  footerSimple,
  pricingSingle,
  pricingTiers,
}
