import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function AccordionLongContent() {
  return (
    <Accordion className="w-full max-w-md">
      <AccordionItem value="long">
        <AccordionTrigger>
          What happens to my data if I cancel my subscription halfway through a
          billing period and later decide to come back?
        </AccordionTrigger>
        <AccordionContent>
          <p>
            Your workspace is kept for 30 days after cancellation. During that
            time you can reactivate and everything is restored exactly as you
            left it.
          </p>
          <p>
            After the retention window, data is permanently deleted. Read the{" "}
            <a href="#">data policy</a> for details.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
