import * as React from "react"

type DelayedLoadingOptions = {
  delay?: number
  minDuration?: number
}

function useDelayedLoading(
  loading: boolean,
  { delay = 150, minDuration = 400 }: DelayedLoadingOptions = {}
) {
  const [visible, setVisible] = React.useState(false)
  const shownAt = React.useRef(0)

  React.useEffect(() => {
    if (loading === visible) {
      return
    }
    if (loading) {
      const timer = setTimeout(
        () => {
          shownAt.current = Date.now()
          setVisible(true)
        },
        Math.max(0, delay)
      )
      return () => clearTimeout(timer)
    }
    const remaining = Math.max(0, minDuration - (Date.now() - shownAt.current))
    const timer = setTimeout(() => setVisible(false), remaining)
    return () => clearTimeout(timer)
  }, [loading, visible, delay, minDuration])

  return visible
}

export { useDelayedLoading }
export type { DelayedLoadingOptions }
