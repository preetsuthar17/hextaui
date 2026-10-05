"use client"

import * as React from "react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

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

export function AccordionControlled() {
  const [value, setValue] = React.useState<string[]>(["what"])

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setValue(items.map((item) => item.value))}
        >
          Open all
        </Button>
        <Button variant="outline" size="sm" onClick={() => setValue([])}>
          Close all
        </Button>
      </div>
      <Accordion
        variant="outline"
        multiple
        value={value}
        onValueChange={setValue}
      >
        {items.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
