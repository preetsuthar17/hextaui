import type { ListField, ListItem } from "@/lib/page-builder/fields"
import { h } from "@/lib/page-builder/node"
import {
  eyebrow,
  flag,
  headFields,
  heading,
  icon,
  iconOptions,
  imageFields,
  lede,
  list,
  media,
  sectionHead,
  text,
  type SectionDefinition,
} from "@/lib/page-builder/sections/shared"

const featureItems = [
  {
    icon: "IconBolt",
    title: "Instant answers",
    description:
      "Ask in plain words. Get a chart, a short summary and the SQL that produced it.",
  },
  {
    icon: "IconChartBar",
    title: "Dashboards that stay fresh",
    description:
      "Every tile re-runs on a schedule you choose, so the numbers in the meeting are today’s.",
  },
  {
    icon: "IconPlug",
    title: "Connects in minutes",
    description:
      "Postgres, BigQuery, Snowflake and 40 more sources, with read-only access by default.",
  },
  {
    icon: "IconUsers",
    title: "Built for sharing",
    description:
      "Comment on a chart, mention a teammate and keep the decision next to the data.",
  },
  {
    icon: "IconShieldCheck",
    title: "Secure by design",
    description:
      "SSO, row-level permissions and an audit log for every query anyone runs.",
  },
  {
    icon: "IconClock",
    title: "Alerts that matter",
    description:
      "Get a message when a metric moves outside its normal range, with the likely cause.",
  },
]

const featureField: ListField = {
  key: "items",
  label: "Features",
  type: "list",
  itemLabel: "Feature",
  titleKey: "title",
  min: 1,
  max: 9,
  item: [
    { key: "icon", label: "Icon", type: "select", options: iconOptions },
    { key: "title", label: "Title", type: "text", max: 60 },
    { key: "description", label: "Description", type: "textarea", max: 240 },
  ],
}

const featureHeadDefaults = {
  eyebrow: "Features",
  headline: "Everything you need to understand your product",
  subhead:
    "One place to ask questions, track metrics and share what you find, without waiting on a data team.",
}

function featureIcon(item: ListItem, className: string) {
  return h("div", { className }, icon(String(item.icon), "size-5"))
}

const featuresGrid: SectionDefinition = {
  id: "features-grid",
  kind: "features",
  variant: "Grid",
  description: "Icon, title and text in three columns.",
  fields: [...headFields, featureField],
  defaults: { ...featureHeadDefaults, items: featureItems },
  build: (props) =>
    h(
      "section",
      { id: "features", className: "px-6 py-16 sm:py-24" },
      h(
        "div",
        { className: "mx-auto flex max-w-6xl flex-col gap-14 sm:gap-16" },
        sectionHead(props),
        h(
          "div",
          { className: "grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3" },
          list(props, "items").map((item) =>
            h(
              "div",
              { className: "flex flex-col gap-3" },
              featureIcon(
                item,
                "flex size-10 items-center justify-center rounded-lg border bg-muted/40 text-foreground"
              ),
              h(
                "h3",
                { className: "mt-2 text-base font-semibold" },
                String(item.title)
              ),
              h(
                "p",
                { className: "text-sm/6 text-pretty text-muted-foreground" },
                String(item.description)
              )
            )
          )
        )
      )
    ),
}

const featuresCards: SectionDefinition = {
  id: "features-cards",
  kind: "features",
  variant: "Cards",
  description: "Features in a bordered grid of cells.",
  fields: [...headFields, featureField],
  defaults: {
    ...featureHeadDefaults,
    eyebrow: "Why Northwind",
    items: featureItems,
  },
  build: (props) =>
    h(
      "section",
      { id: "features", className: "px-6 py-16 sm:py-24" },
      h(
        "div",
        { className: "mx-auto flex max-w-6xl flex-col gap-14 sm:gap-16" },
        sectionHead(props, "start"),
        h(
          "div",
          {
            className:
              "grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-3",
          },
          list(props, "items").map((item) =>
            h(
              "div",
              { className: "flex flex-col gap-2 bg-background p-8" },
              featureIcon(item, "mb-6 text-muted-foreground"),
              h(
                "h3",
                { className: "text-base font-semibold" },
                String(item.title)
              ),
              h(
                "p",
                { className: "text-sm/6 text-pretty text-muted-foreground" },
                String(item.description)
              )
            )
          )
        )
      )
    ),
}

const featuresList: SectionDefinition = {
  id: "features-list",
  kind: "features",
  variant: "List",
  description: "Heading on the left, a feature list on the right.",
  fields: [...headFields, featureField],
  defaults: { ...featureHeadDefaults, items: featureItems.slice(0, 4) },
  build: (props) =>
    h(
      "section",
      { id: "features", className: "px-6 py-16 sm:py-24" },
      h(
        "div",
        {
          className:
            "mx-auto grid max-w-6xl gap-12 lg:grid-cols-[2fr_3fr] lg:gap-20",
        },
        h(
          "div",
          {
            className: "flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start",
          },
          eyebrow(text(props, "eyebrow")),
          heading(text(props, "headline")),
          lede(text(props, "subhead"))
        ),
        h(
          "dl",
          { className: "flex flex-col divide-y border-y" },
          list(props, "items").map((item) =>
            h(
              "div",
              {
                className: "grid gap-2 py-6 sm:grid-cols-[auto_1fr] sm:gap-x-5",
              },
              h(
                "dt",
                {
                  className:
                    "flex items-center gap-3 text-base font-semibold sm:contents",
                },
                featureIcon(
                  item,
                  "text-muted-foreground sm:row-span-2 sm:mt-0.5"
                ),
                h("span", null, String(item.title))
              ),
              h(
                "dd",
                {
                  className:
                    "text-sm/6 text-pretty text-muted-foreground sm:col-start-2",
                },
                String(item.description)
              )
            )
          )
        )
      )
    ),
}

const splitPoints =
  "Ask questions in plain words\nShare live charts in Slack and docs\nSee the query behind every answer"

const featureSplit: SectionDefinition = {
  id: "feature-split",
  kind: "feature-split",
  variant: "Image and text",
  description: "A feature with a check list beside an image.",
  fields: [
    ...headFields,
    {
      key: "points",
      label: "Points (one per line)",
      type: "textarea",
      max: 600,
    },
    { key: "reverse", label: "Image on the left", type: "toggle" },
    ...imageFields,
  ],
  defaults: {
    eyebrow: "Ask anything",
    headline: "From question to chart in one sentence",
    subhead:
      "Type what you want to know. Northwind picks the right tables, writes the query and draws the chart, and you can check every step.",
    points: splitPoints,
    reverse: false,
    imageUrl: "",
    imageAlt: "",
  },
  build: (props) =>
    h(
      "section",
      { className: "px-6 py-16 sm:py-24" },
      h(
        "div",
        {
          className:
            "mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20",
        },
        h(
          "div",
          {
            className: flag(props, "reverse")
              ? "flex flex-col gap-4 lg:order-last"
              : "flex flex-col gap-4",
          },
          eyebrow(text(props, "eyebrow")),
          heading(text(props, "headline")),
          lede(text(props, "subhead")),
          h(
            "ul",
            { className: "mt-4 flex flex-col gap-3 text-sm" },
            text(props, "points")
              .split("\n")
              .map((point) => point.trim())
              .filter(Boolean)
              .map((point) =>
                h(
                  "li",
                  { className: "flex items-start gap-3" },
                  h("IconCircleCheck", {
                    className: "mt-0.5 size-4 shrink-0 text-muted-foreground",
                    "aria-hidden": "true",
                  }),
                  point
                )
              )
          )
        ),
        media(props, "aspect-4/3")
      )
    ),
}

const statItems = [
  { value: "4,000+", label: "Teams on Northwind" },
  { value: "38M", label: "Questions answered" },
  { value: "2.4s", label: "Median time to chart" },
  { value: "99.99%", label: "Uptime last year" },
]

const statField: ListField = {
  key: "items",
  label: "Stats",
  type: "list",
  itemLabel: "Stat",
  titleKey: "label",
  min: 1,
  max: 6,
  item: [
    { key: "value", label: "Value", type: "text", max: 20 },
    { key: "label", label: "Label", type: "text", max: 60 },
  ],
}

const statsRow: SectionDefinition = {
  id: "stats-row",
  kind: "stats",
  variant: "Row",
  description: "Large numbers split by hairlines.",
  fields: [statField],
  defaults: { items: statItems },
  build: (props) =>
    h(
      "section",
      { className: "px-6 py-16 sm:py-20" },
      h(
        "dl",
        {
          className:
            "mx-auto grid max-w-6xl grid-cols-2 gap-y-10 border-y py-10 lg:grid-cols-4 lg:divide-x",
        },
        list(props, "items").map((item) =>
          h(
            "div",
            { className: "flex flex-col-reverse gap-2 px-6 text-center" },
            h(
              "dt",
              { className: "text-sm text-muted-foreground" },
              String(item.label)
            ),
            h(
              "dd",
              {
                className:
                  "text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl",
              },
              String(item.value)
            )
          )
        )
      )
    ),
}

const statsIntro: SectionDefinition = {
  id: "stats-intro",
  kind: "stats",
  variant: "With intro",
  description: "A short story with numbers in cells.",
  fields: [...headFields, statField],
  defaults: {
    eyebrow: "By the numbers",
    headline: "Teams find answers faster with Northwind",
    subhead: "Measured across every workspace over the last twelve months.",
    items: statItems,
  },
  build: (props) =>
    h(
      "section",
      { className: "px-6 py-16 sm:py-24" },
      h(
        "div",
        {
          className:
            "mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-20",
        },
        sectionHead(props, "start"),
        h(
          "dl",
          {
            className:
              "grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border",
          },
          list(props, "items").map((item) =>
            h(
              "div",
              {
                className:
                  "flex flex-col-reverse gap-1 bg-background p-6 sm:p-8",
              },
              h(
                "dt",
                { className: "text-sm text-muted-foreground" },
                String(item.label)
              ),
              h(
                "dd",
                {
                  className:
                    "text-3xl font-semibold tracking-tight tabular-nums",
                },
                String(item.value)
              )
            )
          )
        )
      )
    ),
}

const quoteItems = [
  {
    quote:
      "We replaced three dashboards and a weekly report with one Northwind workspace. Our Monday meeting is half as long.",
    name: "Maya Chen",
    role: "Head of Growth, Polaris",
  },
  {
    quote:
      "Our support team answers their own data questions now. The analysts finally get to work on the hard problems.",
    name: "Daniel Okafor",
    role: "VP Operations, Lumen",
  },
  {
    quote:
      "Seeing the query behind every chart is what won our engineers over. Nothing is a black box.",
    name: "Sofia Martins",
    role: "CTO, Quanta",
  },
]

const quoteField: ListField = {
  key: "items",
  label: "Testimonials",
  type: "list",
  itemLabel: "Testimonial",
  titleKey: "name",
  min: 1,
  max: 9,
  item: [
    { key: "quote", label: "Quote", type: "textarea", max: 400 },
    { key: "name", label: "Name", type: "text", max: 60 },
    { key: "role", label: "Role", type: "text", max: 80 },
  ],
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("")
}

function person(item: ListItem, align: "start" | "center" = "start") {
  return h(
    "figcaption",
    {
      className:
        align === "center"
          ? "flex items-center justify-center gap-3"
          : "flex items-center gap-3",
    },
    h("Avatar", null, h("AvatarFallback", null, initials(String(item.name)))),
    h(
      "div",
      { className: "flex flex-col text-start" },
      h("span", { className: "text-sm font-medium" }, String(item.name)),
      h(
        "span",
        { className: "text-sm text-muted-foreground" },
        String(item.role)
      )
    )
  )
}

const testimonialsGrid: SectionDefinition = {
  id: "testimonials-grid",
  kind: "testimonials",
  variant: "Grid",
  description: "Quotes in three columns.",
  fields: [...headFields, quoteField],
  defaults: {
    eyebrow: "Customers",
    headline: "Loved by teams who live in their data",
    subhead: "",
    items: quoteItems,
  },
  build: (props) =>
    h(
      "section",
      { id: "testimonials", className: "px-6 py-16 sm:py-24" },
      h(
        "div",
        { className: "mx-auto flex max-w-6xl flex-col gap-14 sm:gap-16" },
        sectionHead(props),
        h(
          "div",
          { className: "grid gap-4 md:grid-cols-3" },
          list(props, "items").map((item) =>
            h(
              "figure",
              {
                className:
                  "flex flex-col justify-between gap-8 rounded-2xl border p-6 sm:p-8",
              },
              h(
                "blockquote",
                { className: "text-base/7 text-pretty" },
                `“${String(item.quote)}”`
              ),
              person(item)
            )
          )
        )
      )
    ),
}

const testimonialSingle: SectionDefinition = {
  id: "testimonial-single",
  kind: "testimonials",
  variant: "Spotlight",
  description: "One large quote, centered.",
  fields: [
    { key: "quote", label: "Quote", type: "textarea", max: 400 },
    { key: "name", label: "Name", type: "text", max: 60 },
    { key: "role", label: "Role", type: "text", max: 80 },
  ],
  defaults: quoteItems[0],
  build: (props) =>
    h(
      "section",
      { id: "testimonials", className: "px-6 py-16 sm:py-24" },
      h(
        "figure",
        {
          className:
            "mx-auto flex max-w-3xl flex-col items-center gap-10 text-center",
        },
        h(
          "blockquote",
          {
            className:
              "text-2xl font-medium tracking-tight text-balance sm:text-3xl sm:leading-snug",
          },
          `“${text(props, "quote")}”`
        ),
        person(
          { name: text(props, "name"), role: text(props, "role") },
          "center"
        )
      )
    ),
}

export {
  featureSplit,
  featuresCards,
  featuresGrid,
  featuresList,
  statsIntro,
  statsRow,
  testimonialSingle,
  testimonialsGrid,
}
