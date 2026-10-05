import {
  IconBell,
  IconDeviceDesktop,
  IconKey,
  IconUserCircle,
} from "@tabler/icons-react"

import {
  Item,
  ItemChevron,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  type ItemMediaTone,
} from "@/components/ui/item"

const settings: {
  href: string
  icon: typeof IconBell
  title: string
  tone: ItemMediaTone
  description: string
}[] = [
  {
    href: "#profile",
    icon: IconUserCircle,
    title: "Profile",
    tone: "gray",
    description: "Name, photo and handle",
  },
  {
    href: "#notifications",
    icon: IconBell,
    title: "Notifications",
    tone: "red",
    description: "Mentions, replies and digests",
  },
  {
    href: "#security",
    icon: IconKey,
    title: "Password and passkeys",
    tone: "green",
    description: "Two passkeys, last used today",
  },
  {
    href: "#sessions",
    icon: IconDeviceDesktop,
    title: "Sessions",
    tone: "blue",
    description: "Signed in on 3 devices",
  },
]

export function ItemDemo() {
  return (
    <ItemGroup variant="grouped" className="max-w-sm">
      {settings.map((setting) => (
        <Item key={setting.href} size="sm" render={<a href={setting.href} />}>
          <ItemMedia variant="icon" tone={setting.tone}>
            <setting.icon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{setting.title}</ItemTitle>
            <ItemDescription>{setting.description}</ItemDescription>
          </ItemContent>
          <ItemChevron />
        </Item>
      ))}
    </ItemGroup>
  )
}
