import { IconCheck, IconMail, IconSearch } from "@tabler/icons-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export function InputGroupIcon() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <InputGroup>
        <InputGroupInput placeholder="Search…" aria-label="Search" />
        <InputGroupAddon>
          <IconSearch />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput
          type="email"
          defaultValue="hi@hextaui.com"
          aria-label="Email"
        />
        <InputGroupAddon>
          <IconMail />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <IconCheck className="text-success" aria-label="Verified" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
