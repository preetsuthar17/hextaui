import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageGroup,
} from "@/components/ui/message"

export function MessageAlignment() {
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
          <Bubble variant="secondary" shape="tail">
            <BubbleContent>Start is for the people you talk to.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageAvatar>
          <Avatar>
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble shape="tail">
            <BubbleContent>End is for you. The bubble follows.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </MessageGroup>
  )
}
