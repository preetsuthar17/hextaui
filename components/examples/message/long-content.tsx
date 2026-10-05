import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@/components/ui/message"

export function MessageLongContent() {
  return (
    <div className="w-72 max-w-full">
      <Message>
        <MessageAvatar>
          <Avatar>
            <AvatarImage src="https://github.com/preetsuthar17.png" alt="" />
            <AvatarFallback>PS</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <MessageHeader>
            <span className="truncate">
              Preet Suthar from the HextaUI design systems team
            </span>
          </MessageHeader>
          <Bubble variant="secondary">
            <BubbleContent>
              https://example.com/a/very/long/link/that/does/not/break/naturally/at/all
            </BubbleContent>
          </Bubble>
          <MessageFooter>
            <span className="truncate">
              Delivered to every device signed in to this workspace
            </span>
          </MessageFooter>
        </MessageContent>
      </Message>
    </div>
  )
}
