"use client"

import * as React from "react"
import { IconFile } from "@tabler/icons-react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  TokenInput,
  TokenInputEditor,
  TokenInputToken,
  type TokenDeletion,
  type TokenInputValue,
} from "@/components/ui/ui-sdk-token-input"

const draft: TokenInputValue = [
  "Explain ",
  { type: "file", value: "src/routes.ts", label: "routes.ts" },
  " in two sentences.",
]

const modes: { value: TokenDeletion; label: string }[] = [
  { value: "whole", label: "Whole" },
  { value: "select", label: "Select" },
  { value: "revert", label: "Revert" },
]

function UiSdkTokenInputDeletion() {
  const [deletion, setDeletion] = React.useState<TokenDeletion>("whole")

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <ToggleGroup
        aria-label="Backspace removes"
        value={[deletion]}
        onValueChange={(next) => {
          if (next[0]) setDeletion(next[0] as TokenDeletion)
        }}
        variant="outline"
        size="sm"
      >
        {modes.map((mode) => (
          <ToggleGroupItem key={mode.value} value={mode.value}>
            {mode.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <TokenInput
        key={deletion}
        tokenDeletion={deletion}
        defaultValue={draft}
        renderToken={(token) => (
          <TokenInputToken>
            <IconFile aria-hidden="true" />
            {token.label}
          </TokenInputToken>
        )}
      >
        <TokenInputEditor aria-label="Prompt" />
      </TokenInput>
    </div>
  )
}

export { UiSdkTokenInputDeletion }
