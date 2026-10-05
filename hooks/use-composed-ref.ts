import * as React from "react"

function useComposedRef<T>(ref: React.Ref<T> | undefined) {
  const inner = React.useRef<T | null>(null)
  const setRef = React.useCallback(
    (node: T | null) => {
      inner.current = node
      if (typeof ref === "function") {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    },
    [ref]
  )
  return [inner, setRef] as const
}

export { useComposedRef }
