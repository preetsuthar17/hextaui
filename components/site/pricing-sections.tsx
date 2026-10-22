import { cn } from "cn"

function PageColumn({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className="frame-width px-4 sm:px-8">
      <div className={cn("mx-auto w-full max-w-252", className)}>
        {children}
      </div>
    </div>
  )
}

function PageHead({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  children: React.ReactNode
}) {
  return (
    <header className="flex max-w-2xl flex-col items-start">
      <p className="text-sm font-medium text-brand-strong">{eyebrow}</p>
      <h1 id={id} className="marketing-heading mt-3 text-balance">
        {title}
      </h1>
      <p className="marketing-lede mt-4 max-w-xl text-pretty text-muted-foreground">
        {children}
      </p>
    </header>
  )
}

function SectionHead({
  id,
  eyebrow,
  title,
  className,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div className={cn("flex max-w-2xl flex-col items-start", className)}>
      <p className="text-sm font-medium text-brand-strong">{eyebrow}</p>
      <h2 id={id} className="marketing-heading mt-3 text-balance">
        {title}
      </h2>
      {children ? (
        <p className="marketing-lede mt-4 max-w-xl text-pretty text-muted-foreground">
          {children}
        </p>
      ) : null}
    </div>
  )
}

function Band({
  id,
  className,
  children,
}: {
  id: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section aria-labelledby={id} className="border-t">
      <PageColumn className={cn("py-20 sm:py-28", className)}>
        {children}
      </PageColumn>
    </section>
  )
}

export { Band, PageColumn, PageHead, SectionHead }
