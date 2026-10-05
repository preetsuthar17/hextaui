"use client"

import * as React from "react"
import { IconArrowUp, IconPlus } from "@tabler/icons-react"

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Message, MessageContent, MessageGroup } from "@/components/ui/message"

type Entry = { id: number; mine: boolean; text: string }

const replies = [
  "Every bubble rises in from the side it was sent from.",
  "Send a few in a row and they group under one tail.",
  "The composer grows with your text, then scrolls.",
]

function ChatCard() {
  const [entries, setEntries] = React.useState<Entry[]>([
    { id: 1, mine: false, text: "Shipped the new composer." },
    { id: 2, mine: false, text: "Send me something?" },
    { id: 3, mine: true, text: "Does it keep up with long threads?" },
  ])
  const [draft, setDraft] = React.useState("")
  const [typing, setTyping] = React.useState(false)
  const nextId = React.useRef(4)
  const replyIndex = React.useRef(0)
  const replyTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const threadRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => () => clearTimeout(replyTimer.current), [])

  React.useEffect(() => {
    const thread = threadRef.current
    if (thread) {
      thread.scrollTo({ top: thread.scrollHeight, behavior: "smooth" })
    }
  }, [entries])

  const send = () => {
    const text = draft.trim()
    if (!text) {
      return
    }
    setEntries((current) => [
      ...current,
      { id: nextId.current++, mine: true, text },
    ])
    setDraft("")
    setTyping(true)
    clearTimeout(replyTimer.current)
    replyTimer.current = setTimeout(() => {
      const reply = replies[replyIndex.current % replies.length]
      replyIndex.current += 1
      setTyping(false)
      setEntries((current) => [
        ...current,
        { id: nextId.current++, mine: false, text: reply },
      ])
    }, 1100)
  }

  const runs = entries.reduce<Entry[][]>((groups, entry) => {
    const last = groups.at(-1)
    if (last && last[0].mine === entry.mine) {
      last.push(entry)
    } else {
      groups.push([entry])
    }
    return groups
  }, [])

  return (
    <div className="flex h-104 flex-col overflow-hidden rounded-xl border border-foreground/10 bg-card text-sm text-card-foreground">
      <div className="flex items-center gap-2.5 border-b px-4 py-3">
        <Avatar>
          <AvatarImage src="https://github.com/preetsuthar17.png" alt="" />
          <AvatarFallback>PS</AvatarFallback>
          <AvatarBadge status="online" />
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">Preet</span>
          <span className="text-xs text-muted-foreground">
            {typing ? "Typing…" : "Online"}
          </span>
        </div>
      </div>
      <div
        ref={threadRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3"
      >
        <MessageGroup>
          {runs.map((run) => (
            <Message key={run[0].id} align={run[0].mine ? "end" : "start"}>
              <MessageContent>
                <BubbleGroup shape="tail">
                  {run.map((entry) => (
                    <Bubble
                      key={entry.id}
                      variant={entry.mine ? "default" : "secondary"}
                    >
                      <BubbleContent>{entry.text}</BubbleContent>
                    </Bubble>
                  ))}
                </BubbleGroup>
              </MessageContent>
            </Message>
          ))}
        </MessageGroup>
      </div>
      <form
        className="p-2"
        onSubmit={(event) => {
          event.preventDefault()
          send()
        }}
      >
        <InputGroup>
          <InputGroupTextarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault()
                send()
              }
            }}
            rows={1}
            placeholder="Message Preet"
            aria-label="Message"
          />
          <InputGroupAddon align="block-end" className="justify-between">
            <InputGroupButton size="icon-xs" aria-label="Attach file">
              <IconPlus />
            </InputGroupButton>
            <InputGroupButton
              type="submit"
              variant="default"
              size="icon-xs"
              aria-label="Send"
              disabled={!draft.trim()}
            >
              <IconArrowUp />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </div>
  )
}

export { ChatCard }
