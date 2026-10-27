import { cn } from "cn"

import { siteUrl } from "@/lib/site"
import {
  radiusValues,
  sourceLabels,
  testimonialSources,
  type Testimonial,
  type WallOptions,
  type WallState,
} from "@/lib/testimonial-wall/model"
import {
  accentClasses,
  cardVariants,
  featuredIndex,
  gridClasses,
  marqueeKeyframes,
  masonryClasses,
  wallClasses as c,
} from "@/lib/testimonial-wall/styles"

const sourceIconNames = {
  x: "IconBrandX",
  linkedin: "IconBrandLinkedin",
  producthunt: "IconBrandProducthunt",
  web: "IconWorld",
} as const

const testimonialKeys: (keyof Testimonial)[] = [
  "name",
  "handle",
  "role",
  "avatarUrl",
  "body",
  "source",
  "url",
  "date",
  "rating",
]

function wallDependencies(options: WallOptions) {
  return [
    ...(options.show.avatar ? ["avatar"] : []),
    ...(options.cardStyle === "plain" ? [] : ["card"]),
    ...(options.layout === "carousel" ? ["carousel"] : []),
  ]
}

function needsIcons(options: WallOptions) {
  return (
    options.show.source || options.show.rating || options.layout === "featured"
  )
}

function wallNeedsIconPackage(options: WallOptions) {
  return (
    needsIcons(options) && !options.show.avatar && options.layout !== "carousel"
  )
}

function wallInstallPackages(options: WallOptions) {
  return [
    "shadcn@latest",
    "add",
    ...wallDependencies(options).map((name) => `${siteUrl}/r/${name}.json`),
  ]
}

function wallInstallCommand(options: WallOptions) {
  return `npx ${wallInstallPackages(options).join(" ")}`
}

function literal(value: string | number) {
  return typeof value === "number" ? String(value) : JSON.stringify(value)
}

function testimonialLiteral(testimonial: Testimonial) {
  const lines = testimonialKeys.flatMap((key) => {
    const value = testimonial[key]
    return value === undefined ? [] : [`    ${key}: ${literal(value)},`]
  })
  return `  {\n${lines.join("\n")}\n  },`
}

function indent(code: string, spaces: number) {
  const pad = " ".repeat(spaces)
  return code
    .split("\n")
    .map((line) => (line ? `${pad}${line}` : line))
    .join("\n")
}

function iconImports(options: WallOptions, testimonials: Testimonial[]) {
  const names = new Set<string>()
  if (options.show.source) {
    for (const source of testimonialSources) names.add(sourceIconNames[source])
  }
  if (options.show.rating) names.add("IconStarFilled")
  if (options.layout === "featured") {
    const featured = testimonials[featuredIndex(options, testimonials.length)]
    if (!options.show.rating || !featured?.rating) names.add("IconQuoteFilled")
  }
  return [...names].sort()
}

function importBlock(state: WallState) {
  const { options, testimonials } = state
  const lines: string[] = []
  lines.push(`import type { CSSProperties } from "react"`)
  const icons = iconImports(options, testimonials)
  if (icons.length > 0) {
    lines.push(
      `import {\n${icons.map((name) => `  ${name},`).join("\n")}\n} from "@tabler/icons-react"`
    )
  }
  lines.push("")
  if (options.show.avatar) {
    lines.push(
      `import {\n  Avatar,\n  AvatarFallback,\n  AvatarImage,\n  getInitials,\n} from "@/components/ui/avatar"`
    )
  }
  if (options.cardStyle !== "plain") {
    lines.push(`import { Card, CardContent } from "@/components/ui/card"`)
  }
  if (options.layout === "carousel") {
    lines.push(
      `import {\n  Carousel,\n  CarouselContent,\n  CarouselDots,\n  CarouselItem,\n  CarouselNext,\n  CarouselPrevious,\n} from "@/components/ui/carousel"`
    )
  }
  return lines.join("\n")
}

const typeBlock = `type Testimonial = {
  name: string
  handle?: string
  role?: string
  avatarUrl?: string
  body: string
  source?: ${testimonialSources.map((source) => JSON.stringify(source)).join(" | ")}
  url?: string
  date?: string
  rating?: number
}`

function sourcesBlock() {
  const entries = testimonialSources
    .map(
      (source) =>
        `  ${source}: { label: ${literal(sourceLabels[source])}, icon: ${sourceIconNames[source]} },`
    )
    .join("\n")
  return `const sources = {\n${entries}\n}`
}

const dateBlock = `const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})`

function ratingBlock(options: WallOptions) {
  const filled = cn(c.star, accentClasses[options.accent])
  return `function Rating({ value }: { value: number }) {
  return (
    <div
      role="img"
      aria-label={\`Rated \${value} out of 5\`}
      className=${literal(c.rating)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <IconStarFilled
          key={star}
          aria-hidden
          className={
            star <= value
              ? ${literal(filled)}
              : ${literal(c.starEmpty)}
          }
        />
      ))}
    </div>
  )
}`
}

const sourceBlock = `function Source({ testimonial }: { testimonial: Testimonial }) {
  if (!testimonial.source) return null
  const { label, icon: Icon } = sources[testimonial.source]
  if (!testimonial.url) {
    return (
      <Icon
        role="img"
        aria-label={label}
        className=${literal(c.sourceIcon)}
      />
    )
  }
  return (
    <a
      href={testimonial.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={\`View on \${label}\`}
      className=${literal(c.sourceLink)}
    >
      <Icon aria-hidden className=${literal(c.icon)} />
    </a>
  )
}`

const avatarBlock = `function TestimonialAvatar({
  testimonial,
  size,
}: {
  testimonial: Testimonial
  size?: "lg"
}) {
  return (
    <Avatar size={size}>
      {testimonial.avatarUrl ? (
        <AvatarImage
          src={testimonial.avatarUrl}
          alt=""
          referrerPolicy="no-referrer"
        />
      ) : null}
      <AvatarFallback>{getInitials(testimonial.name)}</AvatarFallback>
    </Avatar>
  )
}`

function subtitleLine(options: WallOptions) {
  return options.show.handle
    ? "  const subtitle = testimonial.handle\n    ? `@${testimonial.handle}`\n    : testimonial.role\n"
    : ""
}

function contentLines(options: WallOptions) {
  const { show } = options
  const meta = show.rating || show.date
  const metaCondition = [
    show.rating ? "testimonial.rating" : "",
    show.date ? "testimonial.date" : "",
  ]
    .filter(Boolean)
    .join(" || ")
  const lines = [
    `<figcaption className=${literal(c.header)}>`,
    show.avatar ? `  <TestimonialAvatar testimonial={testimonial} />` : null,
    `  <div className=${literal(c.author)}>`,
    `    <p className=${literal(c.name)}>{testimonial.name}</p>`,
    show.handle
      ? `    {subtitle ? <p className=${literal(c.subtitle)}>{subtitle}</p> : null}`
      : null,
    `  </div>`,
    show.source ? `  <Source testimonial={testimonial} />` : null,
    `</figcaption>`,
    `<blockquote className=${literal(c.body)}>{testimonial.body}</blockquote>`,
    meta ? `{${metaCondition} ? (` : null,
    meta ? `  <div className=${literal(c.meta)}>` : null,
    show.rating
      ? `    {testimonial.rating ? (
      <Rating value={testimonial.rating} />
    ) : null}`
      : null,
    show.date
      ? `    {testimonial.date ? (
      <time dateTime={testimonial.date} className=${literal(c.date)}>
        {dateFormat.format(new Date(\`\${testimonial.date}T00:00:00Z\`))}
      </time>
    ) : null}`
      : null,
    meta ? `  </div>` : null,
    meta ? `) : null}` : null,
  ]
  return lines.filter((line) => line !== null).join("\n")
}

function cardBlock(options: WallOptions) {
  const content = contentLines(options)
  const body =
    options.cardStyle === "plain"
      ? `    <figure className=${literal(c.plain)}>
${indent(content, 6)}
    </figure>`
      : `    <Card variant=${literal(cardVariants[options.cardStyle])} size="sm" className="h-full">
      <CardContent render={<figure />}>
${indent(content, 8)}
      </CardContent>
    </Card>`
  return `function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
${options.show.handle ? `${subtitleLine(options)}\n` : ""}  return (
${body}
  )
}`
}

function featuredBlock(options: WallOptions, testimonials: Testimonial[]) {
  const testimonial = testimonials[featuredIndex(options, testimonials.length)]
  const rating = options.show.rating && testimonial?.rating
  const accent = accentClasses[options.accent]
  const content = [
    rating
      ? `<Rating value={${testimonial.rating}} />`
      : `<IconQuoteFilled
  aria-hidden
  className=${literal(cn(c.featuredQuote, accent))}
/>`,
    `<blockquote className=${literal(c.featuredBody)}>
  {testimonial.body}
</blockquote>`,
    `<figcaption className=${literal(c.featuredAuthor)}>`,
    options.show.avatar
      ? `  <TestimonialAvatar testimonial={testimonial} size="lg" />`
      : null,
    `  <div>`,
    `    <p className=${literal(c.featuredName)}>{testimonial.name}</p>`,
    options.show.handle
      ? `    {subtitle ? (
      <p className=${literal(c.featuredSubtitle)}>{subtitle}</p>
    ) : null}`
      : null,
    `  </div>`,
    `</figcaption>`,
  ]
    .filter((line) => line !== null)
    .join("\n")
  const body =
    options.cardStyle === "plain"
      ? `      <figure className=${literal(c.featuredPlain)}>
${indent(content, 8)}
      </figure>`
      : `      <Card
        variant=${literal(cardVariants[options.cardStyle])}
        className="mx-auto w-full max-w-2xl"
      >
        <CardContent>
          <figure className=${literal(c.featuredContent)}>
${indent(content, 12)}
          </figure>
        </CardContent>
      </Card>`
  return `export function TestimonialWall() {
${options.show.handle ? `${subtitleLine(options)}\n` : ""}  return (
    <section
      aria-label="Testimonials"
      data-slot="testimonial-wall"
      data-layout="featured"
      className=${literal(c.root)}
      style={{ "--radius": ${literal(radiusValues[options.radius])} } as CSSProperties}
    >
${body}
    </section>
  )
}`
}

function marqueeBlock() {
  const items = `{row.map((testimonial, index) => (
            <div key={index} className=${literal(c.marqueeItem)}>
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}`
  return `function MarqueeRow({
  row,
  reverse,
}: {
  row: Testimonial[]
  reverse: boolean
}) {
  return (
    <div className=${literal(c.marqueeRow)}>
      <div
        className={
          reverse
            ? ${literal(cn(c.marqueeTrack, c.marqueeReverse))}
            : ${literal(c.marqueeTrack)}
        }
        style={
          {
            "--marquee-duration": \`\${Math.max(20, row.length * 8)}s\`,
          } as CSSProperties
        }
      >
        <div className=${literal(c.marqueeGroup)}>
          ${items}
        </div>
        <div aria-hidden inert className=${literal(c.marqueeClone)}>
          ${items}
        </div>
      </div>
    </div>
  )
}`
}

function layoutBody(options: WallOptions) {
  switch (options.layout) {
    case "marquee":
      return options.rows === 2
        ? `<div className=${literal(c.marquee)}>
  <style>{${literal(marqueeKeyframes)}}</style>
  {rows.map((row, index) => (
    <MarqueeRow key={index} row={row} reverse={index === 1} />
  ))}
</div>`
        : `<div className=${literal(c.marquee)}>
  <style>{${literal(marqueeKeyframes)}}</style>
  <MarqueeRow row={testimonials} reverse={false} />
</div>`
    case "carousel":
      return `<Carousel aria-label="Testimonials">
  <CarouselContent>
    {testimonials.map((testimonial, index) => (
      <CarouselItem
        key={index}
        className=${literal(
          options.columns === 3
            ? "@lg:basis-1/2 @3xl:basis-1/3"
            : options.columns === 2
              ? "@lg:basis-1/2"
              : "basis-full"
        )}
      >
        <TestimonialCard testimonial={testimonial} />
      </CarouselItem>
    ))}
  </CarouselContent>
  <div className=${literal(c.carouselControls)}>
    <CarouselDots />
    <div className=${literal(c.carouselButtons)}>
      <CarouselPrevious className="static" />
      <CarouselNext className="static" />
    </div>
  </div>
</Carousel>`
    default: {
      const classes =
        options.layout === "grid"
          ? gridClasses[options.columns]
          : masonryClasses[options.columns]
      return `<div className=${literal(classes)}>
  {testimonials.map((testimonial, index) => (
    <TestimonialCard key={index} testimonial={testimonial} />
  ))}
</div>`
    }
  }
}

const rowsBlock = `  const rows =
    testimonials.length < 4
      ? [testimonials]
      : [
          testimonials.filter((_, index) => index % 2 === 0),
          testimonials.filter((_, index) => index % 2 === 1),
        ]

`

function wallBlock(options: WallOptions) {
  return `export function TestimonialWall() {
${options.layout === "marquee" && options.rows === 2 ? rowsBlock : ""}  return (
    <section
      aria-label="Testimonials"
      data-slot="testimonial-wall"
      data-layout=${literal(options.layout)}
      className=${literal(c.root)}
      style={{ "--radius": ${literal(radiusValues[options.radius])} } as CSSProperties}
    >
${indent(layoutBody(options), 6)}
    </section>
  )
}`
}

function generateWallCode(state: WallState) {
  const { options, testimonials } = state
  const featured = options.layout === "featured"
  const featuredItem = testimonials[featuredIndex(options, testimonials.length)]
  const usesRating = featured
    ? options.show.rating && Boolean(featuredItem?.rating)
    : options.show.rating
  const imports = importBlock(state)
  const blocks = [
    imports,
    typeBlock,
    featured
      ? `const testimonial: Testimonial = ${testimonialLiteral(featuredItem).trim().replace(/,$/, "").replace(/\n  /g, "\n")}`
      : `const testimonials: Testimonial[] = [\n${testimonials.map(testimonialLiteral).join("\n")}\n]`,
    !featured && options.show.source ? sourcesBlock() : null,
    !featured && options.show.date ? dateBlock : null,
    usesRating ? ratingBlock(options) : null,
    !featured && options.show.source ? sourceBlock : null,
    options.show.avatar ? avatarBlock : null,
    featured ? null : cardBlock(options),
    options.layout === "marquee" ? marqueeBlock() : null,
    featured ? featuredBlock(options, testimonials) : wallBlock(options),
  ]
  return `${blocks.filter(Boolean).join("\n\n")}\n`
}

export {
  generateWallCode,
  wallDependencies,
  wallInstallCommand,
  wallInstallPackages,
  wallNeedsIconPackage,
}
