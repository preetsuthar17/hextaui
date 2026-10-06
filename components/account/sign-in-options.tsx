"use client"

import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react"
import { cn } from "cn"

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

function SignInOptions({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-full max-w-xs flex-col gap-2", className)}>
      {providers.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          variant={id === "github" ? "default" : "outline"}
          feedback
          successLabel="Redirecting…"
          errorLabel="Try again"
          onClick={() => signIn(id)}
        >
          <Icon data-icon="inline-start" />
          {label}
        </Button>
      ))}
    </div>
  )
}

export { providers as signInProviders, SignInOptions }
