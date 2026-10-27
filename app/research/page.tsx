import type { Metadata } from "next"

import { factLinkClassName } from "@/components/site/fact-list"
import { InfoPage, InfoSection } from "@/components/site/info-page"
import { JsonLd } from "@/components/site/json-ld"
import Link from "@/components/site/link"
import { pageMetadata } from "@/lib/metadata"
import { getStudies, getStudyHref } from "@/lib/research"
import {
  researchDescription,
  researchTitle,
} from "@/lib/research/markdown"
import { formatDate } from "@/lib/research/study"
import { pageJsonLd } from "@/lib/structured-data"

export const metadata: Metadata = pageMetadata({
  title: researchTitle,
  description: researchDescription,
  path: "/research",
  markdown: "/research.md",
})

export default function Page() {
  const studies = getStudies()

  return (
    <InfoPage
      eyebrow="Research"
      title="Research"
      lead="Original statistics computed from data HextaUI collects itself. Every finding states its sample, its denominator and how it was measured, and has a link of its own."
    >
      <JsonLd
        data={pageJsonLd({
          path: "/research",
          name: researchTitle,
          description: researchDescription,
          breadcrumbs: [{ name: "Research", path: "/research" }],
          type: "CollectionPage",
          items: studies.map((study) => ({
            name: study.title,
            path: getStudyHref(study.slug),
          })),
        })}
      />
      <InfoSection title="Studies">
        <ul className="flex flex-col divide-y border-y">
          {studies.map((study) => (
            <li key={study.slug} className="py-5">
              <h3 className="text-base font-semibold tracking-tight text-balance">
                <Link
                  href={getStudyHref(study.slug)}
                  className={factLinkClassName}
                >
                  {study.title}
                </Link>
              </h3>
              <p className="mt-2 text-base/7 text-pretty text-muted-foreground">
                {study.summary}
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Updated{" "}
                <time dateTime={study.updated}>{formatDate(study.updated)}</time>
              </p>
            </li>
          ))}
        </ul>
      </InfoSection>
    </InfoPage>
  )
}
