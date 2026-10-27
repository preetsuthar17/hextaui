import type { Metadata } from "next"

import { AccountView } from "@/components/account/account-view"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Account",
  description:
    "Your HextaUI account: your profile, your HextaUI Pro access and the email settings for release notes.",
  path: "/account",
  noindex: true,
})

export default function Page() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-4 py-16">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight">Account</h1>
        <p className="text-sm text-muted-foreground">
          Your profile and HextaUI Pro access.
        </p>
      </header>
      <AccountView />
    </main>
  )
}
