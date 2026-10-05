"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { IconBrightness } from "@tabler/icons-react"
import { cn } from "cn"
import { useTheme } from "next-themes"

import { GithubLogo } from "@/components/site/github-logo"
import { Button, buttonVariants } from "@/components/ui/button"
import { KbdGroup } from "@/components/ui/kbd"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { docsComponents, docsHooks, docsUtilities } from "@/lib/docs"
import { formatStars } from "@/lib/github"
import { siteRepository } from "@/lib/site"

type SiteSection = "home" | "docs" | "components" | "blocks" | "hooks"

const componentPaths = new Set([
  "/components",
  ...docsComponents.map((entry) => `/docs/${entry.slug}`),
])
const hookPaths = new Set(
  [...docsHooks, ...docsUtilities].map((entry) => `/docs/${entry.slug}`)
)

const links: { section: SiteSection; label: string; href: string }[] = [
  { section: "home", label: "Home", href: "/" },
  { section: "docs", label: "Docs", href: "/docs" },
  { section: "components", label: "Components", href: "/components" },
  { section: "blocks", label: "Blocks", href: "/blocks" },
  { section: "hooks", label: "Hooks", href: `/docs/${docsHooks[0]?.slug}` },
]

function sectionFor(pathname: string): SiteSection | null {
  const path = pathname.replace(/\/$/, "") || "/"
  if (path === "/") return "home"
  if (path === "/blocks") return "blocks"
  if (componentPaths.has(path)) return "components"
  if (hookPaths.has(path)) return "hooks"
  if (path === "/docs" || path.startsWith("/docs/")) return "docs"
  return null
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Toggle theme"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          />
        }
      >
        <IconBrightness />
      </TooltipTrigger>
      <TooltipContent>
        Toggle theme
        <KbdGroup keys="d" size="sm" />
      </TooltipContent>
    </Tooltip>
  )
}

function SiteHeader({
  stars = null,
  className,
}: {
  stars?: number | null
  className?: string
}) {
  const pathname = usePathname()
  const active = sectionFor(pathname)

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-background/90 backdrop-blur-md",
        pathname.startsWith("/docs") && "max-lg:hidden",
        className
      )}
    >
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center gap-2 px-3">
        <nav aria-label="Main" className="min-w-0 flex-1">
          <ul className="flex [scrollbar-width:none] items-center gap-0.5 overflow-x-auto">
            {links.map((link) => {
              const current = link.section === active
              return (
                <li key={link.section} className="shrink-0">
                  <Link
                    href={link.href}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "inline-flex h-8 items-center rounded-md px-2.5 text-sm font-medium text-muted-foreground transition-colors duration-150 outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden motion-reduce:transition-none",
                      current && "bg-muted text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="flex shrink-0 items-center gap-1">
          <Separator orientation="vertical" className="mx-1 h-4 self-center" />
          <a
            href={siteRepository}
            target="_blank"
            rel="noreferrer"
            aria-label={
              stars === null
                ? "GitHub"
                : `GitHub, ${stars.toLocaleString("en")} stars`
            }
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            <GithubLogo />
            {stars === null ? null : (
              <span className="text-xs text-muted-foreground tabular-nums">
                {formatStars(stars)}
              </span>
            )}
          </a>
          <Separator orientation="vertical" className="mx-1 h-4 self-center" />
          <ThemeToggle />
          <Link
            href="/docs/installation"
            className={cn(buttonVariants({ size: "sm" }), "ms-1 max-sm:hidden")}
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  )
}

export { SiteHeader }
