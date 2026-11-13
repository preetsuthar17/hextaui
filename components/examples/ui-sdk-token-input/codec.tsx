"use client"

import * as React from "react"

import {
  fromText,
  TokenInput,
  TokenInputEditor,
  toText,
  type TokenCodec,
} from "@/components/ui/ui-sdk-token-input"

const chat: TokenCodec = {
  format: (token) => "<@" + token.value + ">",
  parse: (text) =>
    text.split(/(<@[\w.-]+>)/).map((part) => {
      const id = /^<@([\w.-]+)>$/.exec(part)?.[1]
      return id ? { type: "mention", value: id, label: "@" + id } : part
    }),
}

const source = "Ping <@hollis> and <@ines> about the launch"

function UiSdkTokenInputCodec() {
  const [text, setText] = React.useState(source)

  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <TokenInput
        codec={chat}
        copy="label"
        defaultValue={fromText(source, chat)}
        onValueChange={(value) => setText(toText(value, chat))}
      >
        <TokenInputEditor aria-label="Message" />
      </TokenInput>
      <p className="font-mono text-xs wrap-anywhere text-muted-foreground">
        {text}
      </p>
    </div>
  )
}

export { UiSdkTokenInputCodec }
