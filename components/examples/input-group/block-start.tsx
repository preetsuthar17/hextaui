import { IconCopy, IconFileCode } from "@tabler/icons-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"

export function InputGroupBlockStart() {
  return (
    <InputGroup className="max-w-sm">
      <InputGroupTextarea
        defaultValue={'console.log("Hello from HextaUI")'}
        aria-label="script.js"
      />
      <InputGroupAddon align="block-start" separator>
        <InputGroupText>
          <IconFileCode />
          script.js
        </InputGroupText>
        <InputGroupButton size="icon-xs" aria-label="Copy" className="ms-auto">
          <IconCopy />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
