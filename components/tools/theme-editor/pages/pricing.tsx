"use client"

import * as React from "react"
import { IconCheck, IconMinus } from "@tabler/icons-react"

import { BrandMark, PreviewFrame } from "@/components/tools/theme-editor/preview-frame"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { NumberFlow } from "@/components/ui/number-flow"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const tiers = [
  {
    name: "Hobby",
    description: "For side projects and first deploys.",
    monthly: 0,
    yearly: 0,
    cta: "Start free",
    features: ["3 projects", "10k requests / month", "Community support", "1 day log retention"],
  },
  {
    name: "Pro",
    description: "For teams shipping to production every day.",
    monthly: 24,
    yearly: 19,
    cta: "Start 14-day trial",
    popular: true,
    features: [
      "Unlimited projects",
      "1M requests / month",
      "Preview deployments",
      "30 day log retention",
      "Email support, 1 business day",
    ],
  },
  {
    name: "Enterprise",
    description: "For security reviews, SSO and custom limits.",
    monthly: null,
    yearly: null,
    cta: "Talk to sales",
    features: ["SAML SSO and SCIM", "99.99% uptime SLA", "Audit logs", "Dedicated engineer"],
  },
]

const rows: { label: string; values: (boolean | string)[] }[] = [
  { label: "Team members", values: ["1", "Up to 20", "Unlimited"] },
  { label: "Custom domains", values: ["1", "50", "Unlimited"] },
  { label: "Edge regions", values: ["3", "18", "18 + private"] },
  { label: "Role-based access", values: [false, true, true] },
  { label: "SSO", values: [false, false, true] },
]

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <IconCheck className="mx-auto size-4 text-primary" aria-label="Included" />
  if (value === false)
    return <IconMinus className="mx-auto size-4 text-muted-foreground/60" aria-label="Not included" />
  return <span className="tabular-nums">{value}</span>
}

function Pricing() {
  const [billing, setBilling] = React.useState("yearly")

  return (
    <PreviewFrame label="Pricing preview" className="flex-col">
      <header className="flex h-14 shrink-0 items-center gap-6 border-b px-6">
        <span className="flex items-center gap-2">
          <BrandMark className="bg-primary text-primary-foreground" />
          <span className="text-sm font-semibold">Stratus</span>
        </span>
        <nav aria-label="Site" className="hidden items-center gap-4 text-muted-foreground @2xl:flex">
          <a href="#product" className="hover:text-foreground">Product</a>
          <a href="#docs" className="hover:text-foreground">Docs</a>
          <a href="#pricing" aria-current="page" className="font-medium text-foreground">Pricing</a>
          <a href="#changelog" className="hover:text-foreground">Changelog</a>
        </nav>
        <div className="ms-auto flex items-center gap-2">
          <Button variant="ghost" size="sm">Sign in</Button>
          <Button size="sm">Get started</Button>
        </div>
      </header>
      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-6 py-10">
          <div className="flex max-w-xl flex-col items-center gap-3 text-center">
            <Badge appearance="outline" shape="pill">Pricing</Badge>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance">
              Ship on Friday. Sleep on Friday.
            </h2>
            <p className="text-muted-foreground text-pretty">
              Every plan includes global edge hosting, instant rollbacks and the
              same fast build machines. Pay for seats, not surprises.
            </p>
          </div>
          <ToggleGroup
            variant="outline"
            size="sm"
            aria-label="Billing period"
            value={[billing]}
            onValueChange={(value) => {
              if (value[0]) setBilling(value[0])
            }}
          >
            <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
            <ToggleGroupItem value="yearly">
              Yearly
              <span className="text-xs text-success">Save 20%</span>
            </ToggleGroupItem>
          </ToggleGroup>
          <div className="grid w-full grid-cols-1 items-stretch gap-4 @3xl:grid-cols-3">
            {tiers.map((tier) => {
              const price = billing === "yearly" ? tier.yearly : tier.monthly
              return (
                <Card
                  key={tier.name}
                  variant={tier.popular ? "muted" : "default"}
                >
                  <CardHeader>
                    <CardTitle>
                      <span className="flex items-center gap-2">
                        {tier.name}
                        {tier.popular ? (
                          <Badge size="sm">Most popular</Badge>
                        ) : null}
                      </span>
                    </CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-5">
                      <p className="flex h-10 items-baseline gap-1">
                        {price === null ? (
                          <span className="text-3xl font-semibold tracking-tight">Custom</span>
                        ) : (
                          <>
                            <NumberFlow
                              value={price}
                              format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
                              className="text-4xl font-semibold tracking-tight"
                            />
                            <span className="text-muted-foreground">
                              {price === 0 ? "forever" : "per seat / month"}
                            </span>
                          </>
                        )}
                      </p>
                      <ul className="flex flex-col gap-2.5">
                        {tier.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <IconCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button className="w-full" variant={tier.popular ? "default" : "outline"}>
                      {tier.cta}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[32rem] text-sm">
              <caption className="pb-3 text-start font-heading text-base font-semibold">
                Compare plans
              </caption>
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th scope="col" className="py-2.5 text-start font-medium">Feature</th>
                  {tiers.map((tier) => (
                    <th key={tier.name} scope="col" className="py-2.5 text-center font-medium">
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-b last:border-0">
                    <th scope="row" className="py-2.5 text-start font-normal">{row.label}</th>
                    {row.values.map((value, index) => (
                      <td key={tiers[index].name} className="py-2.5 text-center">
                        <Cell value={value} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground">
            Prices in USD, excluding tax. Nonprofits and students get 50% off Pro.
          </p>
        </div>
      </main>
    </PreviewFrame>
  )
}

export default Pricing
