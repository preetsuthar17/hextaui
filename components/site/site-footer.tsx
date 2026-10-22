import Image from "next/image"
import Link from "@/components/site/link"
import { IconBrandX } from "@tabler/icons-react"
import { cn } from "cn"

import { legalPages } from "@/components/legal/legal-page"
import { CookieSettingsButton } from "@/components/site/cookie-consent"
import { GithubLogo } from "@/components/site/github-logo"
import { LocaleSwitcher } from "@/components/site/locale-switcher"
import { Chrome } from "@/lib/i18n/chrome"

import { siteName, siteRepository } from "@/lib/site"

const groups = [
  {
    id: "footer-product",
    title: "Product",
    pages: [
      { href: "/docs", title: "Docs" },
      { href: "/components", title: "Components" },
      { href: "/blocks", title: "Blocks" },
      { href: "/pricing", title: "Pricing" },
      { href: "/changelog", title: "Changelog" },
    ],
  },
  {
    id: "footer-resources",
    title: "Resources",
    pages: [
      { href: "/blog", title: "Blog" },
      { href: "/compare", title: "Compare" },
      { href: "/docs/mcp", title: "MCP server" },
      { href: "/sponsor", title: "Sponsor" },
    ],
  },
  {
    id: "footer-company",
    title: "Company",
    pages: [
      { href: "/about", title: "About" },
      { href: "/contact", title: "Contact" },
      ...legalPages,
    ],
  },
]

const socials = [
  { href: "https://twitter.com/preetsuthar17", label: "X", icon: IconBrandX },
  { href: siteRepository, label: "GitHub", icon: GithubLogo },
]

const linkClassName = "site-footer-link"

function SiteFooter({ className }: { className?: string }) {
  return (
    <footer className={cn("border-t", className)}>
      <div className="frame-width px-4 pt-16 pb-12 sm:px-8 sm:pt-20 sm:pb-10">
        <div className="mx-auto flex w-full max-w-252 flex-col gap-12 lg:flex-row lg:justify-between lg:gap-16">
          <div className="flex shrink-0 flex-col items-start gap-6 lg:w-53">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-md font-display text-lg font-semibold tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden"
            >
              <Image
                src="/hextaui-logo.svg"
                alt=""
                width={22}
                height={22}
                unoptimized
                className="size-5.5"
              />
              {siteName}
            </Link>
            <p className="marketing-small text-sm/[1.375rem] font-medium text-foreground/75">
              <Chrome>The hard states, handled.</Chrome>
              <br />
              <Chrome>Blocks for shadcn/ui.</Chrome>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 sm:gap-x-18 lg:w-188">
            {groups.map((group) => (
              <nav
                key={group.id}
                aria-labelledby={group.id}
                className="flex flex-col gap-5"
              >
                <p
                  id={group.id}
                  className="text-xs/[1.125rem] font-medium text-muted-foreground"
                >
                  <Chrome>{group.title}</Chrome>
                </p>
                <ul className="flex flex-col items-start gap-2">
                  {group.pages.map((page) => (
                    <li key={page.href}>
                      <Link href={page.href} className={linkClassName}>
                        <Chrome>{page.title}</Chrome>
                      </Link>
                    </li>
                  ))}
                  {group.id === "footer-company" ? (
                    <li>
                      <CookieSettingsButton
                        className={cn(
                          linkClassName,
                          "cursor-pointer disabled:cursor-default"
                        )}
                      />
                    </li>
                  ) : null}
                </ul>
              </nav>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-16 flex w-full max-w-252 flex-col gap-6 border-t pt-8 sm:mt-20 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4">
            <p className="text-xs/[1.125rem] text-muted-foreground">
              © {new Date().getFullYear()} {siteName}.{" "}
              <Chrome>Open source under the MIT license.</Chrome>
            </p>
            <ul className="flex items-center gap-4">
              {socials.map((social) => (
                <li key={social.label} className="flex">
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="site-footer-link site-footer-icon"
                  >
                    <social.icon aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <LocaleSwitcher
            className="flex flex-wrap gap-x-4 gap-y-1 text-xs/[1.125rem]"
            linkClassName="site-footer-link site-footer-meta"
          />
        </div>
      </div>
    </footer>
  )
}

export { SiteFooter }
