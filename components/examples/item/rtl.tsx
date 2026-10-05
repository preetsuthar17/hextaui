import { IconBell, IconUserCircle } from "@tabler/icons-react"

import {
  Item,
  ItemChevron,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

export function ItemRtl() {
  return (
    <div dir="rtl" className="w-full max-w-sm">
      <ItemGroup variant="grouped">
        <Item size="sm" render={<a href="#" />}>
          <ItemMedia variant="icon">
            <IconUserCircle />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>الملف الشخصي</ItemTitle>
            <ItemDescription>الاسم والصورة</ItemDescription>
          </ItemContent>
          <ItemChevron />
        </Item>
        <Item size="sm" render={<a href="#" />}>
          <ItemMedia variant="icon">
            <IconBell />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>الإشعارات</ItemTitle>
            <ItemDescription>الإشارات والردود</ItemDescription>
          </ItemContent>
          <ItemChevron />
        </Item>
      </ItemGroup>
    </div>
  )
}
