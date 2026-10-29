"use client";

import { useState } from "react";

export type TrendPoint = { id: string; date: string; value: number };

const RANGES = [
  { id: "8w", label: "8 wk", days: 56 },
  { id: "3m", label: "3 mo", days: 91 },
  { id: "1y", label: "1 yr", days: 365 },
] as const;

function fmt(date: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

// Line + area chart from the design. Points are the user's real logged values, oldest first.
export default function TrendChart({ title, points, unit = "", min, max, ranges = true, caption }: {
  title: React.ReactNode;
  points: TrendPoint[];
  unit?: string;
  min: number;
  max: number;
  ranges?: boolean;
  caption?: string;
}) {
  const [range, setRange] = useState<(typeof RANGES)[number]["id"]>("3m");
  // range tabs only matter once there is more than 8 weeks of history
  const spanDays = points.length > 1 ? (Date.parse(points[points.length - 1].date) - Date.parse(points[0].date)) / 86400000 : 0;
  ranges = ranges && spanDays > 56;
  const days = RANGES.find((r) => r.id === range)?.days ?? 91;
  // ranges count back from the latest logged point, so the chart is the same on server and client
  const latest = points.at(-1)?.date;
  const cutoff = latest ? new Date(new Date(`${latest}T00:00:00Z`).getTime() - days * 86400000).toISOString().slice(0, 10) : "";
  const shown = ranges ? points.filter((p) => p.date >= cutoff) : points;
  const data = shown.length >= 2 ? shown : points.slice(-Math.max(2, shown.length));
  const last = data[data.length - 1];
  const first = data[0];
  const span = Math.max(1, max - min);
  const pts = data.map((p, i) => [data.length === 1 ? 300 : (i / (data.length - 1)) * 300, 120 - ((Math.min(max, Math.max(min, p.value)) - min) / span) * 120]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const delta = last && first ? last.value - first.value : 0;
  const mid = (min + max) / 2;

  return (
    <div className="ui-card ui-stack">
      <div className="ui-head">
        <div>
          <h3>{title}</h3>
          {last ? (
            <div className="ui-value-row">
              <span className="ui-big">{Number.isInteger(last.value) ? last.value : last.value.toFixed(1)}{unit ? <small className="ui-unit"> {unit}</small> : null}</span>
              {data.length > 1 ? <span className="ui-delta">{delta >= 0 ? "+" : ""}{Number.isInteger(delta) ? delta : delta.toFixed(1)} since {fmt(first.date)}</span> : null}
            </div>
          ) : null}
        </div>
        {ranges ? (
          <div className="ui-tabs" role="group" aria-label="Time range">
            {RANGES.map((r) => (
              <button key={r.id} type="button" aria-pressed={range === r.id} onClick={() => setRange(r.id)}>{r.label}</button>
            ))}
          </div>
        ) : null}
      </div>
      {data.length >= 2 ? (
        <div className="ui-chart">
          <div className="ui-chart-axis" aria-hidden="true"><span>{max}</span><span>{Number.isInteger(mid) ? mid : mid.toFixed(1)}</span><span>{min}</span></div>
          <div className="ui-chart-plot">
            <div className="ui-chart-area">
              <svg viewBox="0 0 300 120" preserveAspectRatio="none" role="img" aria-label={`${data.length} logged values from ${fmt(first.date)} to ${fmt(last.date)}`}>
                <path d={`${line} L300 120 L0 120 Z`} fill="#46B3A9" fillOpacity="0.18" />
                <path d={line} fill="none" stroke="#2E7D97" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </svg>
              <span className="ui-chart-dot" style={{ top: `calc(${((pts[pts.length - 1][1] / 120) * 100).toFixed(1)}% - 7px)` }} />
            </div>
            <div className="ui-chart-labels"><span>{fmt(first.date)}</span><span>{fmt(last.date)}</span></div>
          </div>
        </div>
      ) : (
        <p className="ui-sub">Log at least two dives with this value to see a trend.</p>
      )}
      {caption ? <p className="ui-info">{caption}</p> : null}
    </div>
  );
}
