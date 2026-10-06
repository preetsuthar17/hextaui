"use client"

import { useEffect, useState } from "react"
import { createAuthClient } from "better-auth/react"

const authClient = createAuthClient()

type Session = typeof authClient.$Infer.Session

const signedInKey = "hextaui-signed-in"

function readSignedIn() {
  try {
    return localStorage.getItem(signedInKey) === "1"
  } catch {
    return false
  }
}

function writeSignedIn(signedIn: boolean) {
  try {
    if (signedIn) localStorage.setItem(signedInKey, "1")
    else localStorage.removeItem(signedInKey)
  } catch {}
}

let sessionRequest: Promise<Session | null> | undefined

function loadSession() {
  sessionRequest ??= authClient.getSession().then(
    ({ data }) => {
      writeSignedIn(Boolean(data))
      return data ?? null
    },
    () => null
  )
  return sessionRequest
}

function useSession() {
  const [state, setState] = useState<{
    session: Session | null
    pending: boolean
  }>({ session: null, pending: true })

  useEffect(() => {
    let active = true
    const request = readSignedIn() ? loadSession() : Promise.resolve(null)
    request.then((session) => {
      if (active) setState({ session, pending: false })
    })
    return () => {
      active = false
    }
  }, [])

  return state
}

type SignInProvider = "github" | "google"

function signIn(provider: SignInProvider) {
  writeSignedIn(true)
  return authClient.signIn.social({
    provider,
    callbackURL: window.location.pathname,
    errorCallbackURL: "/account",
  })
}

async function startCheckout() {
  const response = await fetch("/api/checkout", { method: "POST" })
  if (response.status === 401) {
    window.location.assign("/account")
    return
  }
  const { url } = (await response.json()) as { url?: string }
  if (!response.ok || !url) throw new Error("Checkout failed")
  window.location.assign(url)
}

async function signOut() {
  await authClient.signOut()
  writeSignedIn(false)
  sessionRequest = undefined
  window.location.reload()
}

export {
  authClient,
  signIn,
  signOut,
  startCheckout,
  useSession,
  type Session,
  type SignInProvider,
}
