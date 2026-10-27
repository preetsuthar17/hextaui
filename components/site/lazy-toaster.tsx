"use client"

import * as React from "react"

type ToastModule = typeof import("@/components/ui/toast")

function LazyToaster() {
  const [toastModule, setToastModule] = React.useState<ToastModule | null>(
    null
  )

  React.useEffect(() => {
    let live = true
    import("@/components/ui/toast").then(
      (module) => {
        if (live) setToastModule(module)
      },
      () => {}
    )
    return () => {
      live = false
    }
  }, [])

  return toastModule ? <toastModule.Toaster /> : null
}

export { LazyToaster }
