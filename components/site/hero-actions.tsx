"use client"

import Link from "@/components/site/link"
import { cn } from "cn"

import { GithubLogo } from "@/components/site/github-logo"
import { useGithubStars } from "@/components/site/use-github-stars"
import { formatStars } from "@/lib/github"
import { useChrome } from "@/lib/i18n/chrome"
import { siteRepository } from "@/lib/site"

function HeroActions({ stars: initial }: { stars: number | null }) {
  const c = useChrome()
  const stars = useGithubStars(initial)

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Link href="/blocks" className="hero-cta">
        {c("Browse blocks")}
      </Link>
      <a
        href={siteRepository}
        target="_blank"
        rel="noreferrer"
        aria-label={
          stars === null
            ? c("Star on GitHub")
            : `${c("Star on GitHub")}, ${stars.toLocaleString("en")}`
        }
        className="hero-cta-secondary"
      >
        <GithubLogo />
        {c("Star on GitHub")}
        {stars === null ? null : (
          <>
            <span aria-hidden="true" className="h-4 w-px bg-white/20" />
            <span aria-hidden="true" className="text-white/75 tabular-nums">
              {formatStars(stars)}
            </span>
          </>
        )}
      </a>
    </div>
  )
}

function StartActions({ className }: { className?: string }) {
  const c = useChrome()

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <Link href="/docs/installation" className="cta-primary">
        {c("Get started")}
      </Link>
      <Link href="/blocks" className="cta-secondary">
        {c("Browse blocks")}
      </Link>
    </div>
  )
}

export { HeroActions, StartActions }
