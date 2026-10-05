import { IconWorld } from "@tabler/icons-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"

export function InputGroupLongContent() {
  return (
    <div className="flex w-72 flex-col gap-4">
      <InputGroup>
        <InputGroupInput
          defaultValue="averyveryverylongunbrokenvaluethatkeepsgoingandgoing"
          aria-label="Value"
        />
        <InputGroupAddon>
          <IconWorld />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupText>.example.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="name" aria-label="Subdomain" />
        <InputGroupAddon>
          <InputGroupText className="max-w-28">
            <span className="truncate">
              https://workspace-with-a-long-name.
            </span>
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
