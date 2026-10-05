"use client"

import * as React from "react"

import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Message, MessageContent } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"

type Entry = { id: number; text: string }

const page = (from: number) =>
  Array.from({ length: 6 }, (_, index) => ({
    id: from + index,
    text: `Message #${from + index}`,
  }))

export function MessageScrollerHistory() {
  const [entries, setEntries] = React.useState<Entry[]>(() => page(100))
  const [loading, setLoading] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  React.useEffect(() => () => clearTimeout(timer.current), [])

  const loadOlder = () => {
    setLoading(true)
    timer.current = setTimeout(() => {
      setEntries((current) => [...page(current[0].id - 6), ...current])
      setLoading(false)
    }, 600)
  }

  return (
    <div className="h-80 w-full max-w-md overflow-hidden rounded-xl border">
      <MessageScrollerProvider>
        <MessageScroller>
          <MessageScrollerViewport
            aria-label="Message history"
            preserveScrollOnPrepend
          >
            <MessageScrollerContent>
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  loading={loading}
                  onClick={loadOlder}
                >
                  Load older messages
                </Button>
              </div>
              {entries.map((entry) => (
                <MessageScrollerItem
                  key={entry.id}
                  messageId={String(entry.id)}
                >
                  <Message align={entry.id % 3 === 0 ? "end" : "start"}>
                    <MessageContent>
                      <Bubble
                        variant={entry.id % 3 === 0 ? "default" : "secondary"}
                      >
                        <BubbleContent>{entry.text}</BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton direction="start" />
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
    </div>
  )
}
