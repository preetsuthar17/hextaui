import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"

const menus = [
  { label: "Projects", items: ["All projects", "Starred", "Archived"] },
  { label: "Team", items: ["Members", "Roles", "Invitations"] },
  { label: "Billing", items: ["Plan", "Invoices", "Payment method"] },
]

export function MenubarVertical() {
  return (
    <Menubar aria-label="Workspace" orientation="vertical">
      {menus.map((menu) => (
        <MenubarMenu key={menu.label}>
          <MenubarTrigger>{menu.label}</MenubarTrigger>
          <MenubarContent side="inline-end" align="start" sideOffset={8}>
            {menu.items.map((item) => (
              <MenubarItem key={item}>{item}</MenubarItem>
            ))}
          </MenubarContent>
        </MenubarMenu>
      ))}
    </Menubar>
  )
}
