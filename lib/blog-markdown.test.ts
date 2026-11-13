import { describe, expect, it } from "vitest"

import { blogPosts } from "@/lib/blog"
import { getBlogArticle, getBlogPostMarkdown } from "@/lib/blog-content"
import { isBlogDiagram } from "@/lib/blog-diagrams"
import { blogPlainText, parseBlogMarkdown } from "@/lib/blog-markdown"
import { siteUrl } from "@/lib/site"

describe("blog figures", () => {
  it("parses an image line with alt text and a caption", () => {
    const [block] = parseBlogMarkdown(
      '![Stars in a row](/media/blog/x/rating.webp "Half stars from one gradient")'
    )
    expect(block).toEqual({
      type: "image",
      alt: "Stars in a row",
      src: "/media/blog/x/rating.webp",
      caption: "Half stars from one gradient",
    })
  })

  it("ends a paragraph at an image or a diagram", () => {
    const blocks = parseBlogMarkdown(
      "First line.\n![Alt](/a.webp)\nNext.\n!diagram[ui-sdk-layers]"
    )
    expect(blocks.map((block) => block.type)).toEqual([
      "paragraph",
      "image",
      "paragraph",
      "diagram",
    ])
  })

  it("counts captions as words", () => {
    const blocks = parseBlogMarkdown('![Alt](/a.webp "Two words")')
    expect(blogPlainText(blocks)).toBe("Two words")
  })

  it("gives every post image a size, and every diagram a definition", async () => {
    for (const post of blogPosts) {
      const { blocks } = await getBlogArticle(post.slug)
      for (const block of blocks) {
        if (block.type === "image") {
          expect(block.src).toMatch(/^\/media\/blog\//)
          expect(block.alt.length).toBeGreaterThan(0)
          expect(block.width).toBeGreaterThan(0)
          expect(block.height).toBeGreaterThan(0)
        }
        if (block.type === "diagram") {
          expect(isBlogDiagram(block.name)).toBe(true)
        }
      }
    }
  })

  it("writes absolute image URLs and diagram text in the Markdown twin", async () => {
    for (const post of blogPosts) {
      const markdown = await getBlogPostMarkdown(post.slug)
      expect(markdown).not.toMatch(/^!diagram\[/m)
      expect(markdown).not.toMatch(/!\[[^\]]*\]\(\//)
      for (const [, src] of markdown.matchAll(/!\[[^\]]*\]\((\S+)/g)) {
        expect(src.startsWith(`${siteUrl}/media/blog/`)).toBe(true)
      }
    }
  })
})
