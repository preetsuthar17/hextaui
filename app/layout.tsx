import { Inter } from "next/font/google"
import localFont from "next/font/local"
import type { Metadata } from "next"

import "./globals.css"
import { DocsSearchProvider } from "@/components/docs/docs-search"
import { AnalyticsScript } from "@/components/site/analytics-script"
import { SiteFooter } from "@/components/site/site-footer"
import { CookieConsent } from "@/components/site/cookie-consent"
import { SiteChrome } from "@/components/site/site-chrome"
import { SiteHeader } from "@/components/site/site-header"
import { WebMcp } from "@/components/site/web-mcp"
import { ThemeProvider } from "@/components/theme-provider"
import {
  absoluteUrl,
  siteAlternateNames,
  siteAuthor,
  siteContactEmail,
  siteName,
  siteRepository,
  siteSummary,
  siteTitle,
  siteTwitter,
  siteUrl,
} from "@/lib/site"
import { catalogViewScript } from "@/lib/catalog-view"
import { getProProductJsonLd } from "@/lib/pricing-info"
import { getGithubStars } from "@/lib/github"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toast"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s — ${siteName}`,
  },
  description: siteSummary,
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
  authors: [{ name: "Preet Suthar", url: "https://twitter.com/preetsuthar17" }],
  creator: siteName,
  openGraph: {
    title: siteTitle,
    description: siteSummary,
    url: "/",
    siteName,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteSummary,
    creator: siteTwitter,
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: siteName,
      alternateName: siteAlternateNames,
      url: `${siteUrl}/`,
      description: siteSummary,
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: "en",
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      alternateName: siteAlternateNames,
      url: `${siteUrl}/`,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/hextaui-logo.png"),
        width: 1040,
        height: 1040,
      },
      description: siteSummary,
      email: siteContactEmail,
      founder: {
        "@type": "Person",
        name: siteAuthor,
        url: "https://twitter.com/preetsuthar17",
      },
      address: {
        "@type": "PostalAddress",
        addressCountry: "IN",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: siteContactEmail,
        url: absoluteUrl("/contact"),
        availableLanguage: ["en"],
      },
      sameAs: [siteRepository, "https://twitter.com/preetsuthar17"],
    },
    getProProductJsonLd(),
    {
      "@type": "SoftwareSourceCode",
      "@id": `${siteUrl}/#software`,
      name: siteName,
      description: siteSummary,
      url: `${siteUrl}/`,
      codeRepository: siteRepository,
      programmingLanguage: ["TypeScript", "React"],
      runtimePlatform: "React",
      license: "https://opensource.org/licenses/MIT",
      isAccessibleForFree: true,
      documentation: absoluteUrl("/docs"),
      publisher: { "@id": `${siteUrl}/#organization` },
    },
  ],
}

const fontSans = Inter({
  subsets: ["latin"],
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
      suppressHydrationWarning
      className={cn(
        "antialiased",
        "font-sans",
        fontSans.variable,
        fontMono.variable
      )}
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: catalogViewScript }} />
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
