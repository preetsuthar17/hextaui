import { Badge } from "@/components/ui/badge"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item"

export function ItemHeaderFooter() {
  return (
    <Item variant="outline" className="max-w-sm" render={<a href="#" />}>
      <ItemHeader>
        <span className="text-xs text-muted-foreground">hextaui/hextaui</span>
        <Badge>Open</Badge>
      </ItemHeader>
      <ItemContent>
        <ItemTitle>Rework the item component</ItemTitle>
        <ItemDescription>
          Grouped surfaces, a gliding hover highlight and selectable rows.
        </ItemDescription>
      </ItemContent>
      <ItemFooter>
        <span className="text-xs text-muted-foreground">
          #482 · 3 reviewers
        </span>
        <span className="text-xs text-muted-foreground">2h ago</span>
      </ItemFooter>
    </Item>
  )
}
