import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "@/components/ui/message"

export function MessageRtl() {
  return (
    <div dir="rtl" className="w-full max-w-md">
      <MessageGroup>
        <Message>
          <MessageAvatar>
            <Avatar>
              <AvatarImage src="https://github.com/preetsuthar17.png" alt="" />
              <AvatarFallback>م</AvatarFallback>
            </Avatar>
          </MessageAvatar>
          <MessageContent>
            <MessageHeader>ميرا</MessageHeader>
            <Bubble variant="secondary">
              <BubbleContent>هل وصل المكون الجديد؟</BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
        <Message align="end">
          <MessageContent>
            <Bubble>
              <BubbleContent>نعم، إنه على الصفحة الآن.</BubbleContent>
            </Bubble>
            <MessageFooter>تمت القراءة</MessageFooter>
          </MessageContent>
        </Message>
      </MessageGroup>
    </div>
  )
}
