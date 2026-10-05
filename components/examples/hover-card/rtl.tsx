import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export function HoverCardRtl() {
  return (
    <div dir="rtl">
      <HoverCard>
        <HoverCardTrigger
          href="#"
          render={<Button variant="link" nativeButton={false} render={<a />} />}
        >
          <span dir="ltr">@hextaui</span>
        </HoverCardTrigger>
        <HoverCardContent side="inline-end">
          <div className="flex gap-3">
            <Avatar>
              <AvatarFallback>هـ</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col gap-1">
              <p className="font-medium">هكستا</p>
              <p className="text-muted-foreground">
                مكونات مبنية على shadcn/ui مع حركة سلسة ودعم كامل للوحة
                المفاتيح.
              </p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}
