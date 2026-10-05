import { Bubble, BubbleContent } from "@/components/ui/bubble"

export function BubbleLongContent() {
  return (
    <div className="flex w-72 max-w-full flex-col gap-3">
      <Bubble variant="secondary">
        <BubbleContent>
          Supercalifragilisticexpialidocious_unbroken_string_that_never_ends_1234567890
        </BubbleContent>
      </Bubble>
      <Bubble align="end">
        <BubbleContent>
          https://example.com/a/very/long/path/that/keeps/going/and/going?with=query&amp;params=true
        </BubbleContent>
      </Bubble>
      <Bubble variant="outline">
        <BubbleContent>
          👩‍👩‍👧‍👦👨🏽‍💻🏳️‍🌈 你好世界，这是一个很长的中文句子用于测试换行
        </BubbleContent>
      </Bubble>
      <Bubble variant="muted" align="end">
        <BubbleContent>k</BubbleContent>
      </Bubble>
      <Bubble variant="tinted">
        <BubbleContent> </BubbleContent>
      </Bubble>
    </div>
  )
}
