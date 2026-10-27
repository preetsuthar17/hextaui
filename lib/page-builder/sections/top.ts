import type {
  ListField,
  ListItem,
  ScalarField,
} from "@/lib/page-builder/fields"
import { h } from "@/lib/page-builder/node"
import {
  actionFields,
  actions,
  brand,
  brandDefaults,
  brandFields,
  eyebrow,
  href,
  icon,
  iconOptions,
  imageFields,
  lede,
  linkButton,
  list,
  media,
  text,
  type SectionDefinition,
} from "@/lib/page-builder/sections/shared"

const navLinks = [
  { label: "Product", href: "#features" },
  { label: "Customers", href: "#testimonials" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
]

const navLinkField: ListField = {
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
}

const navbarSimple: SectionDefinition = {
  id: "navbar-simple",
  kind: "navbar",
  variant: "Simple",
  description: "Logo, centered links and two actions.",
  fields: [
    ...brandFields,
    navLinkField,
    { key: "signInLabel", label: "Sign in label", type: "text", max: 30 },
    { key: "signInHref", label: "Sign in link", type: "url" },
    { key: "ctaLabel", label: "Button", type: "text", max: 30 },
    { key: "ctaHref", label: "Button link", type: "url" },
  ],
  defaults: {
    ...brandDefaults,
    links: navLinks,
    signInLabel: "Sign in",
    signInHref: "/login",
    ctaLabel: "Get started",
    ctaHref: "/signup",
  },
  build: (props) =>
    h(
      "header",
      { className: "border-b" },
      h(
        "div",
        {
          className:
            "mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto] items-center gap-6 px-6 md:grid-cols-[1fr_auto_1fr]",
        },
        brand(props),
        h(
          "nav",
          {
            "aria-label": "Main",
            className: "hidden items-center gap-1 md:flex",
          },
          list(props, "links").map((link) =>
            h(
              "a",
              {
                href: href(String(link.href)),
                className:
                  "rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
              },
              String(link.label)
            )
          )
        ),
        h(
          "div",
          { className: "flex items-center justify-end gap-2" },
          linkButton(text(props, "signInLabel"), text(props, "signInHref"), {
            variant: "ghost",
            size: "sm",
            className: "hidden sm:inline-flex",
          }),
          linkButton(text(props, "ctaLabel"), text(props, "ctaHref"), {
            size: "sm",
          })
        )
      )
    ),
}

const navbarFloating: SectionDefinition = {
  id: "navbar-floating",
  kind: "navbar",
  variant: "Floating",
  description: "A rounded bar that sits inside the page margin.",
  fields: [
    ...brandFields,
    navLinkField,
    { key: "ctaLabel", label: "Button", type: "text", max: 30 },
    { key: "ctaHref", label: "Button link", type: "url" },
  ],
  defaults: {
    ...brandDefaults,
    links: navLinks.slice(0, 3),
    ctaLabel: "Book a demo",
    ctaHref: "/demo",
  },
  build: (props) =>
    h(
      "header",
      { className: "px-4 pt-4 sm:px-6" },
      h(
        "div",
        {
          className:
            "mx-auto flex h-14 max-w-5xl items-center justify-between gap-6 rounded-full border bg-background/80 ps-5 pe-2 backdrop-blur",
        },
        brand(props),
        h(
          "nav",
          {
            "aria-label": "Main",
            className: "hidden items-center gap-6 md:flex",
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
        linkButton(text(props, "ctaLabel"), text(props, "ctaHref"), {
          size: "sm",
          className: "rounded-full",
        })
      )
    ),
}

const heroDefaults = {
  badge: "New: reports that write themselves",
  headline: "The analytics workspace your whole team can read",
  subhead:
    "Northwind turns raw events into clear, shareable answers. Ask a question in plain words and get a chart, a summary and the query behind it.",
  primaryLabel: "Start for free",
  primaryHref: "/signup",
  secondaryLabel: "See how it works",
  secondaryHref: "#features",
  imageUrl: "",
  imageAlt: "",
}

const heroFields: ScalarField[] = [
  { key: "badge", label: "Badge", type: "text", max: 60 },
  { key: "headline", label: "Headline", type: "textarea", max: 140 },
  { key: "subhead", label: "Subhead", type: "textarea", max: 320 },
  ...actionFields,
]

function heroBadge(value: string) {
  return value.trim()
    ? h(
        "Badge",
        {
          appearance: "outline",
          shape: "pill",
          size: "lg",
          className: "gap-2 text-muted-foreground",
        },
        h("span", {
          className: "size-1.5 rounded-full bg-primary",
          "aria-hidden": "true",
        }),
        value
      )
    : null
}

const heroCentered: SectionDefinition = {
  id: "hero-centered",
  kind: "hero",
  variant: "Centered",
  description: "Badge, large headline, two actions and a product shot.",
  fields: [...heroFields, ...imageFields],
  defaults: heroDefaults,
  build: (props) =>
    h(
      "section",
      { className: "px-6 pt-20 pb-16 sm:pt-28 sm:pb-24" },
      h(
        "div",
        {
          className:
            "mx-auto flex max-w-3xl flex-col items-center gap-6 text-center",
        },
        heroBadge(text(props, "badge")),
        h(
          "h1",
          {
            className:
              "text-4xl font-semibold tracking-tight text-balance sm:text-6xl sm:leading-[1.05]",
          },
          text(props, "headline")
        ),
        lede(
          text(props, "subhead"),
          "max-w-2xl text-lg/8 text-pretty text-muted-foreground"
        ),
        actions(props, "mt-2 flex flex-wrap items-center justify-center gap-3")
      ),
      h(
        "div",
        { className: "mx-auto mt-16 max-w-5xl sm:mt-20" },
        media(props, "aspect-16/10")
      )
    ),
}

const heroSplit: SectionDefinition = {
  id: "hero-split",
  kind: "hero",
  variant: "Split",
  description: "Copy on the left, product shot on the right.",
  fields: [...heroFields, ...imageFields],
  defaults: {
    ...heroDefaults,
    badge: "",
    headline: "Answers from your data in seconds, not sprints",
  },
  build: (props) =>
    h(
      "section",
      { className: "px-6 py-16 sm:py-24" },
      h(
        "div",
        {
          className:
            "mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16",
        },
        h(
          "div",
          { className: "flex flex-col items-start gap-6" },
          heroBadge(text(props, "badge")),
          h(
            "h1",
            {
              className:
                "text-4xl font-semibold tracking-tight text-balance sm:text-5xl sm:leading-[1.08]",
            },
            text(props, "headline")
          ),
          lede(
            text(props, "subhead"),
            "max-w-xl text-lg/8 text-pretty text-muted-foreground"
          ),
          actions(props, "mt-2 flex flex-wrap items-center gap-3")
        ),
        media(props, "aspect-4/3")
      )
    ),
}

const heroMinimal: SectionDefinition = {
  id: "hero-minimal",
  kind: "hero",
  variant: "Minimal",
  description: "Oversized type, left aligned, no image.",
  fields: [
    { key: "eyebrow", label: "Eyebrow", type: "text", max: 60 },
    ...heroFields.filter((field) => field.key !== "badge"),
  ],
  defaults: {
    eyebrow: "Northwind for teams",
    headline: "Know what changed, why it changed, and what to do next.",
    subhead: heroDefaults.subhead,
    primaryLabel: heroDefaults.primaryLabel,
    primaryHref: heroDefaults.primaryHref,
    secondaryLabel: "Talk to sales",
    secondaryHref: "/contact",
  },
  build: (props) =>
    h(
      "section",
      { className: "px-6 pt-24 pb-20 sm:pt-36 sm:pb-28" },
      h(
        "div",
        { className: "mx-auto flex max-w-6xl flex-col items-start gap-8" },
        eyebrow(text(props, "eyebrow")),
        h(
          "h1",
          {
            className:
              "max-w-4xl text-5xl font-semibold tracking-tighter text-balance sm:text-7xl sm:leading-[1.02]",
          },
          text(props, "headline")
        ),
        h(
          "div",
          {
            className:
              "flex w-full flex-col gap-8 border-t pt-8 md:flex-row md:items-end md:justify-between",
          },
          lede(
            text(props, "subhead"),
            "max-w-xl text-lg/8 text-pretty text-muted-foreground"
          ),
          actions(props, "flex shrink-0 flex-wrap items-center gap-3")
        )
      )
    ),
}

const logoItems = [
  { name: "Acme", icon: "IconTriangle" },
  { name: "Polaris", icon: "IconCircleDot" },
  { name: "Lumen", icon: "IconSparkles" },
  { name: "Quanta", icon: "IconAtom" },
  { name: "Evergreen", icon: "IconLeaf" },
  { name: "Loop", icon: "IconInfinity" },
]

const logoField: ListField = {
  key: "logos",
  label: "Logos",
  type: "list",
  itemLabel: "Logo",
  titleKey: "name",
  min: 1,
  max: 8,
  item: [
    { key: "name", label: "Name", type: "text", max: 30 },
    { key: "icon", label: "Icon", type: "select", options: iconOptions },
  ],
}

function wordmark(item: ListItem) {
  return h(
    "span",
    {
      className: "flex items-center gap-2 text-lg font-semibold tracking-tight",
    },
    icon(String(item.icon), "size-5"),
    String(item.name)
  )
}

const logosRow: SectionDefinition = {
  id: "logos-row",
  kind: "logos",
  variant: "Row",
  description: "A quiet line of customer wordmarks.",
  fields: [
    { key: "headline", label: "Caption", type: "text", max: 80 },
    logoField,
  ],
  defaults: {
    headline: "Trusted by data teams at fast-growing companies",
    logos: logoItems,
  },
  build: (props) =>
    h(
      "section",
      { className: "px-6 py-12 sm:py-16" },
      h(
        "div",
        { className: "mx-auto flex max-w-6xl flex-col items-center gap-8" },
        h(
          "p",
          { className: "text-sm text-muted-foreground" },
          text(props, "headline")
        ),
        h(
          "ul",
          {
            className:
              "flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-muted-foreground",
          },
          list(props, "logos").map((item) => h("li", null, wordmark(item)))
        )
      )
    ),
}

const logosGrid: SectionDefinition = {
  id: "logos-grid",
  kind: "logos",
  variant: "Grid",
  description: "Wordmarks in a hairline grid.",
  fields: [
    { key: "headline", label: "Caption", type: "text", max: 80 },
    logoField,
  ],
  defaults: {
    headline: "Powering reporting at 4,000+ companies",
    logos: logoItems,
  },
  build: (props) =>
    h(
      "section",
      { className: "px-6 py-16 sm:py-20" },
      h(
        "div",
        { className: "mx-auto flex max-w-6xl flex-col gap-8" },
        h(
          "p",
          { className: "text-center text-sm text-muted-foreground" },
          text(props, "headline")
        ),
        h(
          "ul",
          {
            className:
              "grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-3 lg:grid-cols-6",
          },
          list(props, "logos").map((item) =>
            h(
              "li",
              {
                className:
                  "flex h-24 items-center justify-center bg-background text-muted-foreground",
              },
              wordmark(item)
            )
          )
        )
      )
    ),
}

export {
  heroCentered,
  heroMinimal,
  heroSplit,
  logosGrid,
  logosRow,
  navbarFloating,
  navbarSimple,
}
