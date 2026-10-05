"use client"

import { Button } from "@/components/ui/button"
import {
  createDrawerHandle,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

const contacts = createDrawerHandle<{ name: string; email: string }>()

export function DrawerDetached() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <DrawerTrigger
        handle={contacts}
        payload={{ name: "Olivia Martin", email: "olivia@example.com" }}
        render={<Button variant="outline" size="sm" />}
      >
        Olivia
      </DrawerTrigger>
      <DrawerTrigger
        handle={contacts}
        payload={{ name: "Jackson Lee", email: "jackson@example.com" }}
        render={<Button variant="outline" size="sm" />}
      >
        Jackson
      </DrawerTrigger>
      <Drawer handle={contacts}>
        {({ payload }) => (
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{payload?.name}</DrawerTitle>
              <DrawerDescription>{payload?.email}</DrawerDescription>
            </DrawerHeader>
            <DrawerBody>
              <p className="text-sm text-muted-foreground">
                One drawer, opened by either trigger.
              </p>
            </DrawerBody>
          </DrawerContent>
        )}
      </Drawer>
    </div>
  )
}
