import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

const links = ["Overview", "Activity", "Settings"]

export function NavigationMenuActive() {
  return (
    <NavigationMenu aria-label="Project">
      <NavigationMenuList>
        {links.map((link) => (
          <NavigationMenuItem key={link}>
            <NavigationMenuLink href="#" active={link === "Activity"}>
              {link}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
