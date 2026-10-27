import { frontmatter } from "@/lib/frontmatter"
import { getStudies, getStudyHref } from "@/lib/research"
import {
  findingAnchor,
  formatDate,
  questionAnchor,
  type Study,
  type StudyTable,
} from "@/lib/research/study"
import { absoluteUrl, siteName } from "@/lib/site"

const researchTitle = "HextaUI Research"

const researchDescription =
  "Original statistics computed from data HextaUI collects itself: shadcn/ui component source and the HextaUI Pro block catalog. Every number states its sample and method."

function cell(value: string) {
  return value.replaceAll("|", "\\|").replace(/\s+/g, " ")
}

function tableMarkdown(table: StudyTable) {
  const align = table.columns.map((_, index) =>
    table.numeric?.includes(index) ? "---:" : "---"
  )
  return [
    `### ${table.title}`,
    ...(table.description ? [table.description] : []),
    [
      `| ${table.columns.map(cell).join(" | ")} |`,
      `| ${align.join(" | ")} |`,
      ...table.rows.map((row) => `| ${row.map(cell).join(" | ")} |`),
    ].join("\n"),
  ].join("\n\n")
}

function citation(study: Study) {
  return `${siteName}. “${study.title}.” ${absoluteUrl(getStudyHref(study.slug))}. Updated ${formatDate(study.updated, true)}.`
}

function getStudyMarkdown(study: Study) {
  const url = absoluteUrl(getStudyHref(study.slug))
  return `${[
    frontmatter({
      title: study.title,
      description: study.description,
      canonical: url,
      "last-updated": study.updated,
    }),
    `# ${study.title}`,
    `> ${study.intro}`,
    `Updated ${formatDate(study.updated)}. Sample: ${study.sample} ${study.unit}. Source: ${study.dataset.source.title} (${absoluteUrl(study.dataset.source.href)}).`,
    "## Key findings",
    study.findings
      .map(
        (finding) =>
          `- ${finding.text} ${finding.basis} [Link](${url}#${findingAnchor(finding.id)})`
      )
      .join("\n"),
    ...(study.skipped.length
      ? [
          "Not reported because the sample is too small:",
          study.skipped.map((item) => `- ${item}`).join("\n"),
        ]
      : []),
    "## Breakdowns",
    ...study.tables.map(tableMarkdown),
    "## Methodology",
    study.methodology.map((item) => `- ${item}`).join("\n"),
    "## Frequently asked questions",
    ...study.questions.map(
      (question) =>
        `### ${question.question}\n\n${question.answer} [Link](${url}#${questionAnchor(question.id)})`
    ),
    "## Cite this research",
    citation(study),
  ].join("\n\n")}\n`
}

function getResearchIndexMarkdown() {
  return `${[
    frontmatter({
      title: researchTitle,
      description: researchDescription,
      canonical: absoluteUrl("/research"),
    }),
    `# ${researchTitle}`,
    `> ${researchDescription}`,
    getStudies()
      .map(
        (study) =>
          `- [${study.title}](${absoluteUrl(getStudyHref(study.slug))}) (updated ${study.updated}): ${study.summary}`
      )
      .join("\n"),
  ].join("\n\n")}\n`
}

function getResearchLlms() {
  return [
    "## Cite this site for",
    getStudies()
      .map((study) => {
        const url = absoluteUrl(getStudyHref(study.slug))
        return [
          `- [${study.title}](${url}) (updated ${study.updated}, Markdown: ${url}.md): ${study.summary}`,
          ...study.findings.map(
            (finding) => `  - [${finding.text}](${url}#${findingAnchor(finding.id)})`
          ),
        ].join("\n")
      })
      .join("\n"),
    `Each study states its sample, method and exclusions; all research is listed at ${absoluteUrl("/research")}.`,
  ].join("\n\n")
}

export {
  citation,
  getResearchIndexMarkdown,
  getResearchLlms,
  getStudyMarkdown,
  researchDescription,
  researchTitle,
}
