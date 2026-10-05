import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

const menus = [
  { label: "المنتجات", links: ["المكونات", "القوالب", "السمات"] },
  { label: "الموارد", links: ["التوثيق", "الدعم"] },
]

export function NavigationMenuRtl() {
  return (
    <div dir="rtl" className="w-full max-w-md rounded-xl border px-2 py-1.5">
      <NavigationMenu variant="panel" aria-label="الرئيسية">
        <NavigationMenuList>
          {menus.map((menu) => (
            <NavigationMenuItem key={menu.label}>
              <NavigationMenuTrigger>{menu.label}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid grid-cols-2 gap-1">
                  {menu.links.map((link) => (
                    <li key={link}>
                      <NavigationMenuLink href="#">{link}</NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
