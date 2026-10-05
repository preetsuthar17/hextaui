"use client"

import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Item, ItemContent, ItemGroup, ItemTitle } from "@/components/ui/item"
import { Message, MessageContent } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
  useMessageScrollerVisibility,
} from "@/components/ui/message-scroller"

const topics = [
  "Install the component",
  "Anchor each turn",
  "Follow streamed replies",
  "Load earlier messages",
  "Jump around the thread",
]

function Outline() {
  const { scrollToMessage } = useMessageScroller()
  const { currentAnchorId } = useMessageScrollerVisibility()

  return (
    <ItemGroup variant="grouped" className="w-44 shrink-0">
      {topics.map((topic, index) => (
        <Item
          key={topic}
          size="xs"
          render={<button type="button" />}
          aria-current={
            currentAnchorId === `topic-${index}` ? "true" : undefined
          }
          aria-pressed={currentAnchorId === `topic-${index}`}
          onClick={() =>
            scrollToMessage(`topic-${index}`, { behavior: "smooth" })
          }
        >
          <ItemContent>
            <ItemTitle>{topic}</ItemTitle>
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  )
}

export function MessageScrollerJump() {
  return (
    <MessageScrollerProvider defaultScrollPosition="start">
      <div className="flex w-full max-w-xl items-start gap-4">
        <Outline />
        <div className="h-80 min-w-0 flex-1 overflow-hidden rounded-xl border">
          <MessageScroller>
            <MessageScrollerViewport aria-label="Guide">
              <MessageScrollerContent>
                {topics.map((topic, index) => [
                  <MessageScrollerItem
                    key={`q${index}`}
                    messageId={`topic-${index}`}
                    scrollAnchor
                  >
                    <Message align="end">
                      <MessageContent>
                        <Bubble variant="secondary">
                          <BubbleContent>
                            How do I {topic.toLowerCase()}?
                          </BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>,
                  <MessageScrollerItem
                    key={`a${index}`}
                    messageId={`a${index}`}
                  >
                    <Message>
                      <MessageContent>
                        <Bubble variant="ghost">
                          <BubbleContent>
                            Here is how to {topic.toLowerCase()}. The outline on
                            the side highlights this question while it is the
                            current turn, and clicking another one jumps
                            straight to it.
                          </BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>,
                ])}
              </MessageScrollerContent>
            </MessageScrollerViewport>
          </MessageScroller>
        </div>
      </div>
    </MessageScrollerProvider>
  )
}
