type Finding = { id: string; text: string; basis: string }

type StudyTable = {
  id: string
  title: string
  description?: string
  columns: string[]
  numeric?: number[]
  rows: string[][]
}

type StudyQuestion = { id: string; question: string; answer: string }

type StudyLink = { href: string; title: string }

type Study = {
  slug: string
  title: string
  summary: string
  description: string
  intro: string
  updated: string
  sample: number
  unit: string
  dataset: {
    name: string
    description: string
    variables: string[]
    technique: string
    source: StudyLink
  }
  findings: Finding[]
  skipped: string[]
  tables: StudyTable[]
  methodology: string[]
  questions: StudyQuestion[]
  related: StudyLink[]
}

function formatDate(iso: string, month = false) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    ...(month
      ? { month: "long", year: "numeric" }
      : { dateStyle: "long" as const }),
  }).format(new Date(`${iso}T00:00:00Z`))
}

function findingAnchor(id: string) {
  return `finding-${id}`
}

function tableAnchor(id: string) {
  return `table-${id}`
}

function questionAnchor(id: string) {
  return `faq-${id}`
}

function studyAnchors(study: Study) {
  return [
    ...study.findings.map((finding) => findingAnchor(finding.id)),
    ...study.tables.map((table) => tableAnchor(table.id)),
    ...study.questions.map((question) => questionAnchor(question.id)),
  ]
}

export {
  findingAnchor,
  formatDate,
  questionAnchor,
  studyAnchors,
  tableAnchor,
  type Finding,
  type Study,
  type StudyLink,
  type StudyQuestion,
  type StudyTable,
}
