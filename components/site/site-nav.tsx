"use client"

import Link from "@/components/site/link"
import { IconBrightness, type Icon } from "@tabler/icons-react"

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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useChrome } from "@/lib/i18n/chrome"

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

type PlainLink = { section: SiteSection; label: string; href: string }

function ThemeToggleTooltip({ onToggle }: { onToggle: () => void }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Toggle theme"
            onClick={onToggle}
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

function SiteNavMenu({
  menus,
  plainLinks,
  active,
  soloPrice,
}: {
  menus: Menu[]
  plainLinks: PlainLink[]
  active: SiteSection | null
  soloPrice: number
}) {
  const c = useChrome()

  return (
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
  )
}

export {
  SiteNavMenu,
  ThemeToggleTooltip,
  type Menu,
  type MenuLink,
  type PlainLink,
  type SiteSection,
}
