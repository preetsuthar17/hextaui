import { IconSparkles } from "@tabler/icons-react"

import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Message, MessageAvatar, MessageContent } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"

const thread = [
  {
    prompt: "What's a hairline border?",
    reply:
      "The thinnest line a screen can draw: 1px on standard displays and two thirds of a pixel on high-density ones.",
  },
  {
    prompt: "And concentric radii?",
    reply:
      "Inner corners use the outer radius minus the gap between the edges, so nested shapes curve together.",
  },
  {
    prompt: "Why open saved chats at the last question instead of the bottom?",
    reply:
      "Because the bottom is usually the middle of an answer. Opening at your last question shows what you asked and where the reply starts, so you can pick up the thread without scrolling around to rebuild context. The rest of the answer is right below, and the earlier turns are one scroll away.",
  },
]

export function MessageScrollerSavedThread() {
  return (
    <div className="h-80 w-full max-w-md overflow-hidden rounded-xl border">
      <MessageScrollerProvider defaultScrollPosition="last-anchor">
        <MessageScroller>
          <MessageScrollerViewport aria-label="Saved conversation">
            <MessageScrollerContent>
              {thread.map((turn, index) => [
                <MessageScrollerItem
                  key={`q${index}`}
                  messageId={`q${index}`}
                  scrollAnchor
                >
                  <Message align="end">
                    <MessageContent>
                      <Bubble variant="secondary">
                        <BubbleContent>{turn.prompt}</BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>,
                <MessageScrollerItem key={`a${index}`} messageId={`a${index}`}>
                  <Message>
                    <MessageAvatar>
                      <IconSparkles />
                    </MessageAvatar>
                    <MessageContent>
                      <Bubble variant="ghost">
                        <BubbleContent>{turn.reply}</BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>,
              ])}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton direction="start" />
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
    </div>
  )
}
