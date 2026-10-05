"use client"

import * as React from "react"

import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Message, MessageContent } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"

const peeks = [0, 64, 128]

const answer =
  "Here is a long answer that fills most of the view, so the next question has to scroll to reach the top. Watch how much of this reply stays visible above the new question."

export function MessageScrollerPeek() {
  const [peek, setPeek] = React.useState(64)
  const [turns, setTurns] = React.useState(1)

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {peeks.map((value) => (
          <Button
            key={value}
            size="sm"
            variant={peek === value ? "secondary" : "outline"}
            aria-pressed={peek === value}
            onClick={() => {
              setPeek(value)
              setTurns(1)
            }}
          >
            {value}px peek
          </Button>
        ))}
      </div>
      <div className="h-72 overflow-hidden rounded-xl border">
        <MessageScrollerProvider key={peek} scrollPreviousItemPeek={peek}>
          <MessageScroller>
            <MessageScrollerViewport aria-label="Turns">
              <MessageScrollerContent>
                {Array.from({ length: turns }, (_, turn) => (
                  <React.Fragment key={turn}>
                    <MessageScrollerItem messageId={`q${turn}`} scrollAnchor>
                      <Message align="end">
                        <MessageContent>
                          <Bubble variant="secondary">
                            <BubbleContent>Question {turn + 1}</BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                    <MessageScrollerItem messageId={`a${turn}`}>
                      <Message>
                        <MessageContent>
                          <Bubble variant="ghost">
                            <BubbleContent>{answer}</BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  </React.Fragment>
                ))}
              </MessageScrollerContent>
            </MessageScrollerViewport>
          </MessageScroller>
        </MessageScrollerProvider>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="self-center"
        onClick={() => setTurns(turns + 1)}
      >
        Ask the next question
      </Button>
    </div>
  )
}
