import type { Metadata } from "next"

import { BlogPost } from "@/components/blog/blog-post"
import { blogPostMetadata } from "@/lib/blog"

const slug = "one-page-checkout-react-nextjs"

export const metadata: Metadata = blogPostMetadata(slug)

export default function Page() {
  return <BlogPost slug={slug} />
}
