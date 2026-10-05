import { IconSearch } from "@tabler/icons-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export function InputGroupKbd() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <InputGroup>
        <InputGroupInput placeholder="Search docs…" aria-label="Search docs" />
        <InputGroupAddon>
          <IconSearch />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <kbd>⌘</kbd>
          <kbd>K</kbd>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput
          placeholder="Jump to file…"
          aria-label="Jump to file"
        />
        <InputGroupAddon align="inline-end">
          <kbd>/</kbd>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
