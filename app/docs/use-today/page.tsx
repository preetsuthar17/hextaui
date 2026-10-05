import { DocsCodeBlock } from "@/components/docs/docs-code-block"
import { DocsComponentPage } from "@/components/docs/docs-component-page"
import {
  DocsCode,
  DocsList,
  DocsParagraph,
  DocsSection,
} from "@/components/docs/docs-content"
import { DocsExample } from "@/components/docs/docs-example"
import { DocsInstall } from "@/components/docs/docs-install"
import { DocsAttributesTable } from "@/components/docs/docs-props-table"
import { UseTodayBounds } from "@/components/examples/use-today/bounds"
import { UseTodayDemo } from "@/components/examples/use-today/demo"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("use-today")

const importCode = `import { useToday } from "@/hooks/use-today"`

const usageCode = `const today = useToday()

if (!today) {
  return <Skeleton className="h-5 w-40" />
}

return <p>{format(today, "PPPP")}</p>`

const problemCode = `const today = new Date()`

const helpersCode = `import {
  fromDateKey,
  getTodayKey,
  subscribeToday,
  toDateKey,
} from "@/hooks/use-today"

toDateKey(new Date(2026, 9, 5))
fromDateKey("2026-10-05")

const unsubscribe = subscribeToday(() => refreshAgenda())`

export default function Page() {
  return (
    <DocsComponentPage slug="use-today">
      <DocsExample file="use-today/demo">
        <UseTodayDemo />
      </DocsExample>

      <DocsInstall dependencies={[]} files={["hooks/use-today.ts"]} />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          Reach for it whenever a component depends on the current date, such as
          highlighting today, disabling past days or counting down to a
          deadline.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Why not new Date()">
        <DocsCodeBlock code={problemCode} />
        <DocsParagraph>
          Reading the date while rendering breaks in two ways:
        </DocsParagraph>
        <DocsList>
          <li>
            <strong className="font-medium text-foreground">
              Hydration mismatches.
            </strong>{" "}
            The server renders in its time zone, possibly hours earlier. Near
            midnight, server and browser disagree on the day, and React throws
            away the server HTML.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              Stale dates.
            </strong>{" "}
            A tab left open overnight keeps showing yesterday as today until
            something else re-renders it.
          </li>
        </DocsList>
        <DocsParagraph>
          <DocsCode>useToday</DocsCode> returns <DocsCode>undefined</DocsCode>{" "}
          on the server and during hydration, then the local date. It also
          re-renders at midnight and when the tab becomes visible again, because
          timers in background tabs can be paused and miss midnight.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="use-today/bounds"
          title="Date bounds"
          description={
            <>
              Disable past days and anything more than 30 days out. Until today
              is known, nothing is disabled, so the server HTML matches the
              first client render.
            </>
          }
        >
          <UseTodayBounds />
        </DocsExample>
        <DocsSection title="Date keys" level={3}>
          <DocsCodeBlock code={helpersCode} />
          <DocsParagraph>
            The file also exports the pieces the hook is built from. Date keys
            are local <DocsCode>YYYY-MM-DD</DocsCode> strings. They compare by
            day, sort correctly and are safe to use as React keys or cache keys.{" "}
            <DocsCode>subscribeToday</DocsCode> calls you back at midnight and
            on tab return, outside React.
          </DocsParagraph>
        </DocsSection>
      </DocsSection>

      <DocsSection title="Good to know">
        <DocsList>
          <li>
            The returned <DocsCode>Date</DocsCode> is midnight in local time, so
            comparing it with <DocsCode>{"<"}</DocsCode> or{" "}
            <DocsCode>{">"}</DocsCode> compares days, not times.
          </li>
          <li>
            The same <DocsCode>Date</DocsCode> object comes back until the day
            changes, so it&apos;s safe to use in effect dependencies.
          </li>
          <li>
            Plan for the <DocsCode>undefined</DocsCode> render. A skeleton, or
            rendering without date-based limits, both work.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsSection title="useToday()" id="returns" level={3}>
          <DocsAttributesTable
            label="Returns"
            attributes={[
              {
                name: "Date | undefined",
                description:
                  "Local midnight today. undefined on the server and while hydrating.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="Helpers" level={3}>
          <DocsAttributesTable
            label="Export"
            attributes={[
              {
                name: "toDateKey(date)",
                description: "A Date as a local YYYY-MM-DD string.",
              },
              {
                name: "fromDateKey(key)",
                description: "A YYYY-MM-DD string as a local-midnight Date.",
              },
              {
                name: "getTodayKey()",
                description: "Today's date key.",
              },
              {
                name: "subscribeToday(callback)",
                description:
                  "Calls back at midnight and when the tab becomes visible. Returns an unsubscribe function.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="Used by" level={3}>
          <DocsParagraph>
            <DocsCode>Calendar</DocsCode>, and <DocsCode>Date picker</DocsCode>{" "}
            through it.
          </DocsParagraph>
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
