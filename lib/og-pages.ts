import type { Metadata } from "next"

import { metadata as about } from "@/app/about/page"
import { metadata as blocks } from "@/app/blocks/page"
import { metadata as changelog } from "@/app/changelog/page"
import { metadata as compareAiElements } from "@/app/compare/ai-elements/page"
import { metadata as compareAssistantUi } from "@/app/compare/assistant-ui/page"
import { metadata as compare } from "@/app/compare/page"
import { metadata as comparePromptKit } from "@/app/compare/prompt-kit/page"
import { metadata as compareChatTemplates } from "@/app/compare/shadcn-ai-chat-templates/page"
import { metadata as compareShadcn } from "@/app/compare/shadcn-ui/page"
import { metadata as components } from "@/app/components/page"
import { metadata as contact } from "@/app/contact/page"
import { metadata as docsApi } from "@/app/docs/api/page"
import { metadata as docsInstallation } from "@/app/docs/installation/page"
import { metadata as docsMcp } from "@/app/docs/mcp/page"
import { metadata as docs } from "@/app/docs/page"
import { metadata as license } from "@/app/legal/license/page"
import { metadata as privacy } from "@/app/legal/privacy/page"
import { metadata as refunds } from "@/app/legal/refunds/page"
import { metadata as terms } from "@/app/legal/terms/page"
import { metadata as pricing } from "@/app/pricing/page"
import { metadata as sponsor } from "@/app/sponsor/page"
import { metadata as pageBuilder } from "@/app/tools/page-builder/page"
import {
  blogDescription,
  blogPosts,
  blogTitle,
  getBlogHref,
} from "@/lib/blog"
import {
  componentCategories,
  getComponentCategoryHref,
} from "@/lib/component-categories"
import { docsComponents, docsEntries, titleCase } from "@/lib/docs"
import { metadataTitle } from "@/lib/metadata"
import { homeOgImage } from "@/lib/og-home"
import type { OgImage } from "@/lib/opengraph-image"
import { categoryTitle, proBlocks } from "@/lib/pro/catalog"
import { getStudies, getStudyHref } from "@/lib/research"
import { researchDescription, researchTitle } from "@/lib/research/markdown"
import { siteName } from "@/lib/site"
import {
  getShadcnComparisonHref,
  getShadcnComparisons,
} from "@/lib/shadcn-compare"

type OgPage = { path: string; image: OgImage }

const heroSection = "AI chat UI for shadcn/ui"

function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`
}

function fromMetadata(
  path: string,
  metadata: Metadata,
  image: Omit<OgImage, "title" | "description"> & Partial<OgImage>
): OgPage {
  return {
    path,
    image: {
      title: metadataTitle(metadata),
      description: String(metadata.description ?? ""),
      ...image,
    },
  }
}

function getOgPages(): OgPage[] {
  const marketing = [
    { path: "/", image: homeOgImage },
    fromMetadata("/pricing", pricing, { variant: "hero", section: "Free & Pro" }),
    fromMetadata("/blocks", blocks, { variant: "hero", section: "HextaUI Pro" }),
    fromMetadata("/about", about, { variant: "hero", section: heroSection }),
    fromMetadata("/contact", contact, { variant: "hero", section: heroSection }),
    fromMetadata("/sponsor", sponsor, { variant: "hero", section: heroSection }),
    fromMetadata("/tools/page-builder", pageBuilder, {
      variant: "hero",
      section: "Free tool",
    }),
  ]

  const blockPages = proBlocks.map((block) => ({
    path: `/blocks/${block.name}`,
    image: {
      variant: "hero" as const,
      section: block.free ? "Free block" : "HextaUI Pro",
      title: `${block.title}.`,
      accent: `${categoryTitle(block.category)} block for shadcn/ui.`,
      description: block.description,
    },
  }))

  const pages = [
    fromMetadata("/docs", docs, { variant: "slab", section: "Docs" }),
    fromMetadata("/docs/installation", docsInstallation, {
      variant: "slab",
      section: "Docs",
    }),
    fromMetadata("/docs/api", docsApi, { variant: "slab", section: "Docs" }),
    fromMetadata("/docs/mcp", docsMcp, { variant: "slab", section: "Docs" }),
    fromMetadata("/components", components, {
      variant: "slab",
      section: "Components",
    }),
    fromMetadata("/compare", compare, { variant: "slab", section: "Compare" }),
    fromMetadata("/compare/ai-elements", compareAiElements, {
      variant: "slab",
      section: "Compare",
    }),
    fromMetadata("/compare/assistant-ui", compareAssistantUi, {
      variant: "slab",
      section: "Compare",
    }),
    fromMetadata("/compare/prompt-kit", comparePromptKit, {
      variant: "slab",
      section: "Compare",
    }),
    fromMetadata("/compare/shadcn-ai-chat-templates", compareChatTemplates, {
      variant: "slab",
      section: "Compare",
    }),
    fromMetadata("/compare/shadcn-ui", compareShadcn, {
      variant: "slab",
      section: "Compare",
    }),
    fromMetadata("/changelog", changelog, {
      variant: "slab",
      section: "Changelog",
    }),
    fromMetadata("/legal/license", license, { variant: "slab", section: "Legal" }),
    fromMetadata("/legal/privacy", privacy, { variant: "slab", section: "Legal" }),
    fromMetadata("/legal/refunds", refunds, { variant: "slab", section: "Legal" }),
    fromMetadata("/legal/terms", terms, { variant: "slab", section: "Legal" }),
  ]

  const docsPages = docsEntries.map((entry) => ({
    path: `/docs/${entry.slug}`,
    image: {
      variant: "slab" as const,
      section: "Docs",
      title: docsComponents.includes(entry) ? titleCase(entry.name) : entry.name,
      description: entry.description,
    },
  }))

  const categoryPages = componentCategories.map((category) => ({
    path: getComponentCategoryHref(category.slug),
    image: {
      variant: "slab" as const,
      section: "Components",
      title: category.name,
      description: category.description,
    },
  }))

  const comparePages = getShadcnComparisons().map((comparison) => {
    const values = comparison.variants.reduce(
      (sum, row) => sum + row.hexta.length,
      0
    )
    const facts = [
      comparison.hextaParts.length > 0
        ? plural(comparison.hextaParts.length, "extra part")
        : null,
      comparison.addedProps.length > 0
        ? plural(comparison.addedProps.length, "extra prop")
        : null,
      values > 0 ? plural(values, "extra variant value") : null,
    ].filter(Boolean)
    return {
      path: getShadcnComparisonHref(comparison.slug),
      image: {
        variant: "slab" as const,
        section: "Compare",
        title: `${titleCase(comparison.name)}: HextaUI vs shadcn/ui`,
        description:
          facts.length > 0
            ? `${facts.join(", ")} in the HextaUI version, read from both sources.`
            : "The HextaUI and shadcn/ui versions side by side, read from both sources.",
      },
    }
  })

  const blogPages = [
    {
      path: "/blog",
      image: {
        variant: "slab" as const,
        section: "Blog",
        title: `The ${siteName} ${blogTitle.toLowerCase()}`,
        description: blogDescription,
      },
    },
    ...blogPosts.map((post) => ({
      path: getBlogHref(post.slug),
      image: {
        variant: "slab" as const,
        section: "Blog",
        title: post.title,
        description: post.description,
      },
    })),
  ]

  const researchPages = [
    {
      path: "/research",
      image: {
        variant: "slab" as const,
        section: "Research",
        title: researchTitle,
        description: researchDescription,
      },
    },
    ...getStudies().map((study) => ({
      path: getStudyHref(study.slug),
      image: {
        variant: "slab" as const,
        section: "Research",
        title: study.title,
        description: study.summary,
      },
    })),
  ]

  return [
    ...marketing,
    ...blockPages,
    ...pages,
    ...docsPages,
    ...categoryPages,
    ...comparePages,
    ...blogPages,
    ...researchPages,
  ]
}

export { getOgPages, type OgPage }
