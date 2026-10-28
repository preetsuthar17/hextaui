"use client"

import * as React from "react"
import {
  IconBrandLinkedin,
  IconBrandProducthunt,
  IconBrandX,
  IconQuoteFilled,
  IconStarFilled,
  IconWorld,
} from "@tabler/icons-react"
import { cn } from "cn"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  getInitials,
} from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  formatTestimonialDate,
  radiusValues,
  sourceLabels,
  testimonialSubtitle,
  type Testimonial,
  type TestimonialSource,
  type WallOptions,
} from "@/lib/testimonial-wall/model"
import {
  accentClasses,
  cardVariants,
  featuredIndex,
  gridClasses,
  marqueeDuration,
  marqueeRows,
  masonryClasses,
  wallClasses as c,
} from "@/lib/testimonial-wall/styles"

const sourceIcons: Record<TestimonialSource, typeof IconBrandX> = {
  x: IconBrandX,
  linkedin: IconBrandLinkedin,
  producthunt: IconBrandProducthunt,
  web: IconWorld,
}

type CardProps = { testimonial: Testimonial; options: WallOptions }

const SelectContext = React.createContext<
  ((testimonial: Testimonial) => void) | null
>(null)

function Rating({ value, accent }: { value: number; accent: string }) {
  return (
    <div role="img" aria-label={`Rated ${value} out of 5`} className={c.rating}>
      {[1, 2, 3, 4, 5].map((star) => (
        <IconStarFilled
          key={star}
          aria-hidden
          className={star <= value ? cn(c.star, accent) : c.starEmpty}
        />
      ))}
    </div>
  )
}

function Source({ testimonial }: { testimonial: Testimonial }) {
  if (!testimonial.source) return null
  const Icon = sourceIcons[testimonial.source]
  const label = sourceLabels[testimonial.source]
  if (!testimonial.url) {
    return <Icon role="img" aria-label={label} className={c.sourceIcon} />
  }
  return (
    <a
      href={testimonial.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View on ${label}`}
      className={c.sourceLink}
    >
      <Icon aria-hidden className={c.icon} />
    </a>
  )
}

function TestimonialAvatar({
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
}

function TestimonialContent({ testimonial, options }: CardProps) {
  const { show } = options
  const subtitle = testimonialSubtitle(testimonial, show.handle)
  const rating = show.rating ? testimonial.rating : undefined
  const date = show.date ? testimonial.date : undefined

  return (
    <>
      <figcaption className={c.header}>
        {show.avatar ? <TestimonialAvatar testimonial={testimonial} /> : null}
        <div className={c.author}>
          <p className={c.name}>{testimonial.name}</p>
          {subtitle ? <p className={c.subtitle}>{subtitle}</p> : null}
        </div>
        {show.source ? <Source testimonial={testimonial} /> : null}
      </figcaption>
      <blockquote className={c.body}>{testimonial.body}</blockquote>
      {rating || date ? (
        <div className={c.meta}>
          {rating ? (
            <Rating value={rating} accent={accentClasses[options.accent]} />
          ) : null}
          {date ? (
            <time dateTime={date} className={c.date}>
              {formatTestimonialDate(date)}
            </time>
          ) : null}
        </div>
      ) : null}
    </>
  )
}

function TestimonialCard({ testimonial, options }: CardProps) {
  const select = React.useContext(SelectContext)
  if (!select) return <WallCard testimonial={testimonial} options={options} />
  return (
    <div
      data-slot="testimonial-wall-item"
      className="group/item relative h-full rounded-(--radius) [&_a]:relative [&_a]:z-10"
    >
      <button
        type="button"
        aria-label={`Edit quote from ${testimonial.name}`}
        onClick={() => select(testimonial)}
        className="absolute inset-0 z-[1] cursor-pointer rounded-(--radius) transition-shadow duration-150 ease-out-cubic outline-none hover:ring-(length:--hairline) hover:ring-foreground/25 focus-visible:ring-3 focus-visible:ring-focus-ring motion-reduce:transition-none forced-colors:focus-visible:outline-2 forced-colors:focus-visible:outline-solid"
      />
      <WallCard testimonial={testimonial} options={options} />
    </div>
  )
}

function WallCard({ testimonial, options }: CardProps) {
  if (options.cardStyle === "plain") {
    return (
      <figure className={c.plain}>
        <TestimonialContent testimonial={testimonial} options={options} />
      </figure>
    )
  }
  return (
    <Card
      variant={cardVariants[options.cardStyle]}
      size="sm"
      className="h-full"
    >
      <CardContent render={<figure />}>
        <TestimonialContent testimonial={testimonial} options={options} />
      </CardContent>
    </Card>
  )
}

function FeaturedContent({ testimonial, options }: CardProps) {
  const { show } = options
  const subtitle = testimonialSubtitle(testimonial, show.handle)
  const rating = show.rating ? testimonial.rating : undefined

  return (
    <>
      {rating ? (
        <Rating value={rating} accent={accentClasses[options.accent]} />
      ) : (
        <IconQuoteFilled
          aria-hidden
          className={cn(c.featuredQuote, accentClasses[options.accent])}
        />
      )}
      <blockquote className={c.featuredBody}>{testimonial.body}</blockquote>
      <figcaption className={c.featuredAuthor}>
        {show.avatar ? (
          <TestimonialAvatar testimonial={testimonial} size="lg" />
        ) : null}
        <div>
          <p className={c.featuredName}>{testimonial.name}</p>
          {subtitle ? <p className={c.featuredSubtitle}>{subtitle}</p> : null}
        </div>
      </figcaption>
    </>
  )
}

function FeaturedTestimonial({ testimonial, options }: CardProps) {
  const select = React.useContext(SelectContext)
  if (!select)
    return <FeaturedCard testimonial={testimonial} options={options} />
  return (
    <div
      data-slot="testimonial-wall-item"
      className="group/item relative mx-auto w-full max-w-2xl rounded-(--radius) [&_a]:relative [&_a]:z-10"
    >
      <button
        type="button"
        aria-label={`Edit quote from ${testimonial.name}`}
        onClick={() => select(testimonial)}
        className="absolute inset-0 z-[1] cursor-pointer rounded-(--radius) transition-shadow duration-150 ease-out-cubic outline-none hover:ring-(length:--hairline) hover:ring-foreground/25 focus-visible:ring-3 focus-visible:ring-focus-ring motion-reduce:transition-none forced-colors:focus-visible:outline-2 forced-colors:focus-visible:outline-solid"
      />
      <FeaturedCard testimonial={testimonial} options={options} />
    </div>
  )
}

function FeaturedCard({ testimonial, options }: CardProps) {
  if (options.cardStyle === "plain") {
    return (
      <figure className={c.featuredPlain}>
        <FeaturedContent testimonial={testimonial} options={options} />
      </figure>
    )
  }
  return (
    <Card
      variant={cardVariants[options.cardStyle]}
      className="mx-auto w-full max-w-2xl"
    >
      <CardContent>
        <figure className={c.featuredContent}>
          <FeaturedContent testimonial={testimonial} options={options} />
        </figure>
      </CardContent>
    </Card>
  )
}

function MarqueeRow({
  testimonials,
  options,
  reverse,
}: {
  testimonials: Testimonial[]
  options: WallOptions
  reverse: boolean
}) {
  return (
    <div className={c.marqueeRow}>
      <div
        className={cn(c.marqueeTrack, reverse && c.marqueeReverse)}
        style={
          {
            "--marquee-duration": marqueeDuration(testimonials.length),
          } as React.CSSProperties
        }
      >
        <div className={c.marqueeGroup}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className={c.marqueeItem}>
              <TestimonialCard testimonial={testimonial} options={options} />
            </div>
          ))}
        </div>
        <div aria-hidden inert className={c.marqueeClone}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className={c.marqueeItem}>
              <TestimonialCard testimonial={testimonial} options={options} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function WallLayout({
  testimonials,
  options,
}: {
  testimonials: Testimonial[]
  options: WallOptions
}) {
  switch (options.layout) {
    case "featured": {
      const testimonial =
        testimonials[featuredIndex(options, testimonials.length)]
      return testimonial ? (
        <FeaturedTestimonial testimonial={testimonial} options={options} />
      ) : null
    }
    case "marquee":
      return (
        <div className={c.marquee}>
          {marqueeRows(testimonials, options.rows).map((row, index) => (
            <MarqueeRow
              key={index}
              testimonials={row}
              options={options}
              reverse={index === 1}
            />
          ))}
        </div>
      )
    case "carousel":
      return (
        <Carousel aria-label="Testimonials">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem
                key={index}
                className={
                  options.columns === 3
                    ? "@lg:basis-1/2 @3xl:basis-1/3"
                    : options.columns === 2
                      ? "@lg:basis-1/2"
                      : "basis-full"
                }
              >
                <TestimonialCard testimonial={testimonial} options={options} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className={c.carouselControls}>
            <CarouselDots />
            <div className={c.carouselButtons}>
              <CarouselPrevious className="static" />
              <CarouselNext className="static" />
            </div>
          </div>
        </Carousel>
      )
    case "grid":
      return (
        <div className={gridClasses[options.columns]}>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              testimonial={testimonial}
              options={options}
            />
          ))}
        </div>
      )
    default:
      return (
        <div className={masonryClasses[options.columns]}>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              testimonial={testimonial}
              options={options}
            />
          ))}
        </div>
      )
  }
}

function TestimonialWall({
  testimonials,
  options,
  className,
  onSelect,
}: {
  testimonials: Testimonial[]
  options: WallOptions
  className?: string
  onSelect?: (index: number) => void
}) {
  const select = React.useMemo(
    () =>
      onSelect
        ? (testimonial: Testimonial) => {
            const index = testimonials.indexOf(testimonial)
            if (index >= 0) onSelect(index)
          }
        : null,
    [onSelect, testimonials]
  )
  return (
    <SelectContext.Provider value={select}>
      <section
        aria-label="Testimonials"
        data-slot="testimonial-wall"
        data-layout={options.layout}
        className={cn(c.root, className)}
        style={
          { "--radius": radiusValues[options.radius] } as React.CSSProperties
        }
      >
        <WallLayout testimonials={testimonials} options={options} />
      </section>
    </SelectContext.Provider>
  )
}

export { TestimonialWall }
