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

const directions = [
  { value: "up", label: "Top" },
  { value: "right", label: "Right" },
  { value: "down", label: "Bottom" },
  { value: "left", label: "Left" },
] as const

export function DrawerDirections() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {directions.map(({ value, label }) => (
        <Drawer key={value} swipeDirection={value}>
          <DrawerTrigger render={<Button variant="outline" />}>
            {label}
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Swipe {value} to close</DrawerTitle>
              <DrawerDescription>
                The drawer follows your finger and keeps the momentum when you
                let go.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose render={<Button variant="outline" />}>
                Close
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  )
}
