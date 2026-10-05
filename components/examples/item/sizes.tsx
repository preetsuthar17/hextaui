import { IconMusic } from "@tabler/icons-react"

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

const sizes = ["default", "sm", "xs"] as const

export function ItemSizes() {
  return (
    <ItemGroup className="max-w-sm">
      {sizes.map((size) => (
        <Item key={size} size={size} variant="outline">
          <ItemMedia variant="icon">
            <IconMusic />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Size {size}</ItemTitle>
            <ItemDescription>
              Padding, gap and media scale together.
            </ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  )
}
