import { blogImageAlt } from "@/lib/blog"
import { blogImageSize, blogPostImage } from "@/lib/blog-opengraph-image"

export const dynamic = "force-static"

const slug = "react-shopping-cart-optimistic-updates"

export const alt = blogImageAlt(slug)

export const size = blogImageSize

export const contentType = "image/png"

export default function Image() {
  return blogPostImage(slug)
}
