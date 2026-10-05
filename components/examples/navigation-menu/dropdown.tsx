import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

const guides = [
  { title: "Installation", description: "Add HextaUI to a Next.js app." },
  { title: "Theming", description: "Colors, radius and dark mode." },
  { title: "Motion", description: "Durations, easing and reduced motion." },
]

const components = [
  "Accordion",
  "Button",
  "Dialog",
  "Menubar",
  "Table",
  "Tooltip",
]

export function NavigationMenuDropdown() {
  return (
    <NavigationMenu aria-label="Docs">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Guides</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex w-72 flex-col gap-1">
              {guides.map((guide) => (
                <li key={guide.title}>
                  <NavigationMenuLink href="#">
                    <span className="flex flex-col">
                      <span className="font-medium">{guide.title}</span>
                      <span className="text-muted-foreground">
                        {guide.description}
                      </span>
                    </span>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-80 grid-cols-2 gap-1">
              {components.map((name) => (
                <li key={name}>
                  <NavigationMenuLink href="#">{name}</NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#">Blog</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
