"use client"

import * as React from "react"

import { collect, readMessages } from "@/lib/i18n/catalog"
import { useLocale } from "@/lib/i18n/client"
import {
  chromeDictionaryId,
  defaultLocale,
  type Locale,
} from "@/lib/i18n/config"

type Dictionary = Record<string, string>

const dictionaries = new Map<Locale, Dictionary>()
const listeners = new Set<() => void>()

function readDictionary(locale: Locale) {
  const hit = dictionaries.get(locale)
  if (hit) return hit
  let dictionary: Dictionary | undefined
  if (typeof document === "undefined") {
    dictionary = readMessages(locale, "chrome")
  } else {
    const inline = document.getElementById(chromeDictionaryId(locale))
    if (inline?.textContent) dictionary = JSON.parse(inline.textContent)
  }
  if (dictionary) dictionaries.set(locale, dictionary)
  return dictionary
}

function loadDictionary(locale: Locale) {
  import(`@/lib/i18n/messages/${locale}/chrome.json`).then(
    (module: { default: Dictionary }) => {
      dictionaries.set(locale, module.default)
      listeners.forEach((listener) => listener())
    }
  )
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function useChrome() {
  const locale = useLocale()
  const translated = locale !== defaultLocale
  const getDictionary = () =>
    translated ? readDictionary(locale) : undefined
  const dictionary = React.useSyncExternalStore(
    subscribe,
    getDictionary,
    getDictionary
  )

  React.useEffect(() => {
    if (translated && !dictionary) loadDictionary(locale)
  }, [dictionary, locale, translated])

  return React.useCallback(
    (text: string) => {
      if (!translated) return text
      collect("chrome", text)
      return dictionary?.[text] || text
    },
    [dictionary, translated]
  )
}

function Chrome({ children }: { children: string }) {
  return useChrome()(children)
}

export { Chrome, useChrome }
