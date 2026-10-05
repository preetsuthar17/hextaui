"use client"

import * as React from "react"
import {
  IconArrowUp,
  IconMessageCircle,
  IconRotateClockwise,
  IconSparkles,
} from "@tabler/icons-react"

import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group"
import { Message, MessageAvatar, MessageContent } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"

type Turn = { user: string; assistant: string }
type Entry = { id: string; role: "user" | "assistant"; text: string }

const script: Turn[] = [
  {
    user: "I'm building a chat for our app and the scroll behavior is driving me nuts. Every time the AI streams a reply, the whole thread jumps around.",
    assistant:
      "That's the classic streaming scroll problem. Wrap your message list in a message scroller and turn on autoScroll. The viewport pins to the bottom as tokens arrive, so readers always see the latest text land in place, without the thread lurching around underneath them.\n\nThe important part is that it only follows while the reader is already at the bottom. The moment they scroll up to read something earlier, it backs off and their position is preserved. New text keeps arriving below, the button at the bottom shows there's more, and one tap brings them back to the live edge, where following picks up again.",
  },
  {
    user: "Okay, but when someone sends a new message the view still feels jarring, like the whole conversation reloads from the top.",
    assistant:
      "That's what turn anchoring fixes. Mark each user message with scrollAnchor and a new question settles near the top of the viewport instead of snapping to the very bottom. The answer then has room to stream in below it, and you read it from its first word instead of chasing the end of the stream.\n\nIt also leaves a small peek of the previous exchange above the anchor, so the new turn still feels connected to what came before. Once the answer grows past the bottom of the view, following takes over from the anchor and keeps the newest text in sight.",
  },
  {
    user: "And if they've scrolled up to re-read an older answer? I don't want to yank them back down.",
    assistant:
      "You won't. Scrolling away is a deliberate opt-out, so their place in the thread stays put even while new text keeps arriving below. Wheel, touch, keyboard and dragging the scrollbar all count, so it never fights the reader for control.\n\nWhile there's content they haven't reached, the jump button sits at the bottom of the viewport. If whole messages arrive while they're away, it counts them, so they know what they missed. One tap jumps back to the newest message and turns following back on.",
  },
  {
    user: "Last one: does this work with assistive tech?",
    assistant:
      "Yes. The transcript is a labelled, focusable region, so keyboard users can reach it and scroll it with the arrow keys, Page Up and Page Down. Inside it, the content is a log with additions announced, so screen readers read new messages as they arrive.\n\nSet aria-busy while a reply streams and the announcement waits for the finished message instead of reading every word as it lands. The jump button is a real button with a spoken label, and it leaves the tab order whenever there's nothing to jump to.",
  },
]

export function MessageScrollerDemo() {
  const [entries, setEntries] = React.useState<Entry[]>([])
  const [streaming, setStreaming] = React.useState(false)
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([])
  const turn = entries.filter((entry) => entry.role === "user").length
  const next = script[turn]

  React.useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  const send = () => {
    if (!next || streaming) {
      return
    }
    const id = `turn-${turn}`
    setStreaming(true)
    setEntries((current) => [
      ...current,
      { id: `${id}-user`, role: "user", text: next.user },
    ])
    const words = next.assistant.split(" ")
    timers.current.push(
      setTimeout(() => {
        setEntries((current) => [
          ...current,
          { id: `${id}-assistant`, role: "assistant", text: "" },
        ])
        words.forEach((_, index) => {
          timers.current.push(
            setTimeout(
              () => {
                setEntries((current) =>
                  current.map((entry) =>
                    entry.id === `${id}-assistant`
                      ? { ...entry, text: words.slice(0, index + 1).join(" ") }
                      : entry
                  )
                )
                if (index === words.length - 1) {
                  setStreaming(false)
                }
              },
              40 * (index + 1)
            )
          )
        })
      }, 600)
    )
  }

  const reset = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setStreaming(false)
    setEntries([])
  }

  return (
    <MessageScrollerProvider autoScroll>
      <div className="flex w-full max-w-sm flex-col gap-3">
        <div className="flex h-140 flex-col overflow-hidden rounded-xl border bg-card">
          <div className="flex items-start justify-between gap-3 border-b px-4 py-3">
            <div className="flex min-w-0 flex-col gap-0.5">
              <h3 className="text-sm font-medium">New chat</h3>
              <p className="text-sm text-muted-foreground">
                How can I help you today?
              </p>
            </div>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Reset conversation"
              disabled={entries.length === 0}
              onClick={reset}
            >
              <IconRotateClockwise />
            </Button>
          </div>
          <div className="min-h-0 flex-1">
            {entries.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="stack">
                    <IconMessageCircle />
                  </EmptyMedia>
                  <EmptyTitle>Morning!</EmptyTitle>
                  <EmptyDescription>
                    Press send to start the conversation.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <MessageScroller>
                <MessageScrollerViewport aria-label="Conversation">
                  <MessageScrollerContent aria-busy={streaming}>
                    {entries.map((entry) => (
                      <MessageScrollerItem
                        key={entry.id}
                        messageId={entry.id}
                        scrollAnchor={entry.role === "user"}
                        animated={entry.role === "user"}
                      >
                        {entry.role === "user" ? (
                          <Message align="end">
                            <MessageContent>
                              <Bubble variant="secondary">
                                <BubbleContent>{entry.text}</BubbleContent>
                              </Bubble>
                            </MessageContent>
                          </Message>
                        ) : (
                          <Message>
                            <MessageAvatar>
                              <IconSparkles />
                            </MessageAvatar>
                            <MessageContent>
                              <Bubble variant="ghost">
                                <BubbleContent>
                                  {entry.text ? (
                                    <div className="flex flex-col gap-3">
                                      {entry.text
                                        .split("\n\n")
                                        .map((paragraph, index) => (
                                          <p key={index}>{paragraph}</p>
                                        ))}
                                    </div>
                                  ) : (
                                    "Thinking…"
                                  )}
                                </BubbleContent>
                              </Bubble>
                            </MessageContent>
                          </Message>
                        )}
                      </MessageScrollerItem>
                    ))}
                  </MessageScrollerContent>
                </MessageScrollerViewport>
                <MessageScrollerButton />
              </MessageScroller>
            )}
          </div>
          <div className="border-t p-3">
            <form
              className="w-full"
              onSubmit={(event) => {
                event.preventDefault()
                send()
              }}
            >
              <InputGroup>
                <div className="min-h-14 w-full px-3 py-2.5 text-sm">
                  {next ? (
                    <span className="line-clamp-2">{next.user}</span>
                  ) : (
                    <span className="text-muted-foreground">
                      That&apos;s the whole script. Reset to start over.
                    </span>
                  )}
                </div>
                <InputGroupAddon align="block-end">
                  <InputGroupButton
                    type="submit"
                    variant="default"
                    size="icon-sm"
                    aria-label="Send"
                    disabled={!next || streaming}
                    className="ms-auto"
                  >
                    <IconArrowUp />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </form>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          The prompt is read only. Press send to play the next turn.
        </p>
      </div>
    </MessageScrollerProvider>
  )
}
