import { Separator } from "@/components/ui/separator"

export function SeparatorLongContent() {
  return (
    <div className="flex w-full max-w-72 flex-col gap-6">
      <Separator>
        Messages before you joined the channel are kept for ninety days
      </Separator>
      <Separator align="start">
        https://hextaui.com/docs/components/separator/very-long-anchor
      </Separator>
    </div>
  )
}
