"use client"

import * as React from "react"
import {
  IconArrowDown,
  IconArrowUp,
  IconChevronDown,
  IconTrash,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  getInitials,
} from "@/components/ui/avatar"
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

type FocusRequest = { id: string; field: "name" | "body"; at: number } | null

function DraftInput({
  id,
  label,
  field,
  draft,
  onChange,
  type = "text",
  placeholder,
  maxLength,
  inputMode,
}: {
  id?: string
  label: string
  field: DraftField
  draft: Draft
  onChange: (patch: Partial<Testimonial>) => void
  type?: string
  placeholder?: string
  maxLength?: number
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]
}) {
  return (
    <Field className="min-w-0">
      <FieldLabel>{label}</FieldLabel>
      <Input
        id={id}
        size="sm"
        type={type}
        value={draft[field] ?? ""}
        placeholder={placeholder}
        maxLength={maxLength}
        inputMode={inputMode}
        autoComplete="off"
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
  const bodyId = `quote-${draft.id}-body`

  return (
    <div className="flex flex-col gap-3 px-4 pt-1 pb-4">
      <div className="grid grid-cols-2 gap-3">
        <DraftInput
          id={`quote-${draft.id}-name`}
          label="Name"
          field="name"
          draft={draft}
          onChange={onChange}
          maxLength={wallLimits.name}
          placeholder="Who said it"
        />
        <DraftInput
          label="Handle"
          field="handle"
          draft={draft}
          onChange={onChange}
          maxLength={wallLimits.handle + 1}
          placeholder="@handle"
        />
      </div>
      <div className="flex min-w-0 flex-col gap-2">
        <FieldLabel htmlFor={bodyId}>Quote</FieldLabel>
        <Textarea
          id={bodyId}
          value={draft.body}
          minRows={3}
          maxRows={10}
          maxLength={wallLimits.body}
          placeholder="What they said"
          onChange={(event) => onChange({ body: event.target.value })}
        />
      </div>
      <DraftInput
        label="Role"
        field="role"
        draft={draft}
        onChange={onChange}
        maxLength={wallLimits.role}
        placeholder="Founder, Acme"
      />
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
          Delete
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
  focus,
  onOpenChange,
  onChange,
  onMove,
  onRemove,
}: {
  drafts: Draft[]
  openId: string | null
  focus: FocusRequest
  onOpenChange: (id: string | null) => void
  onChange: (id: string, patch: Partial<Testimonial>) => void
  onMove: (id: string, offset: number) => void
  onRemove: (id: string) => void
}) {
  React.useEffect(() => {
    if (!focus) return
    const frame = requestAnimationFrame(() => {
      const row = document.getElementById(`quote-${focus.id}`)
      const target = document.getElementById(`quote-${focus.id}-${focus.field}`)
      let scroller = row?.parentElement ?? null
      while (scroller && scroller.scrollHeight <= scroller.clientHeight) {
        scroller = scroller.parentElement
      }
      if (
        row &&
        scroller &&
        scroller !== document.documentElement &&
        scroller !== document.body
      ) {
        scroller.scrollTop +=
          row.getBoundingClientRect().top - scroller.getBoundingClientRect().top
      }
      target?.focus({ preventScroll: true })
    })
    return () => cancelAnimationFrame(frame)
  }, [focus])

  return (
    <ul className="divide-y">
      {drafts.map((draft, index) => {
        const open = draft.id === openId
        const panelId = `quote-${draft.id}-panel`
        const name = draft.name.trim()
        return (
          <li
            key={draft.id}
            id={`quote-${draft.id}`}
            data-open={open ? "" : undefined}
            className="scroll-mt-2 data-open:bg-muted/30"
          >
            <button
              type="button"
              aria-expanded={open}
              aria-controls={open ? panelId : undefined}
              onClick={() => onOpenChange(open ? null : draft.id)}
              className="group/row flex w-full items-center gap-3 px-4 py-2.5 text-start transition-colors duration-150 ease-out-cubic outline-none hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:ring-inset motion-reduce:transition-none"
            >
              <Avatar size="sm">
                {draft.avatarUrl ? (
                  <AvatarImage
                    src={draft.avatarUrl}
                    alt=""
                    referrerPolicy="no-referrer"
                  />
                ) : null}
                <AvatarFallback>{getInitials(name || "?")}</AvatarFallback>
              </Avatar>
              <span className="flex min-w-0 flex-1 flex-col">
                <span
                  data-empty={name ? undefined : ""}
                  className="truncate text-sm font-medium data-empty:text-muted-foreground"
                >
                  {name || "Untitled"}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {draft.body.trim() || "No quote yet"}
                </span>
              </span>
              <IconChevronDown
                aria-hidden="true"
                className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out-cubic group-aria-expanded/row:rotate-180 motion-reduce:transition-none"
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
  )
}

export { TestimonialEditor, type Draft, type FocusRequest }
