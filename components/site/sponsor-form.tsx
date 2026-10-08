"use client"

import * as React from "react"

import { DocsSponsorCard } from "@/components/docs/docs-sponsor"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldCounter,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  sponsorLimits,
  sponsorPrice,
  sponsorReviewDays,
  type SponsorInput,
} from "@/lib/sponsor"
import { siteContactEmail } from "@/lib/site"

const examples: SponsorInput = {
  name: "Acme",
  headline: "Ship your shadcn/ui app with Acme",
  description:
    "Acme gives you hosting, previews and analytics for React apps, set up in minutes.",
  cta: "Try Acme",
  url: "https://acme.com",
  email: "marketing@acme.com",
}

const emptyInput: SponsorInput = {
  name: "",
  headline: "",
  description: "",
  cta: "",
  url: "",
  email: "",
}

function useCheckoutDone() {
  const [done, setDone] = React.useState(false)

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setDone(params.get("checkout") === "done")
  }, [])

  return done
}

async function startSponsorCheckout(input: SponsorInput) {
  const response = await fetch("/api/sponsor", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  })
  const body = (await response.json().catch(() => null)) as {
    url?: string
    error?: string
  } | null
  if (!response.ok || !body?.url) {
    throw new Error(body?.error ?? "Checkout didn’t start. Try again.")
  }
  window.location.assign(body.url)
}

function SponsorField({
  name,
  label,
  description,
  value,
  onValueChange,
  type = "text",
  multiline = false,
  autoComplete,
}: {
  name: keyof SponsorInput
  label: string
  description?: string
  value: string
  onValueChange: (value: string) => void
  type?: "text" | "url" | "email"
  multiline?: boolean
  autoComplete?: string
}) {
  const control = {
    name,
    value,
    required: true,
    maxLength: sponsorLimits[name],
    placeholder: examples[name],
    autoComplete,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => onValueChange(event.target.value),
  }

  return (
    <Field validationMode="onBlur">
      <FieldLabel>{label}</FieldLabel>
      {multiline ? (
        <Textarea {...control} minRows={2} maxRows={4} />
      ) : (
        <Input {...control} type={type} />
      )}
      <div className="flex items-baseline justify-between gap-3">
        <FieldDescription>{description}</FieldDescription>
        <FieldCounter />
      </div>
      <FieldError match="valueMissing">Fill this in.</FieldError>
      <FieldError match="typeMismatch">
        {type === "url"
          ? "Use a full link, starting with https://."
          : "Use a valid email address."}
      </FieldError>
    </Field>
  )
}

function SponsorForm() {
  const done = useCheckoutDone()
  const [input, setInput] = React.useState(emptyInput)
  const [error, setError] = React.useState<string | null>(null)
  const [pending, setPending] = React.useState(false)

  const set = (key: keyof SponsorInput) => (value: string) =>
    setInput((previous) => ({ ...previous, [key]: value }))

  const preview = {
    name: input.name || examples.name,
    headline: input.headline || examples.headline,
    description: input.description || examples.description,
    cta: input.cta || examples.cta,
    url: "https://hextaui.com/sponsor",
  }

  if (done) {
    return (
      <div className="flex flex-col gap-2 rounded-xl bg-muted p-6">
        <h2 className="text-lg font-semibold tracking-tight">
          Thanks for sponsoring
        </h2>
        <p className="text-sm/6 text-pretty text-muted-foreground">
          Your card is in review and goes live within {sponsorReviewDays}{" "}
          business day. You’ll get an email when it does. To change the copy,
          write to {siteContactEmail}.
        </p>
      </div>
    )
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setPending(true)
    try {
      await startSponsorCheckout(input)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught))
      setPending(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_12rem]">
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <SponsorField
          name="name"
          label="Brand"
          value={input.name}
          onValueChange={set("name")}
          autoComplete="organization"
        />
        <SponsorField
          name="headline"
          label="Headline"
          description="The bold first line."
          value={input.headline}
          onValueChange={set("headline")}
        />
        <SponsorField
          name="description"
          label="Description"
          description="One or two short sentences."
          value={input.description}
          onValueChange={set("description")}
          multiline
        />
        <SponsorField
          name="cta"
          label="Button label"
          value={input.cta}
          onValueChange={set("cta")}
        />
        <SponsorField
          name="url"
          label="Link"
          description="UTM tags are added for you."
          value={input.url}
          onValueChange={set("url")}
          type="url"
          autoComplete="url"
        />
        <SponsorField
          name="email"
          label="Email"
          description="For the receipt and the go-live email."
          value={input.email}
          onValueChange={set("email")}
          type="email"
          autoComplete="email"
        />
        <div className="flex flex-col gap-3 pt-1">
          <Button
            type="submit"
            size="lg"
            className="self-start"
            loading={pending}
          >
            Continue to payment · ${sponsorPrice}/month
          </Button>
          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}
        </div>
      </form>
      <div className="flex flex-col gap-3 max-md:order-first">
        <p className="text-sm text-muted-foreground">Preview</p>
        <div className="md:sticky md:top-20">
          <DocsSponsorCard sponsor={preview} className="w-48 max-w-full" />
        </div>
      </div>
    </div>
  )
}

export { SponsorForm }
