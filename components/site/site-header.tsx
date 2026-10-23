"use client"

import * as React from "react"
import Image from "next/image"
import Link from "@/components/site/link"
import {
  IconBook,
  IconBrightness,
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
  IconReceipt,
  IconSettings,
  IconShoppingBag,
  IconSparkles,
  IconTerminal2,
  type Icon,
} from "@tabler/icons-react"
import { cn } from "cn"
import { useTheme } from "next-themes"

import { GithubLogo } from "@/components/site/github-logo"
import { useGithubStars } from "@/components/site/use-github-stars"
import { UserMenu } from "@/components/site/user-menu"
import { Button } from "@/components/ui/button"
import { KbdGroup } from "@/components/ui/kbd"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { comparisons } from "@/lib/compare"
import { docsComponents, docsHooks, docsUtilities } from "@/lib/docs"
import { formatStars } from "@/lib/github"
import { useChrome } from "@/lib/i18n/chrome"
import { useSitePathname } from "@/lib/i18n/client"
import { useSoloPrice } from "@/lib/pro/use-early-bird"
import { siteName, siteRepository } from "@/lib/site"

type SiteSection =
  "home" | "docs" | "components" | "blocks" | "resources" | "pricing"

type MenuLink = {
  label: string
  href: string
  description?: string
  icon?: Icon
}

type Menu = {
  section: SiteSection
  label: string
  primary: { title: string; links: MenuLink[] }
  secondary: { title: string; links: MenuLink[] }
}

const componentPaths = new Set([
  "/components",
  ...docsComponents.map((entry) => `/docs/${entry.slug}`),
])
const resourcePaths = ["/blog", "/changelog", "/compare", "/sponsor", "/about"]

const hooksHref = `/docs/${docsHooks[0]?.slug ?? docsUtilities[0]?.slug}`

const menus: Menu[] = [
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

const plainLinks: { section: SiteSection; label: string; href: string }[] = [
  { section: "components", label: "Components", href: "/components" },
  { section: "pricing", label: "Pricing", href: "/pricing" },
]

function sectionFor(pathname: string): SiteSection | null {
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

function MenuItemLink({ link }: { link: MenuLink }) {
  const c = useChrome()
  const MenuIcon = link.icon

  return (
    <NavigationMenuLink render={<Link href={link.href} />}>
      <span className="flex min-w-0 items-start gap-3">
        {MenuIcon ? (
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-background text-muted-foreground inset-ring-(length:--hairline) inset-ring-border forced-colors:border">
            <MenuIcon className="size-5" stroke={1.5} />
          </span>
        ) : null}
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="font-medium">{c(link.label)}</span>
          {link.description ? (
            <span className="text-pretty text-muted-foreground">
              {c(link.description)}
            </span>
          ) : null}
        </span>
      </span>
    </NavigationMenuLink>
  )
}

function MenuPanel({ menu }: { menu: Menu }) {
  const c = useChrome()

  return (
    <NavigationMenuContent className="w-[min(42rem,calc(100vw-2rem))]">
      <div className="-m-2 grid grid-cols-[1.35fr_1fr]">
        <div className="flex flex-col gap-0.5 p-3">
          <p className="px-2 pt-1 pb-2 text-xs font-medium text-muted-foreground">
            {c(menu.primary.title)}
          </p>
          {menu.primary.links.map((link) => (
            <MenuItemLink key={link.href} link={link} />
          ))}
        </div>
        <div className="flex flex-col gap-0.5 border-s bg-muted/50 p-3">
          <p className="px-2 pt-1 pb-2 text-xs font-medium text-muted-foreground">
            {c(menu.secondary.title)}
          </p>
          {menu.secondary.links.map((link) => (
            <MenuItemLink key={link.href} link={link} />
          ))}
        </div>
      </div>
    </NavigationMenuContent>
  )
}

function MobileMenu() {
  const c = useChrome()
  const [open, setOpen] = React.useState(false)
  const groups = [
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
      links: [...menu.primary.links, ...menu.secondary.links],
    })),
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={c("Menu")}
            className="md:hidden"
          />
        }
      >
        <IconMenu2 />
      </SheetTrigger>
      <SheetContent side="right" className="w-[min(20rem,100vw)]">
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
                        onClick={() => setOpen(false)}
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

function SiteHeader({
  stars: initialStars = null,
  className,
}: {
  stars?: number | null
  className?: string
}) {
  const pathname = useSitePathname()
  const c = useChrome()
  const active = sectionFor(pathname)
  const home = active === "home"
  const headerRef = React.useRef<HTMLElement>(null)
  const stars = useGithubStars(initialStars)
  const soloPrice = useSoloPrice()

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
          <NavigationMenu
            aria-label={c("Main")}
            align="center"
            className="[&>[data-slot=navigation-menu-highlight]]:hidden"
          >
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  render={<Link href={plainLinks[0].href} />}
                  data-current={active === "components" ? "" : undefined}
                  aria-current={active === "components" ? "page" : undefined}
                >
                  {c(plainLinks[0].label)}
                </NavigationMenuLink>
              </NavigationMenuItem>
              {menus.map((menu) => (
                <NavigationMenuItem key={menu.section}>
                  <NavigationMenuTrigger
                    data-current={active === menu.section ? "" : undefined}
                  >
                    {c(menu.label)}
                  </NavigationMenuTrigger>
                  <MenuPanel menu={menu} />
                </NavigationMenuItem>
              ))}
              <NavigationMenuItem>
                <NavigationMenuLink
                  render={<Link href={plainLinks[1].href} />}
                  data-current={active === "pricing" ? "" : undefined}
                  aria-current={active === "pricing" ? "page" : undefined}
                >
                  {c(plainLinks[1].label)}
                  <span className="site-nav-price">${soloPrice}</span>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
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
          <ThemeToggle />
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
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}

export { SiteHeader }
