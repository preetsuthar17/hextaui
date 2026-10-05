import {
  IconAlignCenter,
  IconAlignLeft,
  IconAlignRight,
} from "@tabler/icons-react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function ToggleGroupRtl() {
  return (
    <div dir="rtl" className="flex flex-col items-center gap-4">
      <ToggleGroup aria-label="الفترة" defaultValue={["week"]}>
        <ToggleGroupItem value="day">يوم</ToggleGroupItem>
        <ToggleGroupItem value="week">أسبوع</ToggleGroupItem>
        <ToggleGroupItem value="month">شهر</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup
        variant="outline"
        aria-label="محاذاة النص"
        defaultValue={["right"]}
      >
        <ToggleGroupItem value="right" aria-label="محاذاة لليمين">
          <IconAlignRight />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="توسيط">
          <IconAlignCenter />
        </ToggleGroupItem>
        <ToggleGroupItem value="left" aria-label="محاذاة لليسار">
          <IconAlignLeft />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
