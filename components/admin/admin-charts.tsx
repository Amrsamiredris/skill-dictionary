"use client";

import type { DailyEventCount, WeeklyEventCount } from "@/lib/admin-data";

const SERIES_COLORS = {
  copy: "var(--accent)",
  github_click: "#60A5FA",
  install_yes: "var(--green)",
  install_no: "var(--cat-workflow)",
  total: "var(--muted)",
};

export function TimeSeriesChart({
  data,
  mode,
  metric = "total",
}: {
  data: DailyEventCount[] | WeeklyEventCount[];
  mode: "daily" | "weekly";
  metric?: "total" | "stacked";
}) {
  if (data.length === 0) {
    return <p className="admin-muted">No data yet.</p>;
  }

  const labels = data.map((d) =>
    mode === "daily"
      ? (d as DailyEventCount).day.slice(5)
      : (d as WeeklyEventCount).weekLabel,
  );

  if (metric === "stacked") {
    const max = Math.max(...data.map((d) => d.total), 1);
    return (
      <div className="admin-ts-chart">
        <div className="admin-ts-legend">
          <LegendItem color={SERIES_COLORS.copy} label="Copies" />
          <LegendItem color={SERIES_COLORS.github_click} label="GitHub" />
          <LegendItem color={SERIES_COLORS.install_yes} label="Install yes" />
          <LegendItem color={SERIES_COLORS.install_no} label="Install no" />
        </div>
        <div className="admin-stacked-bars">
          {data.map((d, i) => (
            <div key={i} className="admin-stacked-col" title={labels[i]}>
              <div
                className="admin-stacked-stack"
                style={{ height: `${(d.total / max) * 100}%` }}
              >
                {d.install_no > 0 && (
                  <div
                    className="admin-stacked-seg"
                    style={{
                      flex: d.install_no,
                      background: SERIES_COLORS.install_no,
                    }}
                  />
                )}
                {d.install_yes > 0 && (
                  <div
                    className="admin-stacked-seg"
                    style={{
                      flex: d.install_yes,
                      background: SERIES_COLORS.install_yes,
                    }}
                  />
                )}
                {d.github_click > 0 && (
                  <div
                    className="admin-stacked-seg"
                    style={{
                      flex: d.github_click,
                      background: SERIES_COLORS.github_click,
                    }}
                  />
                )}
                {d.copy > 0 && (
                  <div
                    className="admin-stacked-seg"
                    style={{
                      flex: d.copy,
                      background: SERIES_COLORS.copy,
                    }}
                  />
                )}
              </div>
              <span className="admin-ts-label">{labels[i]}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const values = data.map((d) => d.total);
  const max = Math.max(...values, 1);
  const width = 100;
  const height = 48;
  const step = data.length > 1 ? width / (data.length - 1) : width;
  const points = values
    .map((v, i) => {
      const x = data.length === 1 ? width / 2 : i * step;
      const y = height - (v / max) * (height - 4);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="admin-ts-chart">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="admin-line-chart"
        preserveAspectRatio="none"
      >
        <polyline
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          points={points}
        />
        {values.map((v, i) => {
          const x = data.length === 1 ? width / 2 : i * step;
          const y = height - (v / max) * (height - 4);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="1.2"
              fill="var(--accent)"
            />
          );
        })}
      </svg>
      <div className="admin-ts-labels">
        {labels.map((l, i) => (
          <span key={i} className="admin-ts-label">
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

export function DonutChart({
  segments,
}: {
  segments: Array<{ label: string; value: number; color: string }>;
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) {
    return <p className="admin-muted">No data yet.</p>;
  }

  let cumulative = 0;
  const gradientStops = segments
    .map((seg) => {
      const pct = (seg.value / total) * 100;
      const start = cumulative;
      cumulative += pct;
      return `${seg.color} ${start}% ${cumulative}%`;
    })
    .join(", ");

  return (
    <div className="admin-donut-wrap">
      <div
        className="admin-donut"
        style={{ background: `conic-gradient(${gradientStops})` }}
      >
        <div className="admin-donut-hole">
          <span className="admin-donut-total">{total}</span>
          <span className="admin-donut-sub">events</span>
        </div>
      </div>
      <ul className="admin-donut-legend">
        {segments.map((seg) => (
          <li key={seg.label}>
            <span
              className="admin-donut-swatch"
              style={{ background: seg.color }}
            />
            <span>{seg.label}</span>
            <strong>
              {seg.value} ({Math.round((seg.value / total) * 100)}%)
            </strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="admin-legend-item">
      <span className="admin-donut-swatch" style={{ background: color }} />
      {label}
    </span>
  );
}

export function MetricTrend({
  label,
  current,
  previous,
}: {
  label: string;
  current: number;
  previous: number;
}) {
  const delta = current - previous;
  const pct =
    previous > 0 ? Math.round((delta / previous) * 100) : current > 0 ? 100 : 0;
  return (
    <div className="admin-trend">
      <span className="admin-trend-label">{label}</span>
      <span className="admin-trend-value">{current}</span>
      <span
        className={`admin-trend-delta${delta >= 0 ? " up" : " down"}`}
      >
        {delta >= 0 ? "+" : ""}
        {delta} ({pct >= 0 ? "+" : ""}
        {pct}%)
      </span>
    </div>
  );
}
