import { IconCalendar, IconSettings } from "@tabler/icons-react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"

export function CommandRtl() {
  return (
    <div dir="rtl" className="w-full max-w-sm">
      <Command dir="rtl">
        <CommandInput placeholder="ابحث عن أمر…" />
        <CommandList>
          <CommandEmpty>لا توجد نتائج.</CommandEmpty>
          <CommandGroup heading="اقتراحات">
            <CommandItem>
              <IconCalendar />
              التقويم
              <CommandShortcut>⌘T</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <IconSettings />
              الإعدادات
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  )
}
