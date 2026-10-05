import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

export function DrawerNested() {
  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline" />}>
        Choose a plan
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Choose a plan</DrawerTitle>
          <DrawerDescription>
            Compare plans, then open the details of the one you like.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Drawer>
            <DrawerTrigger render={<Button />}>Pro plan details</DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Pro plan</DrawerTitle>
                <DrawerDescription>
                  The first drawer steps back behind this one.
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <Drawer>
                  <DrawerTrigger render={<Button />}>Checkout</DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Checkout</DrawerTitle>
                      <DrawerDescription>
                        Swipe down to go back one step.
                      </DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                      <DrawerClose render={<Button variant="outline" />}>
                        Back
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
                <DrawerClose render={<Button variant="outline" />}>
                  Back
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          <DrawerClose render={<Button variant="outline" />}>Close</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
