"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"

const items = [
  {
    name: "role",
    prompt: "What best describes your work?",
    description: "We’ll tailor the examples you see first.",
    multiple: false,
    choices: [
      { value: "design", label: "Design" },
      { value: "engineering", label: "Engineering" },
      { value: "both", label: "A bit of both" },
    ],
  },
  {
    name: "interests",
    prompt: "What do you build most?",
    description: "Pick as many as you like.",
    multiple: true,
    choices: [
      { value: "forms", label: "Forms and inputs" },
      { value: "overlays", label: "Dialogs and sheets" },
      { value: "data", label: "Tables and data" },
    ],
  },
]

function OnboardingCard() {
  const [done, setDone] = React.useState(false)
  const [round, setRound] = React.useState(0)

  return (
    <Card>
      <CardContent>
        {done ? (
          <div className="flex flex-col items-start gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-base font-medium">You’re all set</span>
              <span className="text-muted-foreground">
                Your workspace is ready with examples picked for you.
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setDone(false)
                setRound(round + 1)
              }}
            >
              Start over
            </Button>
          </div>
        ) : (
          <Questionnaire
            key={round}
            items={items}
            shortcuts="numbers"
            onSubmit={(event) => {
              event.preventDefault()
              setDone(true)
            }}
          >
            <QuestionnaireProgress />
            {items.map((item) => (
              <QuestionnaireItem
                key={item.name}
                name={item.name}
                required
                multiple={item.multiple}
              >
                <QuestionnaireTitle>{item.prompt}</QuestionnaireTitle>
                <QuestionnaireDescription>
                  {item.description}
                </QuestionnaireDescription>
                <QuestionnaireChoices>
                  {item.choices.map((choice) => (
                    <QuestionnaireChoice
                      key={choice.value}
                      value={choice.value}
                    >
                      {choice.label}
                    </QuestionnaireChoice>
                  ))}
                </QuestionnaireChoices>
                <QuestionnaireError />
              </QuestionnaireItem>
            ))}
            <QuestionnaireActions>
              <QuestionnairePrevious />
              <QuestionnaireNext />
              <QuestionnaireSubmit />
            </QuestionnaireActions>
          </Questionnaire>
        )}
      </CardContent>
    </Card>
  )
}

export { OnboardingCard }
