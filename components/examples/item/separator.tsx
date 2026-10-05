import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"

export function ItemSeparatorDemo() {
  return (
    <ItemGroup className="max-w-sm">
      <Item size="sm">
        <ItemContent>
          <ItemTitle>Storage</ItemTitle>
          <ItemDescription>18.2 GB of 50 GB used</ItemDescription>
        </ItemContent>
      </Item>
      <ItemSeparator />
      <Item size="sm">
        <ItemContent>
          <ItemTitle>Bandwidth</ItemTitle>
          <ItemDescription>312 GB this month</ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  )
}
