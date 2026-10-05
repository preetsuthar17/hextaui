import { IconSearch } from "@tabler/icons-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

export function InputGroupSizes() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      {(["sm", "default", "lg"] as const).map((size) => (
        <InputGroup key={size} size={size}>
          <InputGroupInput
            placeholder={`Size ${size}`}
            aria-label={`Size ${size}`}
          />
          <InputGroupAddon>
            <IconSearch />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupButton>Go</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      ))}
    </div>
  )
}
