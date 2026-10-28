import {
  maxSections,
  newKey,
  type PageDoc,
  type PlacedSection,
} from "@/lib/page-builder/doc"
import type { Props } from "@/lib/page-builder/fields"
import { getSection, sectionProps } from "@/lib/page-builder/registry"

type BuilderState = {
  doc: PageDoc
  selected: string | null
  past: PageDoc[]
  future: PageDoc[]
  coalesce: { key: string; at: number } | null
}

type BuilderAction =
  | { type: "load"; doc: PageDoc }
  | { type: "insert"; section: PlacedSection; after?: string | null }
  | { type: "move"; key: string; to: number }
  | { type: "shift"; key: string; by: number }
  | { type: "remove"; key: string }
  | { type: "duplicate"; key: string }
  | {
      type: "update"
      key: string
      patch: (props: Props) => Props
      coalesce: string
      at: number
    }
  | { type: "swap"; key: string; sectionId: string }
  | { type: "theme"; theme: string | null }
  | { type: "select"; key: string | null }
  | { type: "undo" }
  | { type: "redo" }

const historyLimit = 100
const coalesceWindow = 800

function initialState(doc: PageDoc): BuilderState {
  return {
    doc,
    selected: doc.sections[0]?.key ?? null,
    past: [],
    future: [],
    coalesce: null,
  }
}

function commit(
  state: BuilderState,
  doc: PageDoc,
  selected = state.selected
): BuilderState {
  return {
    doc,
    selected,
    past: [...state.past, state.doc].slice(-historyLimit),
    future: [],
    coalesce: null,
  }
}

function indexOf(doc: PageDoc, key: string) {
  return doc.sections.findIndex((section) => section.key === key)
}

function moveTo(doc: PageDoc, key: string, to: number): PageDoc | null {
  const from = indexOf(doc, key)
  const target = Math.max(0, Math.min(doc.sections.length - 1, to))
  if (from === -1 || from === target) return null
  const sections = [...doc.sections]
  const [item] = sections.splice(from, 1)
  sections.splice(target, 0, item)
  return { ...doc, sections }
}

function carryProps(from: Props, sectionId: string) {
  const target = getSection(sectionId)
  if (!target) return {}
  const kept: Props = {}
  for (const field of target.fields) {
    const value = from[field.key]
    if (value === undefined) continue
    if (field.type === "list" ? Array.isArray(value) : !Array.isArray(value)) {
      kept[field.key] = value
    }
  }
  return sectionProps(sectionId, kept)
}

function builderReducer(
  state: BuilderState,
  action: BuilderAction
): BuilderState {
  switch (action.type) {
    case "load":
      return initialState(action.doc)
    case "insert": {
      if (state.doc.sections.length >= maxSections) return state
      const after = action.after === undefined ? state.selected : action.after
      const index = after ? indexOf(state.doc, after) : -1
      const at = index === -1 ? state.doc.sections.length : index + 1
      const sections = [...state.doc.sections]
      sections.splice(at, 0, action.section)
      return commit(state, { ...state.doc, sections }, action.section.key)
    }
    case "move":
    case "shift": {
      const to =
        action.type === "move"
          ? action.to
          : indexOf(state.doc, action.key) + action.by
      const doc = moveTo(state.doc, action.key, to)
      return doc ? commit(state, doc) : state
    }
    case "remove": {
      const index = indexOf(state.doc, action.key)
      if (index === -1) return state
      const sections = state.doc.sections.filter(
        (section) => section.key !== action.key
      )
      const next = sections[Math.min(index, sections.length - 1)]?.key ?? null
      return commit(
        state,
        { ...state.doc, sections },
        state.selected === action.key ? next : state.selected
      )
    }
    case "duplicate": {
      const index = indexOf(state.doc, action.key)
      if (index === -1 || state.doc.sections.length >= maxSections) return state
      const copy = { ...state.doc.sections[index], key: newKey() }
      const sections = [...state.doc.sections]
      sections.splice(index + 1, 0, copy)
      return commit(state, { ...state.doc, sections }, copy.key)
    }
    case "swap": {
      const index = indexOf(state.doc, action.key)
      const current = state.doc.sections[index]
      if (!current || current.type !== "section") return state
      if (current.sectionId === action.sectionId) return state
      const from = getSection(current.sectionId)
      const to = getSection(action.sectionId)
      if (!from || !to || from.kind !== to.kind) return state
      const sections = [...state.doc.sections]
      sections[index] = {
        ...current,
        sectionId: action.sectionId,
        props: carryProps(current.props, action.sectionId),
      }
      return commit(state, { ...state.doc, sections })
    }
    case "theme": {
      const theme = action.theme ?? null
      if ((state.doc.theme ?? null) === theme) return state
      return commit(
        state,
        theme
          ? { sections: state.doc.sections, theme }
          : { sections: state.doc.sections }
      )
    }
    case "update": {
      const index = indexOf(state.doc, action.key)
      const current = state.doc.sections[index]
      if (!current || current.type !== "section") return state
      const sections = [...state.doc.sections]
      sections[index] = { ...current, props: action.patch(current.props) }
      const doc = { ...state.doc, sections }
      const coalesce = `${action.key}:${action.coalesce}`
      if (
        state.coalesce &&
        state.coalesce.key === coalesce &&
        action.at - state.coalesce.at < coalesceWindow
      ) {
        return {
          ...state,
          doc,
          future: [],
          coalesce: { key: coalesce, at: action.at },
        }
      }
      return {
        ...commit(state, doc),
        coalesce: { key: coalesce, at: action.at },
      }
    }
    case "select":
      return state.selected === action.key
        ? state
        : { ...state, selected: action.key, coalesce: null }
    case "undo": {
      const previous = state.past.at(-1)
      if (!previous) return state
      return {
        doc: previous,
        selected: keepSelection(previous, state.selected),
        past: state.past.slice(0, -1),
        future: [state.doc, ...state.future],
        coalesce: null,
      }
    }
    case "redo": {
      const next = state.future[0]
      if (!next) return state
      return {
        doc: next,
        selected: keepSelection(next, state.selected),
        past: [...state.past, state.doc],
        future: state.future.slice(1),
        coalesce: null,
      }
    }
  }
}

function keepSelection(doc: PageDoc, selected: string | null) {
  if (selected && indexOf(doc, selected) !== -1) return selected
  return doc.sections[0]?.key ?? null
}

export { builderReducer, initialState, type BuilderAction, type BuilderState }
