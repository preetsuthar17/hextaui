import type { Metadata } from "next"

import { UnsubscribeView } from "@/components/account/unsubscribe-view"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Unsubscribe",
  description:
    "Stop or restart HextaUI release emails from the link in your inbox. You can also change this later in your account.",
  path: "/unsubscribe",
  noindex: true,
})

export default function Page() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 py-24">
      <UnsubscribeView />
    </main>
  )
}
