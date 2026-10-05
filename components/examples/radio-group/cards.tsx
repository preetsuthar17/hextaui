import {
  RadioGroup,
  RadioGroupCard,
  RadioGroupCardDescription,
  RadioGroupCardTitle,
} from "@/components/ui/radio-group"

const plans = [
  {
    value: "hobby",
    title: "Hobby",
    price: "Free",
    description: "For side projects and trying things out.",
  },
  {
    value: "pro",
    title: "Pro",
    price: "$20/mo",
    description: "Unlimited projects, analytics and priority builds.",
  },
  {
    value: "team",
    title: "Team",
    price: "$60/mo",
    description: "Everything in Pro, plus roles and audit logs.",
  },
]

export function RadioGroupCards() {
  return (
    <RadioGroup
      variant="card"
      aria-label="Plan"
      defaultValue="pro"
      className="max-w-md"
    >
      {plans.map((plan) => (
        <RadioGroupCard key={plan.value} value={plan.value}>
          <span className="flex items-baseline justify-between gap-3">
            <RadioGroupCardTitle>{plan.title}</RadioGroupCardTitle>
            <span className="text-muted-foreground tabular-nums">
              {plan.price}
            </span>
          </span>
          <RadioGroupCardDescription>
            {plan.description}
          </RadioGroupCardDescription>
        </RadioGroupCard>
      ))}
    </RadioGroup>
  )
}
