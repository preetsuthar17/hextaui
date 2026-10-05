import { IconSparkles } from "@tabler/icons-react"

import { Bubble, BubbleContent } from "@/components/ui/bubble"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageGroup,
  MessageHeader,
} from "@/components/ui/message"

export function MessageAssistant() {
  return (
    <MessageGroup className="w-full max-w-md">
      <Message align="end">
        <MessageContent>
          <Bubble variant="secondary">
            <BubbleContent>What does a concentric radius mean?</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageAvatar>
          <IconSparkles />
        </MessageAvatar>
        <MessageContent>
          <MessageHeader>Assistant</MessageHeader>
          <Bubble variant="ghost">
            <BubbleContent>
              An inner corner whose radius is the outer radius minus the gap
              between the two edges. Nested shapes then curve together instead
              of fighting each other at the corners.
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </MessageGroup>
  )
}
