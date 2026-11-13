"use client"

import * as React from "react"
import {
  IconArrowUp,
  IconCheck,
  IconFile,
  IconLoader2,
  IconTerminal2,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  createTokenInputController,
  TokenInput,
  TokenInputEditor,
  TokenInputToken,
  TokenInputTokenRemove,
  toLabel,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuEmpty,
  TriggerMenuHint,
  TriggerMenuItem,
  TriggerMenuItemIcon,
  TriggerMenuList,
  type Token,
  type TokenInputValue,
  type TriggerMenuDataItem,
} from "@/components/ui/ui-sdk-token-input"

const files = [
  { value: "src/app.tsx", label: "app.tsx", keywords: ["src"] },
  { value: "src/routes.ts", label: "routes.ts", keywords: ["src"] },
  { value: "src/styles.css", label: "styles.css", keywords: ["src"] },
  { value: "README.md", label: "README.md" },
  { value: "package.json", label: "package.json" },
]

const skills = [
  {
    value: "search",
    label: "search",
    arguments: [{ name: "query", hint: "<query>", required: true }],
  },
  { value: "review", label: "review" },
  { value: "summarize", label: "summarize" },
]

const loadFile = () => new Promise<void>((resolve) => setTimeout(resolve, 800))

function UiSdkTokenInputPrompt() {
  const [prompt] = React.useState(createTokenInputController)
  const [running, setRunning] = React.useState(false)
  const [sent, setSent] = React.useState<string | null>(null)
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  )

  React.useEffect(() => () => clearTimeout(timer.current), [])

  function send(value: TokenInputValue) {
    if (running || !prompt.getLabel().trim()) return
    setRunning(true)
    const skillTokens = value.filter(
      (segment): segment is Token =>
        typeof segment !== "string" && segment.type === "skill"
    )
    for (const skill of skillTokens) {
      prompt.updateToken(skill.id!, { data: { ...skill.data, run: "running" } })
    }
    timer.current = setTimeout(() => {
      for (const skill of skillTokens) {
        prompt.updateToken(skill.id!, { data: { ...skill.data, run: "done" } })
      }
      setSent(toLabel(prompt.getValue()))
      prompt.clear()
      setRunning(false)
    }, 1200)
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <TokenInput
        controller={prompt}
        onSubmit={send}
        renderToken={(token) => (
          <TokenInputToken>
            {token.type === "skill" ? (
              <IconTerminal2 aria-hidden="true" />
            ) : (
              <IconFile aria-hidden="true" />
            )}
            {token.type === "skill" ? "/" + token.label : token.label}
            {token.data?.run === "running" ? (
              <IconLoader2
                aria-hidden="true"
                className="motion-safe:animate-spin"
              />
            ) : null}
            {token.data?.run === "done" ? (
              <IconCheck aria-hidden="true" className="text-success" />
            ) : null}
            <TokenInputTokenRemove />
          </TokenInputToken>
        )}
      >
        <div className="flex flex-col gap-2">
          <TokenInputEditor
            aria-label="Prompt"
            placeholder="Ask anything. Type @ for files or / for skills"
          />
          <Button
            type="button"
            size="icon-sm"
            className="self-end"
            aria-label={running ? "Sending" : "Send"}
            disabled={running}
            onClick={() => send(prompt.getValue())}
          >
            {running ? (
              <IconLoader2
                aria-hidden="true"
                className="motion-safe:animate-spin"
              />
            ) : (
              <IconArrowUp aria-hidden="true" />
            )}
          </Button>
        </div>
        <TriggerMenu
          triggers={[
            { char: "@", type: "file", items: files },
            { char: "/", boundary: "start", type: "skill", items: skills },
          ]}
          onSelect={(value, details) =>
            details.trigger === "@" ? loadFile() : undefined
          }
        >
          <TriggerMenuHint />
          <TriggerMenuContent>
            <TriggerMenuEmpty>No matches.</TriggerMenuEmpty>
            <TriggerMenuList>
              {(state) =>
                (state.items as TriggerMenuDataItem[]).map((item) => (
                  <TriggerMenuItem
                    key={item.value}
                    value={item.value}
                    label={item.label}
                  >
                    <TriggerMenuItemIcon>
                      {state.trigger === "/" ? (
                        <IconTerminal2 aria-hidden="true" />
                      ) : (
                        <IconFile aria-hidden="true" />
                      )}
                    </TriggerMenuItemIcon>
                    {item.label}
                    {item.value !== item.label ? (
                      <span className="ms-auto truncate font-mono text-xs text-muted-foreground">
                        {item.value}
                      </span>
                    ) : null}
                  </TriggerMenuItem>
                ))
              }
            </TriggerMenuList>
          </TriggerMenuContent>
        </TriggerMenu>
      </TokenInput>
      <p role="status" className="min-h-5 text-sm text-muted-foreground">
        {sent ? "Sent: " + sent : null}
      </p>
    </div>
  )
}

export { UiSdkTokenInputPrompt }
