import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

const invites = [
  { initials: "MO", name: "Mira Okafor", email: "mira@example.com" },
  { initials: "JP", name: "Jun Park", email: "jun@example.com" },
]

export function ItemActionsDemo() {
  return (
    <ItemGroup variant="grouped" className="max-w-md">
      {invites.map((invite) => (
        <Item key={invite.email} size="sm">
          <ItemMedia>
            <Avatar>
              <AvatarFallback>{invite.initials}</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{invite.name}</ItemTitle>
            <ItemDescription>{invite.email}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="ghost" size="sm">
              Decline
            </Button>
            <Button variant="outline" size="sm">
              Accept
            </Button>
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  )
}
