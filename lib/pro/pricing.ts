const proPlans = {
  solo: {
    id: "solo",
    name: "Solo",
    price: 79,
    seats: 1,
    summary: "One developer, unlimited projects including client work.",
  },
  team: {
    id: "team",
    name: "Team",
    price: 249,
    seats: 10,
    summary:
      "Up to 10 developers on one invoice, with one shared token allowed in CI.",
  },
} as const

const legacyPlans = {
  unlimited: {
    id: "unlimited",
    name: "Unlimited",
    seats: null,
  },
} as const

const allProPlans = { ...proPlans, ...legacyPlans }

type ProPlanId = keyof typeof allProPlans

type SalePlanId = keyof typeof proPlans

const salePlanIds = Object.keys(proPlans) as SalePlanId[]

const teamPlanIds = ["team", "unlimited"] as const satisfies ProPlanId[]

type TeamPlanId = (typeof teamPlanIds)[number]

const planRank: Record<ProPlanId, number> = { solo: 0, team: 1, unlimited: 2 }

const refundDays = 30

const earlySoloPrice = 49

function isProPlanId(value: unknown): value is ProPlanId {
  return typeof value === "string" && Object.hasOwn(allProPlans, value)
}

function isSalePlanId(value: unknown): value is SalePlanId {
  return typeof value === "string" && Object.hasOwn(proPlans, value)
}

function isTeamPlan(plan: ProPlanId): plan is TeamPlanId {
  return plan !== "solo"
}

export {
  allProPlans,
  earlySoloPrice,
  isProPlanId,
  isSalePlanId,
  isTeamPlan,
  planRank,
  proPlans,
  refundDays,
  salePlanIds,
  teamPlanIds,
  type ProPlanId,
  type SalePlanId,
  type TeamPlanId,
}
