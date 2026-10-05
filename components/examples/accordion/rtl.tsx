import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const items = [
  {
    value: "what",
    question: "ما هي HextaUI؟",
    answer: "مجموعة مكونات مبنية على shadcn/ui مع اهتمام بالتفاصيل والحركة.",
  },
  {
    value: "install",
    question: "كيف أثبّت مكوّنًا؟",
    answer: "انسخ الشيفرة إلى مشروعك وعدّلها كأي ملف تملكه.",
  },
  {
    value: "license",
    question: "هل يمكنني استخدامها في مشاريع تجارية؟",
    answer: "نعم، جميع المكونات مجانية ومفتوحة المصدر.",
  },
]

export function AccordionRtl() {
  return (
    <div dir="rtl" className="w-full max-w-md">
      <Accordion variant="outline" defaultValue={["what"]}>
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
