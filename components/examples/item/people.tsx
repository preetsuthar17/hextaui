import { IconPlus } from "@tabler/icons-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

const people = [
  { handle: "preetsuthar17", name: "Preet Suthar" },
  { handle: "emilkowalski", name: "Emil Kowalski" },
  { handle: "rauchg", name: "Guillermo Rauch" },
  { handle: "leerob", name: "Lee Robinson" },
]

export function ItemPeople() {
  return (
    <ItemGroup variant="grouped" className="max-w-sm">
      {people.map((person) => (
        <Item key={person.handle} size="sm">
          <ItemMedia>
            <Avatar size="lg">
              <AvatarImage
                src={`https://github.com/${person.handle}.png`}
                alt=""
              />
              <AvatarFallback>
                {person.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{person.name}</ItemTitle>
            <ItemDescription>@{person.handle}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button
              variant="ghost"
              size="icon-sm"

              aria-label={`Invite ${person.name}`}
            >
              <IconPlus />
            </Button>
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  )
}
