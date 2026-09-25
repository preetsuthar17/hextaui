import { Inter } from "next/font/google"
import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const siteName = "HextaUI"
const siteDescription = "Beautiful components built on top of shadcn/ui."

export const metadata: Metadata = {
  title: siteName,
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "HextaUI",
    "shadcn/ui",
    "React components",
    "Tailwind CSS",
    "UI components",
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

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={cn("antialiased", "font-sans", fontSans.variable)}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
