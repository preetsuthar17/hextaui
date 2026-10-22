import type { Metadata } from "next"

import { DocsParagraph } from "@/components/docs/docs-content"
import { CompareLinkGrid, CompareLinks } from "@/components/site/compare"
import { InfoPage, InfoSection } from "@/components/site/info-page"
import { JsonLd } from "@/components/site/json-ld"
import { comparisons } from "@/lib/compare"
import { pageMetadata } from "@/lib/metadata"
import {
  getShadcnComparisonHref,
  getShadcnComparisons,
} from "@/lib/shadcn-compare"
import { pageJsonLd } from "@/lib/structured-data"

const title = "HextaUI compared with shadcn/ui, AI Elements and more"

const description =
  "How HextaUI compares with shadcn/ui, AI Elements, assistant-ui, prompt-kit and shadcn AI chat templates, plus shadcn/ui comparisons component by component."

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/compare",
})

export default function Page() {
  const components = getShadcnComparisons()

  return (
    <InfoPage
      eyebrow="Compare"
      title="Comparisons"
      lead="Honest comparisons between HextaUI and the libraries people weigh it against, with when each one is the better choice. Facts were checked against each project’s source and docs on the date each page states."
    >
      <JsonLd
        data={pageJsonLd({
          path: "/compare",
          name: title,
          description,
          breadcrumbs: [{ name: "Compare", path: "/compare" }],
          type: "CollectionPage",
          items: [
            ...comparisons.map((page) => ({
              name: page.title,
              path: page.href,
            })),
            ...components.map((item) => ({
              name: item.name,
              path: getShadcnComparisonHref(item.slug),
            })),
          ],
        })}
      />
      <InfoSection title="Libraries">
        <CompareLinks items={comparisons} />
      </InfoSection>
      <InfoSection title="Component by component">
        <DocsParagraph>
          Each page puts one HextaUI component next to its shadcn/ui version:
          the parts, variants and props that differ, read from both sources, and
          the command to switch.
        </DocsParagraph>
        <CompareLinkGrid
          items={components.map((item) => ({
            href: getShadcnComparisonHref(item.slug),
            title: item.name,
          }))}
        />
      </InfoSection>
    </InfoPage>
  )
}
