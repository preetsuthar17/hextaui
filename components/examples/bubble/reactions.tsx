"use client"

import * as React from "react"
import {
  IconFlame,
  IconHeart,
  IconMoodSmile,
  IconThumbUp,
} from "@tabler/icons-react"

import { Bubble, BubbleContent, BubbleReactions } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"

function ReactionToggle({
  label,
  icon,
  initial = false,
}: {
  label: string
  icon: React.ReactNode
  initial?: boolean
}) {
  const [pressed, setPressed] = React.useState(initial)

  return (
    <Button
      aria-label={label}
      aria-pressed={pressed}
      variant={pressed ? "default" : "secondary"}
      size="icon-xs"
      onClick={() => setPressed(!pressed)}
    >
      {icon}
    </Button>
  )
}

export function BubbleReactionsDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Bubble variant="secondary">
        <BubbleContent>Shipped the new onboarding flow.</BubbleContent>
        <BubbleReactions
          role="img"
          aria-label="Reactions: thumbs up, fire, and 8 more"
        >
          <span>👍</span>
          <span>🔥</span>
          <span>+8</span>
        </BubbleReactions>
      </Bubble>
      <Bubble align="end">
        <BubbleContent>Reactions can anchor to the top.</BubbleContent>
        <BubbleReactions side="top" align="start" role="img" aria-label="Heart">
          <span>❤️</span>
        </BubbleReactions>
      </Bubble>
      <Bubble variant="secondary">
        <BubbleContent>ok</BubbleContent>
        <BubbleReactions
          role="img"
          aria-label="Reactions: party, eyes, rocket, check"
        >
          <span>🎉</span>
          <span>👀</span>
          <span>🚀</span>
          <span>✅</span>
        </BubbleReactions>
      </Bubble>
      <Bubble variant="outline">
        <BubbleContent>Interactive reactions use buttons.</BubbleContent>
        <BubbleReactions align="start">
          <ReactionToggle label="Thumbs up" icon={<IconThumbUp />} initial />
          <ReactionToggle label="Heart" icon={<IconHeart />} />
          <ReactionToggle label="Fire" icon={<IconFlame />} />
          <ReactionToggle label="Add reaction" icon={<IconMoodSmile />} />
        </BubbleReactions>
      </Bubble>
    </div>
  )
}
