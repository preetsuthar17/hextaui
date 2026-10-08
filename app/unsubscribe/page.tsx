import type { Metadata } from "next"

import { UnsubscribeView } from "@/components/account/unsubscribe-view"

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
}

export default function Page() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 py-24">
      <UnsubscribeView />
    </main>
  )
}
