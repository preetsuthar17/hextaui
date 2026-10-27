"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { IconMarkdown } from "@tabler/icons-react"

import { assistants, IconV0 } from "@/components/docs/docs-page-actions"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  dropdownMenuItemVariants,
} from "@/components/ui/dropdown-menu"
import { useChrome } from "@/lib/i18n/chrome"
import { absoluteUrl } from "@/lib/site"

function DocsPageActionsMenu({
  open,
  onOpenChange,
  anchor,
  markdownHref,
  registryHref,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  anchor: React.RefObject<HTMLButtonElement | null>
  markdownHref: string
  registryHref?: string
}) {
  const prompt = encodeURIComponent(
    `Read ${absoluteUrl(markdownHref)}, I want to ask questions about it.`
  )
  const itemClassName = dropdownMenuItemVariants()
  const c = useChrome()

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuContent
        align="end"
        anchor={anchor}
        finalFocus={anchor}
        className="min-w-48"
      >
        <DropdownMenuGroup>
          <MenuPrimitive.LinkItem
            href={markdownHref}
            target="_blank"
            rel="noopener"
            closeOnClick
            className={itemClassName}
          >
            <IconMarkdown />
            {c("View as Markdown")}
          </MenuPrimitive.LinkItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {registryHref ? (
            <MenuPrimitive.LinkItem
              href={`https://v0.dev/chat/api/open?url=${encodeURIComponent(
                absoluteUrl(registryHref)
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              closeOnClick
              className={itemClassName}
            >
              <IconV0 />
              Open in v0
            </MenuPrimitive.LinkItem>
          ) : null}
          {assistants.map((assistant) => (
            <MenuPrimitive.LinkItem
              key={assistant.name}
              href={assistant.href(prompt)}
              target="_blank"
              rel="noopener noreferrer"
              closeOnClick
              className={itemClassName}
            >
              <assistant.icon />
              Open in {assistant.name}
            </MenuPrimitive.LinkItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { DocsPageActionsMenu }
