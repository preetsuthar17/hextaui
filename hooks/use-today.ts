import * as React from "react"

function toDateKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${date.getFullYear()}-${month}-${day}`
}

function fromDateKey(key: string) {
  const [year, month, day] = key.split("-").map(Number)
  return new Date(year, month - 1, day)
}

function subscribeToday(onChange: () => void) {
  let timer: ReturnType<typeof setTimeout> | undefined

  const schedule = () => {
    const now = new Date()
    const midnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    )
    timer = setTimeout(
      () => {
        onChange()
        schedule()
      },
      midnight.getTime() - now.getTime() + 1000
    )
  }

  const onVisible = () => {
    if (document.visibilityState === "visible") {
      onChange()
    }
  }

  schedule()
  document.addEventListener("visibilitychange", onVisible)

  return () => {
    clearTimeout(timer)
    document.removeEventListener("visibilitychange", onVisible)
  }
}

function getTodayKey() {
  return toDateKey(new Date())
}

function getNoTodayKey() {
  return null
}

function useToday() {
  const key = React.useSyncExternalStore(
    subscribeToday,
    getTodayKey,
    getNoTodayKey
  )

  return React.useMemo(() => (key ? fromDateKey(key) : undefined), [key])
}

export { fromDateKey, getTodayKey, subscribeToday, toDateKey, useToday }
