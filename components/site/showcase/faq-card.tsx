"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const questions = [
  {
    value: "what",
    question: "What is HextaUI?",
    answer:
      "Foundation components and blocks built on top of shadcn/ui, with motion and states already handled.",
  },
  {
    value: "install",
    question: "How do I add a component?",
    answer:
      "Run the shadcn CLI with the component’s registry URL. The source lands in your project and it’s yours.",
  },
  {
    value: "license",
    question: "Can I use it commercially?",
    answer: "Yes. It’s MIT licensed and free for any project.",
  },
]

function FaqCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion defaultValue={["what"]}>
          {questions.map((item) => (
            <AccordionItem key={item.value} value={item.value}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}

export { FaqCard }
