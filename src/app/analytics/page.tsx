"use client";

import { useEffect, useState } from "react";
import { CategoryIcon } from "@/components/Icons";
import { categoryLabel } from "@/lib/constants";
import { formatMoney } from "@/lib/format";
import type { AnalyticsSummary, MonthlyBucket } from "@/lib/types";

type Metric = "profit" | "revenue" | "count";

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [metric, setMetric] = useState<Metric>("profit");

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5">
      <header>
        <p className="text-[13px] text-ink-500 font-medium">รายงานภาพรวม</p>
        <h1 className="h-page mt-0.5">สถิติยอดขาย</h1>
      </header>

      {loading ? (
        <>
          <div className="h-44 rounded-3xl shimmer" />
          <div className="h-72 rounded-2xl shimmer" />
          <div className="h-32 rounded-2xl shimmer" />
        </>
      ) : data ? (
        <>
          {/* This month vs last month */}
          <section
            className="relative overflow-hidden rounded-3xl p-5 text-white"
            style={{
              background:
                "linear-gradient(135deg, #0d9488 0%, #10b981 55%, #34d399 100%)",
            }}
          >
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-12 -left-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <div className="text-white/80 text-[13px] font-medium">
                {data.thisMonth.label}
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-[34px] font-bold tracking-tight leading-none">
                  ฿{formatMoney(data.thisMonth.profit)}
                </span>
                <ChangeBadge change={data.compare.profitChange} />
              </div>
              <div className="text-white/80 text-[12px] mt-1">
                กำไรเดือนนี้ · ขาย {data.thisMonth.count} ชิ้น · ฿
                {formatMoney(data.thisMonth.revenue)}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-[13px]">
                <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur">
                  <div className="text-white/70 text-[11px] font-medium">
                    เดือนที่แล้ว
                  </div>
                  <div className="font-semibold">
                    ฿{formatMoney(data.lastMonth.profit)}
                  </div>
                  <div className="text-[11px] text-white/70">
                    {data.lastMonth.count} ชิ้น
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur">
                  <div className="text-white/70 text-[11px] font-medium">
                    เฉลี่ย/เดือน
                  </div>
                  <div className="font-semibold">฿{formatMoney(data.avgProfit)}</div>
                  <div className="text-[11px] text-white/70">
                    {data.totalAllMonths.count > 0
                      ? `${data.totalAllMonths.count} ชิ้น 12 เดือน`
                      : "ยังไม่มีข้อมูล"}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Metric toggle */}
          <section className="card p-1.5">
            <div className="grid grid-cols-3 gap-1">
              <MetricTab
                label="กำไร"
                active={metric === "profit"}
                onClick={() => setMetric("profit")}
              />
              <MetricTab
                label="ยอดขาย"
                active={metric === "revenue"}
                onClick={() => setMetric("revenue")}
              />
              <MetricTab
                label="จำนวนชิ้น"
                active={metric === "count"}
                onClick={() => setMetric("count")}
              />
            </div>
          </section>

          {/* Bar chart */}
          <section className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="h-section">12 เดือนย้อนหลัง</h2>
              {data.bestMonth && (
                <div className="text-[11px] text-ink-500">
                  สูงสุด:{" "}
                  <span className="font-bold text-brand-600">
                    {data.bestMonth.monthLabel}
                  </span>
                </div>
              )}
            </div>
            <BarChart months={data.months} metric={metric} />
          </section>

          {/* Category breakdown */}
          {data.categories.length > 0 && (
            <section>
              <h2 className="h-section mb-2.5">หมวดหมู่ที่ขายดี</h2>
              <div className="space-y-2">
                {data.categories.map((c) => {
                  const totalProfit = data.categories.reduce(
                    (s, x) => s + x.profit,
                    0
                  );
                  const pct =
                    totalProfit > 0 ? Math.round((c.profit / totalProfit) * 100) : 0;
                  return (
                    <div key={c.category} className="card p-3">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-9 w-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center ring-1 ring-brand-100">
                          <CategoryIcon value={c.category} className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-ink-900 tracking-tight text-[14px]">
                            {categoryLabel(c.category)}
                          </div>
                          <div className="text-[11px] text-ink-500">
                            {c.count} ชิ้น · ฿{formatMoney(c.revenue)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-brand-600 tracking-tight">
                            ฿{formatMoney(c.profit)}
                          </div>
                          <div className="text-[10px] text-ink-500">{pct}%</div>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-ink-100 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            background:
                              "linear-gradient(90deg, #10b981 0%, #34d399 100%)",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {data.totalAllMonths.count === 0 && (
            <div className="card p-8 text-center">
              <div className="text-ink-500 text-sm">
                ยังไม่มีข้อมูลการขาย — เริ่มขายแล้วระบบจะแสดงสถิติให้ที่นี่
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="card p-8 text-center text-ink-500">โหลดข้อมูลไม่สำเร็จ</div>
      )}
    </div>
  );
}

function MetricTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={
        active
          ? "rounded-xl text-white font-semibold py-2.5 text-[13px] tracking-tight"
          : "rounded-xl text-ink-600 font-semibold py-2.5 text-[13px] tracking-tight"
      }
      style={
        active
          ? { background: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)" }
          : undefined
      }
    >
      {label}
    </button>
  );
}

function ChangeBadge({ change }: { change: number | null }) {
  if (change === null) return null;
  const positive = change >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold backdrop-blur ${
        positive ? "bg-white/20 text-white" : "bg-red-500/30 text-white"
      }`}
    >
      {positive ? "↑" : "↓"} {Math.abs(change)}%
    </span>
  );
}

function BarChart({
  months,
  metric,
}: {
  months: MonthlyBucket[];
  metric: Metric;
}) {
  const values = months.map((m) => m[metric]);
  const max = Math.max(...values, 1);
  const W = 360;
  const H = 200;
  const padX = 8;
  const padY = 24;
  const padBottom = 28;
  const innerW = W - padX * 2;
  const innerH = H - padY - padBottom;
  const barWidth = innerW / months.length - 4;

  const fmt = (n: number) =>
    metric === "count" ? `${n}` : `฿${formatMoney(n)}`;

  // Find max month index for highlighting
  const maxIndex = values.indexOf(Math.max(...values));

  return (
    <div className="-mx-1">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[200px]">
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map((p) => (
          <line
            key={p}
            x1={padX}
            x2={W - padX}
            y1={padY + innerH * (1 - p)}
            y2={padY + innerH * (1 - p)}
            stroke="#e5e7eb"
            strokeDasharray="2 4"
          />
        ))}

        {/* Bars */}
        {months.map((m, i) => {
          const v = values[i];
          const h = (v / max) * innerH;
          const x = padX + (innerW / months.length) * i + 2;
          const y = padY + innerH - h;
          const isMax = i === maxIndex && v > 0;
          return (
            <g key={m.month}>
              {v > 0 && (
                <>
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={h}
                    rx={4}
                    fill={
                      metric === "profit"
                        ? isMax
                          ? "url(#gradMax)"
                          : "url(#grad)"
                        : metric === "revenue"
                          ? "url(#gradPeach)"
                          : "url(#gradInk)"
                    }
                  />
                  <text
                    x={x + barWidth / 2}
                    y={y - 4}
                    fontSize="9"
                    fontWeight="700"
                    fill="#0F1419"
                    textAnchor="middle"
                  >
                    {metric === "count"
                      ? v
                      : v >= 1000
                        ? `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k`
                        : v}
                  </text>
                </>
              )}
              <text
                x={x + barWidth / 2}
                y={H - 8}
                fontSize="10"
                fontWeight={isMax ? 700 : 500}
                fill={isMax ? "#10b981" : "#6B7280"}
                textAnchor="middle"
              >
                {m.monthLabel}
              </text>
            </g>
          );
        })}

        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id="gradMax" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#0d9488" />
          </linearGradient>
          <linearGradient id="gradPeach" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fdba74" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
          <linearGradient id="gradInk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9ca3af" />
            <stop offset="100%" stopColor="#4b5563" />
          </linearGradient>
        </defs>
      </svg>

      {/* Legend / hint */}
      <div className="mt-2 text-[11px] text-ink-500 text-center">
        แตะเพื่อสลับมุมมอง · ตัวเลขย่อ k = 1,000
      </div>

      {/* Detail rows for the most recent 3 months */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        {months.slice(-3).map((m) => (
          <div
            key={m.month}
            className="bg-ink-50 rounded-xl p-2 text-center ring-1 ring-ink-900/[0.04]"
          >
            <div className="text-[10px] text-ink-500 font-medium">
              {m.monthLabel}
            </div>
            <div className="text-[13px] font-bold text-ink-900 tracking-tight">
              {fmt(m[metric])}
            </div>
            <div className="text-[10px] text-ink-500">{m.count} ชิ้น</div>
          </div>
        ))}
      </div>
    </div>
  );
}
