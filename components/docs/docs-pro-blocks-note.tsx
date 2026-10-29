import * as React from "react"

import { TrackedButtonLink } from "@/components/site/tracked-button-link"
import { TrackedLink } from "@/components/site/tracked-link"
import type { RelatedLink } from "@/lib/docs-related"
import { t } from "@/lib/i18n/rich"
import { getRequestLocale } from "@/lib/i18n/request"

const maxNamedBlocks = 3

const linkClassName =
  "rounded-sm whitespace-nowrap text-foreground underline decoration-foreground/25 underline-offset-4 transition-colors duration-150 ease-out-cubic outline-none hover:decoration-foreground focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden motion-reduce:transition-none"

function DocsProBlocksNote({ links }: { links: RelatedLink[] }) {
  if (links.length === 0) {
    return null
  }

  const named = links.slice(0, maxNamedBlocks)
  const rest = links.length - named.length
  const items = [
    ...named.map((link) => ({ href: link.href, label: link.title })),
    ...(rest > 0
      ? [{ href: "/blocks", label: t("{count} more", { count: rest }) }]
      : []),
  ]
  const parts = new Intl.ListFormat(getRequestLocale().locale, {
    type: "conjunction",
  }).formatToParts(items.map((item) => item.label))
  const [before, after = ""] = t("See it in a real product: {blocks}").split(
    "{blocks}"
  )
  let index = 0

  return (
    <div className="mt-2 flex items-center justify-between gap-4 rounded-lg bg-muted px-3 py-2.5 text-sm max-sm:flex-col max-sm:items-start">
      <p className="text-pretty text-muted-foreground">
        {before}
        {parts.map((part, partIndex) => {
          if (part.type === "literal") {
            return <React.Fragment key={partIndex}>{part.value}</React.Fragment>
          }
          const item = items[index++]
          return (
            <TrackedLink
              key={item.href}
              href={item.href}
              event="Pro link clicked"
              eventProps={{ from: "component-note", to: item.href }}
              className={linkClassName}
            >
              {item.label}
            </TrackedLink>
          )
        })}
        {after}
      </p>
      <TrackedButtonLink
        href={links[0].href}
        event="Pro link clicked"
        eventProps={{ from: "component-note-button", to: links[0].href }}
        size="sm"
      >
        {t("View block")}
      </TrackedButtonLink>
    </div>
  )
}

export { DocsProBlocksNote }
