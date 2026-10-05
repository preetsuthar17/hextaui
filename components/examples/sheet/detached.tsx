"use client"

import { Button } from "@/components/ui/button"
import {
  createSheetHandle,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const orders = createSheetHandle<{ id: string; status: string }>()

export function SheetDetached() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <SheetTrigger
        handle={orders}
        payload={{ id: "#1042", status: "Shipped" }}
        render={<Button variant="outline" size="sm" />}
      >
        Order #1042
      </SheetTrigger>
      <SheetTrigger
        handle={orders}
        payload={{ id: "#1043", status: "Processing" }}
        render={<Button variant="outline" size="sm" />}
      >
        Order #1043
      </SheetTrigger>
      <Sheet handle={orders}>
        {({ payload }) => (
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Order {payload?.id}</SheetTitle>
              <SheetDescription>Status: {payload?.status}</SheetDescription>
            </SheetHeader>
          </SheetContent>
        )}
      </Sheet>
    </div>
  )
}
