import type { Metadata } from "next"

import { factLinkClassName } from "@/components/site/fact-list"
import { InfoPage, InfoSection } from "@/components/site/info-page"
import { JsonLd } from "@/components/site/json-ld"
import Link from "@/components/site/link"
import { pageMetadata } from "@/lib/metadata"
import { pageJsonLd } from "@/lib/structured-data"
import {
  getLiveTools,
  getToolHref,
  toolsDescription,
  tools,
  toolsTitle,
} from "@/lib/tools"

export const metadata: Metadata = pageMetadata({
  title: toolsTitle,
  description: toolsDescription,
  path: "/tools",
})

export default function Page() {
  const live = getLiveTools()
  const soon = tools.filter((tool) => tool.status === "soon")

  return (
    <InfoPage
      eyebrow="Tools"
      title={toolsTitle}
      lead="Small, free tools for building with shadcn/ui. Each one runs in your browser, needs no account, and ends with code you can paste or install."
    >
      <JsonLd
        data={pageJsonLd({
          path: "/tools",
          name: toolsTitle,
          description: toolsDescription,
          breadcrumbs: [{ name: "Tools", path: "/tools" }],
          type: "CollectionPage",
          items: live.map((tool) => ({
            name: tool.title,
            path: getToolHref(tool.slug),
          })),
        })}
      />
      <InfoSection title="Tools">
        <ul className="flex flex-col divide-y border-y">
          {live.map((tool) => (
            <li key={tool.slug} className="py-5">
              <h3 className="text-base font-semibold tracking-tight text-balance">
                <Link href={getToolHref(tool.slug)} className={factLinkClassName}>
                  {tool.title}
                </Link>
              </h3>
              <p className="mt-2 text-base/7 text-pretty text-muted-foreground">
                {tool.description}
              </p>
            </li>
          ))}
        </ul>
      </InfoSection>
      {soon.length > 0 ? (
        <InfoSection title="Coming soon">
          <ul className="flex flex-col divide-y border-y">
            {soon.map((tool) => (
              <li key={tool.slug} className="py-5">
                <h3 className="text-base font-semibold tracking-tight text-balance text-muted-foreground">
                  {tool.title}
                </h3>
                <p className="mt-2 text-base/7 text-pretty text-muted-foreground">
                  {tool.description}
                </p>
              </li>
            ))}
          </ul>
        </InfoSection>
      ) : null}
    </InfoPage>
  )
}
