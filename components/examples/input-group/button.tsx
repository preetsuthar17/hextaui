"use client"

import * as React from "react"
import { IconCheck, IconCopy, IconX } from "@tabler/icons-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

export function InputGroupButtonDemo() {
  const [copied, setCopied] = React.useState(false)
  const [query, setQuery] = React.useState("button group")

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <InputGroup>
        <InputGroupInput
          readOnly
          defaultValue="https://hextaui.com/docs/input-group"
          aria-label="Share link"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label={copied ? "Copied" : "Copy link"}
            onClick={async () => {
              await navigator.clipboard
                ?.writeText("https://hextaui.com/docs/input-group")
                .catch(() => {})
              setCopied(true)
              setTimeout(() => setCopied(false), 1500)
            }}
          >
            {copied ? <IconCheck /> : <IconCopy />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search components…"
          aria-label="Search components"
        />
        <InputGroupAddon align="inline-end">
          {query ? (
            <InputGroupButton
              size="icon-xs"
              aria-label="Clear search"
              onClick={() => setQuery("")}
            >
              <IconX />
            </InputGroupButton>
          ) : null}
          <InputGroupButton variant="secondary">Search</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
