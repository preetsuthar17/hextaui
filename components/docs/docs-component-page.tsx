import * as React from "react"

import { DocsPage } from "@/components/docs/docs-page"
import { getDocsComponent } from "@/lib/docs"

function DocsComponentPage({
  slug,
  children,
}: {
  slug: string
  children: React.ReactNode
}) {
  const component = getDocsComponent(slug)

  return (
    <DocsPage
      href={`/docs/${component.slug}`}
      title={component.name}
      description={component.description}
      markdownHref={`/docs/${component.slug}.md`}
      registryHref={`/r/${component.slug}.json`}
    >
      {children}
    </DocsPage>
  )
}

export { DocsComponentPage }
