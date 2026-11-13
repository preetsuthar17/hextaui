"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  createTokenInputController,
  TokenInput,
  TokenInputEditor,
  type Token,
  type TokenInputValue,
} from "@/components/ui/ui-sdk-token-input"

const draft: TokenInputValue = [
  "Compare ",
  { type: "file", value: "src/routes.ts", label: "routes.ts" },
  " with ",
]

const loadFile = () => new Promise<void>((resolve) => setTimeout(resolve, 800))

function UiSdkTokenInputController() {
  const [prompt] = React.useState(createTokenInputController)
  const firstToken = () =>
    prompt
      .getValue()
      .find((segment): segment is Token => typeof segment !== "string")

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div
        className="flex flex-wrap gap-2"
        onMouseDown={(event) => event.preventDefault()}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            prompt.insert(
              { type: "file", value: "package.json", label: "package.json" },
              { at: "end", resolve: loadFile() }
            )
          }
        >
          Attach file
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const token = firstToken()
            if (token) prompt.updateToken(token.id!, { label: token.value })
          }}
        >
          Show path
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const token = firstToken()
            if (token) prompt.removeToken(token.id!)
          }}
        >
          Remove first
        </Button>
        <Button variant="ghost" size="sm" onClick={() => prompt.undo()}>
          Undo
        </Button>
        <Button variant="ghost" size="sm" onClick={() => prompt.clear()}>
          Clear
        </Button>
      </div>
      <TokenInput controller={prompt} defaultValue={draft}>
        <TokenInputEditor aria-label="Prompt" />
      </TokenInput>
    </div>
  )
}

export { UiSdkTokenInputController }
