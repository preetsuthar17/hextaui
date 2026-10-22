import Link from "@/components/site/link"

import { BlogBody } from "@/components/blog/blog-body"
import { BlogMeta, BlogRows, BlogTags } from "@/components/blog/blog-meta"
import { DocsPageActions } from "@/components/docs/docs-page-actions"
import { JsonLd } from "@/components/site/json-ld"
import {
  blogAuthor,
  getBlogHref,
  getBlogImageHref,
  getBlogMarkdownHref,
  getRelatedBlogPosts,
} from "@/lib/blog"
import { getBlogArticle } from "@/lib/blog-content"
import { t } from "@/lib/i18n/rich"
import { blogPostingJsonLd } from "@/lib/structured-data"

const backLinkClassName =
  "rounded-sm text-sm font-medium text-brand-strong outline-none hover:underline hover:underline-offset-4 focus-visible:ring-3 focus-visible:ring-focus-ring"

async function BlogPost({ slug }: { slug: string }) {
  const { post, blocks, words, minutes } = await getBlogArticle(slug)
  const path = getBlogHref(slug)
  const related = await Promise.all(
    getRelatedBlogPosts(slug).map((other) => getBlogArticle(other.slug))
  )

  return (
    <main className="flex flex-1 flex-col">
      <JsonLd
        data={blogPostingJsonLd({
          path,
          headline: post.title,
          description: post.description,
          published: post.published,
          tags: post.tags,
          words,
          minutes,
          image: getBlogImageHref(slug),
          author: blogAuthor,
        })}
      />
      <article className="flex flex-col">
        <header className="mx-auto flex w-full max-w-170 flex-col items-start px-4 pt-16 pb-12 sm:pt-24 sm:pb-16">
          <div className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-3">
            <Link href="/blog" className={backLinkClassName}>
              {t("Blog")}
            </Link>
            <DocsPageActions markdownHref={getBlogMarkdownHref(slug)} />
          </div>
          <h1 className="marketing-heading mt-6 text-balance">
            {t(post.title)}
          </h1>
          <p className="marketing-lede mt-5 text-pretty text-muted-foreground">
            {t(post.description)}
          </p>
          <BlogMeta
            published={post.published}
            minutes={minutes}
            author={blogAuthor}
            className="mt-6 text-sm text-muted-foreground"
          />
          <div className="mt-4">
            <BlogTags tags={post.tags} />
          </div>
        </header>
        <div className="border-t">
          <div className="mx-auto flex w-full max-w-170 flex-col px-4 pt-12 pb-20 *:first:mt-0 sm:pt-16 sm:pb-28">
            <BlogBody blocks={blocks} />
          </div>
        </div>
      </article>
      {related.length ? (
        <section aria-labelledby="related-posts" className="border-t">
          <div className="mx-auto w-full max-w-170 px-4 pt-20 pb-20 sm:pt-28 sm:pb-28">
            <h2
              id="related-posts"
              className="font-display text-2xl/tight font-semibold tracking-tight text-balance"
            >
              {t("Related posts")}
            </h2>
            <div className="mt-6 border-t">
              <BlogRows articles={related} level={3} stacked />
            </div>
          </div>
        </section>
      ) : null}
    </main>
  )
}

export { BlogPost }
