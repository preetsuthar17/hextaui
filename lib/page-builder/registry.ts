import { cleanProps, type Props } from "@/lib/page-builder/fields"
import {
  ctaInline,
  ctaPanel,
  faqCentered,
  faqSplit,
  footerColumns,
  footerSimple,
  pricingSingle,
  pricingTiers,
} from "@/lib/page-builder/sections/bottom"
import {
  featureSplit,
  featuresCards,
  featuresGrid,
  featuresList,
  statsIntro,
  statsRow,
  testimonialSingle,
  testimonialsGrid,
} from "@/lib/page-builder/sections/middle"
import type {
  SectionDefinition,
  SectionKind,
} from "@/lib/page-builder/sections/shared"
import {
  heroCentered,
  heroMinimal,
  heroSplit,
  logosGrid,
  logosRow,
  navbarFloating,
  navbarSimple,
} from "@/lib/page-builder/sections/top"

const sectionKinds: { kind: SectionKind; title: string; component: string }[] =
  [
    { kind: "navbar", title: "Navbar", component: "Navbar" },
    { kind: "hero", title: "Hero", component: "Hero" },
    { kind: "logos", title: "Logos", component: "Logos" },
    { kind: "features", title: "Features", component: "Features" },
    {
      kind: "feature-split",
      title: "Feature split",
      component: "FeatureSplit",
    },
    { kind: "stats", title: "Stats", component: "Stats" },
    { kind: "testimonials", title: "Testimonials", component: "Testimonials" },
    { kind: "pricing", title: "Pricing", component: "Pricing" },
    { kind: "faq", title: "FAQ", component: "Faq" },
    { kind: "cta", title: "Call to action", component: "CallToAction" },
    { kind: "footer", title: "Footer", component: "Footer" },
  ]

const sections: SectionDefinition[] = [
  navbarSimple,
  navbarFloating,
  heroCentered,
  heroSplit,
  heroMinimal,
  logosRow,
  logosGrid,
  featuresGrid,
  featuresCards,
  featuresList,
  featureSplit,
  statsRow,
  statsIntro,
  testimonialsGrid,
  testimonialSingle,
  pricingTiers,
  pricingSingle,
  faqCentered,
  faqSplit,
  ctaPanel,
  ctaInline,
  footerColumns,
  footerSimple,
]

const sectionById = new Map(sections.map((section) => [section.id, section]))

function getSection(id: string) {
  return sectionById.get(id)
}

function kindInfo(kind: SectionKind) {
  return sectionKinds.find((item) => item.kind === kind) ?? sectionKinds[0]
}

function sectionLabel(section: SectionDefinition) {
  return `${kindInfo(section.kind).title} · ${section.variant}`
}

function sectionProps(id: string, overrides: unknown = {}): Props {
  const section = getSection(id)
  if (!section) return {}
  return cleanProps(section.fields, overrides, section.defaults)
}

const starterSections = [
  "navbar-simple",
  "hero-centered",
  "logos-row",
  "features-grid",
  "feature-split",
  "testimonials-grid",
  "pricing-tiers",
  "faq-centered",
  "cta-panel",
  "footer-columns",
]

export {
  getSection,
  kindInfo,
  sectionKinds,
  sectionLabel,
  sectionProps,
  sections,
  starterSections,
  type SectionDefinition,
  type SectionKind,
}
