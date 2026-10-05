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
  DrawerVirtualKeyboardProvider,
} from "@/components/ui/drawer"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function DrawerKeyboard() {
  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline" />}>
        Delivery details
      </DrawerTrigger>
      <DrawerVirtualKeyboardProvider>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Delivery details</DrawerTitle>
            <DrawerDescription>
              Tap a field on your phone. It stays above the keyboard.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerBody>
            <FieldGroup>
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input name="name" autoComplete="name" />
              </Field>
              <Field>
                <FieldLabel>Phone</FieldLabel>
                <Input name="phone" type="tel" autoComplete="tel" />
              </Field>
              <Field>
                <FieldLabel>Street address</FieldLabel>
                <Input name="street" autoComplete="street-address" />
              </Field>
              <Field>
                <FieldLabel>Apartment</FieldLabel>
                <Input name="apartment" />
              </Field>
              <Field>
                <FieldLabel>City</FieldLabel>
                <Input name="city" autoComplete="address-level2" />
              </Field>
              <Field>
                <FieldLabel>Postal code</FieldLabel>
                <Input name="postal" autoComplete="postal-code" />
              </Field>
            </FieldGroup>
          </DrawerBody>
          <DrawerFooter>
            <DrawerClose render={<Button />}>Save address</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </DrawerVirtualKeyboardProvider>
    </Drawer>
  )
}
