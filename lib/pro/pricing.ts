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

const sale = {
  name: "Black Friday",
  prices: { solo: 49, team: 149 },
  endsAt: "2026-12-01T08:00:00Z",
} as const

function isSaleActive(now = Date.now()) {
  return now < Date.parse(sale.endsAt)
}

function planPrice(plan: SalePlanId, now = Date.now()) {
  return isSaleActive(now) ? sale.prices[plan] : proPlans[plan].price
}

function formatPrice(value: number) {
  return Number.isInteger(value) ? `$${value}` : `$${value.toFixed(2)}`
}

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
  formatPrice,
  isProPlanId,
  isSaleActive,
  isSalePlanId,
  isTeamPlan,
  planPrice,
  planRank,
  proPlans,
  refundDays,
  sale,
  salePlanIds,
  teamPlanIds,
  type ProPlanId,
  type SalePlanId,
  type TeamPlanId,
}
