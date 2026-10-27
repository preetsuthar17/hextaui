import type { Metadata } from "next"
import { notFound } from "next/navigation"

import {
  StudyCitation,
  StudyFacts,
  StudyFindings,
  StudyMethodology,
  StudyQuestions,
  StudyRelated,
  StudyTables,
} from "@/components/research/study-sections"
import { InfoPage } from "@/components/site/info-page"
import { JsonLd } from "@/components/site/json-ld"
import { pageMetadata } from "@/lib/metadata"
import { getStudies, getStudy, getStudyHref } from "@/lib/research"
import { studyJsonLd } from "@/lib/research/structured-data"

export const dynamicParams = false

export function generateStaticParams() {
  return getStudies().map((study) => ({ topic: study.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<"/research/[topic]">): Promise<Metadata> {
  const study = getStudy((await params).topic)
  if (!study) return {}
  const path = getStudyHref(study.slug)

  return pageMetadata({
    title: study.title,
    description: study.description,
    path,
    markdown: `${path}.md`,
    type: "article",
    modifiedTime: study.updated,
  })
}

export default async function Page({ params }: PageProps<"/research/[topic]">) {
  const study = getStudy((await params).topic)
  if (!study) notFound()
  const path = getStudyHref(study.slug)

  return (
    <InfoPage eyebrow="Research" title={study.title} lead={study.intro}>
      <JsonLd data={studyJsonLd(study)} />
      <StudyFacts study={study} markdownHref={`${path}.md`} />
      <StudyFindings study={study} />
      <StudyTables study={study} />
      <StudyMethodology study={study} />
      <StudyQuestions study={study} />
      <StudyCitation study={study} path={path} />
      <StudyRelated study={study} />
    </InfoPage>
  )
}
