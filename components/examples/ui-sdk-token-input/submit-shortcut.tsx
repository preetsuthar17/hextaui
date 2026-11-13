"use client"

import * as React from "react"

import { Kbd } from "@/components/ui/kbd"
import {
  TokenInput,
  TokenInputEditor,
  toLabel,
} from "@/components/ui/ui-sdk-token-input"

function UiSdkTokenInputSubmitShortcut() {
  const [sent, setSent] = React.useState<string | null>(null)

  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <TokenInput
        submitShortcut="mod+enter"
        onSubmit={(value) => setSent(toLabel(value))}
      >
        <TokenInputEditor
          aria-label="Message"
          placeholder="Write a message. Enter adds a line."
        />
      </TokenInput>
      <p
        role="status"
        className="flex flex-wrap items-center gap-1.5 text-sm wrap-anywhere text-muted-foreground"
      >
        {sent ? (
          "Sent: " + sent
        ) : (
          <>
            Send with <Kbd>⌘</Kbd>
            <Kbd>Enter</Kbd> or <Kbd>Ctrl</Kbd>
            <Kbd>Enter</Kbd>
          </>
        )}
      </p>
    </div>
  )
}

export { UiSdkTokenInputSubmitShortcut }
