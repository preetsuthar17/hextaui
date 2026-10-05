import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from "@/components/ui/bubble"

export function BubbleRtl() {
  return (
    <div dir="rtl" className="flex w-full max-w-md flex-col gap-3">
      <BubbleGroup>
        <Bubble variant="secondary">
          <BubbleContent>مرحبا! هل وصل التحديث؟</BubbleContent>
        </Bubble>
        <Bubble variant="secondary">
          <BubbleContent>أنا أنتظر التأكيد.</BubbleContent>
          <BubbleReactions role="img" aria-label="إعجاب">
            <span>👍</span>
            <span dir="ltr">+3</span>
          </BubbleReactions>
        </Bubble>
      </BubbleGroup>
      <BubbleGroup shape="tail">
        <Bubble align="end">
          <BubbleContent>نعم، تم النشر.</BubbleContent>
        </Bubble>
        <Bubble align="end">
          <BubbleContent render={<button type="button" />}>
            أرني السجل
          </BubbleContent>
        </Bubble>
      </BubbleGroup>
    </div>
  )
}
