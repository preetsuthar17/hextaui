const rows = [
  ["Plan", "Pro"],
  ["Seats", "12"],
  ["Billing", "Yearly"],
  ["Renews", "Mar 4, 2027"],
]

export function HairlineList() {
  return (
    <dl className="w-full max-w-xs divide-y rounded-xl border text-sm">
      {rows.map(([term, value]) => (
        <div key={term} className="flex justify-between px-4 py-3">
          <dt className="text-muted-foreground">{term}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  )
}
