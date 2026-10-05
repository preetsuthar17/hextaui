import { IconChecks, IconClock } from "@tabler/icons-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "@/components/ui/message"

export function MessageHeaderFooter() {
  return (
    <MessageGroup className="w-full max-w-md">
      <Message>
        <MessageAvatar>
          <Avatar>
            <AvatarImage src="https://github.com/preetsuthar17.png" alt="" />
            <AvatarFallback>PS</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <MessageHeader>
            Preet Suthar
            <span className="font-normal">9:41</span>
          </MessageHeader>
          <BubbleGroup shape="tail">
            <Bubble variant="secondary">
              <BubbleContent>Pushed the fix.</BubbleContent>
            </Bubble>
            <Bubble variant="secondary">
              <BubbleContent>Can you check the preview?</BubbleContent>
            </Bubble>
          </BubbleGroup>
          <MessageFooter>Edited</MessageFooter>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageContent>
          <Bubble shape="tail">
            <BubbleContent>Looks right. Merging.</BubbleContent>
          </Bubble>
          <MessageFooter>
            <IconChecks />
            Read 9:43
          </MessageFooter>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageContent>
          <Bubble variant="muted" shape="tail">
            <BubbleContent>Sending the release notes…</BubbleContent>
          </Bubble>
          <MessageFooter>
            <IconClock />
            Sending
          </MessageFooter>
        </MessageContent>
      </Message>
    </MessageGroup>
  )
}
