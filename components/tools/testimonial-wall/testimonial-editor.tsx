"use client"

import * as React from "react"
import {
  IconArrowDown,
  IconArrowUp,
  IconChevronDown,
  IconPlus,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react"
import { cn } from "cn"

import { Avatar, AvatarFallback, getInitials } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import {
  sourceLabels,
  testimonialSources,
  wallLimits,
  type Testimonial,
  type TestimonialSource,
} from "@/lib/testimonial-wall/model"

type Draft = Testimonial & { id: string }

type DraftField = Exclude<keyof Testimonial, "rating" | "source">

function DraftInput({
  label,
  field,
  draft,
  onChange,
  type = "text",
  placeholder,
  maxLength,
  inputMode,
  autoComplete = "off",
}: {
  label: string
  field: DraftField
  draft: Draft
  onChange: (patch: Partial<Testimonial>) => void
  type?: string
  placeholder?: string
  maxLength?: number
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]
  autoComplete?: string
}) {
  return (
    <Field className="min-w-0">
      <FieldLabel>{label}</FieldLabel>
      <Input
        size="sm"
        type={type}
        value={draft[field] ?? ""}
        placeholder={placeholder}
        maxLength={maxLength}
        inputMode={inputMode}
        autoComplete={autoComplete}
        spellCheck={field === "name" || field === "role"}
        onValueChange={(value) => onChange({ [field]: value })}
      />
    </Field>
  )
}

function DraftForm({
  draft,
  index,
  count,
  onChange,
  onMove,
  onRemove,
  onDone,
}: {
  draft: Draft
  index: number
  count: number
  onChange: (patch: Partial<Testimonial>) => void
  onMove: (offset: number) => void
  onRemove: () => void
  onDone: () => void
}) {
  const bodyId = React.useId()

  return (
    <div className="flex flex-col gap-3 px-3 pt-1 pb-3">
      <DraftInput
        label="Name"
        field="name"
        draft={draft}
        onChange={onChange}
        maxLength={wallLimits.name}
        placeholder="Who said it"
      />
      <div className="flex flex-col gap-2">
        <label htmlFor={bodyId} className="text-sm font-medium">
          Quote
        </label>
        <Textarea
          id={bodyId}
          value={draft.body}
          minRows={3}
          maxRows={8}
          maxLength={wallLimits.body}
          placeholder="What they said"
          onChange={(event) => onChange({ body: event.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <DraftInput
          label="Handle"
          field="handle"
          draft={draft}
          onChange={onChange}
          maxLength={wallLimits.handle + 1}
          placeholder="@handle"
        />
        <DraftInput
          label="Role"
          field="role"
          draft={draft}
          onChange={onChange}
          maxLength={wallLimits.role}
          placeholder="Founder, Acme"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field className="min-w-0">
          <FieldLabel>Source</FieldLabel>
          <NativeSelect
            size="sm"
            className="w-full"
            value={draft.source ?? ""}
            onChange={(event) =>
              onChange({
                source: (event.target.value || undefined) as
                  TestimonialSource | undefined,
              })
            }
          >
            <NativeSelectOption value="">None</NativeSelectOption>
            {testimonialSources.map((source) => (
              <NativeSelectOption key={source} value={source}>
                {sourceLabels[source]}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
        <Field className="min-w-0">
          <FieldLabel>Rating</FieldLabel>
          <NativeSelect
            size="sm"
            className="w-full"
            value={draft.rating ? String(draft.rating) : ""}
            onChange={(event) =>
              onChange({
                rating: event.target.value
                  ? Number(event.target.value)
                  : undefined,
              })
            }
          >
            <NativeSelectOption value="">None</NativeSelectOption>
            {[5, 4, 3, 2, 1].map((stars) => (
              <NativeSelectOption key={stars} value={String(stars)}>
                {stars} {stars === 1 ? "star" : "stars"}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <DraftInput
          label="Date"
          field="date"
          type="date"
          draft={draft}
          onChange={onChange}
        />
        <DraftInput
          label="Link"
          field="url"
          type="url"
          inputMode="url"
          draft={draft}
          onChange={onChange}
          maxLength={wallLimits.url}
          placeholder="https://"
        />
      </div>
      <DraftInput
        label="Avatar image URL"
        field="avatarUrl"
        type="url"
        inputMode="url"
        draft={draft}
        onChange={onChange}
        maxLength={wallLimits.url}
        placeholder="https://"
      />
      <div className="flex items-center gap-1 pt-1">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Move up"
          disabled={index === 0}
          onClick={() => onMove(-1)}
        >
          <IconArrowUp />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Move down"
          disabled={index === count - 1}
          onClick={() => onMove(1)}
        >
          <IconArrowDown />
        </Button>
        <Button
          variant="ghost-destructive"
          size="sm"
          className="ms-auto"
          onClick={onRemove}
        >
          <IconTrash data-icon="inline-start" />
          Remove
        </Button>
        <Button variant="outline" size="sm" onClick={onDone}>
          Done
        </Button>
      </div>
    </div>
  )
}

function TestimonialEditor({
  drafts,
  openId,
  onOpenChange,
  onAdd,
  onImport,
  onChange,
  onMove,
  onRemove,
}: {
  drafts: Draft[]
  openId: string | null
  onOpenChange: (id: string | null) => void
  onAdd: () => void
  onImport: () => void
  onChange: (id: string, patch: Partial<Testimonial>) => void
  onMove: (id: string, offset: number) => void
  onRemove: (id: string) => void
}) {
  const full = drafts.length >= wallLimits.testimonials

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <p className="me-auto text-xs text-muted-foreground tabular-nums">
          {drafts.length} of {wallLimits.testimonials}
        </p>
        <Button variant="outline" size="sm" onClick={onImport}>
          <IconUpload data-icon="inline-start" />
          Import
        </Button>
        <Button size="sm" onClick={onAdd} disabled={full}>
          <IconPlus data-icon="inline-start" />
          Add
        </Button>
      </div>
      {drafts.length === 0 ? (
        <p className="border-t px-3 py-8 text-center text-sm text-pretty text-muted-foreground">
          No testimonials yet. Add one, or import X posts, JSON or CSV.
        </p>
      ) : (
        <ul className="divide-y border-t">
          {drafts.map((draft, index) => {
            const open = draft.id === openId
            const panelId = `testimonial-${draft.id}`
            return (
              <li key={draft.id} data-open={open ? "" : undefined}>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={open ? panelId : undefined}
                  onClick={() => onOpenChange(open ? null : draft.id)}
                  className="group/row flex w-full items-center gap-3 px-3 py-2.5 text-start transition-colors duration-150 ease-out outline-none hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:ring-inset motion-reduce:transition-none"
                >
                  <Avatar size="sm">
                    <AvatarFallback>{getInitials(draft.name)}</AvatarFallback>
                  </Avatar>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span
                      className={cn(
                        "truncate text-sm font-medium",
                        !draft.name.trim() && "text-muted-foreground"
                      )}
                    >
                      {draft.name.trim() || "Untitled"}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {draft.body.trim() || "No quote yet"}
                    </span>
                  </span>
                  <IconChevronDown
                    aria-hidden
                    className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-aria-expanded/row:rotate-180 motion-reduce:transition-none"
                  />
                </button>
                {open ? (
                  <div id={panelId}>
                    <DraftForm
                      draft={draft}
                      index={index}
                      count={drafts.length}
                      onChange={(patch) => onChange(draft.id, patch)}
                      onMove={(offset) => onMove(draft.id, offset)}
                      onRemove={() => onRemove(draft.id)}
                      onDone={() => onOpenChange(null)}
                    />
                  </div>
                ) : null}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export { TestimonialEditor, type Draft }
