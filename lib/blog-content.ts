import { readFile } from "node:fs/promises"
import path from "node:path"

import {
  blogAuthor,
  blogDescription,
  blogPosts,
  blogTitle,
  getBlogHref,
  getBlogMarkdownHref,
  getBlogPost,
  getReadingMinutes,
  type BlogPost,
} from "@/lib/blog"
import {
  blogPlainText,
  countWords,
  parseBlogMarkdown,
  type BlogBlock,
} from "@/lib/blog-markdown"
import { getBlogDiagram } from "@/lib/blog-diagrams"
import { darkVariant, imageSize } from "@/lib/blog-media"
import { frontmatter } from "@/lib/frontmatter"
import { absoluteUrl, siteName } from "@/lib/site"

type BlogArticle = {
  post: BlogPost
  blocks: BlogBlock[]
  words: number
  minutes: number
  markdown: string
}

const contentDir = path.join(process.cwd(), "content/blog")

function blogContentFile(slug: string) {
  return `content/blog/${slug}.md`
}

function withImageFacts(block: BlogBlock): BlogBlock {
  if (block.type !== "image") return block
  return { ...block, ...imageSize(block.src), darkSrc: darkVariant(block.src) }
}

function markdownFigure(block: BlogBlock) {
  if (block.type === "image") {
    const title = block.caption ? ` "${block.caption}"` : ""
    return `![${block.alt}](${absoluteUrl(block.src)}${title})`
  }
  if (block.type === "diagram") {
    const { caption, description } = getBlogDiagram(block.name)
    return `**Diagram: ${caption}.** ${description}`
  }
  return undefined
}

function markdownTwinBody(markdown: string) {
  let fenced = false
  return markdown
    .split("\n")
    .map((line) => {
      if (line.startsWith("```")) fenced = !fenced
      if (fenced || !line.startsWith("!")) return line
      const [block] = parseBlogMarkdown(line)
      return (block && markdownFigure(block)) ?? line
    })
    .join("\n")
}

async function getBlogArticle(slug: string): Promise<BlogArticle> {
  const post = getBlogPost(slug)
  const markdown = (
    await readFile(path.join(contentDir, `${slug}.md`), "utf8")
  ).trim()
  const blocks = parseBlogMarkdown(markdown).map(withImageFacts)
  const words = countWords(blogPlainText(blocks))
  return { post, blocks, words, minutes: getReadingMinutes(words), markdown }
}

function postLine(post: BlogPost, href = getBlogMarkdownHref) {
  return `- [${post.title}](${absoluteUrl(href(post.slug))}): ${post.description}`
}

async function getBlogPostMarkdown(slug: string) {
  const { post, markdown, minutes } = await getBlogArticle(slug)
  return `${[
    frontmatter({
      title: post.title,
      description: post.description,
      author: blogAuthor.name,
      date: post.published,
      tags: post.tags.join(", "),
      url: absoluteUrl(getBlogHref(slug)),
    }),
    `# ${post.title}`,
    `> ${post.description}`,
    `By ${blogAuthor.name} · ${post.published} · ${minutes} min read`,
    markdownTwinBody(markdown),
  ].join("\n\n")}\n`
}

function getBlogIndexMarkdown() {
  return `${[
    `# ${siteName} ${blogTitle}`,
    `> ${blogDescription}`,
    blogPosts.map((post) => postLine(post, getBlogHref)).join("\n"),
  ].join("\n\n")}\n`
}

function getBlogLlms() {
  return `${[
    `# ${siteName} ${blogTitle}`,
    `> ${blogDescription} Each article is available as Markdown at its \`.md\` URL.`,
    `- Written by ${blogAuthor.name}, the maker of ${siteName}.\n- Append \`.md\` to any article URL for its Markdown, for example ${absoluteUrl(getBlogMarkdownHref(blogPosts[0].slug))}.`,
    "## Articles",
    blogPosts.map((post) => postLine(post)).join("\n"),
    "## Optional",
    `- [Site index](${absoluteUrl("/llms.txt")}): what ${siteName} is, when to use it, and every developer resource.\n- [Docs index](${absoluteUrl("/docs/llms.txt")}): every docs page as Markdown.`,
  ].join("\n\n")}\n`
}

export {
  blogContentFile,
  getBlogArticle,
  getBlogIndexMarkdown,
  getBlogLlms,
  getBlogPostMarkdown,
  type BlogArticle,
}
