type TrendPoint = {
  id: string;
  date: string;
  value: number;
};

type LineTrendChartProps = {
  points: TrendPoint[];
  label: string;
  color?: string;
  domain?: [number, number];
  valueSuffix?: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export default function LineTrendChart({
  points,
  label,
  color = "#2e7d97",
  domain,
  valueSuffix = "",
}: LineTrendChartProps) {
  const width = 340;
  const height = 166;
  const left = 34;
  const right = 12;
  const top = 18;
  const bottom = 35;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const values = points.map((point) => point.value);
  const rawMin = domain?.[0] ?? Math.min(0, ...values);
  const rawMax = domain?.[1] ?? Math.max(...values);
  const min = rawMin === rawMax ? rawMin - 1 : rawMin;
  const max = rawMin === rawMax ? rawMax + 1 : rawMax;

  const plotted = points.map((point, index) => ({
    ...point,
    x: points.length === 1 ? left + plotWidth / 2 : left + (index / (points.length - 1)) * plotWidth,
    y: top + ((max - point.value) / (max - min)) * plotHeight,
  }));
  const polyline = plotted.map((point) => `${point.x},${point.y}`).join(" ");
  const middleIndex = Math.floor((points.length - 1) / 2);
  const labelIndexes = [...new Set([0, middleIndex, points.length - 1])];

  return (
    <svg
      className="progress-line-chart"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${label}: ${points.map((point) => `${formatDate(point.date)} ${point.value}${valueSuffix}`).join(", ")}`}
    >
      <g stroke="#e3efec" strokeWidth="1">
        {[0, 0.5, 1].map((ratio) => {
          const y = top + ratio * plotHeight;
          return <line key={ratio} x1={left} y1={y} x2={width - right} y2={y} />;
        })}
      </g>
      <g fill="#8da6ad" fontSize="9" textAnchor="end">
        <text x={left - 6} y={top + 3}>{max.toFixed(max % 1 === 0 ? 0 : 1)}</text>
        <text x={left - 6} y={top + plotHeight + 3}>{min.toFixed(min % 1 === 0 ? 0 : 1)}</text>
      </g>
      {points.length > 1 ? (
        <polyline
          points={polyline}
          fill="none"
          stroke={color}
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}
      {plotted.map((point) => (
        <circle key={point.id} cx={point.x} cy={point.y} r="4" fill={color}>
          <title>{formatDate(point.date)}: {point.value}{valueSuffix}</title>
        </circle>
      ))}
      <g fill="#8da6ad" fontSize="9" textAnchor="middle">
        {labelIndexes.map((index) => (
          <text key={points[index].id} x={plotted[index].x} y={height - 11}>
            {formatDate(points[index].date)}
          </text>
        ))}
      </g>
    </svg>
  );
}
