import type { Metadata } from "next"

import { DocsList, DocsParagraph } from "@/components/docs/docs-content"
import { LegalLink } from "@/components/legal/legal-page"
import { InfoPage } from "@/components/site/info-page"
import { docsComponents } from "@/lib/docs"
import { proBlocks } from "@/lib/pro/catalog"

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <InfoPage
      title="Page not found"
      lead="This page moved or no longer exists. HextaUI was rebuilt on Base UI, so some older links point to components that were renamed or retired."
    >
      <DocsParagraph>
        Most of what you might be looking for is here:
      </DocsParagraph>
      <DocsList>
        <li>
          <LegalLink href="/components">Components</LegalLink>: all{" "}
          {docsComponents.length}, with a live preview of each.
        </li>
        <li>
          <LegalLink href="/blocks">Blocks</LegalLink>: {proBlocks.length}{" "}
          practical blocks for AI products, with Prompt Input free.
        </li>
        <li>
          <LegalLink href="/docs">Docs</LegalLink>: installation, hooks,
          utilities and the MCP server.
        </li>
      </DocsList>
    </InfoPage>
  )
}
