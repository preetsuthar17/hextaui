import type { Metadata } from "next"

import { siteName, siteSummary, siteTitle, siteTwitter } from "@/lib/site"

type PageMetadataOptions = {
  path: string
  title?: string
  description?: string
  markdown?: string
}

function pageMetadata({
  path,
  title,
  description = siteSummary,
  markdown,
}: PageMetadataOptions): Metadata {
  const socialTitle = title ? `${title} — ${siteName}` : siteTitle
  const image = {
    url: "/opengraph-image",
    width: 1200,
    height: 630,
    alt: siteTitle,
  }

  return {
    ...(title ? { title } : {}),
    description,
    alternates: {
      canonical: path,
      ...(markdown ? { types: { "text/markdown": markdown } } : {}),
    },
    openGraph: {
      title: socialTitle,
      description,
      url: path,
      siteName,
      type: "website",
      locale: "en_US",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      creator: siteTwitter,
      images: [image],
    },
  }
}

export { pageMetadata }
