"use client"

import * as React from "react"

import { fetchGithubStars } from "@/lib/github"

const storageKey = "hextaui-github-stars"
const maxAge = 1000 * 60 * 10

let request: Promise<number | null> | undefined

function readCached() {
  try {
    const cached = JSON.parse(sessionStorage.getItem(storageKey) ?? "null")
    return cached && Date.now() - cached.at < maxAge
      ? (cached.stars as number)
      : null
  } catch {
    return null
  }
}

function loadStars() {
  request ??= fetchGithubStars().then((stars) => {
    if (stars !== null) {
      try {
        sessionStorage.setItem(
          storageKey,
          JSON.stringify({ stars, at: Date.now() })
        )
      } catch {}
    }
    return stars
  })
  return request
}

function useGithubStars(initial: number | null) {
  const [stars, setStars] = React.useState(initial)

  React.useEffect(() => {
    let active = true
    const cached = readCached()
    const next = cached === null ? loadStars() : Promise.resolve(cached)
    next.then((value) => {
      if (active && value !== null) setStars(value)
    })
    return () => {
      active = false
    }
  }, [])

  return stars
}

export { useGithubStars }
