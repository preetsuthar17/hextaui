"use client"

import * as React from "react"
import Link from "@/components/site/link"

import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useChrome } from "@/lib/i18n/chrome"
import { siteName } from "@/lib/site"

type MobileMenuGroup = {
  title: string
  links: { label: string; href: string }[]
}

function MobileMenuSheet({
  open,
  onOpenChange,
  groups,
  finalFocus,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  groups: MobileMenuGroup[]
  finalFocus: React.RefObject<HTMLButtonElement | null>
}) {
  const c = useChrome()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[min(20rem,100vw)]"
        finalFocus={finalFocus}
      >
        <SheetHeader>
          <SheetTitle>{siteName}</SheetTitle>
        </SheetHeader>
        <SheetBody>
          <nav aria-label={c("Main")} className="flex flex-col gap-6 pb-6">
            {groups.map((group) => (
              <div key={group.title} className="flex flex-col">
                <p className="py-1 text-xs font-medium text-muted-foreground">
                  {c(group.title)}
                </p>
                <ul>
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => onOpenChange(false)}
                        className="footer-link text-foreground"
                      >
                        {c(link.label)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </SheetBody>
      </SheetContent>
    </Sheet>
  )
}

export { MobileMenuSheet, type MobileMenuGroup }
