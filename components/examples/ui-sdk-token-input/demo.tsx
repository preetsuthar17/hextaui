"use client"

import { IconAt } from "@tabler/icons-react"

import {
  TokenInput,
  TokenInputEditor,
  TokenInputToken,
  TokenInputTokenRemove,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuEmpty,
  TriggerMenuItem,
  TriggerMenuList,
  type TokenInputValue,
  type TriggerMenuDataItem,
} from "@/components/ui/ui-sdk-token-input"

const people = [
  { value: "hollis", label: "Hollis Grant", keywords: ["design"] },
  { value: "ines", label: "Inès Moreau", keywords: ["engineering"] },
  { value: "kofi", label: "Kofi Mensah", keywords: ["engineering"] },
  { value: "wren", label: "Wren Takahashi", keywords: ["product"] },
  { value: "tomasz", label: "Tomasz Wójcik", keywords: ["support"] },
]

const draft: TokenInputValue = [
  "Thanks ",
  { type: "mention", value: "ines", label: "Inès Moreau" },
  ", can you pair with ",
]

function UiSdkTokenInputDemo() {
  return (
    <div className="w-full max-w-md">
      <TokenInput
        defaultValue={draft}
        renderToken={(token) => (
          <TokenInputToken>
            <IconAt aria-hidden="true" />
            {token.label}
            <TokenInputTokenRemove />
          </TokenInputToken>
        )}
      >
        <TokenInputEditor
          aria-label="Message"
          placeholder="Type @ to mention someone"
        />
        <TriggerMenu triggers={[{ char: "@", type: "mention", items: people }]}>
          <TriggerMenuContent>
            <TriggerMenuEmpty>No one matches.</TriggerMenuEmpty>
            <TriggerMenuList>
              {(state) =>
                (state.items as TriggerMenuDataItem[]).map((item) => (
                  <TriggerMenuItem
                    key={item.value}
                    value={item.value}
                    label={item.label}
                  >
                    <span
                      aria-hidden="true"
                      className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground"
                    >
                      {item.label.charAt(0)}
                    </span>
                    {item.label}
                  </TriggerMenuItem>
                ))
              }
            </TriggerMenuList>
          </TriggerMenuContent>
        </TriggerMenu>
      </TokenInput>
    </div>
  )
}

export { UiSdkTokenInputDemo }
