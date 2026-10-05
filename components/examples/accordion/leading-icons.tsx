import { IconLock, IconUser } from "@tabler/icons-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function AccordionLeadingIcons() {
  return (
    <Accordion variant="outline" className="w-full max-w-md">
      <AccordionItem value="account">
        <AccordionTrigger icon={null}>
          <IconUser />
          Account
        </AccordionTrigger>
        <AccordionContent>Name, email and avatar.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="security">
        <AccordionTrigger icon={null}>
          <IconLock />
          Security
        </AccordionTrigger>
        <AccordionContent>Password and two-factor settings.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
