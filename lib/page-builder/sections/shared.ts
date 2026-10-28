import {
  isSafeUrl,
  type Field,
  type ListItem,
  type Option,
  type Props,
  type ScalarField,
} from "@/lib/page-builder/fields"
import { h, type Element, type Node } from "@/lib/page-builder/node"

type SectionKind =
  | "navbar"
  | "hero"
  | "logos"
  | "features"
  | "feature-split"
  | "stats"
  | "testimonials"
  | "pricing"
  | "faq"
  | "cta"
  | "footer"

type SectionDefinition = {
  id: string
  kind: SectionKind
  variant: string
  description: string
  fields: Field[]
  defaults: Props
  build: (props: Props) => Element
}

const iconNames = [
  "IconBolt",
  "IconShieldCheck",
  "IconChartBar",
  "IconPlug",
  "IconSparkles",
  "IconLock",
  "IconWorld",
  "IconCode",
  "IconPalette",
  "IconRocket",
  "IconUsers",
  "IconClock",
  "IconCloud",
  "IconDeviceMobile",
  "IconMessage",
  "IconSearch",
  "IconLayersIntersect",
  "IconCircleDot",
  "IconTriangle",
  "IconSquareRounded",
  "IconHexagon",
  "IconInfinity",
  "IconLeaf",
  "IconAtom",
] as const

type IconName = (typeof iconNames)[number]

const iconOptions: Option[] = iconNames.map((name) => ({
  value: name,
  label: name.replace(/^Icon/, "").replace(/([a-z])([A-Z])/g, "$1 $2"),
}))

function text(props: Props | ListItem, key: string) {
  const value = props[key]
  return typeof value === "string" ? value : ""
}

function flag(props: Props | ListItem, key: string) {
  return props[key] === true
}

function list(props: Props, key: string) {
  const value = props[key]
  return Array.isArray(value) ? value : []
}

function href(value: string) {
  const trimmed = value.trim()
  return trimmed && isSafeUrl(trimmed) ? trimmed : "#"
}

function icon(name: string, className = "size-4") {
  const safe = (iconNames as readonly string[]).includes(name)
    ? name
    : "IconCircleDot"
  return h(safe, { className, "aria-hidden": "true" })
}

function lines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
}

function linkButton(
  label: string,
  url: string,
  options: {
    variant?: string
    size?: string
    className?: string
    arrow?: boolean
  } = {}
): Node {
  if (!label.trim()) return null
  return h(
    "Button",
    {
      nativeButton: false,
      render: h("a", { href: href(url) }),
      size: options.size ?? "lg",
      variant: options.variant,
      className: options.className,
    },
    label,
    options.arrow
      ? h("IconArrowRight", {
          "data-icon": "inline-end",
          "aria-hidden": "true",
        })
      : null
  )
}

function actions(
  props: Props,
  className = "flex flex-wrap items-center gap-3"
) {
  const primary = linkButton(
    text(props, "primaryLabel"),
    text(props, "primaryHref"),
    {
      arrow: true,
    }
  )
  const secondary = linkButton(
    text(props, "secondaryLabel"),
    text(props, "secondaryHref"),
    {
      variant: "ghost",
    }
  )
  if (!primary && !secondary) return null
  return h("div", { className }, primary, secondary)
}

function brand(props: Props) {
  return h(
    "a",
    {
      href: "/",
      className:
        "flex items-center gap-2 text-base font-semibold tracking-tight",
    },
    h(
      "span",
      {
        className:
          "flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground",
      },
      icon(text(props, "logoIcon"), "size-4")
    ),
    text(props, "brand")
  )
}

function eyebrow(
  value: string,
  className = "text-sm font-medium text-muted-foreground"
) {
  return value.trim() ? h("p", { className }, value) : null
}

function heading(
  value: string,
  className = "text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
) {
  return h("h2", { className }, value)
}

function lede(
  value: string,
  className = "text-base/7 text-pretty text-muted-foreground sm:text-lg/8"
) {
  return value.trim() ? h("p", { className }, value) : null
}

function sectionHead(props: Props, align: "center" | "start" = "center") {
  const centered = align === "center"
  return h(
    "div",
    {
      className: centered
        ? "mx-auto flex max-w-2xl flex-col items-center gap-4 text-center"
        : "flex max-w-2xl flex-col gap-4",
    },
    eyebrow(text(props, "eyebrow")),
    heading(text(props, "headline")),
    lede(text(props, "subhead"))
  )
}

const mockNav = [
  { label: "Overview", icon: "IconChartBar", active: true },
  { label: "Questions", icon: "IconMessage", active: false },
  { label: "Dashboards", icon: "IconLayersIntersect", active: false },
  { label: "Alerts", icon: "IconClock", active: false },
  { label: "Sources", icon: "IconPlug", active: false },
]

const mockStats = [
  { label: "Weekly active", value: "12,480", change: "+8.2%" },
  { label: "Activation", value: "64%", change: "+3.1%" },
  { label: "Churn", value: "1.9%", change: "−0.4%" },
]

const mockBars = [
  ["Jan", "h-[38%]"],
  ["Feb", "h-[46%]"],
  ["Mar", "h-[42%]"],
  ["Apr", "h-[55%]"],
  ["May", "h-[61%]"],
  ["Jun", "h-[58%]"],
  ["Jul", "h-[70%]"],
  ["Aug", "h-[76%]"],
  ["Sep", "h-[84%]"],
] as const

function productMock(className: string) {
  return h(
    "div",
    {
      className: `${className} overflow-hidden rounded-2xl border bg-muted/40 p-1.5 sm:p-2`,
      "aria-hidden": "true",
    },
    h(
      "div",
      {
        className:
          "flex size-full overflow-hidden rounded-xl border bg-background text-start",
      },
      h(
        "div",
        {
          className:
            "hidden w-44 shrink-0 flex-col gap-0.5 border-e bg-muted/30 p-3 md:flex",
        },
        h(
          "p",
          { className: "px-2 pb-3 text-xs font-medium text-muted-foreground" },
          "Workspace"
        ),
        mockNav.map((item) =>
          h(
            "span",
            {
              className: item.active
                ? "flex items-center gap-2 rounded-md bg-background px-2 py-1.5 text-xs font-medium ring-1 ring-border"
                : "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground",
            },
            icon(item.icon, "size-3.5"),
            item.label
          )
        )
      ),
      h(
        "div",
        { className: "flex min-w-0 flex-1 flex-col gap-4 p-4 sm:p-5" },
        h(
          "div",
          { className: "flex items-center justify-between gap-3" },
          h(
            "div",
            { className: "flex flex-col" },
            h("p", { className: "text-sm font-semibold" }, "Overview"),
            h(
              "p",
              { className: "text-xs text-muted-foreground" },
              "Last 30 days"
            )
          ),
          h(
            "Badge",
            { appearance: "outline", className: "gap-1.5" },
            h("span", {
              className: "size-1.5 rounded-full bg-primary",
              "aria-hidden": "true",
            }),
            "Live"
          )
        ),
        h(
          "div",
          { className: "grid grid-cols-3 gap-2 sm:gap-3" },
          mockStats.map((stat) =>
            h(
              "div",
              { className: "flex flex-col gap-1 rounded-lg border p-2.5 sm:p-3" },
              h(
                "span",
                { className: "truncate text-xs text-muted-foreground" },
                stat.label
              ),
              h(
                "span",
                {
                  className:
                    "text-base font-semibold tracking-tight tabular-nums sm:text-lg",
                },
                stat.value
              ),
              h(
                "span",
                { className: "text-xs text-muted-foreground tabular-nums" },
                stat.change
              )
            )
          )
        ),
        h(
          "div",
          {
            className:
              "flex min-h-0 flex-1 flex-col gap-2 rounded-lg border p-3 sm:p-4",
          },
          h(
            "p",
            { className: "text-xs font-medium text-muted-foreground" },
            "Weekly active users"
          ),
          h(
            "div",
            { className: "flex min-h-0 flex-1 items-end gap-1.5 sm:gap-2" },
            mockBars.map(([month, height], index) =>
              h(
                "div",
                {
                  className:
                    "flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5",
                },
                h("div", {
                  className: `${height} w-full rounded-sm ${index === mockBars.length - 1 ? "bg-primary" : "bg-primary/20"}`,
                }),
                h(
                  "span",
                  { className: "text-[10px] text-muted-foreground" },
                  month
                )
              )
            )
          )
        )
      )
    )
  )
}

function media(props: Props, className: string) {
  const src = text(props, "imageUrl").trim()
  if (src && isSafeUrl(src)) {
    return h(
      "div",
      { className: `${className} overflow-hidden rounded-2xl border bg-muted` },
      h("img", {
        src,
        alt: text(props, "imageAlt"),
        className: "size-full object-cover",
      })
    )
  }
  return productMock(className)
}

const actionFields: ScalarField[] = [
  { key: "primaryLabel", label: "Primary button", type: "text", max: 40 },
  { key: "primaryHref", label: "Primary link", type: "url" },
  { key: "secondaryLabel", label: "Secondary button", type: "text", max: 40 },
  { key: "secondaryHref", label: "Secondary link", type: "url" },
]

const headFields: ScalarField[] = [
  { key: "eyebrow", label: "Eyebrow", type: "text", max: 60 },
  { key: "headline", label: "Headline", type: "textarea", max: 140 },
  { key: "subhead", label: "Subhead", type: "textarea", max: 320 },
]

const imageFields: ScalarField[] = [
  {
    key: "imageUrl",
    label: "Image URL",
    type: "url",
    placeholder: "https://…",
  },
  { key: "imageAlt", label: "Image alt text", type: "text" },
]

const brandFields: ScalarField[] = [
  { key: "brand", label: "Brand name", type: "text", max: 40 },
  { key: "logoIcon", label: "Logo icon", type: "select", options: iconOptions },
]

const brandDefaults = { brand: "Northwind", logoIcon: "IconTriangle" }

export {
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
  icon,
  iconNames,
  iconOptions,
  imageFields,
  lede,
  linkButton,
  lines,
  list,
  media,
  sectionHead,
  text,
  type IconName,
  type SectionDefinition,
  type SectionKind,
}
