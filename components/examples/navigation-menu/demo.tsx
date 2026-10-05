import {
  IconBook,
  IconBrandGithub,
  IconBuildingStore,
  IconChartBar,
  IconCode,
  IconComponents,
  IconLayoutDashboard,
  IconLifebuoy,
  IconPalette,
  IconRocket,
  IconShieldLock,
  IconUsers,
} from "@tabler/icons-react"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

type Entry = {
  title: string
  description: string
  icon: typeof IconBook
}

const products: Entry[] = [
  {
    title: "Components",
    description: "Accessible building blocks with motion built in.",
    icon: IconComponents,
  },
  {
    title: "Blocks",
    description: "Full sections you can drop into a page.",
    icon: IconLayoutDashboard,
  },
  {
    title: "Themes",
    description: "Tokens for color, radius and type.",
    icon: IconPalette,
  },
  {
    title: "Templates",
    description: "Starter apps ready to deploy.",
    icon: IconBuildingStore,
  },
]

const solutions: Entry[] = [
  {
    title: "Startups",
    description: "Ship a polished product on day one.",
    icon: IconRocket,
  },
  {
    title: "Teams",
    description: "One system shared across every app.",
    icon: IconUsers,
  },
  {
    title: "Analytics",
    description: "Dashboards, tables and charts.",
    icon: IconChartBar,
  },
  {
    title: "Security",
    description: "Audited for accessibility and safe defaults.",
    icon: IconShieldLock,
  },
  {
    title: "Developers",
    description: "Typed APIs that read like shadcn.",
    icon: IconCode,
  },
  {
    title: "Open source",
    description: "Read every line on GitHub.",
    icon: IconBrandGithub,
  },
]

const resources: Entry[] = [
  {
    title: "Documentation",
    description: "Every component, example and prop.",
    icon: IconBook,
  },
  {
    title: "Support",
    description: "Questions, bugs and feature requests.",
    icon: IconLifebuoy,
  },
]

function Links({ entries }: { entries: Entry[] }) {
  return (
    <ul className="grid gap-1 sm:grid-cols-2">
      {entries.map((entry) => (
        <li key={entry.title}>
          <NavigationMenuLink href="#">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-background ring-(length:--hairline) ring-border">
              <entry.icon className="text-foreground" />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="font-medium">{entry.title}</span>
              <span className="text-muted-foreground">{entry.description}</span>
            </span>
          </NavigationMenuLink>
        </li>
      ))}
    </ul>
  )
}

export function NavigationMenuDemo() {
  return (
    <div className="w-full max-w-2xl rounded-xl border px-2 py-1.5">
      <NavigationMenu variant="panel" aria-label="Main">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <Links entries={products} />
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
            <NavigationMenuContent>
              <Links entries={solutions} />
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
            <NavigationMenuContent>
              <Links entries={resources} />
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#">Pricing</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
