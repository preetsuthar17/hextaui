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
    name: "team",
    prompt: "How big is your team?",
    choices: ["Just me", "2–10", "11–50", "More than 50"],
  },
  {
    name: "stage",
    prompt: "Where is your product today?",
    choices: ["Idea", "In development", "Launched"],
  },
  {
    name: "timeline",
    prompt: "When do you want to ship?",
    choices: ["This month", "This quarter", "No rush"],
  },
]

export function QuestionnaireLift() {
  return (
    <div className="w-full max-w-md rounded-xl border p-5">
      <Questionnaire
        transition="lift"
        onSubmit={(event) => event.preventDefault()}
      >
        <QuestionnaireProgress variant="bar" />
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
          <QuestionnairePrevious />
          <QuestionnaireNext />
          <QuestionnaireSubmit />
        </QuestionnaireActions>
      </Questionnaire>
    </div>
  )
}
