import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

const snapPoints = ["20rem", 1]

const places = [
  "Blue Bottle Coffee",
  "Tartine Bakery",
  "Mission Dolores Park",
  "Ferry Building",
  "Golden Gate Park",
  "Lands End Trail",
  "Twin Peaks",
  "Coit Tower",
  "Alamo Square",
  "Baker Beach",
  "Crissy Field",
  "Japanese Tea Garden",
]

export function DrawerSnapPoints() {
  return (
    <Drawer snapPoints={snapPoints}>
      <DrawerTrigger render={<Button variant="outline" />}>
        Nearby places
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Nearby places</DrawerTitle>
          <DrawerDescription>
            Drag up to see the full list, or down to close.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <ul className="flex flex-col divide-y">
            {places.map((place) => (
              <li key={place} className="py-3 text-sm">
                {place}
              </li>
            ))}
          </ul>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
