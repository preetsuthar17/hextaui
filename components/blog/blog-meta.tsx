import Link from "@/components/site/link"
import { cn } from "cn"

import type { BlogPost } from "@/lib/blog"
import { getBlogHref } from "@/lib/blog"
import { getRequestLocale } from "@/lib/i18n/request"
import { t } from "@/lib/i18n/rich"

const authorLinkClassName =
  "rounded-sm text-foreground transition-colors duration-150 outline-none hover:underline hover:underline-offset-4 focus-visible:ring-3 focus-visible:ring-focus-ring motion-reduce:transition-none"

const rowLinkClassName =
  "rounded-sm outline-none after:absolute after:inset-0 hover:underline hover:underline-offset-4 focus-visible:ring-3 focus-visible:ring-focus-ring"

function formatBlogDate(date: string) {
  return new Intl.DateTimeFormat(getRequestLocale().locale, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(date))
}

function BlogMeta({
  published,
  minutes,
  author,
  className,
}: {
  published: string
  minutes: number
  author?: { name: string; url: string }
  className?: string
}) {
  return (
    <p className={className ?? "text-sm text-muted-foreground"}>
      {author ? (
        <>
          <a
            href={author.url}
            target="_blank"
            rel="noreferrer"
            className={authorLinkClassName}
          >
            {author.name}
          </a>
          {" · "}
        </>
      ) : null}
      <time dateTime={published}>{formatBlogDate(published)}</time>
      {" · "}
      {t("{minutes} min read", { minutes })}
    </p>
  )
}

function BlogTags({ tags }: { tags: string[] }) {
  return (
    <ul aria-label={t("Tags")} className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li
          key={tag}
          className="inline-flex rounded-md border px-2.5 py-1 text-sm text-muted-foreground"
        >
          {tag}
        </li>
      ))}
    </ul>
  )
}

function BlogRows({
  articles,
  level = 2,
  stacked = false,
}: {
  articles: { post: BlogPost; minutes: number }[]
  level?: 2 | 3
  stacked?: boolean
}) {
  const Heading = level === 2 ? "h2" : "h3"

  return (
    <ul className="flex flex-col">
      {articles.map(({ post, minutes }) => (
        <li
          key={post.slug}
          className={cn(
            "relative grid gap-x-8 gap-y-2 border-t py-8 first:border-t-0",
            !stacked && "sm:grid-cols-4"
          )}
        >
          <BlogMeta
            published={post.published}
            minutes={minutes}
            className="text-sm text-muted-foreground sm:pt-0.5"
          />
          <div
            className={cn(
              "flex max-w-2xl flex-col gap-2",
              !stacked && "sm:col-span-3"
            )}
          >
            <Heading className="font-display text-lg/snug font-semibold tracking-tight text-balance">
              <Link href={getBlogHref(post.slug)} className={rowLinkClassName}>
                {t(post.title)}
              </Link>
            </Heading>
            <p className="text-sm/6 text-pretty text-muted-foreground">
              {t(post.description)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}

export { BlogMeta, BlogRows, BlogTags, formatBlogDate }
