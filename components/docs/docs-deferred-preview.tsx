"use client"

import * as React from "react"

function DocsDeferredPreview({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    const node = ref.current
    if (!node || mounted) {
      return
    }

    const show = () => setMounted(true)
    const observer =
      typeof IntersectionObserver === "function"
        ? new IntersectionObserver(
            (entries) => {
              if (entries.some((entry) => entry.isIntersecting)) {
                show()
              }
            },
            { rootMargin: "100% 0px" }
          )
        : null
    observer?.observe(node)

    const idle =
      typeof requestIdleCallback === "function"
        ? requestIdleCallback(show, { timeout: 4000 })
        : undefined
    const timer = idle === undefined ? setTimeout(show, 2000) : undefined

    return () => {
      observer?.disconnect()
      if (idle !== undefined) {
        cancelIdleCallback(idle)
      }
      clearTimeout(timer)
    }
  }, [mounted])

  return (
    <div ref={ref} className={className}>
      {mounted ? children : null}
    </div>
  )
}

export { DocsDeferredPreview }
