import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

const sections = Array.from({ length: 12 }, (_, index) => index + 1)

export function DrawerScrollable() {
  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline" />}>
        Terms of service
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Terms of service</DrawerTitle>
          <DrawerDescription>Last updated October 2026.</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <div className="flex flex-col gap-4 text-sm text-muted-foreground">
            {sections.map((section) => (
              <p key={section}>
                {section}. By using the service you agree to these terms. We may
                update them from time to time, and we will let you know when
                something important changes. Keep your account details safe and
                tell us if you think someone else has access.
              </p>
            ))}
          </div>
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose render={<Button />}>Accept</DrawerClose>
          <DrawerClose render={<Button variant="outline" />}>
            Decline
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
