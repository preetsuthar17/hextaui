"use client"

import * as React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Marker, MarkerContent } from "@/components/ui/marker"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
} from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"

type Row =
  | { id: string; kind: "joined"; name: string }
  | { id: string; kind: "message"; author: string; text: string }

const message = (id: string, author: string, text: string): Row => ({
  id,
  kind: "message",
  author,
  text,
})

const initial: Row[] = [
  message("1", "Preet", "Morning! Standup in five."),
  message("2", "Jun", "Running two minutes late."),
  message("3", "Sol", "Same, finishing a review."),
  message("4", "Preet", "No rush. Agenda is in the doc."),
  message("5", "Jun", "Read it. Looks good to me."),
  { id: "joined", kind: "joined", name: "Mira" },
  message("6", "Mira", "Hi all, joining from the design team."),
]

const later: Row[] = [
  message("7", "Preet", "Welcome! You're just in time."),
  message("8", "Jun", "Hey Mira 👋"),
  message("9", "Sol", "Good to have you here."),
]

function Author({ name }: { name: string }) {
  return (
    <MessageAvatar>
      <Avatar>
        {name === "Preet" && (
          <AvatarImage src="https://github.com/preetsuthar17.png" alt="" />
        )}
        <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
    </MessageAvatar>
  )
}

export function MessageScrollerGroupChat() {
  const [rows, setRows] = React.useState(initial)
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([])

  React.useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  const receive = () => {
    later.forEach((row, index) => {
      timers.current.push(
        setTimeout(
          () => {
            setRows((current) =>
              current.some((existing) => existing.id === row.id)
                ? current
                : [...current, row]
            )
          },
          600 * (index + 1)
        )
      )
    })
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="h-80 overflow-hidden rounded-xl border">
        <MessageScrollerProvider autoScroll>
          <MessageScroller>
            <MessageScrollerViewport aria-label="Team chat">
              <MessageScrollerContent>
                {rows.map((row) =>
                  row.kind === "joined" ? (
                    <MessageScrollerItem
                      key={row.id}
                      messageId={row.id}
                      scrollAnchor
                    >
                      <Marker variant="separator">
                        <MarkerContent>
                          {row.name} joined the chat
                        </MarkerContent>
                      </Marker>
                    </MessageScrollerItem>
                  ) : (
                    <MessageScrollerItem key={row.id} messageId={row.id}>
                      <Message>
                        <Author name={row.author} />
                        <MessageContent>
                          <MessageHeader>{row.author}</MessageHeader>
                          <Bubble variant="secondary" shape="tail">
                            <BubbleContent>{row.text}</BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  )
                )}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </MessageScrollerProvider>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="self-center"
        onClick={receive}
      >
        Scroll up, then receive messages
      </Button>
    </div>
  )
}
