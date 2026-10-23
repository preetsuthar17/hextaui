"use client"

import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react"
import { cn } from "cn"

import { useInAppBrowserGate } from "@/components/site/open-in-browser"
import { Button } from "@/components/ui/button"
import { signIn, type SignInProvider } from "@/lib/auth-client"

const providers: {
  id: SignInProvider
  label: string
  icon: typeof IconBrandGithub
}[] = [
  { id: "github", label: "Continue with GitHub", icon: IconBrandGithub },
  { id: "google", label: "Continue with Google", icon: IconBrandGoogle },
]

function SignInOptions({
  className,
  openHref,
}: {
  className?: string
  openHref?: string
}) {
  const { guard, dialog } = useInAppBrowserGate()

  return (
    <div className={cn("flex w-full max-w-xs flex-col gap-2", className)}>
      {providers.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          variant={id === "github" ? "default" : "outline"}
          feedback
          successLabel="Redirecting…"
          errorLabel="Try again"
          onClick={() => guard("sign-in", () => signIn(id), openHref)}
        >
          <Icon data-icon="inline-start" />
          {label}
        </Button>
      ))}
      {dialog}
    </div>
  )
}

export { SignInOptions }
