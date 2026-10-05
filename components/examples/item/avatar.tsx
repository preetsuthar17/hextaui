import { IconPlus } from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

const team = [
  { handle: "preetsuthar17", initials: "PS" },
  { handle: "emilkowalski", initials: "EK" },
  { handle: "rauchg", initials: "GR" },
]

export function ItemAvatar() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-6">
      <Item variant="outline">
        <ItemMedia>
          <Avatar size="lg">
            <AvatarImage src="https://github.com/preetsuthar17.png" alt="" />
            <AvatarFallback>PS</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Preet Suthar</ItemTitle>
          <ItemDescription>Maintainer of HextaUI</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button
            variant="outline"
            size="icon-sm"

            aria-label="Invite Preet Suthar"
          >
            <IconPlus />
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline">
        <ItemMedia>
          <AvatarGroup>
            {team.map((person) => (
              <Avatar key={person.handle}>
                <AvatarImage
                  src={`https://github.com/${person.handle}.png`}
                  alt=""
                />
                <AvatarFallback>{person.initials}</AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>No team members</ItemTitle>
          <ItemDescription>Invite your team to collaborate.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="outline">
            Invite
          </Button>
        </ItemActions>
      </Item>
    </div>
  )
}
