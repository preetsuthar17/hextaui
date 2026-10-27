import { cn } from "cn"

import { CompareLinks } from "@/components/site/compare"
import { FactList, factLinkClassName } from "@/components/site/fact-list"
import { InfoSection } from "@/components/site/info-page"
import Link from "@/components/site/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { citation } from "@/lib/research/markdown"
import {
  findingAnchor,
  formatDate,
  questionAnchor,
  tableAnchor,
  type Study,
  type StudyTable,
} from "@/lib/research/study"
import { absoluteUrl } from "@/lib/site"

const anchorClassName =
  "rounded-sm text-sm text-muted-foreground underline decoration-muted-foreground/30 underline-offset-4 transition-colors duration-150 ease-out-cubic outline-none hover:text-foreground hover:decoration-foreground focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden motion-reduce:transition-none"

function StudyFacts({ study, markdownHref }: { study: Study; markdownHref: string }) {
  const source = study.dataset.source
  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-12">
      <FactList
        label="About this study"
        className="border-t pt-6 sm:grid-cols-4"
        facts={[
          {
            label: "Updated",
            value: <time dateTime={study.updated}>{formatDate(study.updated)}</time>,
          },
          { label: "Sample", value: `${study.sample} ${study.unit}` },
          {
            label: "Source",
            value: source.href.startsWith("/") ? (
              <Link href={source.href} className={factLinkClassName}>
                {source.title}
              </Link>
            ) : (
              <a href={source.href} className={factLinkClassName}>
                {source.title}
              </a>
            ),
          },
          {
            label: "Data",
            value: (
              <a href={markdownHref} className={factLinkClassName}>
                Markdown
              </a>
            ),
          },
        ]}
      />
    </div>
  )
}

function StudyFindings({ study }: { study: Study }) {
  return (
    <InfoSection title="Key findings">
      <ol className="flex flex-col divide-y border-y">
        {study.findings.map((finding) => (
          <li
            key={finding.id}
            id={findingAnchor(finding.id)}
            className="scroll-mt-20 py-5"
          >
            <p className="text-base/7 text-pretty text-foreground">
              {finding.text}
            </p>
            <p className="mt-1.5 text-sm text-pretty text-muted-foreground">
              {finding.basis}{" "}
              <a href={`#${findingAnchor(finding.id)}`} className={anchorClassName}>
                Link to this finding
              </a>
            </p>
          </li>
        ))}
      </ol>
      {study.skipped.length ? (
        <div className="mt-6 text-sm text-pretty text-muted-foreground">
          <p>Not reported because the sample is too small:</p>
          <ul className="mt-2 flex list-disc flex-col gap-1 ps-5">
            {study.skipped.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </InfoSection>
  )
}

function StudyTableView({ table }: { table: StudyTable }) {
  const numeric = new Set(table.numeric)
  return (
    <div id={tableAnchor(table.id)} className="mt-10 scroll-mt-20 first:mt-0">
      <h3 className="text-base font-semibold tracking-tight">{table.title}</h3>
      {table.description ? (
        <p className="mt-1 text-sm text-pretty text-muted-foreground">
          {table.description}{" "}
          <a href={`#${tableAnchor(table.id)}`} className={anchorClassName}>
            Link to this table
          </a>
        </p>
      ) : null}
      <div className="mt-4">
        <Table wrap aria-label={table.title}>
          <TableHeader>
            <TableRow>
              {table.columns.map((column, index) => (
                <TableHead
                  key={column}
                  className={cn(numeric.has(index) && "text-end")}
                >
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.rows.map((row) => (
              <TableRow key={row.join("\u0000")}>
                {row.map((value, index) =>
                  index === 0 && !numeric.has(0) ? (
                    <TableHead key={index} scope="row">
                      {value}
                    </TableHead>
                  ) : (
                    <TableCell
                      key={index}
                      className={cn(numeric.has(index) && "text-end")}
                    >
                      {value}
                    </TableCell>
                  )
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function StudyTables({ study }: { study: Study }) {
  return (
    <InfoSection title="Breakdowns">
      {study.tables.map((table) => (
        <StudyTableView key={table.id} table={table} />
      ))}
    </InfoSection>
  )
}

function StudyMethodology({ study }: { study: Study }) {
  return (
    <InfoSection title="Methodology">
      <ul className="flex list-disc flex-col gap-2 ps-5 text-base/7 text-pretty text-muted-foreground">
        {study.methodology.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </InfoSection>
  )
}

function StudyQuestions({ study }: { study: Study }) {
  return (
    <InfoSection title="Frequently asked questions">
      <div className="flex flex-col divide-y border-y">
        {study.questions.map((question) => (
          <div
            key={question.id}
            id={questionAnchor(question.id)}
            className="scroll-mt-20 py-5"
          >
            <h3 className="text-base font-semibold tracking-tight text-balance">
              {question.question}
            </h3>
            <p className="mt-2 text-base/7 text-pretty text-muted-foreground">
              {question.answer}
            </p>
            <a
              href={`#${questionAnchor(question.id)}`}
              className={cn(anchorClassName, "mt-2 inline-block")}
            >
              Link to this answer
            </a>
          </div>
        ))}
      </div>
    </InfoSection>
  )
}

function StudyCitation({ study, path }: { study: Study; path: string }) {
  return (
    <InfoSection title="Cite this research">
      <p className="text-base/7 text-pretty text-muted-foreground">
        Quote any finding with a link to its anchor, or cite the whole study:
      </p>
      <p className="mt-4 border-s-2 ps-4 text-base/7 text-pretty text-foreground">
        {citation(study)}
      </p>
      <p className="mt-4 text-sm text-pretty text-muted-foreground">
        The same findings and tables are at{" "}
        <a href={`${path}.md`} className={factLinkClassName}>
          {absoluteUrl(`${path}.md`)}
        </a>
        .
      </p>
    </InfoSection>
  )
}

function StudyRelated({ study }: { study: Study }) {
  return (
    <InfoSection title="Related">
      <CompareLinks
        items={[{ href: "/research", title: "All research" }, ...study.related]}
      />
    </InfoSection>
  )
}

export {
  StudyCitation,
  StudyFacts,
  StudyFindings,
  StudyMethodology,
  StudyQuestions,
  StudyRelated,
  StudyTables,
}
