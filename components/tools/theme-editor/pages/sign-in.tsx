"use client"

import * as React from "react"
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconEye,
  IconEyeOff,
  IconLock,
} from "@tabler/icons-react"

import { BrandMark, PreviewFrame } from "@/components/tools/theme-editor/preview-frame"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"

const team = ["AL", "MK", "JS", "RT"]

function SignIn() {
  const id = React.useId()
  const [visible, setVisible] = React.useState(false)

  return (
    <PreviewFrame label="Sign in preview">
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <header className="flex h-14 shrink-0 items-center justify-between px-6">
          <span className="flex items-center gap-2">
            <BrandMark className="bg-primary text-primary-foreground" />
            <span className="text-sm font-semibold">Ledgerly</span>
          </span>
          <span className="text-xs text-muted-foreground">
            New here?{" "}
            <a href="#sign-up" className="font-medium text-foreground underline-offset-4 hover:underline">
              Create an account
            </a>
          </span>
        </header>
        <main className="flex flex-1 items-center justify-center px-6 py-8">
          <div className="flex w-full max-w-sm flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <h2 className="font-heading text-2xl font-semibold tracking-tight">Welcome back</h2>
              <p className="text-muted-foreground">Sign in to close the books for October.</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline">
                <IconBrandGoogle data-icon="inline-start" />
                Google
              </Button>
              <Button variant="outline">
                <IconBrandGithub data-icon="inline-start" />
                GitHub
              </Button>
            </div>
            <Separator>
              <span className="text-xs text-muted-foreground">or with email</span>
            </Separator>
            <form className="flex flex-col gap-4" onSubmit={(event) => event.preventDefault()}>
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${id}-email`} className="text-sm font-medium">
                  Work email
                </label>
                <Input
                  id={`${id}-email`}
                  type="email"
                  autoComplete="off"
                  defaultValue="maya@northwind.co"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between">
                  <label htmlFor={`${id}-password`} className="text-sm font-medium">
                    Password
                  </label>
                  <a href="#reset" className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                    Forgot password?
                  </a>
                </div>
                <InputGroup>
                  <InputGroupInput
                    id={`${id}-password`}
                    type={visible ? "text" : "password"}
                    autoComplete="off"
                    defaultValue="correct-horse-battery"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      size="icon-xs"
                      aria-label={visible ? "Hide password" : "Show password"}
                      aria-pressed={visible}
                      onClick={() => setVisible(!visible)}
                    >
                      {visible ? <IconEyeOff /> : <IconEye />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </div>
              <label className="flex items-center gap-2 text-muted-foreground">
                <Checkbox defaultChecked />
                Keep me signed in for 30 days
              </label>
              <Button type="submit" size="lg">
                Sign in
              </Button>
            </form>
            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <IconLock className="size-3.5" aria-hidden="true" />
              SOC 2 Type II. Your data is encrypted at rest.
            </p>
          </div>
        </main>
      </div>
      <aside className="relative hidden w-[44%] shrink-0 flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground @3xl:flex">
        <svg
          aria-hidden="true"
          viewBox="0 0 400 400"
          className="pointer-events-none absolute -top-24 -right-24 size-[28rem] opacity-15"
        >
          {[60, 100, 140, 180].map((radius) => (
            <circle key={radius} cx="200" cy="200" r={radius} fill="none" stroke="currentColor" strokeWidth="1" />
          ))}
        </svg>
        <span className="relative text-xs font-medium tracking-wide uppercase opacity-70">
          Month-end in 2 days, not 2 weeks
        </span>
        <figure className="relative flex flex-col gap-6">
          <blockquote className="font-heading text-xl/snug font-medium text-balance">
            “We moved four entities onto Ledgerly in a weekend. Reconciliation that
            took our team nine days now finishes before Tuesday lunch.”
          </blockquote>
          <figcaption className="flex items-center gap-3">
            <span aria-hidden="true" className="grid size-8 place-items-center rounded-full bg-primary-foreground/15 text-xs font-medium">
              PN
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-medium">Priya Nair</span>
              <span className="text-xs opacity-70">Controller, Fieldrun</span>
            </span>
          </figcaption>
        </figure>
        <div className="relative flex items-center gap-3 text-xs opacity-80">
          <span className="flex -space-x-2">
            {team.map((initials) => (
              <span
                key={initials}
                aria-hidden="true"
                className="grid size-7 place-items-center rounded-full bg-primary-foreground text-xs font-medium text-primary ring-2 ring-primary"
              >
                {initials}
              </span>
            ))}
          </span>
          Trusted by 3,400 finance teams
        </div>
      </aside>
    </PreviewFrame>
  )
}

export default SignIn
