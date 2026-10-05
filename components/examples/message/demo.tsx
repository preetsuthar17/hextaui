"use client"

import * as React from "react"
import { IconArrowUp, IconChecks } from "@tabler/icons-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Marker, MarkerContent, MarkerTime } from "@/components/ui/marker"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "@/components/ui/message"

type Entry = { id: number; from: "me" | "preet"; text: string }

const replies = [
  "Ha, that rise-in is nice.",
  "Try sending a few in a row.",
  "Each one comes in from your side.",
]

export function MessageDemo() {
  const [entries, setEntries] = React.useState<Entry[]>([
    { id: 1, from: "preet", text: "Did the message component land?" },
    { id: 2, from: "preet", text: "Send me something and see how it arrives." },
  ])
  const [draft, setDraft] = React.useState("")
  const nextId = React.useRef(3)
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
      { id: nextId.current++, from: "me", text },
    ])
    setDraft("")
    clearTimeout(replyTimer.current)
    replyTimer.current = setTimeout(() => {
      const reply = replies[replyIndex.current % replies.length]
      replyIndex.current += 1
      setEntries((current) => [
        ...current,
        { id: nextId.current++, from: "preet", text: reply },
      ])
    }, 900)
  }

  const runs = entries.reduce<Entry[][]>((groups, entry) => {
    const last = groups.at(-1)
    if (last && last[0].from === entry.from) {
      last.push(entry)
    } else {
      groups.push([entry])
    }
    return groups
  }, [])

  return (
    <div className="flex w-full max-w-md flex-col overflow-hidden rounded-xl border">
      <div
        ref={threadRef}
        className="h-80 overflow-y-auto overscroll-none px-4 py-4"
      >
        <MessageGroup>
          <Marker variant="separator">
            <MarkerContent>
              <MarkerTime date={new Date()} />
            </MarkerContent>
          </Marker>
          {runs.map((run, index) => {
            const mine = run[0].from === "me"
            const lastRun = index === runs.length - 1
            return (
              <Message key={run[0].id} align={mine ? "end" : "start"}>
                {!mine && (
                  <MessageAvatar>
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/preetsuthar17.png"
                        alt=""
                      />
                      <AvatarFallback>PS</AvatarFallback>
                    </Avatar>
                  </MessageAvatar>
                )}
                <MessageContent>
                  {!mine && <MessageHeader>Preet</MessageHeader>}
                  <BubbleGroup shape="tail">
                    {run.map((entry) => (
                      <Bubble
                        key={entry.id}
                        variant={mine ? "default" : "secondary"}
                      >
                        <BubbleContent>{entry.text}</BubbleContent>
                      </Bubble>
                    ))}
                  </BubbleGroup>
                  {mine && lastRun && (
                    <MessageFooter>
                      <IconChecks />
                      Read
                    </MessageFooter>
                  )}
                </MessageContent>
              </Message>
            )
          })}
        </MessageGroup>
      </div>
      <form
        className="border-t p-3"
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
            className="min-h-10"
          />
          <InputGroupAddon align="inline-end">
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
