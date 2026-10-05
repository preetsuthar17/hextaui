import { IconArrowUp, IconSearch } from "@tabler/icons-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"

export function InputGroupRtl() {
  return (
    <div dir="rtl" className="flex w-full max-w-sm flex-col gap-4">
      <InputGroup>
        <InputGroupInput placeholder="ابحث…" aria-label="بحث" />
        <InputGroupAddon>
          <IconSearch />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <kbd>⌘K</kbd>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="0.00" aria-label="السعر" />
        <InputGroupAddon>
          <InputGroupText>ر.س</InputGroupText>
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupButton variant="default" size="icon-xs" aria-label="إرسال">
            <IconArrowUp />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
