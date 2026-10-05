"use client"

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"

const items = [
  {
    name: "language",
    prompt: "ما اللغة التي تفضلها؟",
    choices: ["العربية", "الإنجليزية", "كلاهما"],
  },
  {
    name: "theme",
    prompt: "أي مظهر تستخدم؟",
    choices: ["فاتح", "داكن", "حسب النظام"],
  },
]

export function QuestionnaireRtl() {
  return (
    <div dir="rtl" className="w-full max-w-md rounded-xl border p-5">
      <Questionnaire onSubmit={(event) => event.preventDefault()}>
        <QuestionnaireProgress />
        {items.map((item) => (
          <QuestionnaireItem key={item.name} name={item.name} required>
            <QuestionnaireTitle>{item.prompt}</QuestionnaireTitle>
            <QuestionnaireChoices>
              {item.choices.map((choice) => (
                <QuestionnaireChoice key={choice} value={choice}>
                  {choice}
                </QuestionnaireChoice>
              ))}
            </QuestionnaireChoices>
          </QuestionnaireItem>
        ))}
        <QuestionnaireActions>
          <QuestionnairePrevious>السابق</QuestionnairePrevious>
          <QuestionnaireNext>التالي</QuestionnaireNext>
          <QuestionnaireSubmit>إرسال</QuestionnaireSubmit>
        </QuestionnaireActions>
      </Questionnaire>
    </div>
  )
}
