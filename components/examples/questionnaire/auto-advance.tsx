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

const scale = ["Not at all", "Slightly", "Moderately", "Very", "Extremely"]

const items = [
  { name: "useful", prompt: "How useful was today's session?" },
  { name: "pace", prompt: "How comfortable was the pace?" },
  { name: "recommend", prompt: "How likely are you to come back?" },
]

export function QuestionnaireAutoAdvance() {
  return (
    <div className="w-full max-w-md rounded-xl border p-5">
      <Questionnaire
        autoAdvance
        shortcuts="numbers"
        onSubmit={(event) => event.preventDefault()}
      >
        <QuestionnaireProgress />
        {items.map((item) => (
          <QuestionnaireItem key={item.name} name={item.name} required>
            <QuestionnaireTitle>{item.prompt}</QuestionnaireTitle>
            <QuestionnaireChoices>
              {scale.map((label) => (
                <QuestionnaireChoice key={label} value={label}>
                  {label}
                </QuestionnaireChoice>
              ))}
            </QuestionnaireChoices>
          </QuestionnaireItem>
        ))}
        <QuestionnaireActions>
          <QuestionnairePrevious />
          <QuestionnaireNext />
          <QuestionnaireSubmit />
        </QuestionnaireActions>
      </Questionnaire>
    </div>
  )
}
