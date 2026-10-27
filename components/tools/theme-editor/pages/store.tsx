"use client"

import * as React from "react"
import { cn } from "cn"
import {
  IconHeart,
  IconSearch,
  IconShoppingBag,
  IconStarFilled,
  IconTruck,
} from "@tabler/icons-react"

import { BrandMark, PreviewFrame } from "@/components/tools/theme-editor/preview-frame"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const finishes = [
  { value: "clay", label: "Clay", tone: "var(--chart-1)" },
  { value: "moss", label: "Moss", tone: "var(--chart-2)" },
  { value: "ink", label: "Ink", tone: "var(--chart-3)" },
]

const sizes = ["8 oz", "12 oz", "16 oz"]

const related = [
  { name: "Pour-over set", price: "$64", tone: "var(--chart-4)", shape: "dripper" },
  { name: "Stoneware plate", price: "$28", tone: "var(--chart-2)", shape: "plate" },
  { name: "Travel tumbler", price: "$36", tone: "var(--chart-5)", shape: "tumbler" },
  { name: "Espresso cups, pair", price: "$32", tone: "var(--chart-1)", shape: "cup" },
] as const

type Shape = "mug" | (typeof related)[number]["shape"]

function ProductArt({ shape, tone, className }: { shape: Shape; tone: string; className?: string }) {
  return (
    <div
      className={cn(
        "relative isolate grid place-items-center overflow-hidden rounded-lg bg-background inset-ring-(length:--hairline) inset-ring-border",
        className
      )}
      style={{ "--tone": tone } as React.CSSProperties}
    >
      <span aria-hidden="true" className="absolute inset-0 -z-1 bg-(--tone) opacity-15" />
      <svg viewBox="0 0 120 120" aria-hidden="true" className="h-3/5 w-3/5 text-(--tone)">
        <ellipse cx="60" cy="104" rx="38" ry="5" className="fill-foreground/10" />
        {shape === "mug" ? (
          <>
            <path d="M84 46h6a12 12 0 0 1 0 24h-6" fill="none" stroke="currentColor" strokeWidth="7" />
            <path d="M28 30h58v56a16 16 0 0 1-16 16H44a16 16 0 0 1-16-16Z" fill="currentColor" />
            <path d="M28 30h58v8H28Z" className="fill-background/25" />
          </>
        ) : shape === "dripper" ? (
          <>
            <path d="M30 34h60L70 74H50Z" fill="currentColor" />
            <rect x="44" y="76" width="32" height="26" rx="6" fill="currentColor" opacity="0.6" />
          </>
        ) : shape === "plate" ? (
          <>
            <ellipse cx="60" cy="66" rx="46" ry="22" fill="currentColor" />
            <ellipse cx="60" cy="62" rx="30" ry="12" className="fill-background/25" />
          </>
        ) : shape === "tumbler" ? (
          <>
            <rect x="42" y="18" width="36" height="12" rx="4" fill="currentColor" opacity="0.6" />
            <path d="M40 32h40l-4 70H44Z" fill="currentColor" />
          </>
        ) : (
          <>
            <path d="M36 54h48v24a20 20 0 0 1-20 20h-8a20 20 0 0 1-20-20Z" fill="currentColor" />
            <path d="M84 62h4a8 8 0 0 1 0 16h-6" fill="none" stroke="currentColor" strokeWidth="5" />
          </>
        )}
      </svg>
    </div>
  )
}

function Store() {
  const [finish, setFinish] = React.useState("clay")
  const [size, setSize] = React.useState("12 oz")
  const tone = finishes.find((item) => item.value === finish)?.tone ?? finishes[0].tone

  return (
    <PreviewFrame label="Store preview" className="flex-col">
      <header className="flex h-14 shrink-0 items-center gap-6 border-b px-6">
        <span className="flex items-center gap-2">
          <BrandMark className="bg-primary text-primary-foreground" />
          <span className="text-sm font-semibold">Kiln & Co.</span>
        </span>
        <nav aria-label="Shop" className="hidden items-center gap-4 text-muted-foreground @2xl:flex">
          <a href="#mugs" aria-current="page" className="font-medium text-foreground">Mugs</a>
          <a href="#plates" className="hover:text-foreground">Plates</a>
          <a href="#coffee" className="hover:text-foreground">Coffee</a>
          <a href="#journal" className="hover:text-foreground">Journal</a>
        </nav>
        <div className="ms-auto flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" aria-label="Search">
            <IconSearch />
          </Button>
          <Button variant="ghost" size="sm" aria-label="Bag, 2 items">
            <IconShoppingBag data-icon="inline-start" />
            <span className="tabular-nums">2</span>
          </Button>
        </div>
      </header>
      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-8">
          <div className="grid grid-cols-1 gap-8 @3xl:grid-cols-2">
            <div className="flex flex-col gap-3">
              <ProductArt shape="mug" tone={tone} className="aspect-square w-full" />
              <div className="grid grid-cols-3 gap-3">
                {finishes.map((item) => (
                  <ProductArt key={item.value} shape="mug" tone={item.tone} className="aspect-[4/3]" />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="success" appearance="muted" size="sm">In stock</Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span className="flex text-warning" aria-label="Rated 4.8 out of 5">
                      {[0, 1, 2, 3, 4].map((star) => (
                        <IconStarFilled key={star} className="size-3.5" aria-hidden="true" />
                      ))}
                    </span>
                    4.8 · 1,204 reviews
                  </span>
                </div>
                <h2 className="font-heading text-2xl font-semibold tracking-tight">Everyday stoneware mug</h2>
                <p className="text-2xl font-semibold tabular-nums">$34</p>
                <p className="text-muted-foreground text-pretty">
                  Thrown by hand in Porto from local clay, glazed twice and fired at
                  1,280°C. Keeps coffee hot for longer and survives the dishwasher.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">
                  Finish <span className="font-normal text-muted-foreground">· {finishes.find((item) => item.value === finish)?.label}</span>
                </span>
                <div role="radiogroup" aria-label="Finish" className="flex gap-2">
                  {finishes.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      role="radio"
                      aria-checked={item.value === finish}
                      aria-label={item.label}
                      onClick={() => setFinish(item.value)}
                      className="size-8 rounded-full bg-(--tone) outline-none ring-offset-2 ring-offset-background inset-ring-(length:--hairline) inset-ring-foreground/15 focus-visible:ring-3 focus-visible:ring-focus-ring aria-checked:ring-2 aria-checked:ring-foreground forced-colors:border"
                      style={{ "--tone": item.tone } as React.CSSProperties}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Size</span>
                <ToggleGroup
                  variant="outline"
                  aria-label="Size"
                  value={[size]}
                  onValueChange={(value) => {
                    if (value[0]) setSize(value[0])
                  }}
                >
                  {sizes.map((item) => (
                    <ToggleGroupItem key={item} value={item}>
                      {item}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
              <div className="flex gap-2">
                <Button size="lg" className="flex-1">Add to bag · $34</Button>
                <Button variant="outline" size="icon-lg" aria-label="Save to wishlist">
                  <IconHeart />
                </Button>
              </div>
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <IconTruck className="size-4" aria-hidden="true" />
                Free shipping over $60. Arrives Thursday, October 30.
              </p>
              <Accordion defaultValue={["details"]}>
                <AccordionItem value="details">
                  <AccordionTrigger>Details and care</AccordionTrigger>
                  <AccordionContent>
                    Holds 12 oz to the brim. Microwave and dishwasher safe. Each glaze
                    pools a little differently, so no two mugs match exactly.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="returns">
                  <AccordionTrigger>Returns</AccordionTrigger>
                  <AccordionContent>
                    Free returns within 30 days. Chipped in transit? Send a photo and we
                    ship a new one the same day.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
          <section aria-labelledby="related-heading" className="flex flex-col gap-4">
            <h3 id="related-heading" className="font-heading text-base font-semibold">Pairs well with</h3>
            <ul className="grid grid-cols-2 gap-4 @3xl:grid-cols-4">
              {related.map((item) => (
                <li key={item.name} className="flex flex-col gap-2">
                  <ProductArt shape={item.shape} tone={item.tone} className="aspect-square" />
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="truncate font-medium">{item.name}</span>
                    <span className="text-muted-foreground tabular-nums">{item.price}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </PreviewFrame>
  )
}

export default Store
