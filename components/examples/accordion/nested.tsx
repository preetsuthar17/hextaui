import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const items = [
  {
    value: "what",
    question: "What is HextaUI?",
    answer:
      "A collection of components built on top of shadcn/ui, with careful attention to structure and micro-interactions.",
  },
  {
    value: "install",
    question: "How do I install a component?",
    answer:
      "Copy the source into your project, then edit it like any other file you own.",
  },
  {
    value: "license",
    question: "Can I use it in commercial projects?",
    answer:
      "Yes. Every component is free and open source, for personal and commercial work.",
  },
]

export function AccordionNested() {
  return (
    <Accordion variant="separated" className="w-full max-w-md">
      <AccordionItem value="billing">
        <AccordionTrigger>Billing</AccordionTrigger>
        <AccordionContent>
          <Accordion variant="ghost">
            {items.map((item) => (
              <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="shipping">
        <AccordionTrigger>Shipping</AccordionTrigger>
        <AccordionContent>Ships within 2 business days.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
