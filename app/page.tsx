import type { Metadata } from "next"
import Image from "next/image"

import { HeroActions } from "@/components/site/hero-actions"
import { Showcase } from "@/components/site/showcase/showcase"
import { getGithubStars } from "@/lib/github"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata({ path: "/" })

export default async function Page() {
  const stars = await getGithubStars()

  return (
    <main className="flex flex-1 flex-col">
      <section className="mx-auto flex w-full max-w-screen-2xl flex-col items-center gap-10 px-3 pt-20 pb-16 text-center sm:items-start sm:pt-28 sm:pb-24 sm:text-left">
        <h1 className="text-hero font-medium tracking-tighter">
          <span className="block whitespace-nowrap">
            Ready to use blocks &amp; components
          </span>{" "}
          <span className="block whitespace-nowrap">
            built on top of{" "}
            <Image
              src="https://github.com/shadcn.png"
              alt=""
              width={64}
              height={64}
              unoptimized
              className="inline-block size-[1em] rounded-full"
            />{" "}
            shadcn/ui
          </span>
        </h1>
        <HeroActions stars={stars} />
      </section>
      <section
        aria-label="Live examples"
        className="mx-auto w-full max-w-screen-2xl px-3 pb-24"
      >
        <Showcase />
      </section>
    </main>
  )
}
