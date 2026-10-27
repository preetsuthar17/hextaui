import { ogImagePath } from "@/lib/metadata"
import { getStudyHref } from "@/lib/research"
import type { Study } from "@/lib/research/study"
import { absoluteUrl, siteName, siteUrl } from "@/lib/site"
import { faqPageJsonLd, pageJsonLd } from "@/lib/structured-data"

function datasetJsonLd(study: Study) {
  const url = absoluteUrl(getStudyHref(study.slug))
  return {
    "@type": "Dataset",
    "@id": `${url}#dataset`,
    name: study.dataset.name,
    description: study.dataset.description,
    url,
    creator: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
    },
    dateModified: study.updated,
    temporalCoverage: study.updated,
    isAccessibleForFree: true,
    variableMeasured: study.dataset.variables,
    measurementTechnique: study.dataset.technique,
    isBasedOn: absoluteUrl(study.dataset.source.href),
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "text/markdown",
        contentUrl: `${url}.md`,
      },
    ],
    subjectOf: { "@id": `${url}#webpage` },
  }
}

function studyJsonLd(study: Study) {
  const path = getStudyHref(study.slug)
  return pageJsonLd({
    path,
    name: study.title,
    description: study.description,
    breadcrumbs: [
      { name: "Research", path: "/research" },
      { name: study.title, path },
    ],
    image: ogImagePath(path),
    extra: [
      datasetJsonLd(study),
      ...(study.questions.length ? [faqPageJsonLd(path, study.questions)] : []),
    ],
  })
}

export { datasetJsonLd, studyJsonLd }
