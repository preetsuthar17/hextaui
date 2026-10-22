import Link from "@/components/site/link"

import { BlogMeta, BlogRows, BlogTags } from "@/components/blog/blog-meta"
import { JsonLd } from "@/components/site/json-ld"
import {
  blogDescription,
  blogLead,
  blogPosts,
  blogTitle,
  getBlogHref,
} from "@/lib/blog"
import { getBlogArticle } from "@/lib/blog-content"
import { t } from "@/lib/i18n/rich"
import { blogJsonLd } from "@/lib/structured-data"

const featuredLinkClassName =
  "rounded-sm outline-none after:absolute after:inset-0 hover:underline hover:decoration-1 hover:underline-offset-4 focus-visible:ring-3 focus-visible:ring-focus-ring"

async function BlogIndex() {
  const articles = await Promise.all(
    blogPosts.map((post) => getBlogArticle(post.slug))
  )
  const [featured, ...rest] = articles

  return (
    <main className="flex flex-1 flex-col">
      <JsonLd
        data={blogJsonLd(
          blogDescription,
          blogPosts.map((post) => ({
            path: getBlogHref(post.slug),
            headline: post.title,
            published: post.published,
          }))
        )}
      />
      <header className="mx-auto flex w-full max-w-252 flex-col items-start px-4 pt-20 pb-16 sm:pt-28 sm:pb-20">
        <p className="text-sm font-medium text-brand-strong">{t(blogTitle)}</p>
        <h1 className="marketing-heading mt-3 text-balance">
          {t("The hard parts, written down")}
        </h1>
        <p className="marketing-lede mt-4 max-w-xl text-pretty text-muted-foreground">
          {t(blogLead)}
        </p>
      </header>
      {featured ? (
        <section aria-label={t(featured.post.title)} className="border-t">
          <div className="relative mx-auto grid w-full max-w-252 gap-x-8 gap-y-3 px-4 py-14 sm:grid-cols-4 sm:py-20">
            <BlogMeta
              published={featured.post.published}
              minutes={featured.minutes}
              className="text-sm text-muted-foreground sm:pt-2"
            />
            <div className="flex max-w-2xl flex-col items-start gap-4 sm:col-span-3">
              <h2 className="font-display text-2xl/tight font-semibold tracking-tight text-balance sm:text-3xl/tight">
                <Link
                  href={getBlogHref(featured.post.slug)}
                  className={featuredLinkClassName}
                >
                  {t(featured.post.title)}
                </Link>
              </h2>
              <p className="marketing-lede text-pretty text-muted-foreground">
                {t(featured.post.description)}
              </p>
              <BlogTags tags={featured.post.tags} />
            </div>
          </div>
        </section>
      ) : null}
      {rest.length ? (
        <section aria-label={t(blogTitle)} className="border-t">
          <div className="mx-auto w-full max-w-252 px-4 pt-4 pb-20 sm:pb-28">
            <BlogRows articles={rest} />
          </div>
        </section>
      ) : null}
    </main>
  )
}

export { BlogIndex }
