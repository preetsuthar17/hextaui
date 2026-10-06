import { Inter } from "next/font/google"
import type { Metadata } from "next"
import Script from "next/script"

import "./globals.css"
import { DocsSearchProvider } from "@/components/docs/docs-search"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteChrome } from "@/components/site/site-chrome"
import { SiteHeader } from "@/components/site/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import {
  absoluteUrl,
  siteDescription,
  siteName,
  siteRepository,
  siteUrl,
} from "@/lib/site"
import { getGithubStars } from "@/lib/github"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toast"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteName,
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "HextaUI",
    "shadcn/ui",
    "React components",
    "Tailwind CSS",
    "UI components",
    "Base UI",
    "React component library",
    "accessible components",
    "Next.js components",
    "copy and paste components",
  ],
  creator: siteName,
  openGraph: {
    title: siteName,
    description: siteDescription,
    siteName,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: siteName,
    description: siteDescription,
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  name: siteName,
  description: siteDescription,
  url: siteUrl,
  codeRepository: siteRepository,
  programmingLanguage: ["TypeScript", "React"],
  runtimePlatform: "React",
  license: "https://opensource.org/licenses/MIT",
  isAccessibleForFree: true,
  documentation: absoluteUrl("/docs"),
  sameAs: [siteRepository],
}

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const stars = await getGithubStars()

  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={cn("antialiased", "font-sans", fontSans.variable)}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <ThemeProvider>
          <DocsSearchProvider>
            <div className="flex min-h-svh flex-col">
              <SiteChrome>
                <SiteHeader stars={stars} />
              </SiteChrome>
              <div className="flex flex-1 flex-col">{children}</div>
              <SiteChrome>
                <SiteFooter />
              </SiteChrome>
            </div>
          </DocsSearchProvider>
          <Toaster />
        </ThemeProvider>
        <Script
          src="https://assets.onedollarstats.com/stonks.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}
