"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"

const items = [
  {
    name: "role",
    required: true,
    prompt: "What best describes your work?",
    description: "We'll tailor the examples you see first.",
    choices: [
      {
        value: "design",
        label: "Design",
        description: "Interfaces, systems and prototypes.",
      },
      {
        value: "engineering",
        label: "Engineering",
        description: "Shipping and maintaining product code.",
      },
      {
        value: "both",
        label: "A bit of both",
        description: "Design engineering, the best kind.",
      },
    ],
  },
  {
    name: "interests",
    multiple: true,
    required: true,
    prompt: "Which components do you reach for most?",
    description: "Pick as many as you like.",
    choices: [
      { value: "forms", label: "Forms and inputs" },
      { value: "overlays", label: "Dialogs and sheets" },
      { value: "navigation", label: "Menus and navigation" },
      { value: "data", label: "Tables and data" },
    ],
  },
  {
    name: "source",
    prompt: "How did you find HextaUI?",
    description: "Optional. Skip it if you don't remember.",
    choices: [
      { value: "x", label: "X / Twitter" },
      { value: "github", label: "GitHub" },
      { value: "friend", label: "A friend" },
    ],
    input: { label: "Somewhere else", placeholder: "Somewhere else…" },
  },
] as const

export function QuestionnaireDemo() {
  const [answers, setAnswers] = React.useState<[string, string][] | null>(null)

  if (answers) {
    return (
      <div className="flex w-full max-w-md flex-col items-start gap-4 rounded-xl border p-5">
        <div className="flex flex-col gap-1">
          <p className="font-medium">Thanks, that helps a lot.</p>
          <p className="text-sm text-muted-foreground">
            Here&apos;s what the form sent:
          </p>
        </div>
        <ul className="flex w-full flex-col gap-1 font-mono text-xs">
          {answers.map(([name, value], index) => (
            <li key={index} className="flex justify-between gap-4">
              <span className="text-muted-foreground">{name}</span>
              <span className="truncate">{value}</span>
            </li>
          ))}
        </ul>
        <Button variant="outline" size="sm" onClick={() => setAnswers(null)}>
          Start over
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md rounded-xl border p-5">
      <Questionnaire
        items={items}
        shortcuts="letters"
        onSubmit={(event) => {
          event.preventDefault()
          const data = new FormData(event.currentTarget)
          setAnswers(
            Array.from(data.entries(), ([name, value]) => [name, String(value)])
          )
        }}
      >
        <QuestionnaireProgress />
        {items.map((item) => (
          <QuestionnaireItem
            key={item.name}
            name={item.name}
            required={"required" in item && item.required}
            multiple={"multiple" in item && item.multiple}
          >
            <QuestionnaireTitle>{item.prompt}</QuestionnaireTitle>
            <QuestionnaireDescription>
              {item.description}
            </QuestionnaireDescription>
            <QuestionnaireChoices>
              {item.choices.map((choice) => (
                <QuestionnaireChoice key={choice.value} value={choice.value}>
                  <span className="font-medium">{choice.label}</span>
                  {"description" in choice ? (
                    <QuestionnaireChoiceDescription>
                      {choice.description}
                    </QuestionnaireChoiceDescription>
                  ) : null}
                </QuestionnaireChoice>
              ))}
              {"input" in item ? (
                <QuestionnaireInput
                  aria-label={item.input.label}
                  placeholder={item.input.placeholder}
                />
              ) : null}
            </QuestionnaireChoices>
            <QuestionnaireError />
          </QuestionnaireItem>
        ))}
        <QuestionnaireActions>
          <QuestionnairePrevious />
          <QuestionnaireSkip />
          <QuestionnaireNext />
          <QuestionnaireSubmit />
        </QuestionnaireActions>
      </Questionnaire>
    </div>
  )
}
