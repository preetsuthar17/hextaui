"use client"

import * as React from "react"

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"

export function QuestionnaireConditional() {
  const [usesFramework, setUsesFramework] = React.useState<string | null>(null)

  return (
    <div className="w-full max-w-md rounded-xl border p-5">
      <Questionnaire onSubmit={(event) => event.preventDefault()}>
        <QuestionnaireProgress />
        <QuestionnaireItem name="framework" required>
          <QuestionnaireTitle>Do you use a React framework?</QuestionnaireTitle>
          <QuestionnaireChoices>
            {["Yes", "No"].map((value) => (
              <QuestionnaireChoice
                key={value}
                value={value}
                onChange={(event) => setUsesFramework(event.target.value)}
              >
                {value}
              </QuestionnaireChoice>
            ))}
          </QuestionnaireChoices>
        </QuestionnaireItem>
        <QuestionnaireItem
          name="which"
          required
          disabled={usesFramework !== "Yes"}
        >
          <QuestionnaireTitle>Which one?</QuestionnaireTitle>
          <QuestionnaireDescription>
            Only asked when you use one. The progress counts it only then.
          </QuestionnaireDescription>
          <QuestionnaireChoices>
            {["Next.js", "React Router", "TanStack Start"].map((value) => (
              <QuestionnaireChoice key={value} value={value}>
                {value}
              </QuestionnaireChoice>
            ))}
          </QuestionnaireChoices>
        </QuestionnaireItem>
        <QuestionnaireItem name="email">
          <QuestionnaireTitle>
            Where can we send the results?
          </QuestionnaireTitle>
          <QuestionnaireChoices>
            <QuestionnaireInput
              type="email"
              aria-label="Email"
              placeholder="you@example.com"
            />
          </QuestionnaireChoices>
        </QuestionnaireItem>
        <QuestionnaireActions>
          <QuestionnairePrevious />
          <QuestionnaireNext />
          <QuestionnaireSubmit />
        </QuestionnaireActions>
      </Questionnaire>
    </div>
  )
}
