import { IconDotsVertical } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardLink,
  CardTitle,
} from "@/components/ui/card"

export function CardRtl() {
  return (
    <div dir="rtl" className="w-full max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle>
            <CardLink href="#">موقع أكمي</CardLink>
          </CardTitle>
          <CardDescription>
            موقع تسويقي ووثائق، يُنشر مع كل دفعة.
          </CardDescription>
          <CardAction>
            <Button variant="ghost" size="icon-sm" aria-label="المزيد">
              <IconDotsVertical />
            </Button>
          </CardAction>
        </CardHeader>
        <CardFooter>
          <Button variant="outline">إلغاء</Button>
          <Button>متابعة</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
