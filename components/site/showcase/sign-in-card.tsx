"use client"

import { IconLock, IconMail } from "@tabler/icons-react"

import { GithubLogo } from "@/components/site/github-logo"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupPasswordToggle,
} from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/toast"

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

function SignInCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to your workspace.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-5">
          <Button variant="outline">
            <GithubLogo />
            Continue with GitHub
          </Button>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Separator className="flex-1" />
            or
            <Separator className="flex-1" />
          </div>
          <form onSubmit={(event) => event.preventDefault()}>
            <FieldGroup>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    type="email"
                    autoComplete="email"
                    defaultValue="preet@hextaui.com"
                  />
                  <InputGroupAddon>
                    <IconMail />
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              <Field>
                <FieldLabel>Password</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    type="password"
                    autoComplete="current-password"
                    defaultValue="correct-horse-battery"
                  />
                  <InputGroupAddon>
                    <IconLock />
                  </InputGroupAddon>
                  <InputGroupAddon align="inline-end">
                    <InputGroupPasswordToggle />
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              <Button
                type="submit"
                feedback
                onClick={async () => {
                  await wait(900)
                  toast("Signed in", { description: "Welcome back, Preet." })
                }}
              >
                Sign in
              </Button>
            </FieldGroup>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}

export { SignInCard }
