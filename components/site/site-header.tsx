"use client"

import * as React from "react"
import Image from "next/image"
import Link from "@/components/site/link"
import {
  IconBook,
  IconBrightness,
  IconChevronDown,
  IconChevronRight,
  IconCode,
  IconComponents,
  IconDownload,
  IconFileText,
  IconHeart,
  IconHistory,
  IconInfoCircle,
  IconLayoutGrid,
  IconMenu2,
  IconNews,
  IconPlugConnected,
  IconSettings,
  IconShoppingBag,
  IconSparkles,
  IconTerminal2,
} from "@tabler/icons-react"
import { cn } from "cn"
import { useTheme } from "next-themes"

import { GithubLogo } from "@/components/site/github-logo"
import { type MobileMenuGroup } from "@/components/site/mobile-menu"
import { useGithubStars } from "@/components/site/use-github-stars"
import { UserMenu } from "@/components/site/user-menu"
import { Button } from "@/components/ui/button"
import {
  type Menu,
  type PlainLink,
  type SiteSection,
} from "@/components/site/site-nav"
import { comparisons } from "@/lib/compare"
import { formatStars } from "@/lib/github"
import { useChrome } from "@/lib/i18n/chrome"
import { useSitePathname } from "@/lib/i18n/client"
import { useSoloPrice } from "@/lib/pro/use-early-bird"
import { siteName, siteRepository } from "@/lib/site"

const resourcePaths = ["/blog", "/changelog", "/compare", "/sponsor", "/about"]

function buildMenus(hooksHref: string): Menu[] {
  return [
  {
    section: "blocks",
    label: "Blocks",
    primary: {
      title: "Categories",
      links: [
        {
          label: "AI",
          href: "/blocks/chat-thread",
          description: "Chat, streaming, tool calls and voice",
          icon: IconSparkles,
        },
        {
          label: "E-commerce",
          href: "/blocks/storefront",
          description: "Storefront, cart, checkout and admin",
          icon: IconShoppingBag,
        },
        {
          label: "Settings",
          href: "/blocks/settings",
          description: "Profile, billing, security and team",
          icon: IconSettings,
        },
      ],
    },
    secondary: {
      title: "Start here",
      links: [
        {
          label: "Prompt Input",
          href: "/blocks/prompt-input",
          description: "Free to install, no account needed",
          icon: IconTerminal2,
        },
        {
          label: "All blocks",
          href: "/blocks",
          description: "Every block with a live preview",
          icon: IconLayoutGrid,
        },
      ],
    },
  },
  {
    section: "docs",
    label: "Docs",
    primary: {
      title: "Documentation",
      links: [
        {
          label: "Introduction",
          href: "/docs",
          description: "What HextaUI is and how it fits together",
          icon: IconBook,
        },
        {
          label: "Installation",
          href: "/docs/installation",
          description: "Set up shadcn/ui and add your first component",
          icon: IconDownload,
        },
        {
          label: "Components",
          href: "/components",
          description: "Every component with live examples",
          icon: IconComponents,
        },
        {
          label: "Hooks",
          href: hooksHref,
          description: "Hooks and utilities for motion, focus and state",
          icon: IconCode,
        },
      ],
    },
    secondary: {
      title: "For agents",
      links: [
        {
          label: "MCP server",
          href: "/docs/mcp",
          description: "Let your assistant read the docs",
          icon: IconPlugConnected,
        },
        {
          label: "llms.txt",
          href: "/llms.txt",
          description: "The whole library as one plain-text map",
          icon: IconFileText,
        },
      ],
    },
  },
  {
    section: "resources",
    label: "Resources",
    primary: {
      title: "Resources",
      links: [
        {
          label: "Blog",
          href: "/blog",
          description: "Guides for building AI and commerce UI",
          icon: IconNews,
        },
        {
          label: "Changelog",
          href: "/changelog",
          description: "What shipped and when",
          icon: IconHistory,
        },
        {
          label: "Sponsor",
          href: "/sponsor",
          description: "Reach developers building with React",
          icon: IconHeart,
        },
        {
          label: "About",
          href: "/about",
          description: "Who builds HextaUI and why",
          icon: IconInfoCircle,
        },
      ],
    },
    secondary: {
      title: "Compare",
      links: comparisons.map((page) => ({
        label: page.title,
        href: page.href,
      })),
    },
  },
  ]
}

const plainLinks: PlainLink[] = [
  { section: "components", label: "Components", href: "/components" },
  { section: "pricing", label: "Pricing", href: "/pricing" },
]

function sectionFor(
  pathname: string,
  componentPaths: Set<string>
): SiteSection | null {
  const path = pathname.replace(/\/$/, "") || "/"
  if (path === "/") return "home"
  if (path === "/blocks" || path.startsWith("/blocks/")) return "blocks"
  if (path === "/pricing") return "pricing"
  if (componentPaths.has(path) || path.startsWith("/components/")) {
    return "components"
  }
  if (path === "/docs" || path.startsWith("/docs/")) return "docs"
  if (
    resourcePaths.some((base) => path === base || path.startsWith(`${base}/`))
  ) {
    return "resources"
  }
  return null
}

const textAction = "site-nav-item inline-flex items-center gap-1"

const loadSiteNav = () => import("@/components/site/site-nav")

type SiteNavModule = Awaited<ReturnType<typeof loadSiteNav>>

const desktopQuery = "(min-width: 48rem) and (hover: hover)"

function useSiteNav() {
  const [siteNav, setSiteNav] = React.useState<SiteNavModule | null>(null)

  React.useEffect(() => {
    let live = true
    const media = window.matchMedia(desktopQuery)
    const load = () => {
      loadSiteNav().then(
        (module) => {
          if (live) setSiteNav(module)
        },
        () => {}
      )
    }
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) load()
    }
    if (media.matches) load()
    else media.addEventListener("change", onChange)
    return () => {
      live = false
      media.removeEventListener("change", onChange)
    }
  }, [])

  return siteNav
}

function ThemeToggle({ siteNav }: { siteNav: SiteNavModule | null }) {
  const { resolvedTheme, setTheme } = useTheme()
  const toggle = () => setTheme(resolvedTheme === "dark" ? "light" : "dark")

  if (siteNav) return <siteNav.ThemeToggleTooltip onToggle={toggle} />

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Toggle theme"
      onClick={toggle}
    >
      <IconBrightness />
    </Button>
  )
}

const staticLinkClassName =
  "flex min-w-0 items-center gap-2 rounded-md text-sm outline-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden"

function StaticNav({
  menus,
  active,
  soloPrice,
}: {
  menus: Menu[]
  active: SiteSection | null
  soloPrice: number
}) {
  const c = useChrome()

  return (
    <nav
      aria-label={c("Main")}
      data-slot="navigation-menu"
      data-orientation="horizontal"
      className="group/navigation-menu relative isolate flex max-w-max min-w-0 flex-1 items-center justify-center"
    >
      <ul
        data-slot="navigation-menu-list"
        className="-m-1 flex min-w-0 flex-1 list-none items-center gap-0.5 p-1"
      >
        <li data-slot="navigation-menu-item" className="relative">
          <Link
            href={plainLinks[0].href}
            data-slot="navigation-menu-link"
            data-current={active === "components" ? "" : undefined}
            aria-current={active === "components" ? "page" : undefined}
            className={staticLinkClassName}
          >
            {c(plainLinks[0].label)}
          </Link>
        </li>
        {menus.map((menu) => (
          <li
            key={menu.section}
            data-slot="navigation-menu-item"
            className="relative"
          >
            <button
              type="button"
              data-slot="navigation-menu-trigger"
              data-current={active === menu.section ? "" : undefined}
              aria-expanded="false"
              className="inline-flex w-max items-center justify-center gap-1 rounded-md text-sm font-medium whitespace-nowrap outline-none select-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden"
            >
              {c(menu.label)}
              <IconChevronDown
                aria-hidden="true"
                data-slot="navigation-menu-trigger-icon"
                className="size-3.5"
              />
            </button>
          </li>
        ))}
        <li data-slot="navigation-menu-item" className="relative">
          <Link
            href={plainLinks[1].href}
            data-slot="navigation-menu-link"
            data-current={active === "pricing" ? "" : undefined}
            aria-current={active === "pricing" ? "page" : undefined}
            className={staticLinkClassName}
          >
            {c(plainLinks[1].label)}
            <span className="site-nav-price">${soloPrice}</span>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

function Logo() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 rounded-md font-display text-lg font-semibold tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden"
    >
      <Image
        src="/hextaui-logo.svg"
        alt=""
        width={24}
        height={24}
        unoptimized
        className="size-6"
      />
      {siteName}
    </Link>
  )
}

const loadMobileMenu = () => import("@/components/site/mobile-menu")

const MobileMenuSheet = React.lazy(() =>
  loadMobileMenu().then((module) => ({ default: module.MobileMenuSheet }))
)

function prefetchMobileMenu() {
  loadMobileMenu().catch(() => {})
}

function mobileGroupsFor(menus: Menu[]): MobileMenuGroup[] {
  return [
    {
      title: "Product",
      links: [
        ...plainLinks,
        { label: "Blocks", href: "/blocks" },
        { label: "Docs", href: "/docs" },
      ],
    },
    ...menus.map((menu) => ({
      title: menu.label,
      links: [...menu.primary.links, ...menu.secondary.links].map(
        ({ label, href }) => ({ label, href })
      ),
    })),
  ]
}

function MobileMenu({ menus }: { menus: Menu[] }) {
  const c = useChrome()
  const [open, setOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  return (
    <>
      <Button
        ref={triggerRef}
        variant="ghost"
        size="icon-sm"
        aria-label={c("Menu")}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="md:hidden"
        onPointerDown={prefetchMobileMenu}
        onFocus={prefetchMobileMenu}
        onClick={() => {
          setMounted(true)
          setOpen(true)
        }}
      >
        <IconMenu2 />
      </Button>
      {mounted ? (
        <React.Suspense fallback={null}>
          <MobileMenuSheet
            open={open}
            onOpenChange={setOpen}
            groups={mobileGroupsFor(menus)}
            finalFocus={triggerRef}
          />
        </React.Suspense>
      ) : null}
    </>
  )
}

function SiteHeader({
  stars: initialStars = null,
  componentSlugs,
  hooksHref,
  className,
}: {
  stars?: number | null
  componentSlugs: string[]
  hooksHref: string
  className?: string
}) {
  const pathname = useSitePathname()
  const c = useChrome()
  const menus = React.useMemo(() => buildMenus(hooksHref), [hooksHref])
  const componentPaths = React.useMemo(
    () =>
      new Set([
        "/components",
        ...componentSlugs.map((slug) => `/docs/${slug}`),
      ]),
    [componentSlugs]
  )
  const active = sectionFor(pathname, componentPaths)
  const home = active === "home"
  const headerRef = React.useRef<HTMLElement>(null)
  const stars = useGithubStars(initialStars)
  const soloPrice = useSoloPrice()
  const siteNav = useSiteNav()

  React.useEffect(() => {
    const header = headerRef.current
    if (!header) return
    if (!home) {
      header.removeAttribute("data-over-hero")
      return
    }
    let frame = 0
    const update = () => {
      frame = 0
      header.toggleAttribute("data-over-hero", window.scrollY <= 4)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [home, pathname])

  return (
    <header
      ref={headerRef}
      data-over-hero={home ? "" : undefined}
      className={cn(
        "site-header sticky top-0 z-40 border-b bg-background/85 text-foreground backdrop-blur-xl transition-colors duration-200 ease-out data-over-hero:border-white/14 data-over-hero:bg-transparent data-over-hero:backdrop-blur-none motion-reduce:transition-none",
        (pathname.startsWith("/docs") || pathname.startsWith("/blocks/")) &&
          "max-lg:hidden",
        className
      )}
    >
      <div className="frame-width grid h-12 grid-cols-[1fr_auto] items-center gap-6 px-4 sm:px-8 md:grid-cols-[1fr_auto_1fr]">
        <div className="flex min-w-0 items-center">
          <Logo />
        </div>
        <div className="site-nav flex justify-center max-md:hidden">
          {siteNav ? (
            <siteNav.SiteNavMenu
              menus={menus}
              plainLinks={plainLinks}
              active={active}
              soloPrice={soloPrice}
            />
          ) : (
            <StaticNav menus={menus} active={active} soloPrice={soloPrice} />
          )}
        </div>
        <div className="flex items-center justify-end gap-4">
          <a
            href={siteRepository}
            target="_blank"
            rel="noreferrer"
            aria-label={
              stars === null
                ? "GitHub"
                : `GitHub, ${stars.toLocaleString("en")} stars`
            }
            className={cn(textAction, "gap-1.5 max-sm:hidden [&_svg]:size-4")}
          >
            <GithubLogo />
            {stars === null ? null : (
              <span className="tabular-nums">{formatStars(stars)}</span>
            )}
          </a>
          <ThemeToggle siteNav={siteNav} />
          <UserMenu signInClassName={textAction} />
          <Link
            href="/docs/installation"
            className={cn(textAction, "max-sm:hidden")}
          >
            {c("Get started")}
            <IconChevronRight
              aria-hidden="true"
              className="size-3.5 rtl:-scale-x-100"
            />
          </Link>
          <MobileMenu menus={menus} />
        </div>
      </div>
    </header>
  )
}

export { SiteHeader }
