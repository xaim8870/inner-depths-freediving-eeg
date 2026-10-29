// Horizontal bars for averages and counts (the design's "What's moving" panel), using only logged values.
export function BarList({ rows, max }: { rows: Array<{ label: string; value: number; display: string }>; max: number }) {
  return (
    <div className="ui-bars">
      {rows.map((row) => (
        <div className="ui-bar-row" key={row.label}>
          <div><strong>{row.label}</strong><span>{row.display}</span></div>
          <div className="ui-bar" aria-hidden="true"><i style={{ width: `${Math.max(4, Math.min(100, (row.value / max) * 100))}%` }} /></div>
        </div>
      ))}
    </div>
  );
}

// Vertical monthly columns (training consistency).
export function MonthColumns({ months }: { months: Array<{ month: string; count: number }> }) {
  const top = Math.max(1, ...months.map((m) => m.count));
  const label = (m: string) => new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" }).format(new Date(`${m}-01T00:00:00Z`));
  return (
    <div className="ui-columns" role="list" aria-label="Training sessions per month">
      {months.map((m) => (
        <div role="listitem" key={m.month} aria-label={`${label(m.month)}: ${m.count} sessions`}>
          <b>{m.count || ""}</b>
          <i style={{ height: `${(m.count / top) * 100}%` }} />
          <span>{label(m.month)}</span>
        </div>
      ))}
    </div>
  );
}
