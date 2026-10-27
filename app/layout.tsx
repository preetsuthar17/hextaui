import { Inter } from "next/font/google"
import localFont from "next/font/local"
import type { Metadata, Viewport } from "next"

import "./globals.css"
import { DocsSearchProvider } from "@/components/docs/docs-search"
import { AnalyticsScript } from "@/components/site/analytics-script"
import { FrameLines } from "@/components/site/frame-lines"
import { SiteFooter } from "@/components/site/site-footer"
import { CookieConsent } from "@/components/site/cookie-consent"
import { InlineScript } from "@/components/site/inline-script"
import { JsonLd } from "@/components/site/json-ld"
import { SiteChrome } from "@/components/site/site-chrome"
import { SiteHeader } from "@/components/site/site-header"
import { WebMcp } from "@/components/site/web-mcp"
import { ThemeProvider } from "@/components/theme-provider"
import {
  siteAuthor,
  siteAuthorUrl,
  siteName,
  siteMetaDescription,
  siteThemeColor,
  siteTitle,
  siteTwitter,
  siteUrl,
} from "@/lib/site"
import { catalogViewScript } from "@/lib/catalog-view"
import { getGithubStars } from "@/lib/github"
import { siteJsonLd } from "@/lib/structured-data"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toast"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s — ${siteName}`,
  },
  description: siteMetaDescription,
  applicationName: siteName,
  keywords: [
    "HextaUI",
    "Hexta UI",
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
  authors: [{ name: siteAuthor, url: siteAuthorUrl }],
  creator: siteName,
  openGraph: {
    title: siteTitle,
    description: siteMetaDescription,
    url: "/",
    siteName,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteMetaDescription,
    site: siteTwitter,
    creator: siteTwitter,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: siteThemeColor.light },
    { media: "(prefers-color-scheme: dark)", color: siteThemeColor.dark },
  ],
}

const fontSans = Inter({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-inter",
})

const fontMono = localFont({
  src: "./fonts/PaperMono.woff2",
  weight: "100 800",
  style: "normal",
  display: "swap",
  variable: "--font-paper-mono",
  fallback: ["ui-monospace", "Menlo", "Consolas", "monospace"],
  adjustFontFallback: false,
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
      data-catalog-view="single"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        "font-sans",
        fontSans.variable,
        fontMono.variable
      )}
    >
      <body>
        <InlineScript html={catalogViewScript} />
        <JsonLd data={siteJsonLd()} />
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
          <FrameLines />
          <Toaster />
          <SiteChrome>
            <CookieConsent />
          </SiteChrome>
        </ThemeProvider>
        <AnalyticsScript />
        <WebMcp />
      </body>
    </html>
  )
}
